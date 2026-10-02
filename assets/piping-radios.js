class PipingRadios extends HTMLElement {
  constructor() {
    super();
    this.optionLegend = document.querySelector("fieldset.product-form__input-trim").querySelector("legend").querySelector("span");
    this.labels = Array.from(this.querySelectorAll(".js.product-form__input")).map((label) => label.querySelector(".form__label").querySelector("span"));
    this.pipingRadios = document.querySelectorAll('input[name="Trim"]');
    this.trimImages = document.querySelectorAll("[data-additional-image]");
    this.imageEl = document.querySelector('input[name="properties[_product_image]"]');
    this.pipingCustomEl = document.querySelector('input[name="properties[_piping_custom]"]');
    this.imageCustomizedEl = document.querySelector('input[name="properties[_customized_image]"]');
    this.basePipingImage = document.querySelector('input[name="properties[_base_piping_image]"]');
    this.imageZoom = document.querySelector('.overlay-image-zoom img');
    this.pipingOptionWrapper = this.querySelector('.trim-options');

    this.slideShows = document.querySelector(".product-media-wrapper").querySelectorAll("slider-component");

    this.addEventListener("change", this.onRadioChange.bind(this));

    this.preventScroll = false;

    this.imageElement = '';

    this.trimSideRadios = this.querySelectorAll('input[name="Trim Side"]');
    if (this.trimSideRadios.length) {
      this.trimSideRadios.forEach((trimSide) => {
        trimSide.addEventListener('click', () => this.togglePipingOptions())
      })
    }
    
  }

  connectedCallback() {
    this.setTrimFromURL();
  }

  onRadioChange() {
    this.getSelectedRadio();
    this.getSelectedSize();
    this.setPipingRadio();
    this.updateOptionLegend();
    this.updateMedia();
    this.updateCustomizeImage();
    enableZoomOnHover(2);
    this.updateTrimInputValue();
  }

  togglePipingOptions() {
    if (!this.getSelectedTrimSide()) return;

    const trimSide = this.getSelectedTrimSide().value;
    if (trimSide == 'None') {
      this.pipingOptionWrapper.classList.add('trim-options-hide');
      const pipingNone = this.pipingOptionWrapper.querySelector('input[name="properties[Trim]"][value="None"]');
      if (pipingNone) {
        pipingNone.checked = true;
        this.onRadioChange();
        document.querySelector('.product-form__input-trim option-dropdown').updateTrimDisplay(pipingNone);
        return;
      }
    } else {
      this.pipingOptionWrapper.classList.remove('trim-options-hide');
      this.updateTrimInputValue();
    }
  }

  updateTrimInputValue() {
    if (!this.piping) return;
    this.trimSideRadios.forEach((trim) => {
      if (trim.value != 'None' && this.piping.type != 'None') {
        trim.value = this.piping.type;
      }
    });
  }

  setPipingRadio() {
    if (!this.piping) return;
    const selected = Array.from(this.pipingRadios).find(
      (pipingRadio) => pipingRadio.value == `${this.piping.type}`
    );
    selected.checked = true;
  }

  updateOptionLegend() {
    if (!this.optionLegend || !this.piping) return;
    this.trimOptionLegend = document.querySelector('.product-form__input-trim .form__label span');
    if (handleize(this.piping.type) === "none") {
      this.labels.forEach((label) => (label.innerText = ""));
      this.trimOptionLegend.innerText = 'None';
    } else {
      this.optionLegend = document.querySelector(`.product-form__input-${handleize(this.piping.type)}`).querySelector("span");
      this.labels.forEach((label) => (label.innerText = ""));
      this.optionLegend.innerText = `${this.piping.handle.replace(" Fringe", "").replace("Pom Pom", "").replace(" Ruffle", "")}`;
      this.trimOptionLegend.innerText = `${this.piping.handle.replace(" Fringe", "").replace("Pom Pom", "").replace(" Ruffle", "")} ${this.piping.type}`
    }
  }

  updateMedia() {
    // if ((!this.size && !this.piping?.type) || !this.piping) return;
    if (!this.size) return;
    // Fall back to the "none" image of the selected size so picking a Size
    // alone already updates the gallery, without waiting for a Trim selection
    const piping = this.piping || { handle: "None", type: "None" };
    const pipingKey = `${piping.handle}-${piping.type}`;

    const hasChanged = this._lastSize !== this.size || this._lastPipingKey !== pipingKey;

    if (!hasChanged) return;

    this._lastSize = this.size;
    this._lastPipingKey = pipingKey;
    const imageString = `${handleize(this.size)}-${handleize(piping.handle)
      .replace("-fringe", "")
      .replace("-pom-pom", "")
      .replace("-ruffle", "")}${
      piping.type === "None" ? "" : `-${handleize(piping.type)}`
    }`;

    const thumbnailEl = document.querySelector(
      `[data-variant="${imageString}"]`
    );

    if (thumbnailEl) {
      this.imageEl.value = thumbnailEl.querySelector("img.image-magnify-hover").src;
    }

    // Product Pages
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");

    if (mainSlider && thumbnailSlider) {
      
      const thumbnail = thumbnailSlider.querySelector(
        `[data-variant="${imageString}"]`
      );
      thumbnailSlider.querySelectorAll("[data-variant]").forEach((img) => {
        img.classList.remove("is-active");
      });
      if (thumbnail) {
        thumbnail.classList.add("is-active");
        thumbnailSlider.querySelector("ul").scroll({
          top: 0,
          left: thumbnail.offsetLeft,
        });
        thumbnailSlider.querySelectorAll('ul.slider li[data-variant]').forEach((thumbnail) => {
          thumbnail.classList.add("product__media-item--additional-image");
        })
        thumbnail.classList.remove("product__media-item--additional-image");
      }

      
      const mainThumbnail = mainSlider.querySelector(
        `[data-variant="${imageString}"]`
      );

      if (this.pipingCustomEl) {
        const imageBaseString = `${handleize(this.size)}-none`;
        const imageBaseMedia = mainSlider.querySelector(`[data-variant="${imageBaseString}"]`);
        if (imageBaseMedia) {
          this.basePipingImage.value = imageBaseMedia.querySelector('img').src;
        }
        if (piping.type === "None") {
          mainSlider.querySelectorAll("ul.slider li").forEach((slide) => {
            slide.classList.remove("is-active");
          });
          this.imageElement = mainThumbnail;
          if (mainThumbnail) {
            mainThumbnail.classList.add("is-active");
            mainSlider.querySelector("ul").scroll({
              top: 0,
              left: mainThumbnail.offsetLeft,
            });
          }
  
          if (this.imageElement) {
            const existingOverlay = this.imageElement.querySelector('.overlay-image');
            const existingBaseMobile = thumbnailSlider.querySelector('.base-image');
            if (existingOverlay) {
              existingOverlay.remove();
              this.imageCustomizedEl.value = '';
              if (existingBaseMobile) {
                existingBaseMobile.remove();
              }
              if (this.pipingCustomEl) this.pipingCustomEl.value = false;
            }
          }
          if (thumbnail) {
            thumbnail.classList.add('tablet-hide');
          }

        } else {
          if (imageBaseMedia) {
            mainSlider?.querySelectorAll('ul.slider li').forEach((slide) => {
              slide.classList.remove('is-active')
            })
            imageBaseMedia.classList.add('is-active');
            mainSlider?.querySelector("ul").scroll({
              top: 0,
              left: imageBaseMedia.offsetLeft,
            });
          }

          const existingOverlay = mainSlider.querySelector('.overlay-image');
          const existingBaseMobile = thumbnailSlider.querySelector('.base-image');
          const imgSrc = mainThumbnail?.querySelector('img').src;
          existingOverlay?.remove();
          existingBaseMobile?.remove();

          if (imgSrc) {
            const overlayImage = document.createElement('img');
            overlayImage.srcset =  mainThumbnail?.querySelector('img').srcset;
            overlayImage.src = imgSrc;
            overlayImage.sizes = "100vw";
            overlayImage.loading = "lazy";
            overlayImage.alt = "overlay";
            overlayImage.classList.add('overlay-image');

            const mediaDiv = imageBaseMedia?.querySelector(".media");
            if (mediaDiv) {
              mediaDiv.appendChild(overlayImage);
            }

            if (existingBaseMobile) {
              existingBaseMobile.remove();
            }

            if (this.pipingCustomEl) this.pipingCustomEl.value = true;
          }
        }
      } else {
        thumbnailSlider.querySelectorAll("ul.slider li").forEach((thumbnail) => {
          thumbnail.classList.remove("is-active");
        });
        mainSlider.querySelectorAll('ul.slider li').forEach(slide => {
          slide.classList.remove('is-active');
        });
        if (mainThumbnail) {
          mainThumbnail.classList.add('is-active');
          mainSlider.querySelector('ul').scroll({
            top: 0,
            left: mainThumbnail.offsetLeft
          });
        }
      }

      this.slideShows.forEach((slideshow) => {
        slideshow.initPages();
        slideshow.resetZoomIcon();
      });

      if (this.preventScroll) return;

      if (window.matchMedia(`(min-width: 40em)`).matches) return;
      window.scroll({
        top: mainSlider.offsetTop - 72,
      });
    }
  }

  updateCustomizeImage() {
    // if ((!this.size && !this.piping?.type) || !this.piping) return;
    if (!this.piping || !this.size) return;
    const mainSlider = document.querySelector(".main-images-slider");
    const existingOverlay = mainSlider.querySelector('.overlay-image');

    if (this.pipingCustomEl) {
      if (this.piping.type === "None") {
        this.imageCustomizedEl.value = '';
      } else {
        if (existingOverlay) {
          const canvas = document.getElementById("canvas-custom-builder"),
          ctx = canvas.getContext("2d");
          canvas.width = 800;
          canvas.height = 800;

          let images = [...existingOverlay.parentElement.getElementsByTagName("img")];
          const assetsLoaded = images.map(async image => {
            const img = new Image();
            img.src = image.src;
            await img.decode();
            return img;
          });

          Promise.all(assetsLoaded).then(images => {
            (function getCanvas() {
              requestAnimationFrame(getCanvas);
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              images.forEach((e, i) =>
                ctx.drawImage(e, 0, 0, canvas.width, canvas.height)
              );

            })();
          }).finally(()=> {
            this.setupFileInput(
              this.dataURItoBlob(canvas.toDataURL("image/webp"))
            );
            this.imageZoom.src = canvas.toDataURL();
            if (document.querySelector('.media .base-image')) {
              document.querySelector('.media .base-image').src = canvas.toDataURL();
            } else {
              const imageBaseString = `${handleize(this.size)}-none`;
              const imageBaseMedia = thumbnailSlider.querySelector(`[data-variant="${imageBaseString}"]`);
              if (imageBaseMedia) {
                const baseImageMobile = document.createElement('img');
                baseImageMobile.src = canvas.toDataURL();
                baseImageMobile.sizes = "100vw";
                baseImageMobile.loading = "eager";
                baseImageMobile.alt = "overlay";
                baseImageMobile.classList.add('base-image', 'image-magnify-hover');
                if (imageBaseMedia) {
                  thumbnailSlider.querySelectorAll('ul.slider li').forEach((thumbnail) => {
                    thumbnail.classList.remove("is-active");
                  })
                  imageBaseMedia.querySelector('.media').appendChild(baseImageMobile);
                  imageBaseMedia.classList.add("is-active");
                  thumbnailSlider.querySelector("ul").scroll({
                    top: 0,
                    left: imageBaseMedia.offsetLeft,
                  });
                  thumbnailSlider.querySelectorAll('ul.slider li[data-variant]').forEach((thumbnail) => {
                    thumbnail.classList.add("product__media-item--additional-image");
                  })
                  imageBaseMedia.classList.remove("product__media-item--additional-image");
                }
              }
            }
            enableZoomOnHover(2);
          })
          .catch(err => console.error(err));
        }
      }
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
      `custom-pillow-builder.png`,
      { type: "image/png", lastModified: new Date().getTime() }
    );
    return file;
  }

  setupFileInput(file) {
    let fileInputElement = this.imageCustomizedEl;
    let container = new DataTransfer();
    container.items.add(file);

    fileInputElement.files = container.files;
  }

  handleizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
  }

  setTrimFromURL() {
    if (!location.search) return;
    const params = Object.fromEntries(new URLSearchParams(location.search));
    if (!params.trimStyle) return;
    const trimSide = params.trimSide === 'None'
      ? this.querySelector(`input[name="Trim Side"][value="None"]`)
      : [...this.querySelectorAll(`input[name="Trim Side"]`)].find((trimSideInput) => trimSideInput.value !== 'None');

    if (trimSide) {
      trimSide.checked = true;
      if (params.trimSide.toLowerCase() === 'none') {
        this.pipingOptionWrapper.classList.add('trim-options-hide');
      } else {
        this.pipingOptionWrapper.classList.remove('trim-options-hide');
      }
    }

    const trimInput = document.querySelector(
      `input[name="properties[Trim]"][value='${params.trimStyle}']`
    );
    if (trimInput) {
      trimInput.checked = true;
    }
    if (trimInput && trimSide) {
      trimInput.checked = true;
      this.onRadioChange();
      return;
    }

    // No trim to restore from the URL ("none", an unknown value, or no param
    // at all): still sync the gallery with the size preselected by ?variant=,
    // so the media matches the size before any trim is picked.
    this.getSelectedRadio();
    this.getSelectedSize();
    this.updateMedia();
  }

  // Matches on the handleized value so "Snow Piping" and "snow-piping" both
  // work. "none" is ignored on purpose: it means no trim has been picked, so
  // the radios stay untouched and the Trim option keeps asking for a choice.
  findTrimInput(trimStyle) {
    const wanted = handleize(trimStyle);
    if (!wanted || wanted === "none") return null;
    return (
      Array.from(this.querySelectorAll('input[name="Trim Side"]')).find(
        (input) => handleize(input.value) === wanted
      ) || null
    );
  }

  getSelectedSize() {
    this.size = document.querySelector('input[name="Size"]:checked')?.value || null;
  }

  getSelectedRadio() {
    this.selectedPipingInput = this.querySelector(".trim-options input:checked");
    if (!this.selectedPipingInput) return;
    this.piping = {
      handle: this.selectedPipingInput.value,
      type: this.selectedPipingInput.dataset.type,
    };
  }

  getSelectedTrimSide() {
    return this.querySelector('input[name="Trim Side"]:checked') || null;
  }
}
customElements.define("piping-radios", PipingRadios);