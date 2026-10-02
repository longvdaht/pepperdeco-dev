function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

function toggleClassBasedOnWidth() {
  const element = document.querySelector('.grid-collection-filter');
  if (!element) return;

  const isMinWidth = window.matchMedia('(min-width: 750px)').matches;
  if (isMinWidth) {
    element.classList.add('product-grid');
  } else {
    element.classList.remove('product-grid');
  }
}

toggleClassBasedOnWidth();

window.addEventListener('resize', toggleClassBasedOnWidth);

const AddClickOptions = () => {
  const details = document.querySelectorAll('#FacetsWrapperMobile [id^="Details-"]');

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
        details?.forEach((detail) => {
          if (!detail.hasAttribute('open') && detail.classList.contains('no-toggle')) {
            detail.setAttribute('open', '');
          }
        })
      }
    });
  })

  const config = { attributes: true };

  details.forEach((detail) => {
    observer.observe(detail, config);
  })
}

document.addEventListener("DOMContentLoaded", function () {
  AddClickOptions();
  const sortLabelDesktop = document.querySelector('.sort-by-desktop-header');
  const sortOptionsDesktop = document.querySelector('#SortBy-desktop-filter');
  if (sortLabelDesktop) {
    sortLabelDesktop.addEventListener('click', function () {
      sortOptionsDesktop.classList.toggle('hidden')
    });
    document.addEventListener('click', event => {
      if (!sortOptionsDesktop.contains(event.target) && !sortLabelDesktop.contains(event.target)) {
        if (!sortOptionsDesktop.classList.contains('hidden')) {
          sortOptionsDesktop.classList.add('hidden')
        }
      }
    });
  }

  const filterCollectionDesktop = document.querySelector('#FacetFiltersForm');
  if (filterCollectionDesktop) {
    document.addEventListener('click', event => {
      if (!filterCollectionDesktop.contains(event.target)) {
        const filterDetails = filterCollectionDesktop.querySelectorAll('details');
        filterDetails.forEach((detail) => {
          detail.removeAttribute('open');
          const toggleButton = detail.querySelector('.dropdown-toggle');
          toggleButton?.classList.remove('minus');
          toggleButton?.classList.add('plus');
        })
      }
    });
  }

  // Hover pricing tier popup
  document.querySelectorAll('.custom-pricing-hover').forEach((wrapper) => {
    const tierTextHover = wrapper.querySelector('.tier-hover');
    const tierPopup = wrapper.querySelector('.tier-popup');

    if (!tierTextHover || !tierPopup) return;

    tierTextHover.addEventListener('mouseenter', () => {
      tierPopup.classList.add('active-popup');
    });

    tierTextHover.addEventListener('mouseleave', (e) => {
      const related = e.relatedTarget;

      setTimeout(() => {
        if (!related || !tierPopup.contains(related)) {
          tierPopup.classList.remove('active-popup');
        }
      }, 100);
    });

    tierPopup.addEventListener('mouseleave', (e) => {
      const related = e.relatedTarget;

      if (!related || !tierPopup.contains(related)) {
        tierPopup.classList.remove('active-popup');
      }
    });

    tierPopup.addEventListener('mouseenter', () => {
      tierPopup.classList.add('active-popup');
    });
  });

  const filterToggleArticle = document.querySelector('.template-article .swatches-search .filter-title');
  const filterArticle = document.querySelector('.template-article #FacetsWrapperDesktop');
  if (filterToggleArticle && filterArticle) {
    filterToggleArticle.addEventListener('click', () => {
      if (filterArticle.classList.contains('hidden')) {
        filterArticle.classList.remove('hidden');
        filterArticle.classList.add('toggled');
      } else {
        filterArticle.classList.add('hidden');
        filterArticle.classList.remove('toggled');
      }
    })

    function handleResize() {
      if (window.innerWidth > 768) {
        filterArticle.classList.remove('hidden');
        filterArticle.classList.remove('toggled')
      } else {
        filterArticle.classList.add('hidden');
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
  }

  const collectionSwatchesTemplate = document.querySelector('.main-collection-swatch-new');
  if (collectionSwatchesTemplate) {
    document.body.classList.add('template-collection-product-bar');
  }
});

const addEventFilter = () => {
  const allDetails = document.querySelectorAll('[id^="Details-"]');

  allDetails.forEach((details) => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    const toggleButton = summary.querySelector('#dropdownToggleIcon');

    if (toggleButton && toggleButton?.classList?.contains('plus')) {
      details.removeAttribute('open');
    }

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      const isOpen = details.hasAttribute('open');

      allDetails.forEach((otherDetails) => {
        if (otherDetails !== details) {
          otherDetails.removeAttribute('open');
          const otherToggleButton = otherDetails.querySelector('#dropdownToggleIcon');
          otherToggleButton?.classList.remove('minus');
          otherToggleButton?.classList.add('plus');
        }
      });

      if (!isOpen) {
        details.setAttribute('open', '');
        toggleButton?.classList.remove('plus');
        toggleButton?.classList.add('minus');
      } else {
        details.removeAttribute('open');
        toggleButton?.classList.remove('minus');
        toggleButton?.classList.add('plus');
      }
    });
  });
};

addEventFilter();

window.addEventListener("filter", () => {
  document.querySelectorAll('[id^="Details-"]').forEach((detail) => {
    const summary = detail.querySelectorAll('.mobile-facets__details');

    if (detail.querySelector('.dropdown-toggle') && summary.length > 3) {
      detail.classList.remove('no-toggle')
      detail.setAttribute('open', false);
    } else {
      detail.classList.add('no-toggle')
      detail.setAttribute('open', true);
    }
  });
  addEventFilter();
  AddClickOptions();
});

window.addEventListener("updateItem", () => {
  toggleClassBasedOnWidth();
})

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  if (elementToFocus) elementToFocus.focus();
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => video.pause());
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute('aria-expanded', false);
  summaryElement.focus();
}

// --- Dropdown restore gate -------------------------------------------------
// Only restore opened dropdowns when the user arrived by clicking a color
// switch link. Any other navigation (menu, footer, direct link, reload)
// starts with all dropdowns closed.
const OPENED_DROPDOWNS_KEY = 'openedDropdowns';
const RESTORE_DROPDOWNS_FLAG = 'restoreDropdownsOnNav';

// Read + consume the flag once per page load (applies to this navigation only).
const shouldRestoreOpenedDropdowns =
  sessionStorage.getItem(RESTORE_DROPDOWNS_FLAG) === '1';
sessionStorage.removeItem(RESTORE_DROPDOWNS_FLAG);

// If restoring isn't allowed for this navigation, clear the saved state so the
// dropdowns don't carry over to a product opened from menu/footer/etc.
if (!shouldRestoreOpenedDropdowns) {
  sessionStorage.removeItem(OPENED_DROPDOWNS_KEY);
}

// Set the flag right before navigating via a color switch link, so the next
// product page knows it should restore the opened dropdowns.
if (!window.__dropdownSwitchNavBound) {
  window.__dropdownSwitchNavBound = true;
  document.addEventListener(
    'click',
    (e) => {
      if (e.target.closest('.switch-option-wrapper.switch-option-color a[href]')) {
        sessionStorage.setItem(RESTORE_DROPDOWNS_FLAG, '1');
      }
    },
    true
  );
}

class OptionDropdown extends HTMLElement {
  constructor() {
    super();
    this.trigger = this.querySelector('[data-dropdown-trigger]');
    this.panel = this.querySelector('[data-dropdown-panel]');
    this.dropdownKey = this.dataset.dropdownKey;

    if (!this.trigger || !this.panel) return;

    document.addEventListener('DOMContentLoaded', () => {
      const allDropdowns = document.querySelectorAll('.product-info-wrapper option-dropdown');
      if (allDropdowns.length === 1) {
        this.classList.add('option-dropdown--single');
      }
    }, { once: true });

    this.trigger.addEventListener('click', (e) => {
      if (
        e.target.closest('.mount-modal-trigger') ||
        e.target.closest('.headrail-modal-trigger')
      ) return;

      this.toggle();
    });

   this.panel.addEventListener('change', (e) => {
    const el = e.target;

    if (el.classList.contains('input-trim-option')) {
      this.updateTrimDisplay(el);
      this.saveOpenedDropdown();
    } else if (
      el.matches('input[type="radio"]') &&
      !el.classList.contains('input-trim-side')
    ) {
      this.updateOptionDisplay(el);
      this.saveOpenedDropdown();
    }
  });

    // Restore all previously opened dropdowns
    if (this.dropdownKey && shouldRestoreOpenedDropdowns) {
      const openedDropdowns = this.getOpenedDropdowns();

      if (openedDropdowns.includes(this.dropdownKey)) {
        requestAnimationFrame(() => {
          this.open(false);
        });
      }
    }
  }

  toggle() {
    if (this.isConstructionLocked()) {
      this.showConstructionFirstMessage();
      const c = document.querySelector('[data-dropdown-key="construction"]');
      if (c && c !== this && !c.isOpen) c.open();
      return;
    }

    
    if (document.querySelector('input[name="construction"]:checked')){
      if (this.isMountLocked()) {
        this.showMountFirstMessage();
        const m = document.querySelector('[data-dropdown-key="mount"]');
        if (m && m !== this && !m.isOpen) m.open();
        return;
      }
    }

    if (this.isPipingSizeLocked()) {
      this.showPipingSizeFirstMessage();
      const p = document.querySelector('[data-dropdown-key="size"]');
      if (p && p !== this && !p.isOpen) p.open();
      return;
    }

    this.isOpen ? this.close() : this.open();
  }

  isConstructionLocked() {
    if (this.dropdownKey === 'construction') return false;

    const unlockedKeys = ['type', 'color'];
    if (unlockedKeys.includes(this.dropdownKey)) return false;

    const requires =
      document.body.classList.contains('template-product-roman-shade') ||
      document.body.classList.contains('template-product-roman-sheer') ||
      document.body.classList.contains('template-product-woven-wood') ||
      document.body.classList.contains('template-product-valance') ||
      document.body.classList.contains('template-product-curtains') ||
      document.body.classList.contains('template-product-cornice');
    if (!requires) return false;

    const constructionRadios = document.querySelectorAll('input[name="construction"]');
    if (!constructionRadios.length) return false;

    return !document.querySelector('input[name="construction"]:checked');
  }

  showConstructionFirstMessage() {
    const form = document.querySelector('product-form');
    if (form && typeof form.handleErrorMessage === 'function') {
      form.handleErrorMessage('Please select: construction option first');
    }
  }

  isMountLocked() {
    if (this.dropdownKey === 'mount') return false;

    const unlockedKeys = ['type', 'color'];
    if (unlockedKeys.includes(this.dropdownKey)) return false;

    const requires =
      document.body.classList.contains('template-product-roman-shade') ||
      document.body.classList.contains('template-product-roman-sheer');
    if (!requires) return false;

    const mountRadios = document.querySelectorAll('input[name="properties[Mount]"]');
    if (!mountRadios.length) return false;

    return !document.querySelector('input[name="properties[Mount]"]:checked');
  }

  showMountFirstMessage() {
    const form = document.querySelector('product-form');
    if (form && typeof form.handleErrorMessage === 'function') {
      form.handleErrorMessage('Please select: mount option first');
    }
  }

  isPipingSizeLocked() {
    if (this.dropdownKey === 'size') return false;

    const unlockedKeys = ['type', 'color'];
    if (unlockedKeys.includes(this.dropdownKey)) return false;

    const requires =
      document.body.classList.contains('template-product-piping-builder');
    if (!requires) return false;

    const sizePiping = document.querySelectorAll('input[name="Size"]');
    if (!sizePiping.length) return false;

    return !document.querySelector('input[name="Size"]:checked');
  }

  showPipingSizeFirstMessage() {
    const form = document.querySelector('product-form');
    if (form && typeof form.handleErrorMessage === 'function') {
      form.handleErrorMessage('Please select: size first');
    }
  }

  updateTrimDisplay(input) {
    const valueSpan = this.trigger.querySelector('[data-trim-selected]');
    const swatchSpan = this.trigger.querySelector('[data-trim-swatch]');
    if (!valueSpan) return;

    if (input.value === 'None') {
       valueSpan.innerHTML = '<span class="option-not-selected">NOT SELECTED</span>';

      if (swatchSpan) {
        swatchSpan.style.display = 'none';
      }

      return;
    }

    const label = this.panel.querySelector(`label[for="${input.id}"]`);
    valueSpan.textContent = label ? label.textContent.trim() : input.value;

    if (swatchSpan && label) {
      const computedColor = window.getComputedStyle(label).backgroundColor;
      swatchSpan.style.backgroundColor = computedColor;
      swatchSpan.style.display = 'inline-block';
    }
  }

  updateOptionDisplay(input) {
    const dedicated = ['Length', 'Height', 'Trim', 'construction'];
    if (dedicated.includes(input.name)) return;
  
    const valueSpan = this.trigger.querySelector('span[id*="-option-"]:not([data-trim-selected]), span[id^="option-"][id$="-legend"]');
    if (!valueSpan) return;

    valueSpan.textContent = input.value;
    valueSpan.classList.remove('option-not-selected');
    
    if (document.getElementById('option-mount-legend') && document.getElementById('option-mount-legend') === valueSpan) {
      const mountHelperTexts = document.querySelectorAll('.product-form__input-width .mount-message');
      if (mountHelperTexts.length) {
        const valueMount = input.value;
        mountHelperTexts.forEach((message) => {
          message.classList.add('visually-hidden');
        })
        const mountValueLowerCase = valueMount.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        document.querySelector(`.product-form__input-width .mount-message-${mountValueLowerCase}`)?.classList.remove('visually-hidden');
      }
      
    }
    if (document.getElementById('option-lining-legend') && document.getElementById('option-lining-legend') === valueSpan) {
      const liningHelperTexts = document.querySelectorAll('.product-form__input-lining .lining-message');
      if (liningHelperTexts.length) {
        const valueLining = input.value;
        liningHelperTexts.forEach((message) => {
          message.classList.add('visually-hidden');
        })
        const valueLowerCase = valueLining.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        document.querySelector(`.lining-message-${valueLowerCase}`)?.classList.remove('visually-hidden');
      }
    }
  }

  get isOpen() {
    return this.hasAttribute('open');
  }

  getOpenedDropdowns() {
    try {
      return JSON.parse(sessionStorage.getItem('openedDropdowns')) || [];
    } catch {
      return [];
    }
  }

  saveOpenedDropdown() {
    if (!this.dropdownKey) return;

    const openedDropdowns = this.getOpenedDropdowns();

    if (!openedDropdowns.includes(this.dropdownKey)) {
      openedDropdowns.push(this.dropdownKey);
      sessionStorage.setItem(
        'openedDropdowns',
        JSON.stringify(openedDropdowns)
      );
    }
  }

  removeOpenedDropdown() {
    if (!this.dropdownKey) return;

    const openedDropdowns = this.getOpenedDropdowns().filter(
      (key) => key !== this.dropdownKey
    );

    sessionStorage.setItem(
      'openedDropdowns',
      JSON.stringify(openedDropdowns)
    );
  }

  open(saveState = true) {
    // Save this dropdown without overwriting previous ones
    if (saveState) {
      this.saveOpenedDropdown();
    }

    this.setAttribute('open', '');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.panel.style.height = this.panel.scrollHeight + 'px';

    this.panel.addEventListener(
      'transitionend',
      () => {
        if (this.isOpen) {
          this.panel.style.height = 'auto';
        }
      },
      { once: true }
    );
  }

  close() {
    this.panel.style.height = this.panel.scrollHeight + 'px';

    requestAnimationFrame(() => {
      this.panel.style.height = '0';
    });

    this.removeAttribute('open');
    this.trigger.setAttribute('aria-expanded', 'false');

    // Remove only this one, keep others
    this.removeOpenedDropdown();
  }
}

customElements.define('option-dropdown', OptionDropdown);

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
    if (this.input) {
      this.input.addEventListener("change", this.onInputChange.bind(this));
    }
    this.querySelector('input').addEventListener("keydown", (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.target.blur();
      }
    });
  }

  onInputChange(event) {
    const minValue = this.input.getAttribute('min');
    if (minValue > 1) {
      if (this.input.value != 0 && parseInt(this.input.value) < minValue) {
        this.input.value = minValue;
      }
    }
    this.updateMasterId();
    this.toggleAddButton(false, "", false);
    this.updateB2BOriginalPrice();
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.currentTarget.name === "plus" ? this.input.stepUp() : this.input.stepDown();

    if (this.parentElement.querySelector('.quantity-require-message')) {
       const minValue = this.input.getAttribute('min');
      if (minValue > 1 && parseInt(this.input.value) == minValue && this.classList.contains('cart-quantity')) {
        this.parentElement.querySelector('.quantity-require-message')?.classList.remove('hidden');
      } else {
        this.parentElement.querySelector('.quantity-require-message')?.classList.add('hidden');
      }
    }

    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);

    // TODO: Refactor this from variant-radios
    this.updateMasterId();
    this.toggleAddButton(false, "", false);
  }

  updateMasterId() {
    const variantSelects = document.querySelector('variant-selects') || document.querySelector('variant-radios');
    if (variantSelects) {
      this.currentVariant = variantSelects?.currentVariant ?? null;
    } else {
      this.currentVariant = this.getVariantData()
      ? this.getVariantData().find(
        (el) =>
          el.id ==
          document.querySelector(
            '.product-info-wrapper form input[name="id"]'
          ).value
      )
      : null;
    }
  }

  // updateB2BOriginalPrice() {
  //   if (window.b2bTradeData?.isB2B) {
  //     const tradeInfoEls = document.querySelectorAll('[data-b2b-trade-info]');
      
  //     tradeInfoEls.forEach(tradeInfoEl => {
  //       const originalPriceEls = tradeInfoEl.querySelectorAll('.original-price-value');
  //       const b2bInput = document.getElementById('b2b-original-price-input');

  //       if (originalPriceEls.length || b2bInput) {
  //         const multiplier = window.b2bTradeData.multiplier
  //           || parseFloat(tradeInfoEl.dataset.multiplier)
  //           || 0.85;
  //         const quantity = parseInt(document.querySelector('.quantity-input[name="quantity"]')?.value) || 1;
  //         const price = this.currentVariant?.price 
  //         ?? window.ShopifyAnalytics?.meta?.product?.variants?.[0]?.price
  //         ?? parseInt(document.querySelector('[data-product-price]')?.dataset.productPrice)
  //         ?? 0;
  //         const originalPrice = Math.round((price / 100 / multiplier) * quantity);

  //         const b2bFormatter = new Intl.NumberFormat("en-US", {
  //           style: "currency", currency: "USD",
  //           minimumFractionDigits: 0, maximumFractionDigits: 0,
  //         });
  //         const formatted = b2bFormatter.format(originalPrice);

  //         originalPriceEls.forEach(el => el.textContent = formatted);
  //         if (b2bInput) b2bInput.value = formatted;
  //         window.b2bTradeData.currentOriginalPrice = originalPrice;
  //         if (this.currentVariant) {
  //           window.b2bTradeData.currentVariantId = this.currentVariant.id;
  //         }
  //       }
  //     });
  //   }
  // }

  updateB2BOriginalPrice() {
    if (!window.b2bTradeData?.isB2B) return;
    if (window.b2bTradeData.hideTradeInfo) return;

    const tradeInfoEls = document.querySelectorAll('[data-b2b-trade-info]');

    tradeInfoEls.forEach(tradeInfoEl => {
      const originalPriceEls = tradeInfoEl.querySelectorAll('.original-price-value');
      const b2bInput = document.getElementById('b2b-original-price-input');
      if (!originalPriceEls.length && !b2bInput) return;

      const multiplier = window.b2bTradeData.multiplier
        || parseFloat(tradeInfoEl.dataset.multiplier)
        || 0.85;
      const quantity = parseInt(document.querySelector('.quantity-input[name="quantity"]')?.value) || 1;

      // Resolve a usable price; skip the update when none is available
      const candidates = [
        this.currentVariant?.price,
        window.ShopifyAnalytics?.meta?.product?.variants?.[0]?.price,
        parseInt(document.querySelector('[data-product-price]')?.dataset.productPrice),
      ];
      const price = candidates.find(v => typeof v === 'number' && !isNaN(v) && v > 0);
      if (price === undefined) return;

      const originalPrice = Math.round((price / 100 / multiplier) * quantity);

      const b2bFormatter = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD",
        minimumFractionDigits: 0, maximumFractionDigits: 0,
      });
      const formatted = b2bFormatter.format(originalPrice);

      originalPriceEls.forEach(el => el.textContent = formatted);
      if (b2bInput) b2bInput.value = formatted;

      window.b2bTradeData.currentOriginalPrice = originalPrice;
      if (this.currentVariant) {
        window.b2bTradeData.currentVariantId = this.currentVariant.id;
      }
    });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    if (!this.currentVariant) return;
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');

    if (!addButton) return;

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    if (disable) {
      addButton.setAttribute("disabled", true);
      if (text) addButton.textContent = text;
    } else {
      addButton.removeAttribute("disabled");
      if (window.variantStrings.addToCartHtml) {
        const price =
          (this.currentVariant.price / 100) *
          parseInt(document.querySelector(".quantity-input").value, 10);
        addButton.innerHTML = window.variantStrings.addToCartHtml.replace(
          "{{ price }}",
          `${formatter.format(price).replace(".00", "")}`
        );
      } else {
        addButton.textContent = window.variantStrings.addToCart;
      }
    }

    if (!modifyClass) return;
  }

  getVariantData() {
    this.variantData = document.querySelector("[data-variants]")
      ? JSON.parse(document.querySelector("[data-variants]").textContent)
      : null;
    return this.variantData;
  }
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// function handleize(str) {
//   return str
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/-$/, "")
//     .replace(/^-/, "");
// }

function handleize(text) {
  if (!text) return '';
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);

  for (const key of formData.keys()) {
    const regex = /(?:^(properties\[))(.*?)(?:\]$)/;

    if (regex.test(key)) {
      obj.properties = obj.properties || {};
      obj.properties[regex.exec(key)[2]] = formData.get(key);
    } else {
      obj[key] = formData.get(key);
    }
  }

  return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector("details");
    const summaryElements = this.querySelectorAll("summary");
    this.addAccessibilityAttributes(summaryElements);

    if (navigator.platform === "iPhone")
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${window.innerHeight}px`
      );

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    );
    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onCloseButtonClick.bind(this))
    );
  }

  addAccessibilityAttributes(summaryElements) {
    summaryElements.forEach((element) => {
      element.setAttribute("role", "button");
      element.setAttribute("aria-expanded", false);
      element.setAttribute("aria-controls", element.nextElementSibling.id);
    });
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute("open");

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen
        ? this.closeMenuDrawer(summaryElement)
        : this.openMenuDrawer(summaryElement);
    } else {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button")
      );

      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
        if (detailsElement.classList.contains('collection-filter-mobile-details')) {
          document.body.classList.add('collection-show-filter-mobile');
        }
      });
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
      if (this.mainDetailsToggle.classList.contains('collection-filter-mobile-details')) {
        document.querySelector('body').classList.add('collection-show-filter-mobile');
      }
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove("menu-opening");
      if (this.mainDetailsToggle.classList.contains('collection-filter-mobile-details')) {
        document.querySelector('body').classList.remove('collection-show-filter-mobile');
      }
      this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open");
        details.classList.remove("menu-opening");
      });
      this.mainDetailsToggle
        .querySelector("summary")
        .setAttribute("aria-expanded", false);
      document.body.classList.remove(
        `overflow-hidden-${this.dataset.breakpoint}`
      );
      document.body.classList.remove(`js-header-menu-open`);
      removeTrapFocus(elementToFocus);
      this.closeAnimation(this.mainDetailsToggle);
    }
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest("details");
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove("menu-opening");
    if (detailsElement.classList.contains('collection-filter-mobile-details')) {
      document.querySelector('body').classList.remove('collection-show-filter-mobile');
    }
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary")
          );
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define("menu-drawer", MenuDrawer);
class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
    this.announcementBar = document.querySelector('.announcement-bar');
    this.header =
      this.header || document.getElementById("shopify-section-header");

    this.updateHeaderHeight();

    const resizeObserver = new ResizeObserver(() => this.updateHeaderHeight());
    resizeObserver.observe(this.header);
    if (this.announcementBar) resizeObserver.observe(this.announcementBar);
  }

  openMenuDrawer(summaryElement) {
    this.header =
      this.header || document.getElementById("shopify-section-header");
    this.borderOffset =
      this.borderOffset ||
        this.closest(".header-wrapper").classList.contains(
          "header-wrapper--border-bottom"
        )
        ? 1
        : 0;
    document.documentElement.style.setProperty(
      "--header-bottom-position",
      `${parseInt(
        this.header.getBoundingClientRect().bottom - this.borderOffset
      )}px`
    );

    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });

    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
    document.body.classList.add(`js-header-menu-open`);
  }

  updateHeaderHeight() {
    const announcementBarHeight = this.announcementBar?.offsetHeight ?? 0;
    this.headerHeight = this.header.offsetHeight + announcementBarHeight;

    document.documentElement.style.setProperty(
      "--header-mobile-height", `${this.headerHeight}px`
    );
    document.documentElement.style.setProperty(
      "--header-inner-mobile-height", `${this.header.offsetHeight}px`
    );
    
    const menuDrawerHeight = window.visualViewport 
      ? window.visualViewport.height
      : window.innerHeight;
    document.documentElement.style.setProperty(
      "--menu-drawer-height", `${menuDrawerHeight}px`
    ); 
    
  }
}

customElements.define("header-drawer", HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this)
    );
    this.addEventListener("keyup", (event) => {
      if (event.code.toUpperCase() === "ESCAPE") this.hide();
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide();
      });
    } else {
      this.addEventListener("click", (event) => {
        if (event.target.nodeName === "MODAL-DIALOG") this.hide();
      });
    }
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
  }

  hide() {
    document.body.classList.remove("overflow-hidden");
    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button) return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal) modal.show(button);
    });
  }
}
customElements.define("modal-opener", ModalOpener);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector("ul");
    this.sliderItems = this.querySelectorAll("li");
    this.pageCount = this.querySelector(".slider-counter--current");
    this.pageTotal = this.querySelector(".slider-counter--total");
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');
    this.dotButtons = this.querySelectorAll('button[name="index"]');
    this.navButtons = this.querySelector('.slider-buttons');
    this.isAutoPlay = parseInt(this.dataset.autoplay, 10);
    this.isPlaying = true;

    if (!this.slider || !this.nextButton) return;

    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);
    if (this.isAutoPlay) {
      const intersectionObserver = new IntersectionObserver((entries) =>
        this.autoPlay(entries)
      );
      intersectionObserver.observe(this.slider, {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      });
    }

    this.slider.addEventListener("scroll", this.update.bind(this));
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
    this.dotButtons.forEach((button) => {
      button.addEventListener("click", this.onDotClick.bind(this));
    });

    if (this.querySelectorAll("video.lazy")) {
      this.loadVideo()
    }
  }

  initPages() {
    this.sliderItems = this.querySelectorAll(".slider > li:not(.visually-hidden");
    const sliderItemsToShow = Array.from(this.sliderItems).filter(
      (element) => element.clientWidth > 0
    );
    this.sliderLastItem = sliderItemsToShow[sliderItemsToShow.length - 1];
    if (sliderItemsToShow.length === 0) return;
    this.slidesPerPage = Math.floor(
      this.slider.clientWidth / sliderItemsToShow[0].clientWidth
    );
    this.totalPages = sliderItemsToShow.length - this.slidesPerPage + 1;
    if (this.totalPages <= 1) {
      this.classList.add('slider-only-page');
    } else {
      this.classList.remove('slider-only-page');
    }
    this.update();
  }

  update() {
    if (!this.pageCount || !this.pageTotal) return;
    this.currentPage =
      Math.round(this.slider.scrollLeft / this.sliderLastItem?.clientWidth) + 1;

    const currentItem = this.querySelectorAll('.slider > li:not(.visually-hidden)')[this.currentPage - 1];
    if (currentItem && currentItem.classList.contains('cylindo-viewer')) {
      this.classList.add('is-cylindo-active');
    } else {
      this.classList.remove('is-cylindo-active');
    }
    
    if (this.currentPage === 1) {
      this.prevButton.setAttribute("disabled", true);
    } else {
      this.prevButton.removeAttribute("disabled");
    }

    if (this.currentPage === this.totalPages || this.totalPages < 1) {
      this.nextButton.setAttribute("disabled", true);
    } else {
      this.nextButton.removeAttribute("disabled");
    }
    if (this.currentPage === this.totalPages && this.currentPage === 1) {
      this.navButtons.classList.add('visually-hidden');
    } else {
      this.navButtons.classList.remove('visually-hidden');
    }

    if (this.dotButtons.length > 0) {
      this.dotButtons.forEach((button) => {
        button.classList.remove("is-active");
      });

      if (this.dotButtons[this.currentPage - 1]) {
        this.dotButtons[this.currentPage - 1].classList.add("is-active");
        this.dotButtons[this.currentPage - 1].classList.remove(
          "product__media-item--trim-image"
        );
      }
    }

    this.pageCount.textContent = this.currentPage;
    if (this.currentPage > this.totalPages) {
      this.pageTotal.textContent = this.currentPage;
    } else {
      this.pageTotal.textContent = this.totalPages;
    }
  }

  autoPlay(entries) {
    // this.currentPage, this.totalPages
    if (!this.isAutoPlay) {
      return;
    }
    entries.forEach((entry) => {
      this.interval;
      if (entry.isIntersecting) {
        this.isPlaying = true;
        this.interval = window.setInterval(() => {
          if (this.currentPage < this.totalPages) {
            this.slider.scroll({
              top: 0,
              left: this.currentPage * this.sliderLastItem.clientWidth,
            });
          } else {
            this.slider.scroll({
              top: 0,
              left: 0,
            });
          }
        }, this.isAutoPlay);
      } else {
        clearInterval(this.interval);
        this.isPlaying = false;
      }
    });
  }

  onButtonClick(event) {
    event.preventDefault(event.currentTarget.name);
    this.sliderItems = this.querySelectorAll(".slider > li");
    const sliderItemsToShow = Array.from(this.sliderItems).filter(
      (element) => element.clientWidth > 0
    );
    const marginRight = window.getComputedStyle(sliderItemsToShow[0]).marginRight;
    const marginRightValue = parseFloat(marginRight);

    const slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollLeft + this.sliderLastItem.clientWidth + marginRightValue
        : this.slider.scrollLeft - this.sliderLastItem.clientWidth - marginRightValue;

    this.slider.scrollTo({
      left: slideScrollPosition,
      behavior: "smooth",
    });
    this.resetZoomIcon();
  }
  onDotClick(event) {
    event.preventDefault;
    const slideScrollPosition =
      (event.currentTarget.dataset.index - 1) * this.sliderLastItem.clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
    clearInterval(this.interval);
    this.isPlaying = false;
    this.resetZoomIcon();
  }

  resetZoomIcon() {
    this.buttonZoomIn = this.querySelector('.zoom-wrapper .zoom-in');
    this.buttonZoomOut = this.querySelector('.zoom-wrapper .zoom-out');
    if (!this.buttonZoomIn && !this.buttonZoomOut) return;
    this.buttonZoomIn.classList.remove('hidden');
    this.buttonZoomOut.classList.add('hidden');

    this.productThumbnailSlides = this.querySelectorAll('.main-images-slider.enable-zoom .media');
    if (this.productThumbnailSlides.length) {
      this.productThumbnailSlides.forEach((media) => {
        const pz = media.pzInstance;
        if (pz) {
          const targetZoom = 1;
          pz.scaleTo(targetZoom, { x: 0, y: 0 });
          pz.offset = { x: 0, y: 0 };
          pz.update();
          media.parentElement.style.pointerEvents = 'none';
        }
      });
    }
  }

  loadVideo() {
    const lazyVideos = [].slice.call(this.querySelectorAll("video.lazy"));
    if ("IntersectionObserver" in window) {
      var lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (video) {
          if (video.isIntersecting) {
            for (var source in video.target.children) {
              var videoSource = video.target.children[source];
              if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                videoSource.src = videoSource.dataset.src;
              }
            }

            video.target.load();
            video.target.classList.remove("lazy");
            lazyVideoObserver.unobserve(video.target);
            video.target.play();
          }
        });
      });

      lazyVideos.forEach(function (lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
      });
    }
  }
}

customElements.define("slider-component", SliderComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);
  }

  onVariantChange() {
    if (document.body.classList.contains('template-product-shower-curtains')) {
      const liningRadios = document.querySelectorAll('input[name="lining"]');
      const liningChecked = document.querySelector('input[name="lining"]:checked');
      if (liningRadios.length && !liningChecked) {
        this.setUnavailable();
        return;
      }
    }
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    this.updatePickupAvailability();
    this.updateHeadRailDepth();

    this.checkChairFurnitureOption();
    this.checkSofaFurnitureOption();
    this.checkWaverlyFurnitureOption();
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateOptionLegends();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      if (window.__cylindoProductCodes && Object.keys(window.__cylindoProductCodes).length > 0) {
        this.activateCylindoViewer();
      }
    }
    const checkContructionChecked = this.checkConstructionOptions();
    if (!checkContructionChecked) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    }
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    );
  }

  activateCylindoViewer() {
    // Find thumbnail slider
    const thumbnailSlider = document.querySelector('.thumbnail-slider');
    if (!thumbnailSlider) return;
  
    // Find cylindo-viewer item
    const cylindoItem = thumbnailSlider.querySelector('.grid__item.cylindo-viewer');
    if (!cylindoItem) return;
  
    // Remove active class from all items
    thumbnailSlider.querySelectorAll('.grid__item').forEach(item => {
      item.classList.remove('is-active');
    });
  
    // Add active class to cylindo item
    cylindoItem.classList.add('is-active');
  
    // Scroll to cylindo item in slider
    const sliderList = thumbnailSlider.querySelector('ul');
    if (sliderList) {
      sliderList.scroll({
        left: cylindoItem.offsetLeft,
        behavior: 'smooth'
      });
    }
  
    // Also update main slider if exists
    const mainSlider = document.querySelector('.main-images-slider');
    if (mainSlider) {
      const mainCylindoItem = mainSlider.querySelector('.grid__item.cylindo-viewer');
      if (mainCylindoItem) {
        mainSlider.querySelectorAll('.grid__item').forEach(item => {
          item.classList.remove('is-active');
        });
        mainCylindoItem.classList.add('is-active');
        
        const mainSliderList = mainSlider.querySelector('ul');
        if (mainSliderList) {
          mainSliderList.scroll({
            left: mainCylindoItem.offsetLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  updateHeadRailDepth() {
    const headRailOptions = document.querySelectorAll('.product-form__input-headrail-depth input[name="properties[Headrail Depth]"]');
    if (!headRailOptions.length) return;
  
    const lengthInput = document.querySelector('length-input input[name="properties[Length]"]') 
      || document.querySelector('length-input-select input[name="properties[Length]"]');
    const widthInput = document.querySelector('width-input input[name="properties[Width]"]') 
      || document.querySelector('width-input-select input[name="properties[Width]"]');
  
    const lengthValue = parseFloat(lengthInput?.value) || 0;
    const widthValue = parseFloat(widthInput?.value) || 0;
  
    if (!lengthValue && !widthValue) return;
  
    let isWovenProduct = document.querySelector('width-input-select')?.classList.contains('width-woven');
    if ((lengthValue >= 60 || widthValue >= 60) && !isWovenProduct) {
      headRailOptions.forEach((option) => {
        if (option.value.includes('2.5')) {
          option.checked = true;
          option.removeAttribute('disabled');
        } else {
          option.setAttribute('disabled', true);
        }
      });
    } else if (isWovenProduct) {
      let force25 = false;
      let weightGroup = document.querySelector('width-input-select');
      if (weightGroup.classList.contains('heavy-weight')) {
        if (widthValue > 60) {
          force25 = true;
        } else if (widthValue > 30) {
          force25 = lengthValue > 24;
        } else {
          force25 = lengthValue > 48;
        }
      } else if (weightGroup.classList.contains('medium-weight')) {
        if (widthValue > 60) {
          force25 = true;
        } else if (widthValue > 36) {
          force25 = lengthValue > 36;
        } else {
          force25 = lengthValue > 54;
        }
      } else {
        force25 = widthValue > 54 || lengthValue > 54;
      }
      if (force25) {
        headRailOptions.forEach((option) => {
          if (option.value.includes('2.5')) {
            option.checked = true;
            option.removeAttribute('disabled');
          } else {
            option.setAttribute('disabled', true);
          }
        });
      } else {
        headRailOptions.forEach((option) => {
          option.removeAttribute('disabled');
        });
      }
    } else {
      headRailOptions.forEach((option) => {
        option.removeAttribute('disabled');
      });
    }
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;
    const newMedia = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_image.id}"]`
    );

    // Product Pages
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");

    if (!newMedia) return;

    // Swatch pages
    if (document.body.classList.contains("template-product-swatches")) {
      document.querySelectorAll("li.grid__item").forEach((item) => {
        item.classList.remove("is-active");
      });
      newMedia.classList.add("is-active");
      if (window.matchMedia("(min-width: 40em)").matches) {
        window.scroll({
          top: newMedia.offsetTop,
        });
      } else {
        const mainThumbnail = mainSlider.querySelector(
          `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_image.id}"]`
        );
        mainSlider.querySelector("ul").scroll({
          top: 0,
          left: mainThumbnail.offsetLeft,
        });
      }
    }

    if (mainSlider && thumbnailSlider) {
      if (mainSlider.offsetParent === null) {
        const thumbnail = thumbnailSlider.querySelector(
          `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_image.id}"]`
        );
        thumbnail.classList.remove("product__media-item--variant");
        thumbnailSlider.querySelector("ul").scroll({
          top: 0,
          left: thumbnail.offsetLeft,
        });
      } else {
        const mainThumbnail = mainSlider.querySelector(
          `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_image.id}"]`
        );
        mainThumbnail.classList.remove("product__media-item--variant");
        mainSlider.querySelector("ul").scroll({
          top: 0,
          left: mainThumbnail.offsetLeft,
        });
      }
      if (
        !window.matchMedia("(min-width: 40em)").matches &&
        document.body.classList.contains("template-product-pillows")
      ) {
        window.scroll({
          top: newMedia.offsetTop,
        });
      }
    }

    this.stickyHeader =
      this.stickyHeader || document.querySelector("sticky-header");
    if (this.stickyHeader) {
      this.stickyHeader.dispatchEvent(new Event("preventHeaderReveal"));
    }
  }

  updateOptionLegends() {
    const lining = document.querySelector(".product-form__input-lining");
    this.currentVariant.options.forEach((option, i) => {
      const label = document.getElementById(
        `${this.dataset.section}-option-${i}`
      );
      
      if (
        label
          .closest("fieldset")
          .classList.contains("product-form__input-length")
      ) {
        if (
          option === "Small" ||
          option === "Medium" ||
          option == "Large" ||
          option == "Extra Large"
        ) {
          const lengthValue = document.querySelector("#length")?.value;
          const isShowerCurtain = document.body.classList.contains("template-product-shower-curtains");

          label.innerHTML = lengthValue
            ? lengthValue
            : `<span class="option-not-selected">
                ${window.cartStrings.selectLength}
              </span>`;
        }
      } else if (
        label.closest("fieldset").classList.contains("product-form__input-trim")
      ) {
        if (document.body.classList.contains("template-product-woven-wood")) {
          return;
        }
        const trimSelected = document.querySelector('input[name="properties[Trim]"]:checked');
        if (trimSelected) {
          label.innerText = label.innerText;
        }
      } else if (
        label
          .closest("fieldset")
          .classList.contains("product-form__input-piping")
      ) {
        label.innerText = option;
        return;
      } else if (
        label
          .closest("fieldset")
          .classList.contains("product-form__input-width:not(.product-form-roman)")
      ) {
        if (
          option === "Small" ||
          option === "Medium" ||
          option == "Large" ||
          option == "Extra Large"
        ) {
          const widthValue = document.querySelector("width-input #width")?.value;

          label.innerHTML = widthValue
            ? widthValue
            : `<span class="option-not-selected">${window.cartStrings.notSelected}</span>`;
        }
      } else if (label.hasAttribute('data-unit')) {
        return;
      } else if (label.hasAttribute('data-waverly-label')) {
        label.innerText = option.replaceAll('with Casters', '').trim();
      } else {
        label.innerText = option;
      }
    });
    if (lining) {
      const label = lining.querySelector(".form__label");
      const legend = lining.querySelector("#option-lining-legend");
      const value = lining.querySelector(
        'input[name="properties[Lining]"]:checked'
      )?.value;
      if (value) {
        legend.innerText = value;
        const liningHelperTexts = lining.querySelectorAll('.lining-message');
        if (liningHelperTexts.length) {
          liningHelperTexts.forEach((message) => {
            message.classList.add('visually-hidden');
          })
          const valueLowerCase = value.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          lining.querySelector(`.lining-message-${valueLowerCase}`)?.classList.remove('visually-hidden');
        }
      }
    }

    const mount = document.querySelector(".product-form__input-mount");
    if (mount) {
      const labelMount = mount.querySelector(".form__label");
      const legendMount = mount.querySelector("#option-mount-legend");
      const valueMount = mount.querySelector(
        'input[name="properties[Mount]"]:checked'
      )?.value;
      if (valueMount) {
        legendMount.innerText = valueMount;
        const mountHelperTexts = document.querySelectorAll('.product-form__input-width .mount-message');
        if (mountHelperTexts.length) {
          
          mountHelperTexts.forEach((message) => {
            message.classList.add('visually-hidden');
          })
          const mountValueLowerCase = valueMount.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          document.querySelector(`.product-form__input-width .mount-message-${mountValueLowerCase}`)?.classList.remove('visually-hidden');
        }
      }
    }

    const headRailDepth = document.querySelector(".product-form__input-headrail-depth");
    if (headRailDepth) {
      const legendHeadRailDepth = headRailDepth.querySelector("#option-headrail-depth-legend");
      const valueHeadRailDepth = headRailDepth.querySelector(
        'input[name="properties[Headrail Depth]"]:checked'
      )?.value;
      if (valueHeadRailDepth) {
        legendHeadRailDepth.innerText = valueHeadRailDepth;
      }
    }

    const depthForm = document.querySelector(".product-form__input-depth");
    if (depthForm) {
      const legendDepthForm = depthForm.querySelector("#option-depth-legend");
      const valueDepthForm = depthForm.querySelector(
        'input[name="properties[Depth]"]:checked'
      )?.value;
      if (valueDepthForm) {
        legendDepthForm.innerText = valueDepthForm;
      }
    }

    const styleElement = document.querySelector(".product-form__input-style");
    if (styleElement) {
      const labelStyle = styleElement.querySelector(".form__label");
      const legendStyle = styleElement.querySelector("#option-style-legend");
      const valueStyle = styleElement.querySelector(
        'input[name="properties[Style]"]:checked'
      )?.value;
      if (legendStyle && valueStyle) {
        legendStyle.classList.remove("option-not-selected");
        legendStyle.innerText = valueStyle;
      }
    }
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === "false") return;
    if (
      document.body.classList.contains("template-product-curtains") ||
      document.body.classList.contains("template-product-cafe-curtains")
    ) {
      // read url for object already present and compare with URLObject
      this.url = {
        construction: document.querySelector(
          'input[name="construction"]:checked'
        )?.value,
        lengthRadio: document.querySelector('input[name="Length"]:checked')
          ?.value,
        length: document.querySelector('input[name="properties[Length]"]')
          ?.value,
        width: document.querySelector('input[name="Width"]:checked')?.value,
        lining: document.querySelector(
          'input[name="properties[Lining]"]:checked'
        )?.value,
        trimEl: encodeURIComponent(
          document.querySelector('input[name="Trim"]:checked')?.value
        ),
        trimStyle: document.querySelector(
          'input[name="properties[Trim Style]"]:checked'
        )?.value,
        trimSide: encodeURIComponent(
          document.querySelector('input[name="properties[Trim]"]:checked')
            ?.value
        ),
      };
      // throw all key value pairs from this.url into the url
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => key + "=" + this.url[key])
          .join("&")}`
      );
    } else if (
      document.body.classList.contains("template-product-cafe-curtains-sheers") ||
      document.body.classList.contains("template-product-sheer-curtain")
    ) {
      this.url = {
        construction: document.querySelector(
          'input[name="construction"]:checked'
        )?.value,
        lengthRadio: document.querySelector('input[name="Length"]:checked')
          ?.value,
        length: document.querySelector('input[name="properties[Length]"]')
          ?.value,
        width: document.querySelector('input[name="Width"]:checked')?.value,
        variant: this.currentVariant.id,
      }
        // throw all key value pairs from this.url into the url
      // window.history.replaceState(
      //   {},
      //   "",
      //   `${this.dataset.url}?${Object.keys(this.url)
      //     .map((key) => key + "=" + this.url[key])
      //     .join("&")}`
      // );
      window.history.replaceState({}, "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => this.url[key] ? key + "=" + this.url[key] : '')
          .filter(Boolean)
          .join("&")}`
      );
    } else if (
      document.body.classList.contains("template-product-shower-curtains")
    ) {
      this.url = {
        lining: document.querySelector('input[name="lining"]:checked')?.value,
        width: encodeURIComponent(
          document.querySelector('input[name="Width"]:checked')?.value
        ),
        length: encodeURIComponent(
          document.querySelector('select[name="properties[Length]"]')?.value
        ),
        trimEl: encodeURIComponent(
          document.querySelector('input[name="Trim"]:checked')?.value
        ),
        trimStyle: document.querySelector(
          'input[name="properties[Trim Style]"]:checked'
        )?.value,
        trimSide: encodeURIComponent(
          document.querySelector('input[name="properties[Trim]"]:checked')
            ?.value
        ),
        variant: this.currentVariant.id,
      };
      // window.history.replaceState(
      //   {},
      //   "",
      //   `${this.dataset.url}?${Object.keys(this.url)
      //     .map((key) => key + "=" + this.url[key])
      //     .join("&")}`
      // );
      window.history.replaceState({}, "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => this.url[key] && this.url[key] !== 'undefined' ? key + "=" + this.url[key] : '')
          .filter(Boolean)
          .join("&")}`
      );
    } else if (
      document.body.classList.contains("template-product-pillows") ||
      document.body.classList.contains("template-product-piping-builder")
    ) {
      this.url = {
        trimSide: encodeURIComponent(
          document.querySelector('input[name="Trim"]:checked')
            ?.value || "none"
        ),
        trimStyle: encodeURIComponent(
          document.querySelector('input[name="properties[Trim]"]:checked')
            ?.value || "none"
        ),
        variant: this.currentVariant.id,
      };
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => key + "=" + this.url[key])
          .join("&")}`
      );
    } else if (
      document.body.classList.contains("template-product-furniture")
    ) {
      this.url = {
        welt: document.querySelector(
          'input[name="properties[Trim]"]:checked'
        )?.value,
        legColor: document.querySelector(
          'input[name="properties[Wood Finish]"]:checked'
        )?.value,
        variant: this.currentVariant.id,
      };
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => this.url[key] ? key + "=" + this.url[key] : '')
          .join("&")}`
      );
    } else if (document.body.classList.contains("template-product-roman-shade") || document.body.classList.contains("template-product-woven-wood")) {
      this.url = {
        construction: document.querySelector(
          'input[name="construction"]:checked'
        )?.value,
        lengthRadio: document.querySelector('input[name="Length"]:checked')
          ?.value,
        length: document.querySelector('input[name="properties[Length]"]')
          ?.value,
        widthRadio: document.querySelector('input[name="Width"]:checked')?.value,
        width: document.querySelector('input[name="properties[Width]"]')?.value,
        lining: document.querySelector(
          'input[name="properties[Lining]"]:checked'
        )?.value,
        mount: document.querySelector('input[name="properties[Mount]"]:checked')?.value,
        headRail: document.querySelector('input[name="properties[Headrail Depth]"]:checked')?.value,
        trimEl: encodeURIComponent(
          document.querySelector('input[name="Trim"]:checked')?.value
        ),
        trimStyle: document.querySelector(
          'input[name="properties[Trim Style]"]:checked'
        )?.value,
        trimSide: encodeURIComponent(
          document.querySelector('input[name="properties[Trim]"]:checked')
            ?.value
        ),
        variant: this.currentVariant.id,
        style: document.querySelector('input[name="properties[Style]"]:checked')?.value,
      };
      // throw all key value pairs from this.url into the url
      // window.history.replaceState(
      //   {},
      //   "",
      //   `${this.dataset.url}?${Object.keys(this.url)
      //     .map((key) => key + "=" + this.url[key])
      //     .join("&")}`
      // );
      window.history.replaceState({}, "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => this.url[key] && this.url[key] !== 'undefined' ? key + "=" + this.url[key] : '')
          .filter(Boolean)
          .join("&")}`
      );
    } else if (document.body.classList.contains("template-product-roman-sheer")) {
      this.url = {
        construction: document.querySelector(
          'input[name="construction"]:checked'
        )?.value,
        lengthRadio: document.querySelector('input[name="Length"]:checked')
          ?.value,
        length: document.querySelector('input[name="properties[Length]"]')
          ?.value,
        widthRadio: document.querySelector('input[name="Width"]:checked')?.value,
        width: document.querySelector('input[name="properties[Width]"]')?.value,
        mount: document.querySelector('input[name="properties[Mount]"]:checked')?.value,
        headRail: document.querySelector('input[name="properties[Headrail Depth]"]:checked')?.value,
        trimEl: encodeURIComponent(
          document.querySelector('input[name="Trim"]:checked')?.value
        ),
        trimStyle: document.querySelector(
          'input[name="properties[Trim Style]"]:checked'
        )?.value,
        trimSide: encodeURIComponent(
          document.querySelector('input[name="properties[Trim]"]:checked')
            ?.value
        ),
        variant: this.currentVariant.id,
      };
      // throw all key value pairs from this.url into the url
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => key + "=" + this.url[key])
          .join("&")}`
      );
    } else if (document.body.classList.contains("template-product-cornice")) {
      this.url = {
        construction: document.querySelector(
          'input[name="construction"]:checked'
        )?.value,
        heightRadio: document.querySelector('input[name="Height"]:checked')?.value,
        widthRadio: document.querySelector('input[name="Width"]:checked')?.value,
        width: document.querySelector('input[name="properties[Width]"]')?.value,
        depth: document.querySelector('input[name="properties[Depth]"]:checked')?.value,
        trimEl: encodeURIComponent(
          document.querySelector('input[name="Trim"]:checked')?.value
        ),
        trimStyle: document.querySelector(
          'input[name="properties[Trim Style]"]:checked'
        )?.value,
        trimSide: encodeURIComponent(
          document.querySelector('input[name="properties[Trim]"]:checked')
            ?.value
        ),
        variant: this.currentVariant.id,
      };
      // throw all key value pairs from this.url into the url
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => key + "=" + this.url[key])
          .join("&")}`
      );
    } else if (document.body.classList.contains("template-product-valance")) {
      this.url = {
        construction: document.querySelector(
          'input[name="construction"]:checked'
        )?.value,
        heightRadio: document.querySelector('input[name="Height"]:checked')?.value,
        widthRadio: document.querySelector('input[name="Width"]:checked')?.value,
        width: document.querySelector('input[name="properties[Width]"]')?.value,
        depth: document.querySelector('input[name="properties[Depth]"]:checked')?.value,
        trimEl: encodeURIComponent(
          document.querySelector('input[name="Trim"]:checked')?.value
        ),
        trimStyle: document.querySelector(
          'input[name="properties[Trim Style]"]:checked'
        )?.value,
        trimSide: encodeURIComponent(
          document.querySelector('input[name="properties[Trim]"]:checked')
            ?.value
        ),
        variant: this.currentVariant.id,
      };
      // throw all key value pairs from this.url into the url
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?${Object.keys(this.url)
          .map((key) => key + "=" + this.url[key])
          .join("&")}`
      );
    } else {
      window.history.replaceState(
        {},
        "",
        `${this.dataset.url}?variant=${this.currentVariant.id}`
      );
    }
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      
      if (input.value !== String(this.currentVariant.id)) {
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  renderProductInfo() {
    this.toggleAddButton(
      !this.currentVariant.available,
      window.variantStrings.soldOut
    );
    if (this.dataset.url.includes("curtain") || this.dataset.url.includes("romanshade") || this.dataset.url.includes("valance") || this.dataset.url.includes("cornice")) return;
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove("visibility-hidden");
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}`
    );
    if (!productForms) return;
    const addButton = productForm.querySelector('[name="add"]');

    if (!addButton) return;

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    const urlParams = new URLSearchParams(window.location.search);
    const trimStyle = urlParams.get('trimStyle');

    this.updateB2BOriginalPrice();

    if (disable) {
      addButton.setAttribute("disabled", true);
      if (text) {
        addButton.textContent = text;
      }
    } else {
      addButton.removeAttribute("disabled");

      // if (trimStyle && trimStyle.toLowerCase().includes('powder pom pom')) {
      //   const price =
      //     (this.currentVariant.price / 100) *
      //     parseInt(document.querySelector(".quantity-input").value, 10);
      //   addButton.innerHTML = window.variantStrings.pompomOosHtml.replace(
      //     "{{ price }}",
      //     `${formatter.format(price).replace(".00", "")}`
      //   );
      // } else {
      //   if (window.variantStrings.addToCartHtml) {
      //     const price =
      //       (this.currentVariant.price / 100) *
      //       parseInt(document.querySelector(".quantity-input").value, 10);
      //     addButton.innerHTML = window.variantStrings.addToCartHtml.replace(
      //       "{{ price }}",
      //       `${formatter.format(price).replace(".00", "")}`
      //     );
      //   } else {
      //     addButton.textContent = window.variantStrings.addToCart;
      //   }
      // }
      const buyButtonText = this.detectPreOrderPompom(trimStyle);
      if (buyButtonText) {
        let price =
          (this.currentVariant.price / 100) *
          parseInt(document.querySelector(".quantity-input").value, 10);

        // Round price for B2B customers
        if (window.b2bTradeData?.isB2B) {
          price = Math.round(price);
        }

        addButton.innerHTML = `${formatter.format(price).replace(".00", "")} | ${buyButtonText}`;
      } else {
        if (window.variantStrings.addToCartHtml) {
          let price =
            (this.currentVariant.price / 100) *
            parseInt(document.querySelector(".quantity-input").value, 10);

          // Round price for B2B customers
          if (window.b2bTradeData?.isB2B) {
            price = Math.round(price);
          }

          addButton.innerHTML = window.variantStrings.addToCartHtml.replace(
            "{{ price }}",
            `${formatter.format(price).replace(".00", "")}`
          );
        } else {
          addButton.textContent = window.variantStrings.addToCart;
        }
      }
    }

    // if (productForms.length >= 1) {
    //   productForms.forEach((form) => {
    //     const addToCartButton = form.querySelector('[name="add"]');

    //     if (disable) {
    //       addToCartButton.setAttribute("disabled", true);
    //       if (text) addToCartButton.textContent = text;
    //     } else {
    //       addToCartButton.removeAttribute("disabled");
    //       // if (trimStyle && trimStyle.toLowerCase().includes('powder pom pom')) {
    //       //   const price =
    //       //     (this.currentVariant.price / 100) *
    //       //     parseInt(document.querySelector(".quantity-input").value, 10);
    //       //   addToCartButton.innerHTML =
    //       //     window.variantStrings.pompomOosHtml.replace(
    //       //       "{{ price }}",
    //       //       `${formatter.format(price).replace(".00", "")}`
    //       //     );
    //       // } else {
    //       //   if (window.variantStrings.addToCartHtml) {
    //       //     const price =
    //       //       (this.currentVariant.price / 100) *
    //       //       parseInt(document.querySelector(".quantity-input").value, 10);
    //       //     addToCartButton.innerHTML =
    //       //       window.variantStrings.addToCartHtml.replace(
    //       //         "{{ price }}",
    //       //         `${formatter.format(price).replace(".00", "")}`
    //       //       );
    //       //   } else {
    //       //     addToCartButton.textContent = window.variantStrings.addToCart;
    //       //   }
    //       // }
    //       const buyButtonText = this.detectPreOrderPompom(trimStyle);
    //       if (buyButtonText) {
    //         const price =
    //           (this.currentVariant.price / 100) *
    //           parseInt(document.querySelector(".quantity-input").value, 10);
    //         addButton.innerHTML = `${formatter.format(price).replace(".00", "")} | ${buyButtonText}`;
    //       } else {
    //         if (window.variantStrings.addToCartHtml) {
    //           const price =
    //             (this.currentVariant.price / 100) *
    //             parseInt(document.querySelector(".quantity-input").value, 10);
    //           addButton.innerHTML = window.variantStrings.addToCartHtml.replace(
    //             "{{ price }}",
    //             `${formatter.format(price).replace(".00", "")}`
    //           );
    //         } else {
    //           addButton.textContent = window.variantStrings.addToCart;
    //         }
    //       }
    //     }
    //   });
    // }

    if (!modifyClass) return;
  }

  // updateB2BOriginalPrice() {
  //   // Check if B2B customer
  //   if (!window.b2bTradeData?.isB2B) return;

  //   const tradeInfoEls = document.querySelectorAll('[data-b2b-trade-info]');
  //   if (!tradeInfoEls.length) return;

  //   // Get current quantity from input
  //   const quantityInput = document.querySelector('.quantity-input[name="quantity"]');
  //   const quantity = parseInt(quantityInput?.value) || 1;

  //   // Calculate original price from current variant price
  //   // Formula: original = (catalog_price / multiplier) * quantity
  //   const catalogPrice = this.currentVariant?.price / 100; // Convert from cents

  //   // Format price
  //   const formatter = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   });

  //   tradeInfoEls.forEach(tradeInfoEl => {
  //     const multiplier = window.b2bTradeData.multiplier || parseFloat(tradeInfoEl.dataset.multiplier) || 0.85;
  //     const originalPrice = Math.round((catalogPrice / multiplier) * quantity);
  //     const formatted = formatter.format(originalPrice);

  //     // Update DOM
  //     const originalPriceEls = tradeInfoEl.querySelectorAll('.original-price-value'); // ✅ querySelectorAll
  //     originalPriceEls.forEach(el => el.textContent = formatted);

  //     // Update window data
  //     window.b2bTradeData.currentOriginalPrice = originalPrice;
  //     window.b2bTradeData.currentVariantId = this.currentVariant?.id;
  //   });

  //   const b2bInput = document.getElementById('b2b-original-price-input');
  //   if (b2bInput) b2bInput.value = formatter.format(
  //     Math.round((catalogPrice / (window.b2bTradeData.multiplier || 0.85)) * quantity)
  //   );
  // }

    updateB2BOriginalPrice() {
    // Check if B2B customer
    if (!window.b2bTradeData?.isB2B) return;

    // Nothing to show for excluded products
    if (window.b2bTradeData.hideTradeInfo) return;

    const tradeInfoEls = document.querySelectorAll('[data-b2b-trade-info]');
    if (!tradeInfoEls.length) return;

    // Bail out while no variant is resolved yet (e.g. Construction not picked).
    // Writing here would produce "$NaN" and overwrite the Liquid-rendered value.
    const variantPrice = this.currentVariant?.price;
    if (typeof variantPrice !== 'number' || isNaN(variantPrice)) return;

    // Get current quantity from input
    const quantityInput = document.querySelector('.quantity-input[name="quantity"]');
    const quantity = parseInt(quantityInput?.value) || 1;

    const catalogPrice = variantPrice / 100; // Convert from cents

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    tradeInfoEls.forEach(tradeInfoEl => {
      const multiplier = window.b2bTradeData.multiplier || parseFloat(tradeInfoEl.dataset.multiplier) || 0.85;
      const originalPrice = Math.round((catalogPrice / multiplier) * quantity);
      const formatted = formatter.format(originalPrice);

      const originalPriceEls = tradeInfoEl.querySelectorAll('.original-price-value');
      originalPriceEls.forEach(el => el.textContent = formatted);

      // Reveal the original-price block if Liquid rendered it hidden
      const originalWrapper = tradeInfoEl.querySelector('[data-original-price]');
      if (originalWrapper) {
        originalWrapper.removeAttribute('hidden');
        const divider = originalWrapper.previousElementSibling;
        if (divider && divider.classList.contains('b2b-trade-info__divider')) {
          divider.removeAttribute('hidden');
        }
      }

      window.b2bTradeData.currentOriginalPrice = originalPrice;
      window.b2bTradeData.currentVariantId = this.currentVariant.id;
    });

    const b2bInput = document.getElementById('b2b-original-price-input');
    if (b2bInput) {
      b2bInput.value = formatter.format(
        Math.round((catalogPrice / (window.b2bTradeData.multiplier || 0.85)) * quantity)
      );
    }
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const addButton = button.querySelector('[name="add"]');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;

    // if (document.querySelector('.template-curtain-no-construction')) {
    //   return;
    // }

    const bodyClassHasFurniture = document.body.className.includes("furniture");
    const bodyClassHasFurnitureChair = document.body.className.includes("chair");
    const bodyClassHasPipingBuilder = document.body.className.includes('piping-builder');

    if (bodyClassHasFurnitureChair) {
      addButton.textContent = window.variantStrings.chooseOptions;
    } else if (bodyClassHasFurniture || bodyClassHasPipingBuilder) {
      addButton.textContent = window.variantStrings.chooseOptions;
    } else if (document.querySelector('.template-curtain-no-construction')) {
      addButton.textContent = window.variantStrings.chooseOptions;
    } 
    else {
      addButton.textContent = window.variantStrings.unavailable;
    }

    addButton.setAttribute('disabled', '');
    if (price) price.classList.add("visibility-hidden");
  }

  getVariantData() {
    this.variantData = this.querySelector('[type="application/json"]') ? JSON.parse(
      this.querySelector('[type="application/json"]').textContent
    ) : null;
    return this.variantData;
  }

  // detectPreOrderPompom(value) {
  //   if (typeof preorder_eta_pom_pom != 'undefined' && preorder_eta_pom_pom && typeof value != 'undefined' && value) {
  //     const preOrderOption = preorder_eta_pom_pom.eta_option;
  //     const textPomPom = preorder_eta_pom_pom.text_pom_pom;
  //     for (let i = 0; i < preOrderOption.length; i++) {
  //       if (preOrderOption[i].toLowerCase() == value.toLowerCase()) {
  //         return textPomPom;
  //       }
  //     }
  //   }
  //   return null;
  // }
  detectPreOrderPompom(value) {
    if (typeof value !== 'string' || !value) return null;
    const valueLower = value.toLowerCase();

    // Source 1: Section settings — definitive when present
    const form =
      this.closest('form[action*="/cart/add"]') ||
      document.querySelector('form[action*="/cart/add"]');
    const messageInput = form?.querySelector('input[name="properties[_pre_order_eta_message]"]');
    const trimsInput = form?.querySelector('input[name="properties[_pre_order_eta_trims]"]');
    const sectionMessage = messageInput?.value?.trim();
    const sectionTrimsRaw = trimsInput?.value?.trim();

    // If section settings are configured (both fields populated),
    // this is the authoritative source — do not fall back to metafield
    if (sectionMessage && sectionTrimsRaw) {
      const trimsList = sectionTrimsRaw
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);
      return trimsList.some(t => t === valueLower) ? sectionMessage : null;
    }

    // Source 2: Metafield (only when section settings are absent)
    if (
      typeof preorder_eta_pom_pom !== 'undefined' &&
      preorder_eta_pom_pom &&
      Object.keys(preorder_eta_pom_pom).length > 0 &&
      Array.isArray(preorder_eta_pom_pom.eta_option)
    ) {
      if (preorder_eta_pom_pom.eta_option.some(option => option.toLowerCase() === valueLower)) {
        return preorder_eta_pom_pom.text_pom_pom || null;
      }
    }

    return null;
  }

  checkChairFurnitureOption() {
    if (this._swivelUpdating) return;
    const baseOptionChecked = this.querySelector("fieldset.product-form__input-base input:checked");
    if (!baseOptionChecked) return;
    const productType = baseOptionChecked?.getAttribute('data-product-type');
    const legRadios = this.querySelector('leg-radios');
    if (!baseOptionChecked || !legRadios || (productType != 'chair' && productType != 'ottoman')) return;

    const legInputs = legRadios.querySelectorAll('input');
    if (baseOptionChecked.value.toLowerCase().includes('kick pleat skirt') || baseOptionChecked.value.toLowerCase().includes('upholstered base')) {
      legRadios.classList.add('hidden');
      legInputs.forEach((input) => {
        input.removeAttribute('required');
        input.checked = false;
        input.disabled = true;
      })
    } else {
      legRadios.classList.remove('hidden');
      legInputs.forEach((input) => {
        // input.setAttribute('required', '');
        input.disabled = false;
      })
    }

    const swivelInputs = this.querySelectorAll('input[name="Swivel"]');
    if (swivelInputs && baseOptionChecked.getAttribute('data-product-custom-type').includes('marlow')) {
      if (baseOptionChecked.value.toLowerCase().includes('legs')) {
        swivelInputs.forEach((swivel) => {
          if (swivel.value == 'No Swivel') {
            swivel.nextElementSibling?.classList.remove('hidden');
            swivel.disabled = false;
            // if (!swivel.checked) {
            //   swivel.checked = true;
            //   swivel.dispatchEvent(new Event('change', { bubbles: true })); 
            // }
          }
          else {
            swivel.checked = false;
            swivel.nextElementSibling?.classList.add('hidden');
            swivel.disabled = true;
          }
        })
      } else if (baseOptionChecked.value.toLowerCase().includes('upholstered base')) {
        swivelInputs.forEach((swivel) => {
          if (swivel.value == 'No Swivel') {
            swivel.nextElementSibling?.classList.add('hidden');
            swivel.disabled = true;
          } else {
            swivel.nextElementSibling?.classList.remove('hidden');
            swivel.disabled = false;
          }
        })
        // const currentChecked = this.querySelector("fieldset.product-form__input-swivel input:checked");
        // if (!currentChecked || currentChecked.value == 'No Swivel') {
        //   const firstSwivel = [...swivelInputs].find(s => s.value != 'No Swivel');
        //   if (firstSwivel) {
        //     firstSwivel.checked = true;
        //     this._swivelUpdating = true;
        //     firstSwivel.dispatchEvent(new Event('change', { bubbles: true }));
        //     this._swivelUpdating = false;
        //   }
        // }
      } else {
        swivelInputs.forEach((swivel) => {
          swivel.nextElementSibling?.classList.remove('hidden');
          swivel.disabled = false;
        })
        
        // const firstOption = swivelInputs[0];
        // if (firstOption && !firstOption.checked) {
        //   firstOption.checked = true;
        //   this._swivelUpdating = true;
        //   firstOption.dispatchEvent(new Event('change', { bubbles: true }));
        //   this._swivelUpdating = false;
        // }
      }
    }
  }

  checkSofaFurnitureOption() {  
    const baseOptionChecked = this.querySelector("fieldset.product-form__input-base input:checked");
    if (!baseOptionChecked) return;
    const productType = baseOptionChecked?.getAttribute('data-product-type');
    const legRadios = this.querySelector('leg-radios');
    const productCustomType = baseOptionChecked?.getAttribute('data-product-custom-type');
    if (!baseOptionChecked || !legRadios || (productType != 'sofa')) return;

    const legInputs = legRadios.querySelectorAll('input');
    if (productCustomType == 'marlow-sofa') {
      if (baseOptionChecked.value.toLowerCase().includes('kick pleat skirt')) {
        legRadios.classList.add('hidden');
        legInputs.forEach((input) => {
          // input.removeAttribute('required');
          input.checked = false;
          input.disabled = true;
        })
      } else {
        legRadios.classList.remove('hidden');
        legInputs.forEach((input) => {
          //input.setAttribute('required', '');
          input.disabled = false;
        })
      }
    }
  }

  checkConstructionOptions() {
    const constructionOptions = document.querySelectorAll("input[name='construction']");
    if (!document.querySelector('.template-curtain-no-construction') || !constructionOptions) return true;
    const constructionOptionChecked = document.querySelector("input[name='construction']:checked");
    if (!constructionOptionChecked) {
      return false;
    } else {
      return true;
    }
  }

  checkSizeOptions() {
    const sizeOptions = document.querySelectorAll("input[name='Size']");
    if (!sizeOptions) return true;
    const sizeOptionChecked = document.querySelector("input[name='Size']:checked");
    if (!sizeOptionChecked) {
      return false;
    } else {
      return true;
    }
  }

  checkWaverlyFurnitureOption() {
    const baseOptionChecked = this.querySelector("fieldset.product-form__input-base input:checked");
    if (!baseOptionChecked) return;
    const productCustomType = baseOptionChecked?.getAttribute('data-product-custom-type');
    if (!productCustomType.includes('waverly')) return;
    const productType = baseOptionChecked?.getAttribute('data-product-type');
    const weltRadios = this.querySelector('welt-radios');
    if (!baseOptionChecked ||!weltRadios || (productType != 'sofa' && productType != 'chair')) return;

    const noWeltInput = weltRadios.querySelector('input[value="No Welt"]');
    const noWeltLabel = weltRadios.querySelector('.trim-welt-no-welt.trim-none');
    const formLabel = weltRadios.querySelector('.form__label span');
    
    if (baseOptionChecked.value.toLowerCase().includes('bun legs')) {
      noWeltLabel.classList.add('hidden');
      noWeltInput.checked = false;
      noWeltInput.disabled = true;
      if (formLabel.textContent.includes(noWeltInput.value)) {
        formLabel.innerHTML = `<span class="option-not-selected">${window.cartStrings.selectTrim}</span>`;
      }
    } else {
      noWeltLabel.classList.remove('hidden');
      noWeltInput.disabled = false;
    }
  }
}

customElements.define("variant-selects", VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
    this.pipingRadios = document.querySelector("piping-radios");
    this.weltRadios = document.querySelector("welt-radios");
    this.legRadios = document.querySelector("leg-radios");
    if (!this.pipingRadios && !this.weltRadios && !this.legRadios) {
      this.addEventListeners();
      this.autoClickFirstRadio();
    }

    this.radioButton = document.querySelector(".trim-options .input-trim-option");
    if (!document.querySelector(".product-form__input-base.only-option")) {
      this.onVariantChange();
    }
  }

  addEventListeners() {
    const sizeRadios = document.querySelectorAll('input[type="radio"].input-size');

    sizeRadios.forEach((radio) => {
      radio.addEventListener("click", (event) => {
        this.handleRadioClick(event.target);
      }
      );
    });
  }

  handleRadioClick() {
    const firstOptionInput = this.radioButton;

    if (firstOptionInput) {
      const event = new MouseEvent("click", { bubbles: true });
      firstOptionInput.dispatchEvent(event);
    }
  }

  autoClickFirstRadio() {
    document.addEventListener("DOMContentLoaded", () => {
      const firstRadio = this.radioButton;
      if (firstRadio) {
        const event = new MouseEvent("click", { bubbles: true });
        firstRadio.dispatchEvent(event);
      }
    });
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset.product-form__input"));
    this.options = fieldsets.map((fieldset) => {
      const checkedRadio = Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      );
      return checkedRadio ? checkedRadio.value : null;
    }).filter(value => value !== null);

    if (!this.pipingRadios) return;
    this.pipingRadios.dispatchEvent(new Event("change"));
  }
}

customElements.define("variant-radios", VariantRadios);

class LengthInput extends HTMLElement {
  constructor() {
    super();
    this.lengthInput = this.querySelector('input[name="properties[Length]"]');
    this.lengthRadios = document.querySelectorAll('input[name="Length"]');
    this.lengthLegendText = document.querySelector('.product-form__input.product-form__input-length .form__label span');
    this.widthInputForm = document.querySelector('width-input');

    this.addEventListener("change", this.updateLength);
    this.lengthInput.addEventListener("focus", this.focusLength);
  }

  focusLength() {
    this.select();
  }

  roundToStep(num, step) {
    return Math.ceil(num / step) * step;
  }

  updateLength() {
    if (!this.lengthInput.value) return;
    let value = Math.ceil(parseFloat(this.lengthInput.value));
    if (this.classList.contains('length-roman-template')) {
      let roundStep = this.lengthInput.getAttribute('data-round');
      value = this.roundToStep(parseFloat(this.lengthInput.value), parseFloat(roundStep));
    }
    if (isNaN(value)) {
      this.lengthInput.value = "";
      this.lengthInput.focus();
      return;
    }
    let size;
    // Minimum/Maximum Max = 200
    let min = this.lengthInput.getAttribute('min') || 7;
    let max = this.lengthInput.getAttribute('max') || 200;
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    // Setting Length Select
    if (this.classList.contains('length-roman-template')) {
      if (value <= 48) {
        size = "Small";
      } else if (value <= 60) {
        size = "Medium";
      } else if (value <= 72) {
        size = "Large";
      } else if (value > 72) {
        size = "Extra Large";
      }
    } else {
      if (value < 70) {
        size = "Small";
      } else if (value < 101) {
        size = "Medium";
      } else if (value < 150) {
        size = "Large";
      } else if (value > 150) {
        size = "Extra Large";
      }
    }

    // XLarge 150-200
    this.lengthInput.value = value + '"';
    this.lengthRadios.forEach((length) => {
      if (length.value.toString() == size) {
        length.checked = true;
      }
    });

    this.updateOptionHeadRail(value);
  }

  updateOptionHeadRail(value) {
    const headRailOptions = document.querySelectorAll('.product-form__input-headrail-depth input[name="properties[Headrail Depth]"]');
    if (!headRailOptions.length) return;
    let widthInputValue = 0;
    if (this.widthInputForm) {
      widthInputValue = parseFloat(this.widthInputForm.querySelector('input[name="properties[Width]"]')?.value || 0);
    }
    if (value >= 60 || widthInputValue >= 60) {
      headRailOptions.forEach((option) => {
        if (option.value.includes('2.5')) {
          option.checked = true;
        } else {
          option.setAttribute('disabled', true)
        }
      });
    } else {
      headRailOptions.forEach((option) => {
        if (option.value.includes('1.5')) {
          option.removeAttribute('disabled')
        }
      });

      const checked = document.querySelector('input[name="properties[Headrail Depth]"]:checked');
      if (checked) {
        checked.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    const variantRadios = document.querySelector('variant-radios');
    if (!variantRadios) return;
    variantRadios?.updateURL();

    // Auto open headrail dropdown
    const headRailFieldset = document.querySelector('.product-form__input-headrail-depth');
    if (headRailFieldset) {
      const headRailDropdown = headRailFieldset.querySelector('option-dropdown');
      if (headRailDropdown && !headRailDropdown.isOpen) {
        headRailDropdown.open();
      }
    }
  }
}

customElements.define("length-input", LengthInput);

class WidthInput extends HTMLElement {
  constructor() {
    super();
    this.widthInput = this.querySelector('input[name="properties[Width]"]');
    this.widthRadios = document.querySelectorAll('input[name="Width"]');
    this.widthLegendText = document.querySelector('.product-form__input.product-form__input-width .form__label span');
    this.lengthInputForm = document.querySelector('length-input');

    this.addEventListener("change", this.updateWidth);
    this.widthInput.addEventListener("focus", this.focusWidth);
  }

  focusWidth() {
    this.select();
  }

  roundToStep(num, step) {
    return Math.ceil(num / step) * step;
  }

  updateWidth() {
    if (!this.widthInput.value) return;
    let roundStep = this.widthInput.getAttribute('data-round');
    let value = this.roundToStep(parseFloat(this.widthInput.value), parseFloat(roundStep));
    if (isNaN(value)) {
      this.widthInput.value = "";
      this.widthInput.focus();
      return;
    }
    let size;
    // Minimum/Maximum Max = 200
    let min = this.widthInput.getAttribute('min') || 18;
    let max = this.widthInput.getAttribute('max') || 96;
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    if (this.classList.contains('width-input-cornice') || this.classList.contains('width-input-valance')) {
      if (value <= 48) {
        size = "Small";
      } else if (value <= 60) {
        size = "Medium";
      } else if (value <= 72) {
        size = "Large";
      } else if (value > 72) {
        size = "Extra Large";
      }
    } else {
      if (value <= 24) {
        size = "Small";
      } else if (value <= 48) {
        size = "Medium";
      } else if (value <= 72) {
        size = "Large";
      } else if (value > 72) {
        size = "Extra Large";
      }
    }

    this.widthInput.value = value + '"';
    this.widthRadios.forEach((width) => {
      if (width.value.toString() == size) {
        width.checked = true;
      }
    });
    this.updateOptionHeadRail(value);
  }

  updateOptionHeadRail(value) {
    const headRailOptions = document.querySelectorAll('.product-form__input-headrail-depth input[name="properties[Headrail Depth]"]');
    if (!headRailOptions.length) return;
    let lengthInputValue = 0;
    if (this.lengthInputForm) {
      lengthInputValue = parseFloat(this.lengthInputForm.querySelector('input[name="properties[Length]"]')?.value || 0);
    }
    if (value >= 60 || lengthInputValue >= 60) {
      headRailOptions.forEach((option) => {
        if (option.value.includes('2.5')) {
          option.checked = true;
        } else {
          option.setAttribute('disabled', true)
        }
      });
    } else {
      headRailOptions.forEach((option) => {
        if (option.value.includes('1.5')) {
          option.removeAttribute('disabled')
        }
      });

      // Dispatch change trigger updateURL
      const checked = document.querySelector('input[name="properties[Headrail Depth]"]:checked');
      if (checked) {
        checked.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    const variantRadios = document.querySelector('variant-radios');
    if (!variantRadios) return;
    variantRadios?.updateURL();

    // Auto open headrail dropdown
    const headRailFieldset = document.querySelector('.product-form__input-headrail-depth');
    if (headRailFieldset) {
      const headRailDropdown = headRailFieldset.querySelector('option-dropdown');
      if (headRailDropdown && !headRailDropdown.isOpen) {
        headRailDropdown.open();
      }
    }
  }

  updateOptionDepth(value) {
    const depthOptions = document.querySelectorAll('.product-form__input-depth input[name="properties[Depth]"]');
    if (!depthOptions.length) return;
    if (value >= 60) {
      depthOptions.forEach((option) => {
        if (option.value.includes('5.5')) {
          option.checked = true;
        } else {
          option.setAttribute('disabled', true)
        }
      });
    } else {
      depthOptions.forEach((option) => {
        if (option.value.includes('3.5')) {
          option.checked = true;
          option.removeAttribute('disabled')
        }
      });
    }
  }
}

customElements.define("width-input", WidthInput);

class WidthInputSelect extends WidthInput {
  constructor() {
    super();
    this.widthInches = this.querySelector('select#width-inches-options');
    this.widthFraction = this.querySelector('select#width-fraction-options');
    this.lengthInputForm = document.querySelector('length-input-select');
  }
  focusWidth() {
    this.widthInches.focus();
  }
  updateWidth() {
    if (!this.widthInches.value || !this.widthFraction.value) return;
    let valueInches = parseFloat(this.widthInches.value) || 18;
    let fraction = parseFloat(this.widthFraction.value) || 0;
    let value = valueInches + fraction;
    let size;

    if (value <= 24) {
      size = "Small";
    } else if (value <= 48) {
      size = "Medium";
    } else if (value <= 72) {
      size = "Large";
    } else if (value > 72) {
      size = "Extra Large";
    }

    const maxWidth = this.widthInput.getAttribute('max');
    if (valueInches == maxWidth) {
      this.widthFraction.querySelectorAll('option').forEach((option) => {
        if (!option.classList.contains('select-title')) {
          if (option.value == 0) {
            option.selected = true;
          }
          if (option.value != 0) {
            option.setAttribute('disabled', '');
            option.setAttribute('hidden', '')
          }
        }
      })
    } else {
      this.widthFraction.querySelectorAll('option').forEach((option) => {
        if (!option.classList.contains('select-title')) {
          option.removeAttribute('disabled');
          option.removeAttribute('hidden')
        }
      })
    }

    this.widthInput.value = value + '"';
    this.widthRadios.forEach((width) => {
      if (width.value.toString() == size) {
        width.checked = true;
      }
    });
    setTimeout(() => {
      if (this.classList.contains('width-woven')) {
        this.updateOptionHeadRailWoven(value);
        if (this.classList.contains('heavy-weight')) {
          this.updateOptionHeight(value);
        }
      } else {
        this.updateOptionHeadRail(value);
      }
      
    }, 100);
    this.updateOptionLegend(value);

    this.dispatchEvent(new Event('widthChanged', { bubbles: true }));
  }

  updateOptionLegend(inches, fraction) {
    this.label = document.querySelector(".product-form__input-width .form__label span");
    let fractionText = '';
    if (this.label) {
      this.label.innerText = inches + fractionText + '"'
    }
  }

  updateOptionHeight(value) {
    if (!this.lengthInputForm) return;
    const lengthSelect = this.lengthInputForm.querySelector('#length-inches-options');
    const lengthFractionSelect = this.lengthInputForm.querySelector('#length-fraction-options');
    let lengthInput = this.lengthInputForm.querySelector('input[name="properties[Length]"]');
    let lengthInputValue = parseFloat(lengthInput?.value || 0);
    
    const maxHeight = value > 60 ? 66 : 96;
    lengthInput.setAttribute('max', maxHeight)

    lengthSelect.querySelectorAll('option').forEach((option) => {
      const val = parseFloat(option.value);
      if (val > maxHeight) {
        option.setAttribute('disabled', true);
        option.setAttribute('hidden', '');
      } else {
        option.removeAttribute('disabled');
        option.removeAttribute('hidden');
      }
    });
    if (parseFloat(lengthInputValue) >= maxHeight) {
      lengthSelect.querySelector(`option[value="${maxHeight}"`).selected = true;
      lengthFractionSelect.querySelector(`option:not(.select-title)[value="0"]`).selected = true;
      lengthSelect.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (lengthSelect.value == 66) {
      lengthSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const variantRadios = document.querySelector('variant-radios');
    if (!variantRadios) return;
    variantRadios?.updateURL();
  }

  updateOptionHeadRailWoven(value) {
    const headRailOptions = document.querySelectorAll('.product-form__input-headrail-depth input[name="properties[Headrail Depth]"]');
    if (!headRailOptions.length) return;
    let length = 0;
    if (this.lengthInputForm) {
      length = parseFloat(this.lengthInputForm.querySelector('input[name="properties[Length]"]')?.value || 0);
    }
    const width = value;
    let force25 = false;

   
    if (this.classList.contains('heavy-weight')) {
      if (width > 60) {
        force25 = true;
      } else if (width > 30) {
        force25 = length > 24;
      } else {
        force25 = length > 48;
      }
    } else if (this.classList.contains('medium-weight')) {
      if (width > 60) {
        force25 = true;
      } else if (width > 36) {
        force25 = length > 36;
      } else {
        force25 = length > 54;
      }
    } else {
      force25 = width > 54 || length > 54;
    }

    if (force25) {
      headRailOptions.forEach((option) => {
        if (option.value.includes('2.5')) {
          option.checked = true;
        } else {
          option.setAttribute('disabled', true)
        }
      });
    } else {
      headRailOptions.forEach((option) => {
        if (option.value.includes('1.5')) {
          option.removeAttribute('disabled')
        }
      });

      // Dispatch change trigger updateURL
      const checked = document.querySelector('input[name="properties[Headrail Depth]"]:checked');
      if (checked) {
        checked.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    const variantRadios = document.querySelector('variant-radios');
    if (!variantRadios) return;
    variantRadios?.updateURL();
  }

}
customElements.define("width-input-select", WidthInputSelect);

class LengthInputSelect extends LengthInput {
  constructor() {
    super();
    this.lengthInches = this.querySelector('select#length-inches-options');
    this.lengthFraction = this.querySelector('select#length-fraction-options');
    this.widthInputForm = document.querySelector('width-input-select');
  }

  focusLength() {
    this.lengthInches.focus();
  }

  updateLength() {
    if (!this.lengthInches.value || !this.lengthFraction.value) return;
    let valueInches = parseFloat(this.lengthInches.value) || 18;
    let fraction = parseFloat(this.lengthFraction.value) || 0;
    let value = valueInches + fraction;
    let size;

    // Setting Length Select
    if (value <= 48) {
      size = "Small";
    } else if (value <= 60) {
      size = "Medium";
    } else if (value <= 72) {
      size = "Large";
    } else if (value > 72) {
      size = "Extra Large";
    }

    const maxLength = this.lengthInput.getAttribute('max');
    if (valueInches == maxLength) {
      value = maxLength;
      this.lengthInches.value = maxLength;
      this.lengthFraction.querySelectorAll('option').forEach((option) => {
        if (!option.classList.contains('select-title')) {
          if (option.value == 0) {
            option.selected = true;
          }
          if (option.value != 0) {
            option.setAttribute('disabled', '');
            option.setAttribute('hidden', '')
          }
        }
      })
    } else {
      this.lengthFraction.querySelectorAll('option').forEach((option) => {
        if (!option.classList.contains('select-title')) {
          option.removeAttribute('disabled');
          option.removeAttribute('hidden')
        }
      })
    }

    // XLarge 150-200
    this.lengthInput.value = value + '"';
    this.lengthRadios.forEach((length) => {
      if (length.value.toString() == size) {
        length.checked = true;
      }
    });

    setTimeout(() => {
      if (this.classList.contains('length-woven')) {
        this.updateOptionHeadRailWoven(value);
      } else {
        this.updateOptionHeadRail(value);
      }
    }, 100);
    this.updateOptionLegend(value);
  }

  updateOptionLegend(inches, fraction) {
    this.label = document.querySelector(".product-form__input-length .form__label span");
    let fractionText = '';
    if (this.label) {
      this.label.innerText = inches + fractionText + '"'
    }
  }

  updateOptionHeadRailWoven(value) {
    const headRailOptions = document.querySelectorAll('.product-form__input-headrail-depth input[name="properties[Headrail Depth]"]');
    if (!headRailOptions.length) return;
    let width = 0;
    if (this.widthInputForm) {
      width = parseFloat(this.widthInputForm.querySelector('input[name="properties[Width]"]')?.value || 0);
    }
    const length = value;
    let force25 = false;

    if (this.classList.contains('heavy-weight')) {
      if (width > 60) {
        force25 = true;
      } else if (width > 30) {
        force25 = length > 24;
      } else {
        force25 = length > 48;
      }
    } else if (this.classList.contains('medium-weight')) {
      if (width > 60) {
        force25 = true;
      } else if (width > 36) {
        force25 = length > 36;
      } else {
        force25 = length > 54;
      }
    } else {
      force25 = width > 54 || length > 54;
    }

    if (force25) {
      headRailOptions.forEach((option) => {
        if (option.value.includes('2.5')) {
          option.checked = true;
        } else {
          option.setAttribute('disabled', true)
        }
      });
    } else {
      headRailOptions.forEach((option) => {
        if (option.value.includes('1.5')) {
          option.removeAttribute('disabled')
        }
      });

      // Dispatch change trigger updateURL
      const checked = document.querySelector('input[name="properties[Headrail Depth]"]:checked');
      if (checked) {
        checked.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    const variantRadios = document.querySelector('variant-radios');
    if (!variantRadios) return;
    variantRadios?.updateURL();
  }
}

customElements.define("length-input-select", LengthInputSelect);

class ShowerCurtainLengthSelect extends HTMLElement {
  constructor() {
    super();
    this.lengthInput = this.querySelector('select[name="properties[Length]"]');
    this.lengthRadios = document.querySelectorAll('input[name="Length"]');

    this.addEventListener("change", this.updateLength);
    this.lengthInput.addEventListener("focus", this.focusLength);
  }

  updateLength() {
    if (!this.lengthInput.value) return;
    let value = Math.ceil(parseFloat(this.lengthInput.value));
    let size;
    // Minimum/Maximum Max = 150
    if (value < 60) {
      value = 60;
    } else if (value > 150) {
      value = 150;
    }
    // Setting Length Select
    if (value < 99) {
      size = "Medium";
    } else if (value < 150) {
      size = "Large";
    }
    this.lengthRadios.forEach((length) => {
      if (length.value.toString() == size) {
        length.checked = true;
      }
    });
  }
}

customElements.define(
  "shower-curtain-length-select",
  ShowerCurtainLengthSelect
);

class TrimRadios extends HTMLElement {
  constructor() {
    super();
    this.optionLegend = document
      .querySelector("fieldset.product-form__input-trim")
      .querySelector("legend")
      .querySelector("span");
    this.labels = Array.from(
      this.querySelectorAll(".js.product-form__input")
    ).map((label) => label.querySelector(".form__label").querySelector("span"));

    this.trimRadios = document.querySelectorAll('input[name="Trim"]');
    this.trimSides = document.querySelectorAll(
      'input[name="properties[Trim]"]'
    );

    this.trimStyles = document.querySelectorAll(
      'input[name="properties[Trim Style]"]'
    );

    this.trimOptionsWrapper = this.querySelector(
      ".trim-options.product-form__input"
    );

    this.constructionRadios = document.querySelectorAll('construction-radios input');

    this.slideShows = document
      .querySelector(".product-media-wrapper")
      .querySelectorAll("slider-component");

    this.addEventListener("change", this.onRadioChange);

    this.toggleButton = this.querySelector("#trimToggleIcon");
    if (this.toggleButton) {
      this.toggleButton.addEventListener("click", this.showTrimStyle.bind(this));
    }

    this.trimOptionMessage = this.querySelector(
      ".trim-options-message"
    );
    this.trimOptionMessageError = this.querySelector(
      ".trim-option__error-message-wrapper"
    );
  }

  onRadioChange() {
    const requiresConstruction =
      document.body.classList.contains("template-product-roman-shade") ||
      document.body.classList.contains("template-product-woven-wood") ||
      document.body.classList.contains("template-product-valance") ||
      document.body.classList.contains("template-product-cornice");

    if (requiresConstruction) {
      const constructionRadios = document.querySelectorAll('input[name="construction"]');
      if (constructionRadios.length && !document.querySelector('input[name="construction"]:checked')) {
        const cDropdown = document.querySelector('[data-dropdown-key="construction"]');
        if (cDropdown && !cDropdown.isOpen) cDropdown.open();
        return;
      }
    }

    if (!this.getSelectedSide() && !this.getSelectedStyle()) {
      this.handleErrorMessage("Unknown error occurred");
      return;
    }

    // if (document.body.classList.contains("template-product-curtains")) {
    //   const selectedStyle = this.getSelectedStyle();
    //   const trimStyle = selectedStyle ? selectedStyle.value : 'None';

    //   if (trimStyle.toLowerCase() === 'none') {
    //     return;
    //   }
    // }

    if (this.getSelectedStyle()) {
      const luxe = JSON.parse(this.getSelectedStyle()?.dataset.luxe);
      const side =
        this.getSelectedSide()?.value.toLowerCase().indexOf("side") >= 0;
      let btm = false;

      if (document.body.classList.contains("template-product-cafe-curtains")) {
        btm = this.getSelectedSide()?.value.toLowerCase().indexOf("bottom") >= 0;
      } else if (document.body.classList.contains("template-product-roman-shade") || 
                document.body.classList.contains("template-product-cornice") || 
                document.body.classList.contains("template-product-valance") || 
                document.body.classList.contains("template-product-woven-wood")) {
        btm = this.getSelectedSide()?.value.toLowerCase().indexOf("none") < 0;
      } else {
        btm = this.getSelectedSide()?.value.toLowerCase().indexOf("bottom") > 0;
      }

      this.trimType = this.getSelectedTrimRadio();
      this.setTrimRadio(luxe, side, btm);
      this.updateOptionLegend();
      this.updateMedia();
    }
  }

  showTrimStyle(status) {
    if (!this.getSelectedSide()) return;


    if (status.type == 'click') status = 'toggle';
    const side =
      this.getSelectedSide()?.value.toLowerCase().indexOf("side") >= 0;
    let btm = false;

    if (document.body.classList.contains("template-product-cafe-curtains")) {
      btm = this.getSelectedSide()?.value.toLowerCase().indexOf("bottom") >= 0;
    } else if (document.body.classList.contains("template-product-shower-curtains")) {
      btm = this.getSelectedSide()?.value.toLowerCase().indexOf("bottom") >= 0;
    } else if (document.body.classList.contains("template-product-roman-shade") || 
                document.body.classList.contains("template-product-cornice") || 
                document.body.classList.contains("template-product-valance") ||
                document.body.classList.contains("template-product-woven-wood")) {
      btm = this.getSelectedSide()?.value.toLowerCase().indexOf("none") < 0;
    } else {
      btm = this.getSelectedSide()?.value.toLowerCase().indexOf("bottom") > 0;
    }

    if (this.trimOptionsWrapper) {
      if (this.trimOptionsWrapper.classList.contains('trim-options-toggle-show') && !btm && !side) {
        if (this.toggleButton.classList.contains('plus')) {
          this.trimOptionsWrapper.classList.remove('trim-options-hide');
          this.toggleButton.classList.remove('plus');
          this.toggleButton.classList.add('minus');

        } else {
          this.trimOptionsWrapper.classList.add('trim-options-hide');
          if (status == "hide") {
            this.toggleButton.classList.add('minus');
            this.toggleButton.classList.remove('plus');
            this.trimOptionMessageError.setAttribute('hidden', '');
          } else {
            this.toggleButton.classList.remove('minus');
            this.toggleButton.classList.add('plus');
            this.trimOptionsWrapper.classList.remove('trim-options-toggle-show');
            this.toggleButton.classList.remove('trim-click-toggle');
          }
        }
      } else {
        if (btm || side) {
          this.trimOptionsWrapper.classList.remove('trim-options-toggle-show');
          this.toggleButton.classList.remove('trim-click-toggle');
          this.trimOptionsWrapper.classList.remove('trim-options-hide');
        }
        if (this.toggleButton.classList.contains('plus') && (status == "show" || status == 'toggle')) {
          this.trimOptionsWrapper.classList.remove('trim-options-hide');
          this.toggleButton.classList.remove('plus');
          this.toggleButton.classList.add('minus');
          if (status == 'toggle' && !btm && !side) {
            this.trimOptionsWrapper.classList.add('trim-options-toggle-show');
            this.toggleButton.classList.add('trim-click-toggle');
            this.trimOptionMessageError.setAttribute('hidden', '');
            this.trimOptionMessage.classList.add('hidden');
          } else {
            this.trimOptionsWrapper.classList.remove('trim-options-toggle-show');
            this.toggleButton.classList.remove('trim-click-toggle');
          }
        } else if (this.toggleButton.classList.contains('minus') && (status == "hide" || status == 'toggle')) {
          this.trimOptionsWrapper.classList.add('trim-options-hide');
          this.toggleButton.classList.remove('minus');
          this.toggleButton.classList.add('plus');
          this.trimOptionMessageError.setAttribute('hidden', '');
          if (status == 'toggle') {
            this.trimOptionsWrapper.classList.remove('trim-options-toggle-show');
            this.toggleButton.classList.remove('trim-click-toggle');
          }
        }
      }
    }
  }

  setTrimRadio(luxe = false, side = false, bottom = false) {
    if (!this.getSelectedSide()) return;
    if (!this.getSelectedSide() && !this.getSelectedStyle()) {
      this.handleErrorMessage("Unknown error occurred");
      return;
    }

    let selected;
    if (!side && !bottom) {
      this.showTrimStyle("hide");
      selected = Array.from(this.trimRadios).find(
        (trimRadio) => trimRadio.value == `None`
      );
      
      if (this.trimOptionMessage) {
        this.trimOptionMessage.classList.add('hidden');
        if (this.getSelectedSide()?.value.toLowerCase() === 'none' && this.getSelectedStyle()?.value.toLowerCase() !== 'none') {
          this.trimOptionMessageError.removeAttribute('hidden');
        } else {
          this.trimOptionMessageError.setAttribute('hidden', '');
        }
      }

      const trimStyleNone = Array.from(this.trimStyles).find(
        (trimStyle) => trimStyle.value == `None`
      );

      if (trimStyleNone) {
        trimStyleNone.checked = true;
      };

    } else {
      if (this.trimOptionMessage) {
        this.trimOptionMessage.classList.remove('hidden');
        this.trimOptionMessageError.setAttribute('hidden', '');

        if (this.getSelectedStyle().value.toLowerCase() !== 'none') {
          this.trimOptionMessage.innerText = this.trimOptionMessage.getAttribute('data-trim-option-none');
        } else {
          this.trimOptionMessage.innerText = this.trimOptionMessage.getAttribute('data-trim-option');
        }
      }

      const setSides =
        bottom && side
          ? "Sides + Bottom: "
          : side && !bottom
            ? "Side: "
            : bottom && !side
              ? "Bottom: "
              : "";
      const setLuxe = luxe ? "Luxe Trim" : "Trim" || "";
      
      if (!document.body.classList.contains("template-product-cornice") && !document.body.classList.contains("template-product-valance")) {
        selected = Array.from(this.trimRadios).find(
          (trimRadio) => trimRadio.value == `${setSides}${setLuxe}`
        );
      } else {
        const setType = this.getSelectedStyle()?.value.toLowerCase().indexOf('band') > 0
          ? "Band"
          : this.getSelectedStyle()?.value.toLowerCase().indexOf('pom pom') > 0
            ? "Pom Pom"
            : this.getSelectedStyle()?.value.toLowerCase().indexOf('tassel') > 0
              ? "Tassel"
              : "Rick Rack"

        selected = Array.from(this.trimRadios).find(
          (trimRadio) => trimRadio.value == `${setSides}${setType}`
        );

        const trimSideNew = Array.from(this.trimSides).find(
          (trimSide) => trimSide.value != `None`
        );
        if (trimSideNew) {
          trimSideNew.value = `${setSides}${setType}`;
        }
      } 

      this.showTrimStyle("show");
    }

    if (selected) {
      selected.checked = true;
    }
  }

  updateOptionLegend() {
    if (!this.getSelectedSide() && !this.getSelectedStyle()) {
      this.handleErrorMessage("Unknown error occurred");
      return;
    }

    // if (!document.body.classList.contains("template-product-cornice") && !document.body.classList.contains("template-product-valance")) {
    //   this.optionLegend.innerText =
    //   this.getSelectedSide() && this.getSelectedStyle()
    //     ? this.getSelectedSide().value.toLowerCase() !== "none" && this.getSelectedStyle().value.toLowerCase() !== "none" ?
    //       `${this.getSelectedStyle().value} on ${this.getSelectedSide().value}` : "None"
    //     : "None";
    // } 

    let text = "SELECT TRIM";
    let isPlaceholder = true;

    const selectedSide = this.getSelectedSide();
    const selectedStyle = this.getSelectedStyle();
    const sideValue = selectedSide?.value?.toLowerCase() || "none";
    const styleValue = selectedStyle?.value?.toLowerCase() || "none";

    // if (!document.body.classList.contains("template-product-cornice") && !document.body.classList.contains("template-product-valance")) {
    //   if (this.getSelectedSide() && this.getSelectedStyle() && 
    //       this.getSelectedSide().value.toLowerCase() !== "none" && 
    //       this.getSelectedStyle().value.toLowerCase() !== "none") {
        
    //     text = `${this.getSelectedStyle().value} on ${this.getSelectedSide().value}`;
    //   }
    // }

    if (!document.body.classList.contains("template-product-cornice") &&
      !document.body.classList.contains("template-product-valance")) {

      if (selectedSide && sideValue === "none") {
        text = "No trim";
        isPlaceholder = false;
      } else if (selectedSide && selectedStyle &&
                sideValue !== "none" && styleValue !== "none") {
        text = `${selectedStyle.value} on ${selectedSide.value}`;
        isPlaceholder = false;
      }
    }

    // this.optionLegend.innerText = text;

    // if (text === "SELECT TRIM") {
    //   this.optionLegend.classList.add("option-not-selected");
    // } else {
    //   this.optionLegend.classList.remove("option-not-selected");
    // }

    if (isPlaceholder) {
      this.optionLegend.innerHTML = '<span class="option-not-selected">' + text + '</span>';
    } else {
      this.optionLegend.innerText = text;
      this.optionLegend.classList.remove("option-not-selected");
    }

    // else {
    //   this.optionLegend.innerText =
    //   this.getSelectedSide() && this.getSelectedStyle()
    //     ? this.getSelectedSide().value.toLowerCase() !== "none" && this.getSelectedStyle().value.toLowerCase() !== "none" ?
    //       `${this.getSelectedStyle().value} on bottom` : "None"
    //     : "None";
    // }

    // if (handleize(this.trimType.type) === "none") {
    //   this.labels.forEach((label) => (label.innerText = ""));
    // } else {
    //   this.legend = document
    //     .querySelector(`.product-form__input-${handleize(this.trimType.type)}`)
    //     .querySelector("span");
    //   this.labels.forEach((label) => (label.innerText = ""));
    //   this.legend.innerText = `${this.trimType.handle
    //     .replace(" Band", "")
    //     .replace(" Tassel", "")
    //     .replace(" Rick Rack", "")
    //     .replace(" Fringe", "")
    //     .replace("Pom Pom", "")}`;
    // }
  }

  updateMedia() {
    const valueMedia = this.getSelectedStyle().value;
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");

    if (valueMedia == 'None') {
      if (!thumbnailSlider.querySelectorAll("ul li").length) return;
      const firstThumbnail = thumbnailSlider.querySelector("ul li:first-child");
      firstThumbnail.click();

      const firstMainThumbnail = mainSlider.querySelector("ul li:first-child");
      mainSlider.querySelector("ul").scroll({
        top: 0,
        left: firstMainThumbnail.offsetLeft,
        behavior: "smooth",
      });
    } else {
      const media = this.getSelectedStyle().dataset.trimImage;
      if (!media) return;

      // Product Pages
      if (mainSlider && thumbnailSlider) {
        const thumbnail = thumbnailSlider.querySelector(
          `[data-media-id="${media}"]`
        );

        const mainThumbnail = mainSlider.querySelector(
          `[data-media-id="${media}"]`
        );
        if (!thumbnail || !mainThumbnail) return;

        const existingOverlayThumbnail = thumbnailSlider.querySelector('.overlay-image');
        const existingOverlayMainThumbnail = mainSlider.querySelector('.overlay-image');
        if (existingOverlayThumbnail) {
          existingOverlayThumbnail.remove();
        }
        if (existingOverlayMainThumbnail) {
          existingOverlayMainThumbnail.remove();
        }

        if (thumbnail.classList.contains('product__media-item-additional-trim-image')) {
          const thumnailNone = thumbnailSlider.querySelector(
            `[data-media-option="none"]`
          );
          if (thumnailNone) {
            thumnailNone.classList.remove("product__media-item--trim-image");
            thumnailNone.classList.add("is-active");
            thumbnailSlider.querySelector("ul").scroll({
              top: 0,
              left: thumnailNone.offsetLeft,
            });
          }
          const mainThumbnailNone = mainSlider.querySelector(
            `[data-media-option="none"]`
          );

          if (mainThumbnailNone) {
            mainThumbnailNone.classList.remove("product__media-item--trim-image");
            mainThumbnailNone.classList.add("is-active");
            mainSlider.querySelector("ul").scroll({
              top: 0,
              left: mainThumbnailNone.offsetLeft,
            });
          }

          const canvas = document.getElementById("canvas-custom-builder");
          const ctx = canvas.getContext("2d");

          let images = [];
          images.push(mainThumbnailNone.querySelector('.media img').src);
          images.push(mainThumbnail.querySelector('.media img').src);

          const assetsLoaded = images.map(async image => {
            const img = new Image();
            img.src = image;
            await img.decode();
            return img;
          });

          Promise.all(assetsLoaded).then(images => {
            const firstImage = images[0];
            canvas.width = 900;
            canvas.height = 900;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            images.forEach((e, i) =>
              ctx.drawImage(e, 0, 0, canvas.width, canvas.height)
            );

            canvas.toBlob((blob) => {
              const objectURL = URL.createObjectURL(blob);

              const overlayImageMainSlider = document.createElement('img');
              overlayImageMainSlider.src = objectURL;
              overlayImageMainSlider.srcset = objectURL;
              overlayImageMainSlider.sizes = "100vw";
              overlayImageMainSlider.loading = "eager";
              overlayImageMainSlider.fetchpriority = "high";
              overlayImageMainSlider.alt = "overlay";
              overlayImageMainSlider.classList.add('overlay-image', 'image-magnify-hover');
              mainThumbnailNone.querySelector('.media').append(overlayImageMainSlider);

              const overlayImageThumbnail = document.createElement('img');
              overlayImageThumbnail.src = objectURL;
              overlayImageThumbnail.srcset = objectURL;
              overlayImageThumbnail.sizes = "100vw";
              overlayImageThumbnail.loading = "lazy";
              overlayImageThumbnail.alt = "overlay";
              overlayImageThumbnail.classList.add('overlay-image');
              thumnailNone.querySelector('.media').append(overlayImageThumbnail);

              enableZoomOnHover();
            }, "image/webp", 1);
          }).catch(err => console.error(err));

        } else {
          thumbnailSlider.querySelectorAll("[data-media-id]").forEach((img) => {
            img.classList.remove("is-active");
          });
          thumbnailSlider.querySelectorAll("[data-trim-image]").forEach((img) => {
            img.classList.add("product__media-item--trim-image");
          });

          mainSlider.querySelectorAll("[data-trim-image]").forEach((img) => {
            img.classList.add("product__media-item--trim-image");
          });

          if (thumbnail) {
            thumbnail.classList.remove("product__media-item--trim-image");
            thumbnail.classList.add("is-active");
            thumbnailSlider.querySelector("ul").scroll({
              top: 0,
              left: thumbnail.offsetLeft,
            });
          }
          if (mainThumbnail) {

            mainThumbnail.classList.remove("product__media-item--trim-image");
            mainThumbnail.classList.add("is-active");
            mainSlider.querySelector("ul").scroll({
              top: 0,
              left: mainThumbnail.offsetLeft,
            });
            mainSlider.querySelector(`[data-media-option="none"]`)?.classList.remove("is-active");
          }
        }

        if (window.matchMedia(`(min-width: 40em)`).matches) return;
        window.scroll({
          top: mainSlider.offsetTop - 72,
        });
      }
    }
  }

  getSelectedTrimRadio() {
    this.selectedTrimInput = this.querySelector("input:checked");

    if (!this.selectedTrimInput) return;
    return {
      handle: this.selectedTrimInput.value,
      type: this.selectedTrimInput.dataset.type,
    };
  }

  getSelectedRadio() {
    return Array.from(this.trimRadios).find((trim) => trim.checked === true);
  }

  getSelectedStyle() {
    return Array.from(this.trimStyles).find((style) => style.checked === true);
  }

  getSelectedSide() {
    return Array.from(this.trimSides).find((side) => side.checked === true);
  }
  getSelectedConstruction() {
    return Array.from(this.constructionRadios).find((construction) => construction.checked === true);
  }
}

customElements.define("trim-radios", TrimRadios);

class ShowerCurtainTrimRadios extends TrimRadios {
  constructor() {
    super();
  }

  onRadioChange() {
    if (!this.getSelectedSide() && !this.getSelectedStyle()) {
      this.handleErrorMessage("Unknown error occurred");
      return;
    }

    if (this.getSelectedStyle()) {
      const luxe = JSON.parse(this.getSelectedStyle().dataset.luxe);
      const side =
        this.getSelectedSide()?.value.toLowerCase().indexOf("side") >= 0;
      const btm =
        this.getSelectedSide()?.value.toLowerCase().indexOf("bottom") >= 0;
      this.trimType = this.getSelectedTrimRadio();
      this.setTrimRadio(luxe, side, btm);
      this.updateOptionLegend();
      this.updateMedia();
    }
  }

  setTrimRadio(luxe = false, side = false, bottom = false) {
    let selected;
    if (!side && !bottom) {
      this.showTrimStyle("hide");
      selected = Array.from(this.trimRadios).find(
        (trimRadio) => trimRadio.value == `None`
      );
      if (this.trimOptionMessage) {
        this.trimOptionMessage.classList.add('hidden');

        if (this.getSelectedSide()?.value.toLowerCase() === 'none' && this.getSelectedStyle()?.value.toLowerCase() !== 'none') {
          this.trimOptionMessageError.removeAttribute('hidden');
        } else {
          this.trimOptionMessageError.setAttribute('hidden', '');
        }
      } 
      

      const trimStyleNone = Array.from(this.trimStyles).find(
        (trimStyle) => trimStyle.value == `None`
      );

      if (trimStyleNone) {
        trimStyleNone.checked = true;
      };

    } else {
      if (this.trimOptionMessage) {
        this.trimOptionMessage.classList.remove('hidden');
        this.trimOptionMessageError.setAttribute('hidden', '');
        if (this.getSelectedStyle().value.toLowerCase() !== 'none') {
          this.trimOptionMessage.innerText = this.trimOptionMessage.getAttribute('data-trim-option-none');
        } else {
          this.trimOptionMessage.innerText = this.trimOptionMessage.getAttribute('data-trim-option');
        }
      }
      

      const setSides =
        bottom && side
          ? "Sides + Bottom: "
          : bottom && !side
            ? "Bottom: "
            : "Sides: " || "";
      const setLuxe = luxe ? "Luxe Trim" : "Trim" || "";
      selected = Array.from(this.trimRadios).find(
        (trimRadio) => trimRadio.value == `${setSides}${setLuxe}`
      );
      this.showTrimStyle("show");
    }

    if (selected) {
      selected.checked = true;
    }
  }
}

customElements.define("shower-curtain-trim-radios", ShowerCurtainTrimRadios);

class RomanShadeTrimTradios extends TrimRadios {
  constructor() {
    super();
    this.trimMounts = document.querySelectorAll(
      'input[name="properties[Mount]"]'
    );
    this.trimWovenStyles = document.querySelectorAll(
      'input[name="properties[Style]"]'
    );
    this.constructions = document.querySelectorAll(
      'input[name="construction"]'
    );
    this.constructionRadios = document.querySelector('construction-radios');
    if (this.constructionRadios) {
      this.constructionRadios.addEventListener('change', this.onRadioChange.bind(this));
    }
    
    this.trimMountChecked = document.querySelector('input[name="properties[Mount]"]:checked');
    this.imageCustomizedEl = document.querySelector('input[name="properties[_customized_image]"]');
    if (this.trimMounts) {
      this.onRadioChange = this.onRadioChange.bind(this);
      this.trimMounts.forEach((trimMount) => {
        trimMount.addEventListener('change', this.onRadioChange);
      });
    }
    if (this.trimWovenStyles) {
      this.onRadioChange = this.onRadioChange.bind(this);
      this.trimWovenStyles.forEach((trimWovenStyle) => {
        trimWovenStyle.addEventListener('change', this.onRadioChange);
      });
    }
   
  }

  // updateOptionLegend() {
  //   const selectedStyle = this.getSelectedStyle();
  //   const selectedSide = this.getSelectedSide();

  //   const styleValue = selectedStyle?.value?.toLowerCase() || "none";
  //   const sideValue = selectedSide?.value?.toLowerCase() || "none";

  //   let text = "SELECT TRIM";

  //   if (styleValue !== "none" && sideValue !== "none") {
  //     if (styleValue.includes("band")) {
  //       if (document.body.classList.contains("template-product-cornice") || document.body.classList.contains("template-product-valance")) {
  //         text = `${selectedStyle.value} ON BOTTOM`;
  //       } else {
  //         if (document.querySelector('input[name="construction"]:checked')) {
  //           const selectedConstruction = document.querySelector('input[name="construction"]:checked')?.value;
  //           if (selectedConstruction.toLowerCase() == 'relaxed') {
  //             text = `${selectedStyle.value} ON SIDES W/ 2.5" INSET`;
  //           } else if (selectedConstruction.toLowerCase() == 'flat') {
  //             if (document.querySelector(".template-product-woven-wood")) {
  //               text = `${selectedStyle.value} ON SIDES & BOTTOM`;
  //             } else {
  //               text = `${selectedStyle.value} ON SIDES & BOTTOM W/ 2.5" INSET`;
  //             }
  //           } else {
  //             text = `${selectedStyle.value} ON 3 SIDES W/ 2.5" INSET`;
  //           }
  //         }
  //       }
  //     } else {
  //       text = `${selectedStyle.value} ON BOTTOM`;
  //     }
  //   }

  //   this.optionLegend.innerText = text;

  //   if (text === "SELECT TRIM") {
  //     this.optionLegend.classList.add("option-not-selected");
  //   } else {
  //     this.optionLegend.classList.remove("option-not-selected");
  //   }
  // }

  updateOptionLegend() {
    const selectedStyle = this.getSelectedStyle();
    const selectedSide = this.getSelectedSide();

    const styleValue = selectedStyle?.value?.toLowerCase() || "none";
    const sideValue = selectedSide?.value?.toLowerCase() || "none";

    let text = "SELECT TRIM";
    let isPlaceholder = true;

    if (selectedSide && sideValue === "none") {
      text = "No trim";
      isPlaceholder = false;
    } else if (styleValue !== "none" && sideValue !== "none") {
      isPlaceholder = false;
      if (styleValue.includes("band")) {
        if (document.body.classList.contains("template-product-cornice") || document.body.classList.contains("template-product-valance")) {
          text = `${selectedStyle.value} ON BOTTOM`;
        } else {
          if (document.querySelector('input[name="construction"]:checked')) {
            const selectedConstruction = document.querySelector('input[name="construction"]:checked')?.value;
            if (selectedConstruction.toLowerCase() == 'relaxed') {
              text = `${selectedStyle.value} ON SIDES W/ 2.5" INSET`;
            } else if (selectedConstruction.toLowerCase() == 'flat') {
              if (document.querySelector(".template-product-woven-wood")) {
                text = `${selectedStyle.value} ON SIDES & BOTTOM`;
              } else {
                text = `${selectedStyle.value} ON SIDES & BOTTOM W/ 2.5" INSET`;
              }
            } else {
              text = `${selectedStyle.value} ON 3 SIDES W/ 2.5" INSET`;
            }
          } else {
            text = "SELECT TRIM";
            isPlaceholder = true;
          }
        }
      } else {
        text = `${selectedStyle.value} ON BOTTOM`;
      }
    }

    if (isPlaceholder) {
      this.optionLegend.innerHTML = '<span class="option-not-selected">' + text + '</span>';
    } else {
      this.optionLegend.innerText = text;
      this.optionLegend.classList.remove("option-not-selected");
    }
  }

  setConstructionDefault() {
    //const construction = this.getSelectedConstruction()?.value;
    //if (construction) return;
    // const selected = Array.from(this.constructions).find(
    //   (constructionRadio) => constructionRadio.value == `Flat`
    // );
    // selected.checked = true;
    // selected.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }

  setTrimRadio(luxe = false, side = false, bottom = false) {
    let selected;
    if (!side && !bottom) {
      this.showTrimStyle("hide");
      selected = Array.from(this.trimRadios).find(
        (trimRadio) => trimRadio.value == `None`
      );
      if (this.trimOptionMessage) {
        this.trimOptionMessage.classList.add('hidden');

        if (this.getSelectedSide()?.value.toLowerCase() === 'none' && this.getSelectedStyle()?.value.toLowerCase() !== 'none') {
          this.trimOptionMessageError.removeAttribute('hidden');
        } else {
          this.trimOptionMessageError.setAttribute('hidden', '');
        }
      }

      const trimStyleNone = Array.from(this.trimStyles).find(
        (trimStyle) => trimStyle.value == `None`
      );

      if (trimStyleNone) {
        trimStyleNone.checked = true;
      };
    } else {
      const construction = this.getSelectedConstruction()?.value?.toLowerCase() || null;
      
      if (this.trimOptionMessage) {

        this.trimOptionMessageError.setAttribute('hidden', '');
        if (document.querySelector('.template-product-woven-wood') && construction == 'scalloped') {
          this.trimOptionMessage.classList.add('hidden');
        } else {
          this.trimOptionMessage.classList.remove('hidden');
        }

        if (this.getSelectedStyle().value.toLowerCase() !== 'none') {
          this.trimOptionMessage.innerText = this.trimOptionMessage.getAttribute('data-trim-option-none');
        } else {
          this.trimOptionMessage.innerText = this.trimOptionMessage.getAttribute('data-trim-option');
        }
      }
      
      
      let setSides = this.getSelectedStyle().value.toLowerCase().indexOf('band') > 0 ? 
        construction == 'flat' ? 'Sides + Bottom: ' : "Sides: " : "Bottom: ";
      if (document.body.classList.contains("template-product-cornice") || document.body.classList.contains("template-product-valance")) {
        setSides = "Bottom: ";
      }
      
      const setType = this.getSelectedStyle().value.toLowerCase().indexOf('twill band') > 0
        ? "Twill Band"
        :this.getSelectedStyle().value.toLowerCase().indexOf('band') > 0
          ? "Band"
          : this.getSelectedStyle().value.toLowerCase().indexOf('pom pom') > 0
            ? "Pom Pom"
            : this.getSelectedStyle().value.toLowerCase().indexOf('tassel') > 0
              ? "Tassel"
              : this.getSelectedStyle().value.toLowerCase().indexOf('gimp') > 0
                ? "Gimp"
                : "Rick Rack"
      selected = Array.from(this.trimRadios).find(
        (trimRadio) => trimRadio.value == `${setSides}${setType}`
      );

      const trimSideNew = Array.from(this.trimSides).find(
        (trimSide) => trimSide.value != `None`
      );
      if (trimSideNew) {
        trimSideNew.value = `${setSides}${setType}`;
      }

      this.showTrimStyle("show");
    }

    if (selected) {
      selected.checked = true;
    }
    this.setConstructionDefault();
  }

  updateMedia() {
    const valueMedia = this.getSelectedStyle().value;
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");

    const mount = this.getSelectedMount()?.value || null;
    const construction = this.getSelectedConstruction()?.value || null;
    const wovenStyle = this.getSelectedWovenStyle()?.value || null;

    if (!mount || !construction) return;

    let baseString = `${this.handleizeText(construction)}-${this.handleizeText(mount)}`;
    if (wovenStyle) {
      baseString = `${this.handleizeText(construction)}-${this.handleizeText(wovenStyle)}-${this.handleizeText(mount)}`;
    }

    let imageBaseString = `${baseString}-none`;
    if (construction == 'Flat' && (valueMedia.includes('Band') || valueMedia.includes('Rick Rack')) && !document.body.classList.contains("template-product-woven-wood")) {
      imageBaseString = `${baseString}-tail-none`;
    }

    let imageString = `${baseString}-${this.handleizeText(valueMedia)}`;
    if (construction == 'Knife Pleat' || construction == 'Scalloped') {
      if (valueMedia.includes('Rick Rack') || valueMedia.includes('Band')) {
        imageBaseString = `${baseString}-none`;
      }
    } else if (construction == 'Relaxed' && valueMedia.includes('Rick Rack')) {
      imageBaseString = `${baseString}-none`;
    }

    if (!mainSlider && !thumbnailSlider) return;
    const imageBaseMedia = mainSlider.querySelector(
      `[data-variant="${imageBaseString}"]`
    );
    const imageBaseMediaThumbnail = thumbnailSlider.querySelector(
      `[data-variant="${imageBaseString}"]`
    );

    if (imageBaseMedia) {
      mainSlider?.querySelectorAll("ul.slider li")?.forEach((slide) => {
        slide.classList.remove('is-active');
      })
      imageBaseMedia.classList.add("is-active");
      mainSlider?.querySelector("ul").scroll({
        top: 0,
        left: imageBaseMedia.offsetLeft,
      });
    }
    if (imageBaseMediaThumbnail) {
      thumbnailSlider.querySelectorAll("ul.slider li").forEach((thumbnail) => {
        thumbnail.classList.remove('is-active');
      })
      thumbnailSlider.querySelectorAll('ul.slider li[data-variant]').forEach((thumbnail) => {
        thumbnail.classList.add("product__media-item--additional-image");
      })
      imageBaseMediaThumbnail.classList.remove('product__media-item--additional-image');
      imageBaseMediaThumbnail.classList.add("is-active");
      thumbnailSlider.querySelector("ul").scroll({
        top: 0,
        left: imageBaseMediaThumbnail.offsetLeft, 
      });
    }

    const mainThumbnail = mainSlider.querySelector(
      `[data-variant="${imageString}"]`
    );
    const existingOverlay = mainSlider.querySelector('.overlay-image');
    const existingBaseDesktop = mainSlider.querySelector('.base-image');
    const existingBaseMobile = thumbnailSlider.querySelector('.base-image');
    const imgSrc = mainThumbnail?.querySelector('img').src;
    existingBaseDesktop?.remove();
    existingOverlay?.remove();
    existingBaseMobile?.remove();

    // if (valueMedia == 'None' && this.imageCustomizedEl) {
    //   this.imageCustomizedEl.value = '';
    // }

    if (mainThumbnail && imgSrc) {
      const canvas = document.getElementById("canvas-custom-builder");
      const ctx = canvas.getContext("2d");

      let images = [];
      if (imageBaseMedia) {
        images.push(imageBaseMedia.querySelector('.media img').src);
      }
      if (mainThumbnail) {
        images.push(mainThumbnail.querySelector('.media img').src);
      }

      const assetsLoaded = images.map(async image => {
        const img = new Image();
        img.src = image;
        await img.decode();
        return img;
      });

      Promise.all(assetsLoaded).then(images => {
        const firstImage = images[0];
        canvas.width = 900;
        canvas.height = 900;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        images.forEach((e, i) =>
          ctx.drawImage(e, 0, 0, canvas.width, canvas.height)
        );

        canvas.toBlob((blob) => {
          const objectURL = URL.createObjectURL(blob);

          const overlayImageMainSlider = document.createElement('img');
          overlayImageMainSlider.src = objectURL;
          overlayImageMainSlider.srcset = objectURL;
          overlayImageMainSlider.sizes = "100vw";
          overlayImageMainSlider.loading = "eager";
          overlayImageMainSlider.fetchpriority = "high";
          overlayImageMainSlider.alt = "overlay";
          overlayImageMainSlider.classList.add('overlay-image', 'image-magnify-hover');
          imageBaseMedia.querySelector('.media').append(overlayImageMainSlider);

          const overlayImageThumbnail = document.createElement('img');
          overlayImageThumbnail.src = objectURL;
          overlayImageThumbnail.srcset = objectURL;
          overlayImageThumbnail.sizes = "100vw";
          overlayImageThumbnail.loading = "lazy";
          overlayImageThumbnail.alt = "overlay";
          overlayImageThumbnail.classList.add('overlay-image');
          imageBaseMediaThumbnail.querySelector('.media').append(overlayImageThumbnail);

          if (this.imageCustomizedEl) {
            const file = new File(
              [blob],
              'custom-roman-shade-builder.png',
              { type: 'image/png', lastModified: new Date().getTime() }
            );
            const container = new DataTransfer();
            container.items.add(file);
            this.imageCustomizedEl.files = container.files;
          } 

          enableZoomOnHover();
        }, "image/webp", 1);
      }).catch(err => console.error(err));
    }
  }

  handleizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
  }

  getSelectedMount() {
    if (this.trimMounts) {
      return Array.from(this.trimMounts).find((style) => style.checked === true);
    } else {
      return null
    }
  }

  getSelectedWovenStyle() {
    if (this.trimWovenStyles) {
      return Array.from(this.trimWovenStyles).find((style) => style.checked === true);
    } else {
      return null
    }
  }

  getSelectedConstruction() {
    return Array.from(this.constructions).find((style) => style.checked === true);
  }
}

customElements.define("roman-shade-trim-radios", RomanShadeTrimTradios);

class ValanceCorniceTrimTradios extends RomanShadeTrimTradios {
  constructor() {
    super();
    this.constructions = document.querySelectorAll(
      'input[name="construction"]'
    );
    this.imageCustomizedEl = document.querySelector('input[name="properties[_customized_image]"]');

    const widthInputSelect = document.querySelector('width-input-select');
    if (widthInputSelect) {
      widthInputSelect.addEventListener('widthChanged', () => {
        this.resetTrimLegend();
      });
    }
  }

  resetTrimLegend() {
    if (this.optionLegend) {
      const text = this.optionLegend.innerText.trim().toUpperCase();
      if (text === "SELECT TRIM") {
        this.optionLegend.classList.add("option-not-selected");
      } else {
        this.optionLegend.classList.remove("option-not-selected");
      }
    }
  }

  // setConstructionDefault() {
  //   const construction = this.getSelectedConstruction()?.value;
  //   if (construction) return;
  //   const selected = Array.from(this.constructions).find(
  //     (constructionRadio) => constructionRadio.value == `Classic`
  //   );
  //   if (!selected) return;
  //   selected.checked = true;
  // }

  updateMedia() {
    const valueMedia = this.getSelectedStyle().value;
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");
    const construction = this.getSelectedConstruction()?.value || 'Classic';

    if (!construction) return;

    let imageBaseString = `${this.handleizeText(construction)}-none`; 
    let imageString = `${this.handleizeText(construction)}-${this.handleizeText(valueMedia)}`;

    

    if (!mainSlider && !thumbnailSlider) return;
    const imageBaseMedia = mainSlider.querySelector(
      `[data-variant="${imageBaseString}"]`
    );
    const imageBaseMediaThumbnail = thumbnailSlider.querySelector(
      `[data-variant="${imageBaseString}"]`
    );

    if (imageBaseMedia) {
      mainSlider?.querySelectorAll("ul.slider li")?.forEach((slide) => {
        slide.classList.remove('is-active');
      })
      imageBaseMedia.classList.add("is-active");
      mainSlider?.querySelector("ul").scroll({
        top: 0,
        left: imageBaseMedia.offsetLeft,
      });
    }
    if (imageBaseMediaThumbnail) {
      thumbnailSlider.querySelectorAll("ul.slider li").forEach((thumbnail) => {
        thumbnail.classList.remove('is-active');
      })
      thumbnailSlider.querySelectorAll('ul.slider li[data-variant]').forEach((thumbnail) => {
        thumbnail.classList.add("product__media-item--additional-image");
      })
      imageBaseMediaThumbnail.classList.remove('product__media-item--additional-image');
      imageBaseMediaThumbnail.classList.add("is-active");
      thumbnailSlider.querySelector("ul").scroll({
        top: 0,
        left: imageBaseMediaThumbnail.offsetLeft, 
      });
    }

    const mainThumbnail = mainSlider.querySelector(
      `[data-variant="${imageString}"]`
    );
    const existingOverlay = mainSlider.querySelector('.overlay-image');
    const existingBaseDesktop = mainSlider.querySelector('.base-image');
    const existingBaseMobile = thumbnailSlider.querySelector('.base-image');
    const imgSrc = mainThumbnail?.querySelector('img').src;
    existingBaseDesktop?.remove();
    existingOverlay?.remove();
    existingBaseMobile?.remove();

    // if (valueMedia == 'None' && this.imageCustomizedEl) {
    //   this.imageCustomizedEl.value = '';
    // }

    if (mainThumbnail && imgSrc) {
      const canvas = document.getElementById("canvas-custom-builder");
      const ctx = canvas.getContext("2d");

      let images = [];
      if (imageBaseMedia) {
        images.push(imageBaseMedia.querySelector('.media img').src);
      }
      if (mainThumbnail) {
        images.push(mainThumbnail.querySelector('.media img').src);
      }

      const assetsLoaded = images.map(async image => {
        const img = new Image();
        img.src = image;
        await img.decode();
        return img;
      });

      Promise.all(assetsLoaded).then(images => {
        const firstImage = images[0];
        canvas.width = 900;
        canvas.height = 900;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        images.forEach((e, i) =>
          ctx.drawImage(e, 0, 0, canvas.width, canvas.height)
        );

        canvas.toBlob((blob) => {
          const objectURL = URL.createObjectURL(blob);

          const overlayImageMainSlider = document.createElement('img');
          overlayImageMainSlider.src = objectURL;
          overlayImageMainSlider.srcset = objectURL;
          overlayImageMainSlider.sizes = "100vw";
          overlayImageMainSlider.loading = "eager";
          overlayImageMainSlider.fetchpriority = "high";
          overlayImageMainSlider.alt = "overlay";
          overlayImageMainSlider.classList.add('overlay-image', 'image-magnify-hover');
          imageBaseMedia.querySelector('.media').append(overlayImageMainSlider);

          const overlayImageThumbnail = document.createElement('img');
          overlayImageThumbnail.src = objectURL;
          overlayImageThumbnail.srcset = objectURL;
          overlayImageThumbnail.sizes = "100vw";
          overlayImageThumbnail.loading = "lazy";
          overlayImageThumbnail.alt = "overlay";
          overlayImageThumbnail.classList.add('overlay-image');
          imageBaseMediaThumbnail.querySelector('.media').append(overlayImageThumbnail);

          if (this.imageCustomizedEl) {
            const file = new File(
              [blob],
              'custom-roman-shade-builder.png',
              { type: 'image/png', lastModified: new Date().getTime() }
            );
            const container = new DataTransfer();
            container.items.add(file);
            this.imageCustomizedEl.files = container.files;
          } 

          enableZoomOnHover();
        }, "image/webp", 1);
      }).catch(err => console.error(err));
    }
  }

  handleizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
  }

  getSelectedConstruction() {
    if (!this.constructions) return;
    return Array.from(this.constructions).find((style) => style.checked === true);
  }
}

customElements.define("valance-cornice-trim-radios", ValanceCorniceTrimTradios);

class YardQuantity extends VariantSelects {
  constructor() {
    super();
    this.input = this.querySelector(".yard-quantity input");
    this.changeEvent = new Event("change", { bubbles: true });
    this.QuantityInputWrapper = document.querySelector('quantity-input');
    this.quantityInput = this.QuantityInputWrapper.querySelector("input");
    this.optionLegend = this.querySelector('.product-form__input--dropdown .form__label span');

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );

    this.input.addEventListener("change", this.onInputYardChange.bind(this));
    
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;
    event.currentTarget.name === "plus" ? this.input.stepUp() : this.input.stepDown();

    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }


  onInputYardChange(event) {
    const value = event.target.value;
    const minValue = this.input.getAttribute('min');

    if (parseInt(value) < parseInt(minValue)) {
      this.input.value = parseInt(minValue);
    }
    this.quantityInput.value = this.input.value;
    // this.QuantityInputWrapper.onInputChange.bind(this);
    if (typeof this.QuantityInputWrapper.onInputChange === 'function') {
      this.QuantityInputWrapper.onInputChange({ target: this.quantityInput });
    }
    this.updateOptionQuantityLegends();
  }

  updateOptionQuantityLegends() {
    if (!this.optionLegend) return;
    const unit = this.optionLegend.getAttribute('data-unit');
    this.optionLegend.innerText = `${this.input.value} ${this.input.value == 1? unit : unit + 's'}`;
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset.product-form__input"));
    this.options = fieldsets.map((fieldset) => {
      const selectEl = fieldset.querySelector("select");
      if (selectEl) {
        return selectEl.value;
      }
      const checkedRadio = fieldset.querySelector("input[type=radio]:checked");
      if (checkedRadio) {
        return checkedRadio.value;
      }

      return null;
    }).filter(value => value !== null);
  }

}
customElements.define("yard-quantity", YardQuantity);

class FabricOptions extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll('.section-product-option-wrapper .wallpaper-option-top-top');
    if (!this.items) return;
    this.itemsTitle = this.querySelectorAll('.wallpaper-title');
    this.itemsSubTitle = this.querySelectorAll('.wallpaper-subtitle');
    this.itemsContentGround = this.querySelectorAll('.content-ground');
    this.itemsContentWeight = this.querySelectorAll('.content-weight');
    this.itemsContentRub = this.querySelectorAll('.content-rub');
    this.itemsContentCareInstruction = this.querySelectorAll('.content-care-instruction');

    requestAnimationFrame(() => this.updateHeightEachElement());
    window.addEventListener("resize", this.updateHeightEachElement.bind(this));

    if (this.querySelectorAll('details.content-toggle').length) {
      this.querySelectorAll('details.content-toggle').forEach(details => {
        details.addEventListener('toggle', () => this.updateHeightEachElement());
      });
    }
  }

  getMaxHeight(elements) {
    let maxHeight = 0;
    elements.forEach(el => {
      el.style.height = '';
      const height = el.offsetHeight;
      if (height > maxHeight) maxHeight = height;
    });
    return maxHeight;
  }

  updateHeightEachElement() {
    const maxTitle = this.getMaxHeight(Array.from(this.itemsTitle));
    const maxSubTitle = this.getMaxHeight(Array.from(this.itemsSubTitle));
    const maxContentGround = this.getMaxHeight(Array.from(this.itemsContentGround));
    const maxContentWeight = this.getMaxHeight(Array.from(this.itemsContentWeight));
    const maxContentRub = this.getMaxHeight(Array.from(this.itemsContentRub));
    const maxContentCareInstruction = this.getMaxHeight(Array.from(this.itemsContentCareInstruction));

    const elements = [
      ['.wallpaper-title', maxTitle],
      ['.wallpaper-subtitle', maxSubTitle],
      ['.content-ground', maxContentGround],
      ['.content-weight', maxContentWeight],
      ['.content-rub', maxContentRub],
      ['.content-care-instruction', maxContentCareInstruction],
    ];

    this.items.forEach((item) => {
      elements.forEach(([selector, height]) => {
        const el = item.querySelector(selector);
        if (el) {
          el.style.height = height + 'px';
        }
      });
    });
  }
}
customElements.define("fabric-options", FabricOptions);

class CollectionGridView extends HTMLElement {
  constructor() {
    super();
    this.gridViewMobileBtn = this.querySelectorAll('.btn-grid');
    if (!this.gridViewMobileBtn) return;
    this.gridViewMobileBtn.forEach((viewBtn, index) => {
      viewBtn.addEventListener('click', this.changeGridView.bind(this));
    })
  }

  changeGridView(event) {
    event.preventDefault();
    const target = event.currentTarget;
    this.collectionGrid = document.querySelector('#ProductGridContainer #product-grid');
    this.collectionGridCustom = document.querySelectorAll('#ProductGridContainer .collection-block-wrapper ul.product-grid');
    this.gridViewMobileBtn.forEach((btn, index) => {
      btn.classList.remove('active');
    })
    target.classList.add('active');
    if (this.collectionGridCustom.length) {
      this.collectionGridCustom.forEach((collection) => {
        collection.style.visibility = 'hidden';
      })
    }
    requestAnimationFrame(() => {
      if (target.classList.contains('view-1-col')) {
        if (this.collectionGrid) {
          this.collectionGrid.classList.remove('grid--2-col-tablet-down');
          this.collectionGrid.classList.add('grid--1-col-tablet-down');
        }
        if (this.collectionGridCustom.length) {
          this.collectionGridCustom.forEach((collection, idx) => {
            collection.classList.add('mobile-one');
            requestAnimationFrame(() => {
              collection.style.visibility = '';
            });
          })
        }
      } else {
        if (this.collectionGrid) {
          this.collectionGrid.classList.add('grid--2-col-tablet-down');
          this.collectionGrid.classList.remove('grid--1-col-tablet-down');
        }
        if (this.collectionGridCustom.length) {
          this.collectionGridCustom.forEach((collection) => {
            collection.classList.remove('mobile-one');
            requestAnimationFrame(() => {
              collection.style.visibility = '';
            });
          })
        }
      }
    });
  }
}

customElements.define('grid-view-change', CollectionGridView);

class RecentlyViewedProducts extends HTMLElement {
  constructor() {
    super();

    this.storageKey = 'recentlyViewedProducts';
    this.limit = Number(this.dataset.limit) || 8;
  }

  connectedCallback() {
    this.saveCurrentProduct();
    this.renderProducts();
  }

  saveCurrentProduct() {
    if (!window.location.pathname.includes('/products/')) return;

    const handle = window.location.pathname.split('/products/')[1];

    let products =
      JSON.parse(localStorage.getItem(this.storageKey)) || [];

    products = products.filter((item) => item !== handle);

    products.unshift(handle);

    products = products.slice(0, 12);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(products)
    );
  }

  async renderProducts() {
    this.container = this.querySelector('ul.recently-viewed-products__list');

    if (!this.container) return;

    const currentHandle =
      window.location.pathname.split('/products/')[1];

    let products =
      JSON.parse(localStorage.getItem(this.storageKey)) || [];

    products = products.filter(
      (handle) => handle !== currentHandle
    );

    products = products.slice(0, this.limit);

    if (!products.length) {
      this.classList.add('hidden');
    } else {
      const cards = await Promise.all(
        products.map((handle) =>
          fetch(`/products/${handle}?view=card-product`)
            .then((response) => response.text())
        )
      );

      this.classList.remove('hidden');

      this.container.innerHTML = cards
        .map(
          (card) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(card, 'text/html');
            if (!doc.querySelector('.product-card-wrapper.recently-item')) return '';
            return `
              <li class="carousel-cell grid__item">
                ${card}
              </li>
            `
          }
        )
        .join('');
    }
  }
}

customElements.define('recently-viewed-products', RecentlyViewedProducts);

class FabricCardOptions extends HTMLElement {
  constructor() {
    super();
    this.fabricOptionItem = this.querySelectorAll('.image-option');
    if (!this.fabricOptionItem) return;
    this.fabricOptionItem.forEach((fabric) => fabric.addEventListener('click', (e) => this.handleClick(e)));
  }

  handleClick(e) {
    e.preventDefault();
    const target = e.target;
    if (target.classList.contains('current')) return;

    this.querySelector('.image-option.current').classList.remove('current');
    target.classList.add('current');
    const href = target.getAttribute('href')?.split('?')[0];
    if (!href) return;
      fetch(`${href}?view=card-product`)
      .then(response => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const cardProduct = target.closest('.card-wrapper.product-card-wrapper');

        let cardMedia = cardProduct.querySelector('.card .card__inner');
        if (cardMedia) {
          cardMedia.innerHTML = html.querySelector('.card .card__inner').innerHTML;
        }

        let cardHeading = cardProduct.querySelector('.card > .card__content .card__information .card__heading');
        if (cardHeading) {
          cardHeading.innerHTML = html.querySelector('.card > .card__content .card__heading').innerHTML;
          if (cardProduct.querySelector('fabric-card-option .show-more')) {
            let cardProductURL = html.querySelector('.card > .card__content .card__heading a').getAttribute('href');
            cardProduct.querySelector('fabric-card-option .show-more').setAttribute('href', cardProductURL);
          }
          
        }
        
        let cardPrice = cardProduct.querySelector('.card > .card__content .price ');
        if (cardPrice) {
          cardPrice.innerHTML = html.querySelector('.card > .card__content .price ').innerHTML;
        }
        let cardType = cardProduct.querySelector('.card > .card__content .type ');
        if (cardType) {
          cardType.innerHTML = html.querySelector('.card > .card__content .type ').innerHTML;
        }
      });
  }

}

customElements.define('fabric-card-option', FabricCardOptions);
