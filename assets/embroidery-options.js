class EmbroideryOptions extends HTMLElement {
  constructor() {
    super();
    this.section = this.dataset.section;
    this.modal = this.closest("details-modal-embroidery");
    this.loadingOverlay = this.querySelector(".loading-overlay");
    this.imageWrapper = this.querySelector("image-wrapper");
    this.pillowSizes = this.querySelectorAll(`#pillow-size-${this.section}`);
    this.personalizationHelper = this.querySelector("#personalization-helper");

    this.helperText = {
      Monogram: "3 Letters—First Initial, Last Initial, Middle Initial",
      Text: "1-15 Characters—letters, numbers, or keyboard symbols",
    };

    this.inputs = {
      embroideryBuy: this.querySelector("#embroidery_price"),
      productForm: document.querySelector("product-form")?.form,
      customizedImage: this.querySelector(
        'input[name="properties[_customized_image]"]'
      ),
      captureButton: this.querySelector("#embroidery-capture-and-validate"),
      embroidery: this.querySelectorAll(
        'input[name="properties[_Embroidery]"]'
      ),
      embroideryType: this.querySelectorAll(
        'input[name="properties[_Embroidery Type]"]'
      ),
      colors: this.querySelectorAll(
        'input[name="properties[Embroidery Color]"]'
      ),
      typefaces: this.querySelectorAll('input[name="properties[Typeface]"]'),
      personalization: this.querySelector(
        'input[name="properties[Personalization]"]'
      ),
      confirmation: this.querySelector(
        'input[name="properties[_Embroidery Acknowledgement]"][type="checkbox"]'
      ),
      maxWidth: this.querySelector('input[name="properties[_Max Width]"]'),
      maxHeight: this.querySelector('input[name="properties[_Max Height]"]'),
    };

    this.addEventListener("change", this.handleChange);
    this.inputs?.personalization?.addEventListener(
      "input",
      this.handleChange.bind(this)
    );
    this.inputs?.personalization?.addEventListener(
      "blur",
      this.scrollModalToTop.bind(this)
    );

    this.inputs?.captureButton?.addEventListener(
      "click", 
      this.validationOptions.bind(this)
    );
    if (this.modal) {
      this.modal.addEventListener("modal-open", this.setup.bind(this));
      this.modal.addEventListener("modal-close", this.clearAll.bind(this));
    }

    this.pipingOptionWrapper = this.querySelector('.welf-options .trim-options.product-form__input');
    
    this.setMobile();

    window.addEventListener("resize", debounce(this.setMobile.bind(this), 300));

    this.pouch = false;

    // Note: make sure to use handleize when looking up
    this.LOOKUP_TABLES = {
      Monogram: {
        "makeup-bag": {
          cornelia: {
            height: 2.25,
            displaySize: 32,
          },
          ludlow: {
            height: 2.25,
            displaySize: 15,
          },
          "love-lane": {
            height: 2.25,
            displaySize: 16,
          },
          bowery: {
            height: 2.25,
            displaySize: 20,
          },
          mulberry: {
            height: 2.25,
            displaySize: 11,
          },
        },
        "18-square": {
          cornelia: {
            height: 4.8,
            displaySize: 42,
          },
          "love-lane": {
            height: 5.5,
            displaySize: 18,
          },
          bowery: {
            height: 6.5,
            displaySize: 28,
          },
          mulberry: {
            height: 5.8,
            displaySize: 13,
          },
        },
        "20-square": {
          cornelia: {
            height: 4.9,
            displaySize: 42,
          },
          "love-lane": {
            height: 5.7,
            displaySize: 18,
          },
          bowery: {
            height: 6.75,
            displaySize: 28,
          },
          mulberry: {
            height: 6,
            displaySize: 13,
          },
        },
        "22-square": {
          cornelia: {
            height: 5,
            displaySize: 42,
          },
          "love-lane": {
            height: 5.9,
            displaySize: 18,
          },
          bowery: {
            height: 7,
            displaySize: 28,
          },
          mulberry: {
            height: 6.2,
            displaySize: 13,
          },
        },
        "euro-sham": {
          cornelia: {
            height: 5.2,
            displaySize: 33.6,
          },
          "love-lane": {
            height: 5.9,
            displaySize: 16.2,
          },
          bowery: {
            height: 7,
            displaySize: 21,
          },
          mulberry: {
            height: 6.25,
            displaySize: 11.7,
          },
        },
        bolster: {
          cornelia: {
            height: 5,
            displaySize: 31.5,
          },
          "love-lane": {
            height: 5.7,
            displaySize: 15,
          },
          bowery: {
            height: 6.5,
            displaySize: 20,
          },
          mulberry: {
            height: 6,
            displaySize: 10.2,
          },
        },
        "petite-lumbar": {
          cornelia: {
            height: 4.5,
            displaySize: 35,
          },
          "love-lane": {
            height: 4.5,
            displaySize: 15,
          },
          bowery: {
            height: 4.5,
            displaySize: 20,
          },
          mulberry: {
            height: 4.5,
            displaySize: 10,
          },
        },
        "midi-lumbar": {
          cornelia: {
            height: 4.8,
            displaySize: 35,
          },
          "love-lane": {
            height: 5.2,
            displaySize: 15,
          },
          bowery: {
            height: 5.5,
            displaySize: 20,
          },
          mulberry: {
            height: 5.5,
            displaySize: 10,
          },
        },
        "xl-lumbar": {
          cornelia: {
            height: 5.2,
            displaySize: 24,
          },
          "love-lane": {
            height: 5.7,
            displaySize: 10.4,
          },
          bowery: {
            height: 7,
            displaySize: 15,
          },
          mulberry: {
            height: 6.25,
            displaySize: 7,
          },
        },
      },
      Text: {
        "has-descenders": {
          "makeup-bag": {
            ludlow: {
              short: {
                height: 2.925,
                displaySize: 15,
              },
              medium: {
                height: 1.4625,
                displaySize: 13,
              },
              long: {
                width: 5,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 2.925,
                displaySize: 16,
              },
              medium: {
                height: 1.4625,
                displaySize: 11.2,
              },
              long: {
                width: 5,
                displaySize: 9,
              },
            },
            bowery: {
              short: {
                height: 2.925,
                displaySize: 20,
              },
              medium: {
                height: 1.4625,
                displaySize: 15,
              },
              long: {
                width: 5,
                displaySize: 11,
              },
            },
            mulberry: {
              short: {
                height: 2.925,
                displaySize: 11,
              },
              medium: {
                height: 1.4625,
                displaySize: 8.4,
              },
              long: {
                width: 5,
                displaySize: 7,
              },
            },
          },
          "18-square": {
            ludlow: {
              short: {
                height: 3.575,
                displaySize: 15,
              },
              medium: {
                height: 3.575,
                displaySize: 13,
              },
              long: {
                width: 9.5,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 7.15,
                displaySize: 18,
              },
              medium: {
                height: 4.225,
                displaySize: 12,
              },
              long: {
                width: 9.5,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 8.45,
                displaySize: 28,
              },
              medium: {
                height: 4.225,
                displaySize: 15,
              },
              long: {
                width: 9.5,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 7.54,
                displaySize: 13,
              },
              medium: {
                height: 4.225,
                displaySize: 9,
              },
              long: {
                width: 9.5,
                displaySize: 7,
              },
            },
          },
          "20-square": {
            ludlow: {
              short: {
                height: 3.77,
                displaySize: 15,
              },
              medium: {
                height: 3.575,
                displaySize: 12,
              },
              long: {
                width: 10.25,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 7.41,
                displaySize: 18,
              },
              medium: {
                height: 4.42,
                displaySize: 12,
              },
              long: {
                width: 10.25,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 8.775,
                displaySize: 28,
              },
              medium: {
                height: 4.42,
                displaySize: 15,
              },
              long: {
                width: 10.25,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 7.8,
                displaySize: 13,
              },
              medium: {
                height: 4.42,
                displaySize: 9,
              },
              long: {
                width: 10.25,
                displaySize: 6,
              },
            },
          },
          "22-square": {
            ludlow: {
              short: {
                height: 4.29,
                displaySize: 15,
              },
              medium: {
                height: 3.575,
                displaySize: 11,
              },
              long: {
                width: 11,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 7.67,
                displaySize: 18,
              },
              medium: {
                height: 4.615,
                displaySize: 12,
              },
              long: {
                width: 11,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 9.1,
                displaySize: 28,
              },
              medium: {
                height: 4.615,
                displaySize: 15,
              },
              long: {
                width: 11,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 8.06,
                displaySize: 13,
              },
              medium: {
                height: 4.615,
                displaySize: 9,
              },
              long: {
                width: 11,
                displaySize: 6,
              },
            },
          },
          "euro-sham": {
            ludlow: {
              short: {
                height: 4.55,
                displaySize: 12.75,
              },
              medium: {
                height: 3.575,
                displaySize: 11,
              },
              long: {
                width: 12,
                displaySize: 8.5,
              },
            },
            "love-lane": {
              short: {
                height: 7.67,
                displaySize: 16.2,
              },
              medium: {
                height: 4.81,
                displaySize: 11,
              },
              long: {
                width: 12,
                displaySize: 6.8,
              },
            },
            bowery: {
              short: {
                height: 9.1,
                displaySize: 21,
              },
              medium: {
                height: 4.81,
                displaySize: 15,
              },
              long: {
                width: 12,
                displaySize: 10.2,
              },
            },
            mulberry: {
              short: {
                height: 8.125,
                displaySize: 11.7,
              },
              medium: {
                height: 4.81,
                displaySize: 8,
              },
              long: {
                width: 12,
                displaySize: 5.1,
              },
            },
          },
          bolster: {
            ludlow: {
              short: {
                height: 4.29,
                displaySize: 13,
              },
              medium: {
                height: 3.575,
                displaySize: 10,
              },
              long: {
                width: 11,
                displaySize: 8.3,
              },
            },
            "love-lane": {
              short: {
                height: 7.41,
                displaySize: 15,
              },
              medium: {
                height: 4.42,
                displaySize: 10,
              },
              long: {
                width: 11,
                displaySize: 6.64,
              },
            },
            bowery: {
              short: {
                height: 8.45,
                displaySize: 28,
              },
              medium: {
                height: 4.42,
                displaySize: 12,
              },
              long: {
                width: 11,
                displaySize: 9.96,
              },
            },
            mulberry: {
              short: {
                height: 7.8,
                displaySize: 10,
              },
              medium: {
                height: 4.42,
                displaySize: 7,
              },
              long: {
                width: 11,
                displaySize: 4.98,
              },
            },
          },
          "petite-lumbar": {
            ludlow: {
              short: {
                height: 3.9,
                displaySize: 12.75,
              },
              medium: {
                height: 3.575,
                displaySize: 12.75,
              },
              long: {
                width: 10,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 5.85,
                displaySize: 15,
              },
              medium: {
                height: 4.42,
                displaySize: 12,
              },
              long: {
                width: 10,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 5.85,
                displaySize: 20,
              },
              medium: {
                height: 4.42,
                displaySize: 15,
              },
              long: {
                width: 10,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 5.85,
                displaySize: 10,
              },
              medium: {
                height: 4.42,
                displaySize: 8,
              },
              long: {
                width: 10,
                displaySize: 6,
              },
            },
          },
          "midi-lumbar": {
            ludlow: {
              short: {
                height: 4.29,
                displaySize: 12.75,
              },
              medium: {
                height: 3.575,
                displaySize: 12.75,
              },
              long: {
                width: 11,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 6,
                displaySize: 15,
              },
              medium: {
                height: 4.42,
                displaySize: 12,
              },
              long: {
                width: 11,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 7.15,
                displaySize: 20,
              },
              medium: {
                height: 4.42,
                displaySize: 15,
              },
              long: {
                width: 11,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 7.15,
                displaySize: 10,
              },
              medium: {
                height: 4.42,
                displaySize: 8,
              },
              long: {
                width: 11,
                displaySize: 6,
              },
            },
          },
          "xl-lumbar": {
            ludlow: {
              short: {
                height: 4.55,
                displaySize: 15,
              },
              medium: {
                height: 3.575,
                displaySize: 5.6,
              },
              long: {
                width: 17,
                displaySize: 8,
              },
            },
            "love-lane": {
              short: {
                height: 7.67,
                displaySize: 10.4,
              },
              medium: {
                height: 4.81,
                displaySize: 6.8,
              },
              long: {
                width: 17,
                displaySize: 7.2,
              },
            },
            bowery: {
              short: {
                height: 9.1,
                displaySize: 15,
              },
              medium: {
                height: 4.81,
                displaySize: 10.2,
              },
              long: {
                width: 17,
                displaySize: 9.6,
              },
            },
            mulberry: {
              short: {
                height: 8.125,
                displaySize: 7,
              },
              medium: {
                height: 4.81,
                displaySize: 5.1,
              },
              long: {
                width: 17,
                displaySize: 5.4,
              },
            },
          },
        },
        "no-descenders": {
          "makeup-bag": {
            ludlow: {
              short: {
                height: 2.25,
                displaySize: 15,
              },
              medium: {
                height: 1.125,
                displaySize: 13,
              },
              long: {
                width: 5,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 2.25,
                displaySize: 16,
              },
              medium: {
                height: 1.125,
                displaySize: 11.2,
              },
              long: {
                width: 5,
                displaySize: 9,
              },
            },
            bowery: {
              short: {
                height: 2.25,
                displaySize: 20,
              },
              medium: {
                height: 1.125,
                displaySize: 15,
              },
              long: {
                width: 5,
                displaySize: 11,
              },
            },
            mulberry: {
              short: {
                height: 2.25,
                displaySize: 11,
              },
              medium: {
                height: 1.125,
                displaySize: 8.4,
              },
              long: {
                width: 5,
                displaySize: 7,
              },
            },
          },
          "18-square": {
            ludlow: {
              short: {
                height: 2.75,
                displaySize: 15,
              },
              medium: {
                height: 2.75,
                displaySize: 13,
              },
              long: {
                width: 9.5,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 5.5,
                displaySize: 18,
              },
              medium: {
                height: 3.25,
                displaySize: 12,
              },
              long: {
                width: 9.5,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 6.5,
                displaySize: 28,
              },
              medium: {
                height: 3.25,
                displaySize: 15,
              },
              long: {
                width: 9.5,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 5.8,
                displaySize: 13,
              },
              medium: {
                height: 3.25,
                displaySize: 9,
              },
              long: {
                width: 9.5,
                displaySize: 7,
              },
            },
          },
          "20-square": {
            ludlow: {
              short: {
                height: 2.9,
                displaySize: 15,
              },
              medium: {
                height: 2.75,
                displaySize: 12,
              },
              long: {
                width: 10.25,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 5.7,
                displaySize: 18,
              },
              medium: {
                height: 3.4,
                displaySize: 12,
              },
              long: {
                width: 10.25,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 6.75,
                displaySize: 28,
              },
              medium: {
                height: 3.4,
                displaySize: 15,
              },
              long: {
                width: 10.25,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 6,
                displaySize: 13,
              },
              medium: {
                height: 3.4,
                displaySize: 9,
              },
              long: {
                width: 10.25,
                displaySize: 6,
              },
            },
          },
          "22-square": {
            ludlow: {
              short: {
                height: 3.3,
                displaySize: 15,
              },
              medium: {
                height: 2.75,
                displaySize: 11,
              },
              long: {
                width: 11,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 5.9,
                displaySize: 18,
              },
              medium: {
                height: 3.55,
                displaySize: 12,
              },
              long: {
                width: 11,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 7,
                displaySize: 28,
              },
              medium: {
                height: 3.55,
                displaySize: 15,
              },
              long: {
                width: 11,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 6.2,
                displaySize: 9,
              },
              medium: {
                height: 3.55,
                displaySize: 9,
              },
              long: {
                width: 11,
                displaySize: 6,
              },
            },
          },
          "euro-sham": {
            ludlow: {
              short: {
                height: 3.5,
                displaySize: 12.75,
              },
              medium: {
                height: 2.75,
                displaySize: 11,
              },
              long: {
                width: 12,
                displaySize: 8.5,
              },
            },
            "love-lane": {
              short: {
                height: 5.9,
                displaySize: 16.2,
              },
              medium: {
                height: 3.7,
                displaySize: 11,
              },
              long: {
                width: 12,
                displaySize: 6.8,
              },
            },
            bowery: {
              short: {
                height: 7,
                displaySize: 21,
              },
              medium: {
                height: 3.7,
                displaySize: 15,
              },
              long: {
                width: 12,
                displaySize: 10.2,
              },
            },
            mulberry: {
              short: {
                height: 6.25,
                displaySize: 11.7,
              },
              medium: {
                height: 3.7,
                displaySize: 8,
              },
              long: {
                width: 12,
                displaySize: 5.1,
              },
            },
          },
          bolster: {
            ludlow: {
              short: {
                height: 3.3,
                displaySize: 13,
              },
              medium: {
                height: 2.75,
                displaySize: 10,
              },
              long: {
                width: 11,
                displaySize: 8.3,
              },
            },
            "love-lane": {
              short: {
                height: 5.7,
                displaySize: 15,
              },
              medium: {
                height: 3.4,
                displaySize: 10,
              },
              long: {
                width: 11,
                displaySize: 6.64,
              },
            },
            bowery: {
              short: {
                height: 6.5,
                displaySize: 20,
              },
              medium: {
                height: 3.4,
                displaySize: 12,
              },
              long: {
                width: 11,
                displaySize: 9.96,
              },
            },
            mulberry: {
              short: {
                height: 6,
                displaySize: 10,
              },
              medium: {
                height: 3.4,
                displaySize: 7,
              },
              long: {
                width: 11,
                displaySize: 4.98,
              },
            },
          },
          "petite-lumbar": {
            ludlow: {
              short: {
                height: 3,
                displaySize: 12.75,
              },
              medium: {
                height: 2.75,
                displaySize: 12.75,
              },
              long: {
                width: 10,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 4.5,
                displaySize: 15,
              },
              medium: {
                height: 3.4,
                displaySize: 12,
              },
              long: {
                width: 10,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 4.5,
                displaySize: 20,
              },
              medium: {
                height: 3.4,
                displaySize: 15,
              },
              long: {
                width: 10,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 4.5,
                displaySize: 10,
              },
              medium: {
                height: 3.4,
                displaySize: 8,
              },
              long: {
                width: 10,
                displaySize: 6,
              },
            },
          },
          "midi-lumbar": {
            ludlow: {
              short: {
                height: 3.3,
                displaySize: 12.75,
              },
              medium: {
                height: 2.75,
                displaySize: 12.75,
              },
              long: {
                width: 11,
                displaySize: 10,
              },
            },
            "love-lane": {
              short: {
                height: 5.2,
                displaySize: 15,
              },
              medium: {
                height: 3.4,
                displaySize: 12,
              },
              long: {
                width: 11,
                displaySize: 8,
              },
            },
            bowery: {
              short: {
                height: 5.5,
                displaySize: 20,
              },
              medium: {
                height: 3.4,
                displaySize: 15,
              },
              long: {
                width: 11,
                displaySize: 12,
              },
            },
            mulberry: {
              short: {
                height: 5.5,
                displaySize: 10,
              },
              medium: {
                height: 3.4,
                displaySize: 8,
              },
              long: {
                width: 11,
                displaySize: 6,
              },
            },
          },
          "xl-lumbar": {
            ludlow: {
              short: {
                height: 3.5,
                displaySize: 15,
              },
              medium: {
                height: 2.75,
                displaySize: 5.6,
              },
              long: {
                width: 17,
                displaySize: 8,
              },
            },
            "love-lane": {
              short: {
                height: 5.9,
                displaySize: 10.4,
              },
              medium: {
                height: 3.7,
                displaySize: 6.8,
              },
              long: {
                width: 17,
                displaySize: 7.2,
              },
            },
            bowery: {
              short: {
                height: 7,
                displaySize: 15,
              },
              medium: {
                height: 3.7,
                displaySize: 10.2,
              },
              long: {
                width: 17,
                displaySize: 9.6,
              },
            },
            mulberry: {
              short: {
                height: 6.25,
                displaySize: 7,
              },
              medium: {
                height: 3.7,
                displaySize: 5.1,
              },
              long: {
                width: 17,
                displaySize: 5.4,
              },
            },
          },
        },
      },
    };
  }

  connectedCallback() {
    this.triggerPersonalize();
  }

  scrollModalToTop() {
    this.closest(".product-modal__content").scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  setMobile() {
    this.mobile = window.matchMedia("(min-width: 60em)").matches ? false : true;
    this.tablet =
      window.matchMedia("(min-width: 40em)").matches &&
      window.matchMedia("(max-width: 90em)").matches
        ? true
        : false;
    this.handleChange();
  }

  clearAll() {
    this.inputs.customizedImage.value = "";
    this.inputs.personalization.value = "";
    this.inputs.maxWidth.value = "";
    this.inputs.maxHeight.value = "";
    this.querySelector(
      'input[name="properties[_Embroidery]"][value="false"]'
    ).checked = true;
    this.setRequiredFields("close");
    if (this.getEmbroideryType()) {
      this.querySelector(
        'input[name="properties[_Embroidery Type]"]:checked'
      ).checked = false;
    }
    if (this.getTypeface()) {
      this.querySelector(
        'input[name="properties[Typeface]"]:checked'
      ).checked = false;
    }
    if (this.getColor()) {
      this.querySelector(
        'input[name="properties[Embroidery Color]"]:checked'
      ).checked = false;
    }
    this.setOptionLegends();
    this.setPersonalizationText();
    this.unsetPersonalizationUrl();
  }

  setup() {
    this.setPersonalizationUrl();
    this.scrollModalToTop();
    document.querySelector("sticky-header").reset();
    this.setRequiredFields("open");
    this.querySelector(
      'input[name="properties[_Embroidery]"][value="true"]'
    ).checked = true;
    // this.querySelector(
    //   'input[name="properties[_Embroidery Type]"][value="Monogram"]'
    // ).checked = true;
    this.setTypefaces(this.getEmbroideryType().toLowerCase());
    this.updateMedia();
    this.setImageWrapperClasses();
    this.getPillowData();
    this.setPillowTitle();
    this.setPillowImage();
    this.setTrimRadio();
    this.updatePrice();
  }

  handleChange(e) {
    if (!this.querySelector('input[name="properties[_Embroidery]"][value="true"]')?.checked) return;
    this.querySelector('.product-form__input.type-options').classList.remove('hidden');
    let measurements;
    if (this.getEmbroideryType() === "Monogram") {
      measurements =
        this.LOOKUP_TABLES?.[this.getEmbroideryType()]?.[
          this.handleize(this.getPillowData().pillowSize) || "makeup-bag"
        ]?.[this.handleize(this.getTypeface() || "")];
      this.setTypefaces(this.getEmbroideryType().toLowerCase());
      this.checkMonogramRequirements();
      this.setPersonalizationTextSize(measurements?.displaySize || 10);
    } else {
      this.setTypefaces(this.getEmbroideryType().toLowerCase());
      let textLength =
        this.checkCharacterCount() <= 3
          ? "short"
          : this.checkCharacterCount() <= 6
          ? "medium"
          : this.checkCharacterCount() <= 16
          ? "long"
          : "";
      measurements =
        this.LOOKUP_TABLES?.[this.getEmbroideryType()]?.[
          this.checkDescenders()
        ]?.[this.handleize(this.getPillowData().pillowSize) || "makeup-bag"]?.[
          this.handleize(this.getTypeface() || "")
        ]?.[textLength];
      this.checkTextRequirements();
      this.setPersonalizationTextSize(measurements?.displaySize || 3);
    }

    this.setImageWrapperClasses(
      this.handleize(this.getColor() || ""),
      this.handleize(this.getTypeface() || "")
    );

    if (measurements?.["height"]) {
      this.setHeight(measurements["height"]);
      this.setWidth();
    } else if (measurements?.["width"]) {
      this.setHeight();
      this.setWidth(measurements["width"]);
    } else {
      this.setHeight();
      this.setWidth();
    }

    if (this.getTypeface()) {
      if (
        this.getEmbroideryType() == "Monogram" &&
        this.inputs.personalization.value.length < 3
      ) {
        this.setPersonalizationText("");
      } else {
        this.setPersonalizationText(this.inputs.personalization.value || "");
      }
    } else {
      this.setPersonalizationText("");
    }

    this.setOptionLegends();
    this.setHelperText();

    if (
      !!!e ||
      e?.target.name.includes("Color") ||
      e?.target.name.includes("Trim") ||
      e?.target.name.includes("trim")
    ) {
      this.updatePrice();
      this.scrollModalToTop();
    }
  }

  setTypefaces(type = "monogram") {
    // Determines which typesfaces to show for text/monogram
    // Also controls background images for labels/radio buttons
    this.inputs.typefaces.forEach((input) => {
      const backgroundImage = input.getAttribute(`data-${type}`);
      if (!input.getAttribute(`data-${type}`)) {
        input.classList.remove("is-active");
      } else {
        input.classList.add("is-active");
      }
      if (
        (this.getTypeface() == "Cornelia" && type == "text") ||
        (this.getTypeface() == "Ludlow" && type == "monogram")
      ) {
        input.checked = false;
      }
      if (!backgroundImage) return;
      this.querySelector(
        `.type-option-${handleize(input.value)}`
      ).style.backgroundImage = `url(${backgroundImage})`;
    });
  }

  setOptionLegends() {
    this.querySelector("#type-option-legend").textContent =
      this.getTypeface() || "";
    // this.querySelector("#embroidery-color-legend").textContent =
    //   this.getColor() || "";

    // 1. Type dropdown trigger (Monogram / Text)
    const typeSelected = this.querySelector("#type-selected");
    if (typeSelected) {
      typeSelected.textContent = this.getEmbroideryType() || "Monogram";
    }

    // 2. Thread color dropdown trigger + swatch
    const trimOptionSelected = this.querySelector("#embroidery-color-legend");

    if (trimOptionSelected) {
      trimOptionSelected.innerHTML = this.getColor()
        ? this.getColor()
        : `<span class="option-not-selected">${window.cartStrings.notSelected}</span>`;
    }

    const threadSwatch = this.querySelector("[data-thread-color]");
    const colorChecked = this.querySelector('input[name="properties[Embroidery Color]"]:checked');
    if (threadSwatch) {
      if (colorChecked?.value) {
        const colorLabel = this.querySelector(`label[for="${colorChecked.id}"]`);
        if (colorLabel) {
          const computedColor = window.getComputedStyle(colorLabel).backgroundColor;
          threadSwatch.style.backgroundColor = computedColor;
          threadSwatch.style.display = 'inline-block';
        }
      } else {
        threadSwatch.style.display = 'none';
      }
    }

    // 3. Trim/piping dropdown trigger + swatch
    const dataTrimSelected = this.querySelector("[data-trim-selected]");
    const trimSwatch = this.querySelector("[data-trim-swatch]");

    const trimChecked = this.querySelector('input[name="trim-proxy"]:checked');

    if (dataTrimSelected) {
      const trimValue = trimChecked?.value;
      dataTrimSelected.textContent = (trimValue && trimValue !== 'None') 
      ? !trimValue.includes('Fringe') && !trimValue.includes('Ruffle') && !trimValue.includes('Pom Pom') && !trimValue.includes('Piping') && !trimValue.includes('None') 
        ? trimValue + ' Piping' 
        : trimValue : 'None';
    }


    if (trimSwatch && trimChecked) {
      const trimLabel = this.querySelector(`label[for="${trimChecked.id}"]`);
      if (trimLabel && trimChecked.value !== 'None') {
        const computedColor = window.getComputedStyle(trimLabel).backgroundColor;
        trimSwatch.style.backgroundColor = computedColor;
        trimSwatch.style.display = 'inline-block';
      } else {
        trimSwatch.style.display = 'none';
      }
    }
  }

  setHeight(height = "") {
    this.inputs.maxHeight.value = height == "" ? "" : `${height}"`;
  }

  setWidth(width = "") {
    this.inputs.maxWidth.value = width == "" ? "" : `${width}"`;
  }

  setImageWrapperClasses(color = "", typeface = "") {
    this.imageWrapper.removeAttribute("class");
    this.imageWrapper.classList.add(
      `embroidery-color`,
      `color-${color}`,
      `typeface-${typeface}`,
      `type-${this.handleize(this.getEmbroideryType())}`,
      `size-${this.handleize(this.getPillowData().pillowSize)}`
    );
  }

  setRequiredFields(event) {
    if (event === "open") {
      this.inputs.personalization.required = "required";
      this.inputs.confirmation.required = "required";
      this.inputs.typefaces.forEach((input) => {
        input.required = "required";
        input.checked = false;
      });
      this.inputs.embroidery.forEach((input) => {
        input.required = "required";
        input.checked = false;
      });
      this.inputs.colors.forEach((input) => {
        input.required = "required";
        input.checked = false;
      });
    } else {
      this.inputs.personalization.removeAttribute("required");
      this.inputs.confirmation.removeAttribute("required");
      this.inputs.typefaces.forEach((input) => {
        if (input.value !== "") {
          input.removeAttribute("required");
        }
        input.value === "" ? (input.checked = true) : (input.checked = false);
      });
      this.inputs.embroideryType.forEach((input) => {
        if (input.value !== "") {
          input.removeAttribute("required");
        }
        input.value === "" ? (input.checked = true) : (input.checked = false);
      });
      this.inputs.colors.forEach((input) => {
        if (input.value !== "") {
          input.removeAttribute("required");
        }
        input.value === "" ? (input.checked = true) : (input.checked = false);
      });
    }
  }

  setPillowImage() {
    if (this.querySelector("image-wrapper img:not(.base-image)")) {
      this.querySelector("image-wrapper img:not(.base-image)").setAttribute(
        "src",
        this.getPillowData().pillowImageSrc
      );
      this.querySelector("image-wrapper img:not(.base-image)").setAttribute(
        "alt",
        this.getPillowData().pillowTrimStyle
      );
      if (this.getPillowData().customPipingBuilder == 'true') {
        if (this.querySelector("image-wrapper img.base-image")) {
          this.querySelector("image-wrapper img.base-image").setAttribute(
            "src",
            this.getPillowData().pillowImageBaseSrc
          );
        } else {
          const imageBaseEl = document.createElement("img");
          imageBaseEl.src = this.getPillowData().pillowImageBaseSrc;
          imageBaseEl.classList.add('base-image');
          imageBaseEl.setAttribute('alt', 'Base image');
          this.imageWrapper.insertBefore(imageBaseEl, this.querySelector("image-wrapper img:not(.base-image"));
        }
      }
    } else {
      if (this.getPillowData().customPipingBuilder == 'true') {
        const imageBaseEl = document.createElement("img");
        imageBaseEl.src = this.getPillowData().pillowImageBaseSrc;
        imageBaseEl.classList.add('base-image');
        imageBaseEl.setAttribute('alt', 'Base image');
        this.imageWrapper.append(imageBaseEl);
      }
      const imageEl = document.createElement("img");
      imageEl.src = this.getPillowData().pillowImageSrc;
      this.imageWrapper.append(imageEl);
    }
  }

  setPillowTitle() {
    const pillowData = this.getPillowData();
    if (!pillowData.pillowSize || !this.pillowSizes) return;
  
    this.pillowSizes.forEach(el => {
      el.textContent = pillowData.pillowSize;
    });
  }

  setTrimRadio() {
    const trimSide = document.querySelector(
      `input[name="Trim Side"]:checked`
    )?.value;
    const trimStyle = document.querySelector(
      `input[name="properties[Trim]"]:checked`
    )?.value;
    if (!trimStyle && !trimSide) return;

    const trimSideChecked = trimSide === 'None'
      ? this.querySelector(`input[name="trim-side-proxy"][value="None"]`)
      : [...this.querySelectorAll(`input[name="trim-side-proxy"]`)].find((trimProxy) => trimProxy.value !== 'None');
    
    if (trimSideChecked) {
      trimSideChecked.checked = true;
      if (trimSide.toLowerCase() != 'none') {
        this.pipingOptionWrapper.classList.remove('trim-options-hide');
      } else {
        this.pipingOptionWrapper.classList.add('trim-options-hide');
      }
      if (trimStyle) {
        if (trimSide.toLowerCase() != 'none' && trimStyle.toLowerCase() != 'none') {
          this.querySelectorAll(`input[name="trim-side-proxy"]`).forEach((trim) => {
            if (trim.value != 'None' && trimSide.toLowerCase() != 'none') {
              trim.value = trimSide;
            }
          })
        }
      }
    }
    const trimChecked = this.querySelector(`input[name="trim-proxy"][value="${trimStyle}"]`);
    const trimLabel = this.querySelector('.product-form__input.welf-options [data-trim-selected]');
    const trimSwatch = this.querySelector('.product-form__input.welf-options [data-trim-swatch]');

    trimChecked.checked = true;
    trimLabel.textContent = trimChecked.value;
    if (!trimChecked.value.includes('Fringe') && !trimChecked.value.includes('Ruffle') && !trimChecked.value.includes('Pom Pom') && !trimChecked.value.includes('Piping') && !trimChecked.value.includes('None')) {
      trimLabel.textContent = trimChecked.value + ' Piping';
    }

    if (trimSwatch && trimChecked) {
      const trimLabel = this.querySelector(`label[for="${trimChecked.id}"]`);
      if (trimLabel && trimChecked.value !== 'None') {
        const computedColor = window.getComputedStyle(trimLabel).backgroundColor;
        trimSwatch.style.backgroundColor = computedColor;
        trimSwatch.style.display = 'inline-block';
      } else {
        trimSwatch.style.display = 'none';
      }
    }
  }

  setPersonalizationText(text = "") {
    this.querySelector("image-wrapper #personalization-text").innerHTML = text
      .split("")
      .map(
        (el, i) =>
          `<span class="char char-${i}${
            el === " " ? " char-empty" : ""
          }">${el}</span>`
      )
      .join("");
  }

  setPersonalizationTextSize(size = 10) {
    if (this.checkCharacterCount() <= 10) {
      if (this.tablet) {
        this.querySelector(
          "image-wrapper #personalization-text"
        ).style = `font-size: ${size * 0.8}rem`;
      } else if (!this.mobile && !this.tablet) {
        // desktop
        this.querySelector(
          "image-wrapper #personalization-text"
        ).style = `font-size: ${size}rem`;
      } else {
        // mobile
        this.querySelector(
          "image-wrapper #personalization-text"
        ).style = `font-size: ${size * 0.5}rem`;
      }
    } else {
      if (this.tablet) {
        this.querySelector(
          "image-wrapper #personalization-text"
        ).style = `font-size: ${size * 0.55}rem`;
      } else if (!this.mobile && !this.tablet) {
        // desktop
        this.querySelector(
          "image-wrapper #personalization-text"
        ).style = `font-size: ${size * 0.75}rem`;
      } else {
        // mobile
        this.querySelector(
          "image-wrapper #personalization-text"
        ).style = `font-size: ${size * 0.35}rem`;
      }
    }
  }

  setHelperText() {
    this.personalizationHelper.textContent =
      this.helperText?.[this.getEmbroideryType()];
  }

  checkMonogramRequirements() {
    this.inputs.personalization.pattern = ".{3,3}";
    this.inputs.personalization.title = "Please enter 3 characters";
    this.inputs.personalization.value =
      this.inputs.personalization.value.toUpperCase();
    this.inputs.personalization.value =
      this.inputs.personalization.value.replace(/[^A-Z]/g, "");
    this.inputs.personalization.value = this.inputs.personalization.value.slice(
      0,
      3
    );
  }

  checkTextRequirements() {
    this.inputs.personalization.removeAttribute("pattern");
    this.inputs.personalization.removeAttribute("title");
    this.inputs.personalization.value = this.inputs.personalization.value
      .replace(/'\b/g, "\u2018")
      .replace("\u2026", "...")
      .replace(/\b'/g, "\u2019")
      .replace(/"\b/g, "\u201c")
      .replace(/\b"/g, "\u201d")
      .replace(
        /[^a-zA-Z0-9 \~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\:\”\“\;\u2019\u2018\u2032\u2033\u2034\<\>\?\,\.\/\'\"]/g,
        ""
      )
      .replace("  ", " ");
    if (this.getTypeface() === "Mulberry") {
      this.inputs.personalization.value =
        this.inputs.personalization.value.replace(/[\~\^\{\}]/g, "");
    }
    this.inputs.personalization.value = this.inputs.personalization.value.slice(
      0,
      15
    );
  }

  checkDescenders() {
    // for checking max height/width
    return /([gjpqy])+/.test(this.inputs.personalization.value)
      ? "has-descenders"
      : "no-descenders";
  }

  checkCharacterCount() {
    // returns # of characters
    // for validation
    return this.inputs.personalization.value.length;
  }

  updateMedia() {
    if (!document.querySelector("piping-radios")) return;
    // Triggers change before the modal opens to make sure the right image is selected
    document.querySelector("piping-radios").onRadioChange();
  }

  updatePrice() {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    this.inputs.embroideryBuy.textContent = `${formatter
      .format(
        (this.getPillowData().pillowPrice +
          parseInt(this.inputs.embroideryBuy.dataset.price)) /
          100
      )
      .replace(".00", "")}`;
  }

  getEmbroideryType() {
    // gets checked input and returns monogram or text
    return this.querySelector(
      'input[name="properties[_Embroidery Type]"]:checked'
    )?.value;
  }

  getColor() {
    // gets checked input and returns color value
    return this.querySelector(
      'input[name="properties[Embroidery Color]"]:checked'
    )?.value;
  }

  getTypeface() {
    // gets checked input and returns typeface name
    return this.querySelector('input[name="properties[Typeface]"]:checked')
      ?.value;
  }

  getPillowData() {
    return {
      pillowImageSrc:
        document.querySelector('input[name="properties[_product_image]"]')
          .value ||
        document.querySelector(".thumbnail-slider .is-active img").src,
      pillowImageBaseSrc: document.querySelector('input[name="properties[_base_piping_image]"]')?.value || null,
      customPipingBuilder: document.querySelector('input[name="properties[_piping_custom]"]')?.value || null,
      pillowSize:
        document.querySelector('input[name="Size"]:checked')?.value || null,
      pillowTrim:
        document.querySelector('input[name="Trim Side"]:checked')
          ?.value || null,
      pillowTrimStyle:
        document.querySelector('input[name="properties[Trim]"]:checked')
          ?.value || null,
      pillowPrice:
        parseInt(
          document.querySelector("#price_buy")?.textContent.replace("$", "")
        ) * 100,
    };
  }

  setPersonalizationUrl() {
    if (window.location.search.includes("personalize")) return;
    window.history.replaceState(
      {},
      "",
      `${window.location.href}${
        window.location.search ? "&" : "?"
      }personalize=true`
    );
  }

  unsetPersonalizationUrl() {
    if (!window.location.search.includes("personalize")) return;
    window.history.replaceState(
      {},
      "",
      `${window.location.href
        .replace("?personalize=true", "")
        .replace("&personalize=true", "")}`
    );
  }

  triggerPersonalize() {
    if (!location.search) return;
    const params = Object.fromEntries(new URLSearchParams(location.search));
    if (!params.personalize) return;
    this.modal.querySelector("summary").click();
  }

  toggleLoading() {
    this.loadingOverlay.classList.toggle("active");
  }

  openRequiredDropdowns() {
    const allDropdowns = this.querySelectorAll('option-dropdown');
    
    allDropdowns.forEach(dropdown => {
      const isOpen = dropdown.hasAttribute('open');
      if (isOpen) return;   
      const hasEmptyRequired = Array.from(
        dropdown.querySelectorAll('input[required], input.required')
      ).some(input => {
        if (input.type === 'radio') {
          const name = input.name;
          return !dropdown.querySelector(`input[name="${name}"]:checked`)
            || dropdown.querySelector(`input[name="${name}"]:checked`)?.value === '';
        }
        return !input.value;
      });
  
      if (hasEmptyRequired) {
        dropdown._optionDropdown?.open() || dropdown.open?.();
      }
    });
  }

  saveImage() {
    this.toggleLoading();
    const valid = this.inputs.productForm.reportValidity();
    if (valid) {
      if (!window.html2canvas) return;
      let scale = 1;
      if (!this.mobile) {
        scale = 0.5;
      }
      const config = {
        logging: false,
        scale: scale,
        // ignoreElements: function (element) {
        //   if (element.id === 'shopify-section-announcement-bar' || element.id === 'shopify-section-header' || element.id === 'shopify-section-template--15236217372732__1644249423261db1b8' || element.id === 'shopify-section-template--15236217372732__product-recommendations' || element.id === 'shopify-section-template--15236217372732__1633988363790b2161' || element.id === 'shopify-section-template--15236217372732__163398841244446eb7' || element.id === 'shopify-section-footer') {
        //     return false;
        //   }
        // }
      };
      html2canvas(document.querySelector("image-wrapper"), config)
        .then((canvas) => {
          return this.setupFileInput(
            this.dataURItoBlob(canvas.toDataURL("image/png"))
          );
        })
        .then(() => {
          document
            .querySelector("product-form")
            .form.dispatchEvent(
              new Event("submit", { bubbles: true, cancelable: true })
            );
        });
    } else {
      this.toggleLoading();
      this.openRequiredDropdowns();
    }
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for (var i = 0; i < byteString.length; i++) {
      dw.setUint8(i, byteString.charCodeAt(i));
    }

    // write the ArrayBuffer to a blob, and you're done
    let data = new Blob([ab]);
    let file = new File(
      [data],
      `${this.handleize(this.inputs.personalization.value)}.png`,
      { type: "image/png", lastModified: new Date().getTime() }
    );
    return file;
  }

  setupFileInput(file) {
    let fileInputElement = this.inputs.customizedImage;
    let container = new DataTransfer();
    container.items.add(file);

    fileInputElement.files = container.files;
  }

  handleize(str) {
    if (!str) return;
    str = str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/([^\w]+|\s+)/g, "-") // Replace space and other characters by hyphen
      .replace(/\-\-+/g, "-") // Replaces multiple hyphens by one hyphen
      .replace(/(^-+|-+$)/g, "") // Remove extra hyphens from beginning or end of the string
      .toLowerCase(); // To lowercase
    return str;
  }

  validationOptions() {
    this.handleErrorMessage();

    const typeDropdown = document.querySelector('[data-dropdown-key="embroidery-type"]');
    this.type = document.querySelectorAll(
      '[name="properties[_Embroidery Type]"]'
    );
    if (this.type.length) {
      this.typeChecked = document.querySelector(
        '[name="properties[_Embroidery Type]"]:checked'
      );
      if (!this.typeChecked || this.typeChecked.value === '') {
        this.handleErrorMessage('Please select: embroidery type');
        if (typeDropdown && !typeDropdown.isOpen) {
          typeDropdown.open();
        }
        return false;
      }
    }

    this.typeFaces = document.querySelectorAll(
      '[name="properties[Typeface]"]'
    );
    if (this.typeFaces.length) {
      this.typeFaceChecked = document.querySelector(
        '[name="properties[Typeface]"]:checked'
      );
      if (!this.typeFaceChecked) {
        this.handleErrorMessage('Please select: embroidery typeface');
        if (typeDropdown && !typeDropdown.isOpen) {
          typeDropdown.open();
        }
        return false;
      }
    }
    
    this.personalization = document.querySelector(
      '[name="properties[Personalization]"]'
    );
    if (this.personalization.value === '') {
      this.handleErrorMessage('Please enter: personalization');
      if (typeDropdown && !typeDropdown.isOpen) {
        typeDropdown.open();
      }
      return false;
    }

    this.embroideryColor = document.querySelectorAll(
      '[name="properties[Embroidery Color]"]'
    );
    if (this.embroideryColor.length) {
      this.embroideryColorChecked = document.querySelector(
        '[name="properties[Embroidery Color]"]:checked'
      );
      const colorDropdown = document.querySelector('[data-dropdown-key="embroidery-color"]');
      if (!this.embroideryColorChecked) {
        this.handleErrorMessage('Please select: thread color');
        if (colorDropdown && !colorDropdown.isOpen) {
          colorDropdown.open();
        }
        return false;
      }
    }

    const trimDropdown = document.querySelector('[data-dropdown-key="piping-radios-embroidery"]');
    this.trimLocationProxy = document.querySelectorAll(
      '[name="trim-side-proxy"]'
    );
    if (this.trimLocationProxy.length) {
      this.trimLocationProxyChecked = document.querySelector(
        '[name="trim-side-proxy"]:checked'
      );
      
      if (!this.trimLocationProxyChecked) {
        this.handleErrorMessage('Please select: trim location');
        if (trimDropdown && !trimDropdown.isOpen) {
          trimDropdown.open();
        }
        return false;
      }
    }

    this.trimProxy = document.querySelectorAll(
      '[name="trim-proxy"]'
    );
    if (this.trimProxy.length) {
      this.trimProxyChecked = document.querySelector(
        '[name="trim-proxy"]:checked'
      );
      if (!this.trimProxyChecked) {
        this.handleErrorMessage('Please select: trim style');
        if (trimDropdown && !trimDropdown.isOpen) {
          trimDropdown.open();
        }
        return false;
      }
    }

    if (this.trimLocationProxy.length && this.trimProxy.length) {
      if (this.trimLocationProxyChecked.value.toLowerCase() != 'none' && this.trimProxyChecked.value.toLowerCase() == 'none') {
        this.handleErrorMessage('Please select: trim style');
        if (trimDropdown && !trimDropdown.isOpen) {
          trimDropdown.open();
        }
        return false;
      }
    }

    this.confirmation = document.querySelector(
      '#embroidery-confirmation[name="properties[_Embroidery Acknowledgement]"]'
    );
    if (!this.confirmation.checked) {
      this.handleErrorMessage('Please check: confirmation');
      return false;
    }
    
    this.saveImage();
  }
  
  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper =
      this.errorMessageWrapper ||
      this.querySelector(".embroidery-modal__error-message-wrapper");
    this.errorMessage =
      this.errorMessage ||
      this.errorMessageWrapper.querySelector(
        ".embroidery__error-message"
      );

    this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
}

customElements.define("embroidery-options", EmbroideryOptions);

class DetailsModalEmbroidery extends DetailsModal {
  constructor() {
    super();
  }

  onSummaryClick(event) {
    event.preventDefault();
    this.allSelected = this.checkVariantOptions();

    event.target.closest("details").hasAttribute("open")
      ? this.close()
      : this.allSelected ? this.open(event) : this.close();
  }
  
  checkVariantOptions() {
    this.handleErrorMessage();

    this.size = document.querySelectorAll(
      '[name="Size"]'
    );
    this.sizeChecked = document.querySelector(
      '[name="Size"]:checked'
    );
    if (this.size.length) {
      if (!this.sizeChecked) {
        this.handleErrorMessage('Please select: size');
        const sizeDropdown = document.querySelector('[data-dropdown-key="size"]');
        if (sizeDropdown && !sizeDropdown.isOpen) {
          sizeDropdown.open();
        }
        return false;
      }
    }

    this.insert = document.querySelectorAll(
      '[name="Feather/Down Insert"]'
    );
    this.insertChecked = document.querySelector(
      '[name="Feather/Down Insert"]:checked'
    );

    if (this.insert.length) {
      if (!this.insertChecked) {
        this.handleErrorMessage('Please select: feather/down insert');
        const insertDropdown = document.querySelector('[data-dropdown-key="feather-down-insert"]');
        if (insertDropdown && !insertDropdown.isOpen) {
          insertDropdown.open();
        }
        return false;
      }
    }

    // this.trim = document.querySelectorAll(
    //   '[name="Trim"]'
    // );
    // this.trimChecked = document.querySelector(
    //   '[name="Trim"]:checked'
    // );

    // if (this.trim.length) {
    //   if (!this.trimChecked) {
    //     this.handleErrorMessage('Please select trim option 1');
    //     const trimDropdown = document.querySelector('[data-dropdown-key="trim"]');
    //     if (trimDropdown && !trimDropdown.isOpen) {
    //       trimDropdown.open();
    //     }
    //     return false;
    //   }
    // }
    
    this.trimSide = document.querySelectorAll(
      '[name="Trim Side"]'
    );
    this.trimSideChecked = document.querySelector(
      '[name="Trim Side"]:checked'
    );

    if (this.trimSide.length) {
      if (!this.trimSideChecked) {
        this.handleErrorMessage('Please select: trim');
        const trimDropdown = document.querySelector('[data-dropdown-key="trim"]');
        if (trimDropdown && !trimDropdown.isOpen) {
          trimDropdown.open();
        }
        return false;
      }
    }

    this.trimStyle = document.querySelectorAll(
      '[name="properties[Trim]"]'
    );
    this.trimStyleChecked = document.querySelector(
      '[name="properties[Trim]"]:checked'
    );

    if (this.trimStyle.length) {
      if (!this.trimStyleChecked) {
        this.handleErrorMessage('Please select: trim style');
        const trimDropdown = document.querySelector('[data-dropdown-key="trim"]');
        if (trimDropdown && !trimDropdown.isOpen) {
          trimDropdown.open();
        }
        return false;
      }
    }

    if (this.trimStyleChecked && this.trimSideChecked) {
      if (this.trimSideChecked.value != 'None' && this.trimStyleChecked.value == 'None') {
        this.handleErrorMessage('Please select: trim style');
        const trimDropdown = document.querySelector('[data-dropdown-key="trim"]');
        if (trimDropdown && !trimDropdown.isOpen) {
          trimDropdown.open();
        }
        return false;
      }
    }


    return true;

  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper =
      this.errorMessageWrapper ||
      this.querySelector(".embroidery__error-message-wrapper");
    this.errorMessage =
      this.errorMessage ||
      this.errorMessageWrapper.querySelector(
        ".embroidery__error-message"
      );

    this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
}
customElements.define("details-modal-embroidery", DetailsModalEmbroidery);