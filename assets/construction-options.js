class ChildRadios extends HTMLElement {
  constructor() {
    super();
    this.helperTexts = this.querySelectorAll(".construction-helper");
    this.addEventListener("change", this.onRadioChange.bind(this));
    this.selects =
      document.querySelector("variant-radios") ||
      document.querySelector("variant-selects");
  }

  // connectedCallback() {
  //   this.saveCurrentOptions();

  //   if (this.savedOptions.construction && this.savedOptions.construction != 'undefined') {
  //     this.renderProductSelects(
  //       document.querySelector(
  //         `input[name="construction"][value='${this.savedOptions.construction}']`
  //       ).dataset.url
  //     );
  //   } else {
  //     this.selects.setUnavailable();
  //   }
  //   this.updateOptionLegend(this.savedOptions.construction);
  //   this.updateHelperText(this.savedOptions.construction);
  // }

  connectedCallback() {
    this.saveCurrentOptions();

    const construction =
      (this.savedOptions.construction && this.savedOptions.construction !== 'undefined')
        ? this.savedOptions.construction
        : null;

    if (construction) {
      const input = document.querySelector(
        `input[name="construction"][value='${construction}']`
      );
      if (input) {
        this.renderProductSelects(input.dataset.url);
      } else {
        this.selects.setUnavailable();
      }
    } else {
      this.selects.setUnavailable();
    }

    this.updateOptionLegend(construction);
    this.updateHelperText(construction);
  }

  onRadioChange({ target }) {
    target.checked = true;
    this.selects.onVariantChange();
    this.saveCurrentOptions();
    this.renderProductSelects(target.dataset.url);
    this.updateOptionLegend(target.value);
    this.updateHelperText(target.value);
  }

  updateHelperText(type) {
    if (typeof productType != "undefined" && productType == 'Sheer Curtain') {
      this.helperTexts.forEach((helperText) => {
        helperText.classList.add("visually-hidden");
      });
      const rockPocket = document.querySelector(`.construction-helper-${'Rod Pocket'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const ringTop = document.querySelector(`.construction-helper-${'Ring Top'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const grommet = document.querySelector(`.construction-helper-${'Grommet'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const pinchPleat = document.querySelector(`.construction-helper-${'Pinch Pleat'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const tailoredPleat = document.querySelector(`.construction-helper-${'Tailored Pleat'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      switch (type) {
        case 'Rod Pocket':
          if (rockPocket) {
            rockPocket.innerHTML = ' ';
            rockPocket.classList.remove('visually-hidden');
          }
          break;
        case 'Ring Top':
          if (ringTop) {
            ringTop.classList.remove('visually-hidden');
          }
          break;
        case 'Grommet':
          if (grommet) {
            grommet.classList.remove('visually-hidden');
          }
          break;
        case 'Pinch Pleat':
          if (pinchPleat) {
            pinchPleat.classList.remove('visually-hidden');
          }
          break;
        case 'Tailored Pleat':
          if (tailoredPleat) {
            tailoredPleat.classList.remove('visually-hidden');
          }
          break;
        default:
          if (rockPocket) {
            rockPocket.innerHTML = ' ';
            rockPocket.classList.remove('visually-hidden');
          }
          break;
      }
    } else if (typeof productType != "undefined" && productType == 'Curtain') {
      this.helperTexts.forEach((helperText) => {
        helperText.classList.add("visually-hidden");
      });
      const rockPocket = document.querySelector(`.construction-helper-${'Rod Pocket'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const ringTop = document.querySelector(`.construction-helper-${'Ring Top'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const grommet = document.querySelector(`.construction-helper-${'Grommet'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const pinchPleat = document.querySelector(`.construction-helper-${'Pinch Pleat'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const tailoredPleat = document.querySelector(`.construction-helper-${'Tailored Pleat'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      switch (type) {
        case 'Rod Pocket':
          if (rockPocket) {
            rockPocket.innerHTML = ' ';
            rockPocket.classList.remove('visually-hidden');
          }
          break;
        case 'Ring Top':
          if (ringTop) {
            ringTop.classList.remove('visually-hidden');
          }
          break;
        case 'Grommet':
          if (grommet) {
            grommet.classList.remove('visually-hidden');
          }
          break;
        case 'Pinch Pleat':
          if (pinchPleat) {
            pinchPleat.classList.remove('visually-hidden');
          }
          break;
        case 'Tailored Pleat':
          if (tailoredPleat) {
            tailoredPleat.innerHTML = ' ';
            tailoredPleat.classList.remove('visually-hidden');
          }
          break;
        default:
          if (rockPocket) {
            rockPocket.innerHTML = ' ';
            rockPocket.classList.remove('visually-hidden');
          }
          break;
      }
    } else {
      if (!type) return;
      this.helperTexts.forEach((helperText) => {
        if (
          helperText.classList.contains(
            `construction-helper-${type.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`
          )
        ) {
          helperText.classList.remove("visually-hidden");
        } else {
          helperText.classList.add("visually-hidden");
        }
      });
    }
  }

  renderProductSelects(url) {
    if (!url) return;
    fetch(`${url}?&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const radioId = `variant-radios-${this.dataset.section}`;
        const priceId = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const radioDestination = document.getElementById(radioId);
        const radioSource = html.getElementById(radioId);
        const priceDestination = document.getElementById(priceId);
        const priceSource = html.getElementById(priceId);
        if (radioSource && radioDestination)
          radioDestination.innerHTML = radioSource.innerHTML;
        if (priceSource && priceDestination)
          priceDestination.innerHTML = priceSource.innerHTML;

        // Reload curtain-calculator.js
        const scripts = html.querySelectorAll('script[src*="curtain-calculator.js"]');
        if (scripts.length === 0) {
          console.warn('No curtain-calculator.js scripts found in response HTML');
        } else {
          scripts.forEach((script) => {
            const oldScript = document.querySelector(`script[src="${script.src}"]`);
            if (oldScript) oldScript.remove();

            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.defer = true;
            newScript.onload = () => console.log(`Script loaded: ${script.src}`);
            newScript.onerror = () => console.error(`Failed to load script: ${script.src}`);
            document.body.appendChild(newScript);
          });
        }

        this.setSavedOptions();
      });
  }

  updateOptionLegend(value) {
    const label = document.getElementById(
      `${this.dataset.section}-option-construction`
    );
    if (label && value && value !== 'undefined') {
      label.innerText = value;
    }
  }

  saveCurrentOptions() {
    // Get from URL?
    const params = Object.fromEntries(new URLSearchParams(location.search));
    this.savedOptions = params;
  }

  setSavedOptions() {
    // set the values first
    const constructionE = document.querySelector(
      `input[name="construction"][value='${this.savedOptions.construction}']`
    );

    if (constructionE) {
      constructionE.checked = true;
    } else {
      this.selects.setUnavailable();
    }

    const widthE = document.querySelector(
      `input[name="Width"][value='${this.savedOptions.width}']`
    );

    if (widthE) {
      widthE.checked = true;
    }

    const widthInputText = document.querySelector('input[name="properties[Width]"]');
    if (widthInputText) {
      if (this.savedOptions.widthRadio) {
        const widthRadio = document.querySelector(
          `input[name="Width"][value='${this.savedOptions.widthRadio}']`
        );
        if (widthRadio) {
          widthRadio.checked = true;
        }
      }
      widthInputText.value = this.savedOptions.width;
    }
    const widthInchesSelect = document.querySelector('#width-inches-options');
    const widthFractionSelect = document.querySelector('#width-fraction-options');
    if (widthInchesSelect && widthFractionSelect) {
      if (this.savedOptions.width) {
        const rounded = parseFloat(this.savedOptions.width)
        const integerPart = Math.trunc(rounded);
        const decimalPart = +(rounded - integerPart).toFixed(3);

        widthInchesSelect.value = integerPart;
        widthFractionSelect.value = decimalPart;
        if (document.querySelector('.product-form__input-width.product-form-roman .form__label span')) {
          document.querySelector('.product-form__input-width.product-form-roman .form__label span').innerText = this.savedOptions.width;
        }
        widthInchesSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    const lengthE = document.querySelector(
      `input[name="Length"][value='${this.savedOptions.lengthRadio}']`
    );

    if (lengthE) {
      lengthE.checked = true;
    }

    const lengthInput = document.querySelector('select[name="properties[Length]"]');
    if (lengthInput && this.savedOptions.length) {
      lengthInput.value = this.savedOptions.length;
    }

    const lengthInputText = document.querySelector('input[name="properties[Length]"]');
    if (lengthInputText && this.savedOptions.length) {
      lengthInputText.value = this.savedOptions.length;
    }

    const lengthInchesSelect = document.querySelector('#length-inches-options');
    const lengthFractionSelect = document.querySelector('#length-fraction-options');
    if (lengthInchesSelect && lengthFractionSelect) {
      if (this.savedOptions.length) {
        const roundedLength = parseFloat(this.savedOptions.length)
        const integerPartLength = Math.trunc(roundedLength);
        const decimalPartLength = +(roundedLength - integerPartLength).toFixed(3);

        lengthInchesSelect.value = integerPartLength;
        lengthFractionSelect.value = decimalPartLength;
        lengthInchesSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

    }

    const liningValue = this.savedOptions.lining;
    const liningE = document.querySelector(
      `input[name="properties[Lining]"][value='${liningValue}']`
    );
    if (liningE) {
      liningE.checked = true;
      if (liningValue) {
        const liningMessage = document.querySelector(`.lining-message-${liningValue.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
        if (liningMessage) {
          liningMessage.classList.remove('visually-hidden')
        }
      }

    }

    const trimStyleE = document.querySelector(
      `input[name="properties[Trim Style]"][value='${this.savedOptions.trimStyle}']`
    );
    if (trimStyleE) {
      trimStyleE.checked = true;
    }

    if (this.savedOptions.trimSide) {
      let trimSideE = document.querySelector(
        `input[name="properties[Trim]"][value='${this.savedOptions.trimSide}']`
      );
      if (this.savedOptions.trimSide.toLocaleLowerCase() != 'none') {
        if (document.body.classList.contains("template-product-roman-shade") ||
          document.body.classList.contains("template-product-cornice") ||
          document.body.classList.contains("template-product-valance") ||
          document.body.classList.contains("template-product-woven-wood")) {
          trimSideE = Array.from(document.querySelectorAll('input[name="properties[Trim]"]')).find(
            (trimSide) => trimSide.value != `None`
          )
        }
      } else {
        trimSideE = document.querySelector(
          `input[name="properties[Trim]"][value='${this.savedOptions.trimSide}']`
        );
      }

      if (trimSideE) {
        trimSideE.checked = true;
      }
    }

    const trimE = document.querySelector(
      `input[name="Trim"][value='${this.savedOptions.trimEl}'`
    );

    if (trimE) {
      trimE.checked = true;
    }

    let mountValue = this.savedOptions.mount;
    if (!this.savedOptions.mount) {
      mountValue = document.querySelector('input[name="properties[Mount]"]:checked');
    }
    const mountE = document.querySelector(
      `input[name="properties[Mount]"][value='${mountValue}']`
    );
    if (mountE) {
      mountE.checked = true;
      if (mountValue) {
        const mountMessage = document.querySelector(`.mount-message-${mountValue.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
        if (mountMessage) {
          mountMessage.classList.remove('visually-hidden')
        }
      }
    }

    const headRailE = document.querySelector(
      `input[name="properties[Headrail Depth]"][value='${this.savedOptions.headRail}']`
    );
    if (headRailE) {
      headRailE.checked = true;
    }

    const heightE = document.querySelector(
      `input[name="Height"][value='${this.savedOptions.heightRadio}']`
    );

    if (heightE) {
      heightE.checked = true;
    }

    const depthE = document.querySelector(
      `input[name="properties[Depth]"][value='${this.savedOptions.depth}']`
    );
    if (depthE) {
      depthE.checked = true;
    }

    const styleValue = this.savedOptions.style;
    const styleE = document.querySelector(
      `input[name="properties[Style]"][value='${styleValue}']`
    );
    if (styleE) {
      styleE.checked = true;
    }

    this.selects =
      document.querySelector("variant-radios") ||
      document.querySelector("variant-selects");
    this.trimOptions =
      document.querySelector("trim-radios") ||
      document.querySelector("variant-selects") ||
      document.querySelector("roman-shade-trim-radios") ||
      document.querySelector("valance-cornice-trim-radios") ||
      document.querySelector("woven-trim-radios");
    // let the other elements know values have changed
    this.selects.onVariantChange();
    if (this.trimOptions) {
      this.trimOptions.onRadioChange();
    }

    if (!this.savedOptions.construction) {
      const constructionOptionChecked = document.querySelector("input[name='construction']:checked");
      if (constructionOptionChecked) {
        this.savedOptions.construction = constructionOptionChecked.value;
      }
    }
    this.showTrimOption(this.savedOptions.construction);
  }

  showTrimOption(value) {
    this.trimOptions = document.querySelector("trim-radios") ||
      document.querySelector("variant-selects") ||
      document.querySelector("roman-shade-trim-radios") ||
      document.querySelector("valance-cornice-trim-radios");
    this.tripOptionsLegend = document.querySelector(".product-form__input-trim");
    this.rickRackTrimOption = document.querySelector('.product-form__input-rick-rack');
    this.rickRackOptions = document.querySelectorAll('.trim-rick-rack');
    this.bandTrimOption = document.querySelector('.product-form__input-band');

    this.bandOptions = document.querySelectorAll('.trim-option-band');
    this.rickRackOptions = document.querySelectorAll('.trim-rick-rack');
    if (!this.trimOptions) return;

    if (value.includes('Double Rod')) {
      this.trimOptions.classList.add('hidden');
      this.tripOptionsLegend.classList.add('hidden');
      const trimStyleE = document.querySelector(
        `input[name="properties[Trim Style]"][value='None']`
      );
      if (trimStyleE) {
        trimStyleE.checked = true;
      }

      const trimSideE = document.querySelector(
        `input[name="properties[Trim]"][value='None']`
      );
      if (trimSideE) {
        trimSideE.checked = true;
      }

      const trimE = document.querySelector(
        `input[name="Trim"][value='None']`
      );

      if (trimE) {
        trimE.checked = true;
      }

      this.updateMedia();
    } else if (value.includes('Relaxed')) {
      if (this.rickRackTrimOption) {
        this.rickRackTrimOption.classList.add('hidden');
      }
      if (this.rickRackOptions.length) {
        this.rickRackOptions.forEach((option) => {
          option.classList.add('hidden');
        })
      }

      const trimStyleE = document.querySelector(
        `input[name="properties[Trim Style]"]:checked`
      );
      if (trimStyleE.value.toLowerCase().indexOf('rick rack') > 0) {
        const trimStyleNone = document.querySelector(
          `input[name="properties[Trim Style]"][value='None']`
        );
        if (trimStyleNone) {
          trimStyleNone.click();
          trimStyleNone.checked = true;
        }
        const trimRadios = document.querySelector('roman-shade-trim-radios') || document.querySelector('valance-cornice-trim-radios');
        if (trimRadios) {
          trimRadios.onRadioChange();
        }
        this.updateMedia();
      }

    } else if (value.includes('Scalloped') || value.includes('Ribbed') || value.includes('Knife Pleat')) {
      if (this.rickRackTrimOption) {
        this.rickRackTrimOption.classList.add('hidden');
      }
      if (this.rickRackOptions.length) {
        this.rickRackOptions.forEach((option) => {
          option.classList.add('hidden');
        })
      }

      if (this.bandTrimOption) {
        this.bandTrimOption.classList.add('hidden');
      }
      if (this.bandOptions.length) {
        this.bandOptions.forEach((band) => {
          band.classList.add('hidden');
        })
      }
      const trimStyleE = document.querySelector(
        `input[name="properties[Trim Style]"]:checked`
      );
      if (trimStyleE.value.toLowerCase().indexOf('rick rack') > 0 || trimStyleE.value.toLowerCase().indexOf('band') > 0) {
        const trimStyleNone = document.querySelector(
          `input[name="properties[Trim Style]"][value='None']`
        );
        if (trimStyleNone) {
          trimStyleNone.click();
          trimStyleNone.checked = true;
        }

        const trimRadios = document.querySelector('roman-shade-trim-radios') || document.querySelector('.trim-radios-cornice-valance');
        if (trimRadios) {
          trimRadios.onRadioChange();
        }
        this.updateMedia();
      }
    } else {
      this.trimOptions.classList.remove('hidden');
      this.tripOptionsLegend.classList.remove('hidden');
      if (this.rickRackTrimOption) {
        this.rickRackTrimOption.classList.remove('hidden');
      }
      if (this.rickRackOptions.length) {
        this.rickRackOptions.forEach((option) => {
          option.classList.remove('hidden');
        })
      }
      if (this.bandTrimOption) {
        this.bandTrimOption.classList.remove('hidden');
      }
      if (this.bandOptions.length) {
        this.bandOptions.forEach((option) => {
          option.classList.remove('hidden');
        })
      }
    }

    // const trimFieldset = document.querySelector('.js.product-form__input-trim');
    // if (trimFieldset) {
    //   const trimDropdown = trimFieldset.closest('option-dropdown') 
    //                     || trimFieldset.querySelector('option-dropdown');
    //   if (trimDropdown && !trimDropdown.isOpen) {
    //     trimDropdown.open();
    //   }
    // }

    const trimSideNoneE = document.querySelector(`input[name="properties[Trim]"][value='None']`);
    const scallopedMessage = document.querySelector(`.construction-trim-message-scalloped`);

    if (value.includes('Scalloped') && document.querySelector(".template-product-woven-wood")) {
      trimSideNoneE.nextElementSibling.classList.add('hidden');
      if (scallopedMessage) {
        scallopedMessage.classList.remove('visually-hidden')
      }

      if (trimSideNoneE.checked) {
        const trimSideE = document.querySelector(`input[name="properties[Trim]"][value='Trim']`);
        if (trimSideE) {
          trimSideE.click();
          trimSideE.checked = true;
        }
      }
      const trimRadios = document.querySelector('roman-shade-trim-radios') || document.querySelector('.trim-radios-cornice-valance');
      if (trimRadios) {
        trimRadios.onRadioChange();
      }
      this.updateMedia();
      if (document.querySelector(`input[name="properties[Trim Style]"]`).checked) {
        document.querySelector(".trim-options .trim-options-message").classList.add('hidden');
      }
    } else {
      trimSideNoneE.nextElementSibling.classList.remove('hidden');
      document.querySelector(".trim-options .trim-options-message").classList.remove('hidden');
      if (scallopedMessage) {
        scallopedMessage.classList.add('visually-hidden');
      }
    }

    const trimGimp = document.querySelectorAll('.gimp-input');
    let selectTrim = "SELECT TRIM";
    let optionLegendWoven = document
      .querySelector("fieldset.product-form__input-trim")
      .querySelector("legend")
      .querySelector("span");
    if (document.querySelector('.template-product-woven-wood')) {
      optionLegendWoven.innerHTML = '<span class="option-not-selected">' + selectTrim + '</span>';
      if (value.includes('Flat')) {
        trimGimp.forEach(function (el) {
          el.classList.add('hidden');
          if (el.checked) {
            el.checked = false;
          }
        });
      } else {
        trimGimp.forEach(function (el) {
          el.classList.remove('hidden');
        });
      }
    }
  }

  handleizeText(text) {
    if (!text) return;
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  updateMedia() {
    // Product Pages
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");
    const isCompositeMedia = document.body.classList.contains("template-product-cafe-curtains");

    if (mainSlider && thumbnailSlider) {
      if (!thumbnailSlider.querySelectorAll("ul li").length) return;
      let baseString;
      if (isCompositeMedia) {
        baseString = `${this.handleizeText(this.savedOptions.construction)}`;
      } else {
        baseString = `${this.handleizeText(this.savedOptions.construction)}-${this.handleizeText(this.savedOptions.mount)}`;
      }
      if (this.savedOptions.style) {
        baseString = `${this.handleizeText(this.savedOptions.construction)}-${this.handleizeText(this.savedOptions.style)}-${this.handleizeText(this.savedOptions.mount)}`;
      }
      let imageBaseString = `${baseString}-none`;
      if (this.savedOptions.construction == 'Flat' && (this.savedOptions.trimStyle.includes('Band') || this.savedOptions.trimStyle.includes('Rick Rack')) && !document.body.classList.contains("template-product-woven-wood")) {
        imageBaseString = `${this.handleizeText(construction)}-${this.handleizeText(mount)}-tail-none`;
      }
      let imageNoneMain = mainSlider.querySelector(
        `[data-variant="${imageBaseString}"]`
      );
      if (imageNoneMain) {
        mainSlider?.querySelectorAll("ul.slider li")?.forEach((slide) => {
          slide.classList.remove('is-active');
        })
        imageNoneMain.classList.add("is-active");
        mainSlider?.querySelector("ul").scroll({
          top: 0,
          left: imageNoneMain.offsetLeft,
        });
      } else {
        imageNoneMain = thumbnailSlider.querySelector("ul li:first-child");
        imageNoneMain.click();
      }

      const imageNoneThumbnail = thumbnailSlider.querySelector(
        `[data-variant="${imageBaseString}"]`
      );

      if (imageNoneThumbnail) {
        thumbnailSlider.querySelectorAll("ul.slider li").forEach((thumbnail) => {
          thumbnail.classList.remove('is-active');
        })
        thumbnailSlider.querySelectorAll('ul.slider li[data-variant]').forEach((thumbnail) => {
          thumbnail.classList.add("product__media-item--additional-image");
        })
        imageNoneThumbnail.classList.remove('product__media-item--additional-image');
        imageNoneThumbnail.classList.add("is-active");
        thumbnailSlider.querySelector("ul").scroll({
          top: 0,
          left: imageNoneThumbnail.offsetLeft,
        });
      }

      if (window.matchMedia(`(min-width: 40em)`).matches) return;
      window.scroll({
        top: mainSlider.offsetTop - 72,
      });
    }
  }
}
customElements.define("child-radios", ChildRadios);

class ConstructionRadios extends ChildRadios {
  constructor() {
    super();
  }
}
customElements.define("construction-radios", ConstructionRadios);

class CafeConstructionRadios extends ChildRadios {
  constructor() {
    super();
  }
}
customElements.define("cafe-construction-radios", CafeConstructionRadios);

class ShowerLiningRadios extends ChildRadios {
  constructor() {
    super();
    this.liningChecked = this.querySelector('[name="lining"]:checked');
    if (!this.liningChecked) {
      this.selects =
        document.querySelector("variant-radios") ||
        document.querySelector("variant-selects");
      if (this.selects) {
        this.selects.toggleAddButton(true, "", true);
        this.selects.setUnavailable();
      }

    }

  }

  // connectedCallback() {
  //   this.saveCurrentOptions();
  //   if (this.savedOptions.lining) {
  //     this.renderProductSelects(
  //       document.querySelector(
  //         `input[name="lining"][value='${this.savedOptions.lining}']`
  //       ).dataset.url
  //     );
  //   }
  //   this.updateOptionLegend(this.savedOptions.lining);
  //   this.updateHelperText(this.savedOptions.lining);
  // }

  connectedCallback() {
    this.saveCurrentOptions();

    const liningVal = this.savedOptions.lining;
    const liningInput = (liningVal && liningVal !== 'undefined')
      ? document.querySelector(`input[name="lining"][value='${liningVal}']`)
      : null;

    if (liningInput) {
      this.renderProductSelects(liningInput.dataset.url);
    } else {
      this.selects.setUnavailable();
    }

    const safeLining = (liningVal && liningVal !== 'undefined') ? liningVal : null;
    this.updateOptionLegend(safeLining);
    this.updateHelperText(safeLining);
  }

  updateOptionLegend(value) {
    const label = document.getElementById(
      `${this.dataset.section}-option-sc-lining`
    );
    if (label && value) {
      label.innerText = value;

      this.liningHelperSCTexts = this.querySelectorAll('.lining-message');
      if (this.liningHelperSCTexts.length) {
        this.liningHelperSCTexts.forEach((message) => {
          message.classList.add('visually-hidden');
        })
        const valueLowerCase = value.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        this.querySelector(`.lining-message-${valueLowerCase}`)?.classList.remove('visually-hidden');
      }
    }
  }

  setSavedOptions() {
    const liningE = document.querySelector(
      `input[name="lining"][value='${this.savedOptions.lining}']`
    );
    if (liningE) {
      liningE.checked = true;

      const liningValue = this.savedOptions.lining;
      if (liningValue) {
        const liningMessage = document.querySelector(`.lining-message-${liningValue.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
        if (liningMessage) {
          liningMessage.classList.remove('visually-hidden');
        }
      }
    }

    const lengthSelect = document.querySelector(`select[name="properties[Length]"]`);
    if (lengthSelect) {
      lengthSelect.value = this.savedOptions.length;
    }

    const widthE = document.querySelector(
      `input[name="Width"][value='${this.savedOptions.width}']`
    );
    if (widthE) {
      widthE.checked = true;
    }

    const trimStyleE = document.querySelector(`input[name="properties[Trim Style]"][value='${this.savedOptions.trimStyle}']`);
    if (trimStyleE) {
      trimStyleE.checked = true;
    }

    const trimSideE = document.querySelector(`input[name="properties[Trim]"][value='${this.savedOptions.trimSide}']`);
    if (trimSideE) {
      trimSideE.checked = true;
    }

    const trimE = document.querySelector(`input[name="Trim"][value='${this.savedOptions.trimEl}']`);
    if (trimE) {
      trimE.checked = true;
    }

    this.selects =
      document.querySelector("variant-radios") ||
      document.querySelector("variant-selects");
    this.trimOptions =
      document.querySelector("shower-curtain-trim-radios") ||
      document.querySelector("variant-selects");
    this.selects.onVariantChange();
    if (this.trimOptions) {
      this.trimOptions.onRadioChange();
    }
  }
}

customElements.define("shower-lining-radios", ShowerLiningRadios);
