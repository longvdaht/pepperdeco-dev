// Hide validation error messages as soon as the user changes any option,
// so a message like "Please select: mount option first" doesn't stay on screen
// after the user has acted on it. Clicking Add to cart re-validates anyway.
if (!window.__errorMessageAutoClearBound) {
  window.__errorMessageAutoClearBound = true;
  const clearErrorMessages = (e) => {
    // Ignore programmatic change events so an error shown by code isn't cleared instantly
    if (!e.isTrusted) return;
    const el = e.target;
    if (!el.matches || !el.matches("input, select, textarea")) return;

    document
      .querySelectorAll(".product-form__error-message-wrapper:not([hidden])")
      .forEach((wrapper) => wrapper.setAttribute("hidden", ""));

    const modal = el.closest("embroidery-options, details-modal-embroidery");
    if (modal) {
      modal
        .querySelectorAll(
          ".embroidery-modal__error-message-wrapper:not([hidden]), .embroidery__error-message-wrapper:not([hidden])"
        )
        .forEach((wrapper) => wrapper.setAttribute("hidden", ""));
    }
  };
  document.addEventListener("change", clearErrorMessages);
  document.addEventListener("input", clearErrorMessages);
}

if (!customElements.get("product-form")) {
  customElements.define(
    "product-form",
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector("form");
        if (!this.form) return;
        this.form.querySelector("[name=id]").disabled = false;
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.header = document.querySelector("sticky-header");
        this.cartDrawer = document.querySelector("cart-drawer");
        this.formCurtain = this.querySelector(
          ".template-product-curtains .form, .template-product-cafe-curtains .form, .template-product-sheer-curtain .form"
        );

        if (!this.formCurtain) return;

        this.formCurtain.setAttribute('novalidate', 'novalidate');
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        const submitButton = this.querySelector('[type="submit"]');

        const trimSide = document.querySelector(
          '[name="properties[Trim]"]:checked'
        );
        const trimOption = document.querySelector(
          '[name="properties[Trim Style]"]:checked'
        );
        this.rushShipping = document.querySelector(
          '[name="properties[Rush Processing]"]:checked'
        );
        this.colorMatching = document.querySelector(
          '[name="properties[_color_matching]"]:checked'
        );
        this.colorMatchOrder = document.querySelector(
          '[name="properties[Color Match Order]"]'
        );
        this.embroidery = document.querySelector(
          'input[name="properties[_Embroidery]"][value="true"]'
        )?.checked;
        this.embroideryId = document.querySelector(
          'input[name="properties[_Embroidery]"][value="true"]'
        )?.dataset?.embroideryId;

        this.baseOptionChecked = document.querySelector(
          '[name="Base"]:checked'
        );
        this.woodFinishOptions = document.querySelectorAll(
          '[name="properties[Wood Finish]"]'
        );
        this.woodFinishOptionChecked = document.querySelector(
          '[name="properties[Wood Finish]"]:checked'
        );
        this.furnitureSize = document.querySelector(
          '[name="Size"]'
        );
        this.furnitureSizeChecked = document.querySelector(
          '[name="Size"]:checked'
        );

        const pipingSide = document.querySelector(
          '[name="Trim Side"]:checked'
        );
        const pipingOption = document.querySelector(
          '[name="properties[Trim]"]:checked'
        );

        this.handleErrorMessage();

        this.constructionOptions = document.querySelectorAll('[name="construction"]');
        if (this.constructionOptions.length) {
          this.constructionOptionChecked = document.querySelector('[name="construction"]:checked');
          if (!this.constructionOptionChecked) {
            this.handleErrorMessage("Please select: construction option");
            const constructionDropdown = document.querySelector('[data-dropdown-key="construction"]');
            if (constructionDropdown && !constructionDropdown.isOpen) {
              constructionDropdown.open();
            }
            return;
          }
        }

        const trimDropdown = document.querySelector('[data-dropdown-key="trim"]');

        if (!trimSide && document.querySelectorAll('.product-form__input-trim [name="properties[Trim]"]').length) {
          this.handleErrorMessage("Please select: trim");
          if (trimDropdown && !trimDropdown.isOpen) {
            trimDropdown.open();
          }
          return;
        }

        if (!trimOption && document.querySelectorAll('.product-form__input-trim [name="properties[Trim Style]"]').length) {
          this.handleErrorMessage("Please select: trim style");
          if (trimDropdown && !trimDropdown.isOpen) {
            trimDropdown.open();
          }
          return;
        }
        
        if (trimSide && trimOption) {
          if (!this.validateTrimSide(trimSide, trimOption)) {
            this.handleErrorMessage("Please select: trim");
            if (trimDropdown && !trimDropdown.isOpen) {
              trimDropdown.open();
            }
            return;
          }
          if (!this.validateTrimStyle(trimSide, trimOption)) {
            this.handleErrorMessage("Please select: trim style");
            if (trimDropdown && !trimDropdown.isOpen) {
              trimDropdown.open();
            }
            return;
          }
          if (document.querySelector('.template-product-woven-wood') && this.constructionOptionChecked) {
            if (this.constructionOptionChecked.value == 'Flat' && trimOption.classList.contains('gimp-input')) {
              this.handleErrorMessage("Please select: trim style");
              if (trimDropdown && !trimDropdown.isOpen) {
                trimDropdown.open();
              }
              return;
            } else if (this.constructionOptionChecked.value != 'Flat' && !trimOption.classList.contains('gimp-input')) {
              this.handleErrorMessage("Please select: trim style");
              if (trimDropdown && !trimDropdown.isOpen) {
                trimDropdown.open();
              }
              return;
            }
          }
        }

        if (!pipingSide && document.querySelectorAll('.product-form__input-trim [name="properties[Trim Side]"]').length) {
          this.handleErrorMessage("Please select: trim");
          if (trimDropdown && !trimDropdown.isOpen) {
            trimDropdown.open();
          }
          return;
        }

        if (!pipingOption && document.querySelectorAll('.product-form__input-trim [name="properties[Trim]"]').length) {
          this.handleErrorMessage("Please select: trim style");
          if (trimDropdown && !trimDropdown.isOpen) {
            trimDropdown.open();
          }
          return;
        }

        if (pipingSide && pipingOption) {
          if (!this.validateTrimSide(pipingSide, pipingOption)) {
            this.handleErrorMessage("Please select: trim");
            if (trimDropdown && !trimDropdown.isOpen) {
              trimDropdown.open();
            }
            return;
          }
          if (!this.validateTrimStyle(pipingSide, pipingOption)) {
            this.handleErrorMessage("Please select: trim style");
            if (trimDropdown && !trimDropdown.isOpen) {
              trimDropdown.open();
            }
            return;
          }
        }

        this.weltOptionChecked = document.querySelector(
          '.product-form__input-welt [name="properties[Trim]"]:checked'
        );
        if (!this.weltOptionChecked && document.querySelectorAll('.product-form__input-welt [name="properties[Trim]"]').length) {
          this.handleErrorMessage("Please select: Trim");
          const weltDropdown = document.querySelector('[data-dropdown-key="welt"]');
          if (weltDropdown && !weltDropdown.isOpen) {
            weltDropdown.open();
          }
          return;
        }


        // if (this.colorMatching && !this.colorMatchOrder.value) {
        //   this.handleErrorMessage("Please enter previous order number");
        //   this.colorMatchOrder.focus();
        //   return;
        // } else if (!this.colorMatching && this.colorMatchOrder) {
        //   this.colorMatchOrder.value = "";
        // }
        if (this.colorMatching && this.colorMatchOrder) {
          this.colorMatchOrder.setAttribute("required", "required");

          if (!this.colorMatchOrder.checkValidity()) {
            this.colorMatchOrder.reportValidity();
            return;
          }
        } else if (this.colorMatchOrder) {
          this.colorMatchOrder.removeAttribute("required");
          this.colorMatchOrder.value = "";
        }

        // if (this.woodFinishOptions.length) {
        //   if (this.baseOptionChecked && !this.baseOptionChecked.value.toLowerCase().includes('kick pleat skirt') && !this.baseOptionChecked.value.toLowerCase().includes('upholstered base')) {
        //     if (!this.woodFinishOptionChecked) {
        //       this.handleErrorMessage("Please select: leg color");
        //     }
        //   }
        // } 

        if (this.form.classList.contains('product-form__furniture') && this.furnitureSize.length) {
          if (!this.furnitureSizeChecked) {
            this.handleErrorMessage("Please select: size");
          }
        }

        this.widthInchesSelect = document.querySelector('#width-inches-options');
        if (this.widthInchesSelect) {
          const widthFieldset = document.querySelector('.js.product-form__input-width');
          if (widthFieldset) {
            const widthDropdown = widthFieldset.closest('option-dropdown')
              || widthFieldset.querySelector('option-dropdown');
            if (widthDropdown && !widthDropdown.isOpen) {
              widthDropdown.open();
            }
          }

          if (!this.widthInchesSelect.value) {
            this.handleErrorMessage("Please select: width");
            return;
          }
        }

        this.lengthInchesSelect = document.querySelector('#length-inches-options');
        if (this.lengthInchesSelect) {
          const lengthFieldset = document.querySelector('.js.product-form__input-length');
          if (lengthFieldset) {
            const lengthDropdown = lengthFieldset.closest('option-dropdown')
              || lengthFieldset.querySelector('option-dropdown');
            if (lengthDropdown && !lengthDropdown.isOpen) {
              lengthDropdown.open();
            }
          }

          if (!this.lengthInchesSelect.value) {
            this.handleErrorMessage("Please select: length");
            return;
          }
        }

        const lengthInput = document.querySelector('#length');

        if (lengthInput && !lengthInput.checkValidity()) {
          const dropdown = lengthInput.closest('option-dropdown');

          if (dropdown && typeof dropdown.open === 'function' && !dropdown.isOpen) {
            dropdown.open();
          }

          lengthInput.reportValidity();
          lengthInput.focus();

          return;
        }

        this.liningOptions = document.querySelectorAll(
          '[name="lining"]'
        );
        if (this.liningOptions.length) {
          this.liningOptionChecked = document.querySelector(
            '[name="lining"]:checked'
          );
          if (!this.liningOptionChecked) {
            this.handleErrorMessage("Please select: lining");
            const liningDropdown = document.querySelector('[data-dropdown-key="lining"]') || document.querySelector('[data-dropdown-key="sc-lining"]');
            if (liningDropdown && !liningDropdown.isOpen) {
              liningDropdown.open();
            }
            return;
          }
        }

        this.styleOptions = document.querySelectorAll('[name="properties[Style]"]');
        if (this.styleOptions.length) {
          this.styleOptionChecked = document.querySelector('[name="properties[Style]"]:checked');
          if (!this.styleOptionChecked) {
            const styleFieldset = document.querySelector('.product-form__input-style');
            const styleDropdown = styleFieldset?.querySelector('option-dropdown')
              || styleFieldset?.closest('option-dropdown');
            if (styleDropdown && !styleDropdown.isOpen) {
              styleDropdown.open();
            }
            this.handleErrorMessage("Please select: style");
            return;
          }
        }

        this.mountOptions = document.querySelectorAll(
          '[name="properties[Mount]"]'
        );

        if (this.mountOptions.length) {
          this.mountOptionChecked = document.querySelector(
            '[name="properties[Mount]"]:checked'
          );
          if (!this.mountOptionChecked) {
            const mountDropdown = document.querySelector('[data-dropdown-key="mount"]');
            if (mountDropdown && !mountDropdown.isOpen) {
              mountDropdown.open();
            }
            this.handleErrorMessage("Please select: mount");
            return;
          }
        }

        this.depthOptions = document.querySelectorAll(
          '[name="properties[Depth]"]'
        );
        if (this.depthOptions.length) {
          this.depthOptionChecked = document.querySelector(
            '[name="properties[Depth]"]:checked'
          );
          if (!this.depthOptionChecked) {
            this.handleErrorMessage("Please select: depth");
            const depthDropdown = document.querySelector('[data-dropdown-key="depth"]');
            if (depthDropdown && !depthDropdown.isOpen) {
              depthDropdown.open();
            }
            return;
          }
        }

        this.headRailOptions = document.querySelectorAll(
          '[name="properties[Headrail Depth]"]'
        );

        if (this.headRailOptions.length) {
          this.headRailOptionChecked = document.querySelector(
            '[name="properties[Headrail Depth]"]:checked'
          );
          if (!this.headRailOptionChecked) {
            this.handleErrorMessage("Please select: headrail depth");
            const headRailDropdown = document.querySelector('[data-dropdown-key="headrail"]');
            if (headRailDropdown && !headRailDropdown.isOpen) {
              headRailDropdown.open();
            }
            return;
          }
        }

        this.liningPPOptions = document.querySelectorAll(
          '[name="properties[Lining]"]'
        );
        if (this.liningPPOptions.length) {
          this.liningPPOptionChecked = document.querySelector(
            '[name="properties[Lining]"]:checked'
          );
          if (!this.liningPPOptionChecked) {
            this.handleErrorMessage("Please select: lining");
            const liningPPDropdown = document.querySelector('[data-dropdown-key="lining"]');
            if (liningPPDropdown && !liningPPDropdown.isOpen) {
              liningPPDropdown.open();
            }
            return;
          }
        }

        this.featherInsert = document.querySelectorAll(
          '[name="Feather/Down Insert"]'
        );
        if (this.featherInsert.length) {
          this.featherInsertChecked = document.querySelector(
            '[name="Feather/Down Insert"]:checked'
          );
          if (!this.featherInsertChecked) {
            this.handleErrorMessage("Please select: Feather/Down Insert");
            const featherDropdown = document.querySelector('[data-dropdown-key="feather-down-insert"]');
            if (featherDropdown && !featherDropdown.isOpen) {
              featherDropdown.open();
            }
            return;
          }
        }

        // this.baseOptions = document.querySelectorAll('[name="Base"]');
        // if (this.baseOptions.length) {
        //   this.baseOptionChecked = document.querySelector('[name="Base"]:checked');
        //   if (!this.baseOptionChecked) {
        //     this.handleErrorMessage("Please select: base");
        //     return;
        //   }
        // }

        // this.detailOptions = document.querySelectorAll('[name="Detail"]');
        // if (this.detailOptions.length) {
        //   this.detailOptionChecked = document.querySelector('[name="Detail"]:checked');
        //   if (!this.detailOptionChecked) {
        //     this.handleErrorMessage("Please select: detail");
        //     return;
        //   }
        // }

        this.baseOptions = document.querySelectorAll('[name="bed-base-option"]');
        if (this.baseOptions.length) {
          this.baseOptionChecked = document.querySelector('[name="bed-base-option"]:checked');
          if (!this.baseOptionChecked) {
            this.handleErrorMessage("Please select: base construction");

            const baseFieldset = document.querySelector('[name="bed-base-option"]')?.closest('.product-form__input')
              || document.querySelector('.product-form__input-bed-base');
            if (baseFieldset) {
              const baseDropdown = baseFieldset.closest('option-dropdown')
                || baseFieldset.querySelector('option-dropdown');
              if (baseDropdown && !baseDropdown.isOpen) {
                baseDropdown.open();
              }
            }
            return;
          }
        }

        this.seatOptions = document.querySelectorAll('[name="Seat"]');
        if (this.seatOptions.length) {
          this.seatOptionChecked = document.querySelector('[name="Seat"]:checked');
          if (!this.seatOptionChecked) {
            this.handleErrorMessage("Please select: seat");
            return;
          }
        }

        this.woodFinishOptions = document.querySelectorAll('[name="properties[Wood Finish]"]');
        if (this.woodFinishOptions.length) {
          this.woodFinishOptionChecked = document.querySelector('[name="properties[Wood Finish]"]:checked');
          if (this.baseOptionChecked && !this.baseOptionChecked.value.toLowerCase().includes('kick pleat skirt') && !this.baseOptionChecked.value.toLowerCase().includes('upholstered base')) {
            if (!this.woodFinishOptionChecked) {
              this.handleErrorMessage("Please select: wood finish");

              const legFieldset = document.querySelector('[name="properties[Wood Finish]')?.closest('.product-form__input')
                || document.querySelector('.product-form__input-bed-base');
              if (legFieldset) {
                const legDropdown = legFieldset.closest('option-dropdown')
                  || legFieldset.querySelector('option-dropdown');
                if (legDropdown && !legDropdown.isOpen) {
                  legDropdown.open();
                }
              }
              return;
            }
          }
        }

        submitButton.setAttribute("aria-disabled", true);
        submitButton.classList.add("loading");

        if (this.embroidery && this.embroideryId) {
          const config = fetchConfig("javascript");
          config.headers["X-Requested-With"] = "XMLHttpRequest";
          delete config.headers["Content-Type"];

          const formData = new FormData(this.form);
          formData.append(
            "sections",
            this.cartDrawer?.getSectionsToRender().map((section) => section.id)
          );
          formData.append("sections_url", window.location.pathname);

          // Bed platform → add as property on main product
          const bedRadioChecked = document.querySelector('.bed-platform-checkbox:checked');
          if (bedRadioChecked) {
            const bedLabel = document.querySelector('label[for="' + bedRadioChecked.id + '"]');
            const bedTitle = bedLabel ? bedLabel.textContent.trim() : '';
            const bedPriceCents = parseInt(bedRadioChecked.dataset.price || 0);
            let bedTitleWithPrice = bedTitle;

            if (bedPriceCents > 0) {
              const bedPriceFormatted = '$' + (bedPriceCents / 100).toFixed(2).replace(/\.00$/, '');
              bedTitleWithPrice = bedTitle + ' +' + bedPriceFormatted;
              formData.append('properties[_Base Construction Price]', bedPriceFormatted);
            }
            formData.append('properties[Base Construction]', bedTitleWithPrice);
            const bedSize = bedRadioChecked.dataset.name;
            if (bedSize) {
              formData.append('properties[_Base Construction Size]', bedSize);
            }
          }

          config.body = formData;

          fetch(`${routes.cart_add_url}`, config)
            .then((response) => response.json())
            .then((response) => {
              if (response.status) {
                this.handleErrorMessage(response.description);
                return;
              }
              return {
                id: response.id,
                key: response.key,
                title: response.product_title,
                variant_title: response.variant_title,
                type: response.product_type,
                quantity: response.quantity,
              };
            })
            .then((product) => {
              const items = [];
              // Bed platform: add item has price > 0
              const bedRadioChecked = document.querySelector('.bed-platform-checkbox:checked');
              if (bedRadioChecked && parseInt(bedRadioChecked.dataset.price) > 0) {
                const bedConstructionQty = parseInt(document.querySelector('.product-form__furniture input[name="quantity"]').value);
                items.push({
                  id: bedRadioChecked.dataset.variantId,
                  quantity: bedConstructionQty,
                  properties: {
                    _parent_product_id: this.product.id,
                    _parent_variant: this.product.variant_title,
                    _parent_key: this.product.key,
                    _is_platform: true,
                    _is_warranty: true,
                    _hidden: true
                  }
                });
              }
              if (this.embroidery) {
                items.push({
                  id: parseFloat(this.embroideryId),
                  quantity: product.quantity,
                  properties: {
                    _product_id: product.id,
                    _variant_id: product.variant_title,
                    _product_title: product.title,
                  },
                });
              }
              if (items.length > 0) {
                const additionalProductsConfig = fetchConfig("javascript");
                additionalProductsConfig.body = JSON.stringify({
                  items: items,
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
                    if (document.querySelector("embroidery-options")) {
                      document
                        .querySelector("embroidery-options")
                        .toggleLoading();
                    }
                    this.cartDrawer?.fetchAndOpenCart();
                  });
              } else {
                return;
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              if (!this.embroidery) {
                this.cartDrawer?.fetchAndOpenCart();
              }
              submitButton.classList.remove("loading");
              submitButton.removeAttribute("aria-disabled");
            });
        } else {
          const config = fetchConfig("javascript");
          config.headers["X-Requested-With"] = "XMLHttpRequest";
          delete config.headers["Content-Type"];

          const formData = new FormData(this.form);
          formData.append(
            "sections",
            this.cartDrawer?.getSectionsToRender().map((section) => section.id)
          );
          formData.append("sections_url", window.location.pathname);

          // Bed platform → add as property on main product
          const bedRadioChecked = document.querySelector('.bed-platform-checkbox:checked');
          if (bedRadioChecked) {
            const bedLabel = document.querySelector('label[for="' + bedRadioChecked.id + '"]');
            const bedTitle = bedLabel ? bedLabel.textContent.trim() : '';
            const bedPriceCents = parseInt(bedRadioChecked.dataset.price || 0);
            let bedTitleWithPrice = bedTitle;

            if (bedPriceCents > 0) {
              const bedPriceFormatted = '$' + (bedPriceCents / 100).toFixed(2).replace(/\.00$/, '');
              bedTitleWithPrice = bedTitle + ' +' + bedPriceFormatted;
              formData.append('properties[_Base Construction Price]', bedPriceFormatted);
            }
            formData.append('properties[Base Construction]', bedTitleWithPrice);
            const bedSize = bedRadioChecked.dataset.name;
            if (bedSize) {
              formData.append('properties[_Base Construction Size]', bedSize);
            }
          }

          let customPiping = false;
          for (var pair of formData.entries()) {
            if (pair[0] === "properties[_piping_custom]" && pair[1] === "true") {
              customPiping = true;
              break;
            }
          }
          for (var pair of formData.entries()) {
            if ((pair[0] === "properties[_Embroidery]" && pair[1] === "false") && !customPiping) {
              formData.append("properties[_customized_image]", "");
            }
          }
          config.body = formData;

          fetch(`${routes.cart_add_url}`, config)
            .then((response) => response.json())
            .then((response) => {
              if (response.status) {
                this.handleErrorMessage(response.description);
                return;
              }
              this.product = {
                id: response.id,
                key: response.key,
                title: response.title,
                variant_title: response.variant_title,
                type: response.product_type,
                quantity: response.quantity
              };
            })
            .then(() => {
              const items = [];
              // Bed platform: add item has price > 0
              const bedRadioChecked = document.querySelector('.bed-platform-checkbox:checked');
              if (bedRadioChecked && parseInt(bedRadioChecked.dataset.price) > 0) {
                const bedConstructionQty = parseInt(document.querySelector('.product-form__furniture input[name="quantity"]').value);
                items.push({
                  id: bedRadioChecked.dataset.variantId,
                  quantity: bedConstructionQty,
                  properties: {
                    _parent_product_id: this.product.id,
                    _parent_variant: this.product.variant_title,
                    _parent_key: this.product.key,
                    _is_warranty: true,
                    _is_platform: true,
                    _hidden: true
                  }
                });
              }
              if (this.rushShipping) {
                items.push({
                  id: this.rushShipping.dataset.product,
                  quantity: 1,
                  properties: {
                    _product_id: this.product.id,
                    _product_title: this.product.title,
                    "Rush Processing": this.product.title,
                  },
                });
              }
              let quantity_product = 20;
              if (this.product.variant_title) {
                if (this.product.variant_title.match(/\d+/)) {
                  quantity_product = this.product.variant_title.match(/\d+/)[0];
                }
              }
              if ((this.product.type === "Wallpaper") && (this.product.variant_title?.includes('Panels')) && parseInt(this.product.quantity) <= 5) {
                items.push({
                  id: 40628503150652,
                  quantity: 1,
                  properties: {
                    _product_id: this.product.id,
                    _product_title: this.product.title,
                    "Setup Fee": this.product.title,
                  },
                });
              } else if (
                (this.product.type === "Wallpaper") &&
                parseInt(quantity_product) < 20 && !(this.product.variant_title?.includes('Panels'))
              ) {
                items.push({
                  id: 40628503150652,
                  quantity: 1,
                  properties: {
                    _product_id: this.product.id,
                    _product_title: this.product.title,
                    "Setup Fee": this.product.title,
                  },
                });
              }
              if (items.length > 0) {
                const additionalProductsConfig = fetchConfig("javascript");
                additionalProductsConfig.body = JSON.stringify({
                  items: items,
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
                    this.cartDrawer?.fetchAndOpenCart();
                  });
              } else {
                return;
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              let quantity_product = 20;
              if (this.product.variant_title) {
                if (this.product.variant_title.match(/\d+/)) {
                  quantity_product = this.product.variant_title.match(/\d+/)[0];
                }
              }

              if (
                !this.rushShipping ||
                ((this.product.type === "Wallpaper") &&
                  parseInt(quantity_product) < 20)
              ) {
                this.cartDrawer?.fetchAndOpenCart();
              }
              submitButton.classList.remove("loading");
              submitButton.removeAttribute("aria-disabled");
            });
        }
      }

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );

        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      validateTrimStyle(trimSide, trimOption) {
        // console.log(trimSide, trimOption);
        if (
          trimSide.value.toLowerCase() === "none" &&
          trimOption.value.toLowerCase() === "none"
        )
          return true;
        if (
          trimSide.value.toLowerCase() !== "none" &&
          trimOption.value.toLowerCase() === "none"
        ) {
          return false;
        }
        return true;
      }

      validateTrimSide(trimSide, trimOption) {
        // console.log(trimSide, trimOption);
        if (
          trimOption.value.toLowerCase() !== "none" &&
          trimSide.value.toLowerCase() === "none"
        )
          return false;
        return true;
      }
    }
  );
}

const thumbnailSlider = document.querySelector(".thumbnail-slider");
const mainSlider = document.querySelector(".main-images-slider");

if (thumbnailSlider && mainSlider) {
  const thumbnailImages = thumbnailSlider.querySelectorAll("li");
  thumbnailImages.forEach((thumbnail) => {
    thumbnail.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      const mediaId = li.dataset.mediaId;
      thumbnailImages.forEach((thumbnail) => {
        thumbnail.classList.remove("is-active");
      });
      li.classList.add("is-active");
      mainSlider.querySelector("ul").scroll({
        top: 0,
        left: mainSlider.querySelector(`li[data-media-id="${mediaId}"]`)
          .offsetLeft,
      });
    });
  });
}

if (document.body.classList.contains("template-product-swatches")) {
  const swatchSlider = document.querySelector(
    "slider-component.thumbnail-swatches"
  );
  const swatchThumbnails = document.querySelectorAll(".thumbnail-swatches li");
  swatchThumbnails.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      const parent = e.target.closest("li").parentElement;
      const index = Array.from(parent.children).findIndex(
        (el) => el === e.target.closest("li")
      );
      const select = document.querySelector(`select[name="options[Pattern]"]`);
      select.selectedIndex = index;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  swatchSlider.slider.addEventListener("scroll", function (e) {
    const atSnappingPoint = e.target.scrollLeft % e.target.offsetWidth === 0;
    const timeOut = atSnappingPoint ? 0 : 150; //see notes

    clearTimeout(e.target.scrollTimeout); //clear previous timeout

    e.target.scrollTimeout = setTimeout(function () {
      const index = swatchSlider.currentPage - 1;
      const select = document.querySelector(`select[name="options[Pattern]"]`);
      if (select.selectedIndex == index) return;
      select.selectedIndex = index;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }, timeOut);
  });
}