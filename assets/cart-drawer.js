class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', async (event) => {
      event.preventDefault();

      if (this.busy) return;

      const attachedKeys = (this.dataset.attached || '')
        .split(';')
        .map((k) => k.trim())
        .filter(Boolean);
      const embroideryKey = (this.dataset.embroideryKey || '').trim();
      const rushKey = (this.dataset.rushKey || '').trim();

      if (attachedKeys.length === 0) {
        this.closest('cart-drawer').updateQuantity(this.dataset.index, 0);
        return;
      }

      this.busy = true;
      const updateProducts = {}

      attachedKeys.forEach((attached_id) => {
        if (attached_id !== embroideryKey && attached_id !== rushKey) updateProducts[attached_id] = 0;
      });

      updateProducts[this.dataset.key] = 0;

      try {

        const qtyAddonKeys = [embroideryKey, rushKey].filter(Boolean);

        if (qtyAddonKeys.length > 0) {
          const cart = await fetch('/cart.js').then((r) => r.json());

          qtyAddonKeys.forEach((key) => {
            const addon = cart.items.find((i) => i.key === key);
            if (!addon) return;
            const count = attachedKeys.filter((k) => k === key).length || 1;
            updateProducts[key] = Math.max(0, addon.quantity - count);
          });
        }

        fetch(routes.cart_update_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            updates: updateProducts
          })
        }).then(response => {
          this.closest('cart-drawer').fetchCart();
        })
          .catch((error) => {
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      } finally {
        this.busy = false;
      }
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    const index = event.target.dataset.index;
    const quantity = event.target.value;
    const name = document.activeElement.getAttribute('name');

    // A second change on a line still in flight would race the first response.
    if (this.pendingLines.has(String(index))) return;
  
    const removeBtn = this.querySelector(`#Remove-${index}`);
    const lineKey = removeBtn?.dataset.key || '';
    const qty = parseInt(quantity);
    const updates = {};

    // The bed platform is one per bed, so it follows the parent quantity.
    const platformKey = removeBtn?.dataset.platformKey || '';
    if (platformKey) updates[platformKey] = qty;

    // Rush, setup fee and embroidery are flat per-line charges: they keep their
    // own quantity and only go away when the parent line does.
    if (qty === 0 && platformKey) {
      (removeBtn?.dataset.attached || '')
        .split(';')
        .map((key) => key.trim())
        .filter(Boolean)
        .forEach((key) => {
          updates[key] = 0;
        });
    }

    if (Object.keys(updates).length) {
      this.enableLoading(index);
      fetch(routes.cart_update_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      }).finally(() => {
        this.updateQuantity(index, quantity, name, lineKey);
      });
    } else {
      this.updateQuantity(index, quantity, name);
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: 'main-cart-items',
        selector: '.js-contents'
      }
    ];
  }

  connectedCallback() {
    this.body = document.querySelector('body');
    this.drawer = document.getElementById('shopify-section-cart-drawer');
    this.overlay = document.getElementById('cart-overlay');
    this.outer = document.getElementById('cart-drawer-outer');
    this.cartContents = document.querySelector('.cart__contents');
    this.revealBtn = document.getElementById('cart-reveal');
    this.subtotal = document.getElementById('cart-subtotal');
    this.cartCount = document.querySelector('.cart__indicator');
    this.cartCountDrawer = this.querySelector('.cart-count')
    this.totalPriceCheckout = document.querySelector('#cart-drawer-outer .total-price');
    
    this.totalCartPage = document.getElementById('cart-total-price');
    this.originalTotalCartPage = document.getElementById('cart-original-total-price');

    this.fetchAndOpenCart = this.fetchAndOpenCart.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);


    this.revealBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.fetchAndOpenCart();
    })

    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.closeDrawer.bind(this))
    );

    this.overlay.addEventListener('click', (e) => {
      this.closeDrawer();
    })

    this.requestSequence = 0;
    this.pendingLines = new Set();
  }

  fetchCart(callback) {
    fetch('/cart.js', {
      credentials: 'same-origin',
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((cart) => {
        if (cart.items.length !== 0) {
          this.outer.classList.remove('is-empty');
          this.renderCart(cart);
        } else if (cart.items.length === 0) {
          this.outer.classList.add('is-empty');
          this.renderCart(cart);
        }
        this.checkSetupFeeInCart(cart);
        this.checkRushQtyInCart(cart);
        if ((typeof callback) === 'function') {
          callback(cart);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  updateQuantity(line, quantity, name, key) {
    this.enableLoading(line);

    const sequence = ++this.requestSequence;

    // Addressing the line by key survives the re-indexing that happens when an
    // attached add-on line is removed before this call.
    const body = JSON.stringify({
      ...(key ? { id: key } : { line }),
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        if (response.status === 422) {
          throw new Error(response.statusText);
        } else {
          return response.text();
        }
      })
      .then((state) => {
        // A newer request already started, so this response is stale.
        if (sequence !== this.requestSequence) return;

        const parsedState = JSON.parse(state);
        this.outer.classList.toggle('is-empty', parsedState.item_count === 0);

        // this.subtotal.innerHTML = `$${(parsedState.items_subtotal_price / 100).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        this.totalPriceCheckout.innerHTML = `$${(parsedState.items_subtotal_price / 100).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

        if (this.originalTotalCartPage) {
          this.originalTotalCartPage.innerHTML = `$${(parsedState.original_total_price / 100).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }
        if (this.totalCartPage) {
          this.totalCartPage.innerHTML = `$${(parsedState.items_subtotal_price / 100).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }

        this.getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        }));

        const lineItem = document.getElementById(`cart-product-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) lineItem.querySelector(`[name="${name}"]`).focus();
        this.updateCartCount();
        this.checkSetupFeeInCart(parsedState);
        this.checkRushQtyInCart(parsedState);
      })
      .catch((err) => {
        if (name == 'plus') {
          const lineItem = this.querySelector(`#cart-product-${line}`);
          lineItem.querySelector('.quantity-input').value = quantity - 1
          lineItem.querySelector('.error__message').classList.remove('hidden');
        }
        console.error(window.cartStrings.error);
      })
      .finally(() => {
        this.disableLoading(line);
        if (sequence === this.requestSequence) {
          this.pendingLines.clear();
          this.classList.remove('cart-drawer--loading');
        }
      });
  }

  enableLoading(line) {
    this.pendingLines.add(String(line));
    this.classList.add('cart-drawer--loading');

    const lineItem = this.querySelector(`#cart-product-${line}`);
    if (!lineItem) return;

    lineItem.classList.add('cart-item--loading');
    lineItem.querySelectorAll('button, input').forEach((el) => {
      el.setAttribute('disabled', 'disabled');
    });
  }

  disableLoading(line) {
    this.pendingLines.delete(String(line));
    if (this.pendingLines.size === 0) this.classList.remove('cart-drawer--loading');

    // The row may have been replaced by the section swap, so re-query it.
    const lineItem = this.querySelector(`#cart-product-${line}`);
    if (!lineItem) return;

    lineItem.classList.remove('cart-item--loading');
    lineItem.querySelectorAll('button, input').forEach((el) => {
      el.removeAttribute('disabled');
    });
  }

  renderCart(cart) {
    fetch(`${window.location.pathname}?sections=main-cart-items`)
      .then(response => response.json())
      .then(parsedState => {
        
        this.subtotal.innerText = `$${(cart.items_subtotal_price / 100).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        this.cartContents.innerHTML = this.getSectionInnerHTML(parsedState['main-cart-items'], '.js-contents');
        this.totalPriceCheckout.innerHTML = `$${(cart.items_subtotal_price / 100).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

        if (this.originalTotalCartPage) {
          this.originalTotalCartPage.innerHTML = `$${(cart.original_total_price / 100).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }
        if (this.totalCartPage) {
          this.totalCartPage.innerHTML = `$${(cart.items_subtotal_price / 100).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }

        this.updateCartCount();
      })
      .catch((e) => {
        console.error(e);
      })
  }

  updateCartCount() {
    this.cartItemCount = document.querySelector('[data-cart-length]') ? document.querySelector('[data-cart-length]').dataset.cartLength : null;
    this.cartCount.innerHTML = this.cartItemCount ? parseInt(this.cartItemCount, 10) : null;
    this.cartCountDrawer.innerHTML = this.cartItemCount ? parseInt(this.cartItemCount, 10) : 0;
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  openDrawer() {
    this.body.classList.add('model-active');
    this.drawer.classList.add('is-active');
  }

  closeDrawer() {
    this.body.classList.remove('model-active');
    this.drawer.classList.remove('is-active');
  }

  fetchAndOpenCart() {
    this.fetchCart(() => {
      this.openDrawer();
    });
  }

  checkSetupFeeInCart(cart, event) {
    if (cart.items.length === 0) return;
    let wallpaperMinimumItems = [];
    for (var i=0; i < cart.items.length; i++) {
      if (cart.items[i].properties['_wallpaper_minimum']) {
        const itemTitle = cart.items[i].title.replace("- Yardage", "");
        wallpaperMinimumItems.push({
          id: cart.items[i].id,
          quantity: cart.items[i].quantity,
          title: itemTitle,
          variantTitle: cart.items[i].variant_title
        });
      }
    }

    const setupFeeItems = cart.items.filter((x) => x.id == '40628503150652');
    if (!wallpaperMinimumItems.length && !setupFeeItems.length) return;
    const updateProducts = {};
    const itemAdd = [];
    
    if (!wallpaperMinimumItems.length && setupFeeItems.length) {
      setupFeeItems.forEach((fee) => {
        updateProducts[fee.key] = 0;
      });
    } else {
      wallpaperMinimumItems.forEach((wallpaper) => { 
        let isSetupFeeInCart = false;
        let countUnder20 = 0;
        let countPanelsUnder5 = 0;
        let totalCount = 0;
        let feeKey = '';
        let feeCount = 0;
        setupFeeItems.forEach((fee) => {
          const matchingProductId = fee.properties['_product_id'];
          if (fee.properties['_product_id'] == wallpaper.id) {
            countPanelsUnder5 = wallpaperMinimumItems.filter(x => 
              x.variantTitle.includes('Panels') && 
              x.id === matchingProductId && x.quantity <= 5
            ).length;
            
            countUnder20 = wallpaperMinimumItems.filter(x =>
              x.id === matchingProductId &&
              x.quantity < 20 && !x.variantTitle.includes('Panels')
            ).length;

            feeKey = fee.key;
            isSetupFeeInCart = true;
            feeCount = fee.quantity;
            totalCount = countPanelsUnder5 + countUnder20;
          }
        })
        
        if (feeKey != '' && feeCount != totalCount) {
          updateProducts[feeKey] = totalCount;
        }
        
        let isWallPaperAdd = false;
        if (wallpaper.quantity < 20 && !wallpaper.variantTitle.includes('Panels')) {
          isWallPaperAdd = true;
        } else if (wallpaper.quantity <= 5 && wallpaper.variantTitle.includes('Panels')) {
          isWallPaperAdd = true;
        }
        if (!isSetupFeeInCart && isWallPaperAdd) {
          itemAdd.push({
            id: 40628503150652,
            quantity: 1,
            properties: {
              _product_id: wallpaper.id,
              _product_title: wallpaper.title,
              "Setup Fee": wallpaper.title,
            }
          })
        }
      })
    }

    if (Object.keys(updateProducts).length) {
      try {
        fetch(routes.cart_update_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            updates: updateProducts
          })
        }).then(response => {
          this.closest('cart-drawer').fetchCart();
        })
          .catch((error) => {
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      }
    }

    if (!itemAdd.length) return;
    const additionalProductsConfig = fetchConfig("javascript");
    additionalProductsConfig.body = JSON.stringify({
      items: itemAdd,
    });
    fetch(`${routes.cart_add_url}`, additionalProductsConfig)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.handleErrorMessage(response.description);
          return response.status;
        }
      })
      .finally(() => {
        this.closest('cart-drawer').fetchCart();
      });
  }

  checkRushQtyInCart(cart, event) {
    if (cart.items.length === 0) return;
    let rushItems = [];
    for (var i=0; i < cart.items.length; i++) {
      if (cart.items[i].properties['Rush Processing'] && !cart.items[i].properties['_product_id']) {
        rushItems.push({
          id: cart.items[i].id,
          quantity: cart.items[i].quantity,
          title: cart.items[i].title
        });
      }
    }

    const rushProcessingItem = cart.items.filter((x) => x.id == '40429314441276');
    if (!rushItems.length && !rushProcessingItem.length) return;

    const updateProducts = {};
    if (rushProcessingItem[0].quantity == rushItems.length) return;
    updateProducts[rushProcessingItem[0].id] = rushItems.length;

    if (Object.keys(updateProducts).length) {
      try {
        fetch(routes.cart_update_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            updates: updateProducts
          })
        }).then(response => {
          this.closest('cart-drawer').fetchCart();
        })
          .catch((error) => {
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      }
    }
  }
}

customElements.define('cart-drawer', CartDrawer);
