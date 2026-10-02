class WeltRadios extends HTMLElement {
  constructor() {
    super();
    this.optionLegend = this.querySelector(".product-form__input-welt")?.querySelector(".form__label").querySelector("span");
    this.weltRadios = document.querySelectorAll('input[name="properties[Trim]"]');
    this.imageEl = document.querySelector('input[name="properties[_product_image]"]');
    this.imageCustomizedEl = document.querySelector('input[name="properties[_customized_image]"]');
    this.baseWeltImage = document.querySelector('input[name="properties[_base_welt_image]"]');
    this.imageZoom = document.querySelector('.overlay-image-zoom img');

    this.slideShows = document.querySelector(".product-media-wrapper").querySelectorAll("slider-component");

    this.selects =
      document.querySelector("variant-radios") ||
      document.querySelector("variant-selects");
    this.selects.addEventListener("change", this.onRadioChange.bind(this));

    this.preventScroll = false; 
  }

  connectedCallback() {
    this.preloadImages();
    this.setTrimFromURL();
  }

  preloadImages() {
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");
    if (!mainSlider || !thumbnailSlider) return;
  
    this.imageCache = new Map();
  
    const mediaItems = mainSlider.querySelectorAll("[data-variant]");
    mediaItems.forEach(item => {
      const variant = item.getAttribute("data-variant");
      const imgSrc = item.querySelector("img")?.src;
      if (imgSrc) {
        const img = new Image();
        img.src = imgSrc;
        img.setAttribute('fetchpriority', 'high');
        this.imageCache.set(variant, img);
      }
    });
  
    const loadPromises = Array.from(this.imageCache.values()).map(img => 
      new Promise(resolve => img.onload = resolve)
    );
    Promise.all(loadPromises).then(() => {
      console.log("All images preloaded");
    });
  }

  onRadioChange() {
    this.size = getSelectedSize();
    this.base = getSelectedBase();
    this.seat = getSelectedSeat();
    this.detail = getSelectedDetail();
    this.configuration = getSelectedConfiguration();
    this.leg = getSelectedLeg();
    this.setDefaultSize();
    this.getSelectedRadio();
    //this.setWeltRadio();
    if (!this.welt) return;
    this.updateOptionLegend();
    this.updateMedia();
    this.updateCustomizeImage();
    enableZoomOnHover();
    this.selects.checkWaverlyFurnitureOption();
  }

  setDefaultSize() {
    const productType = (this.getAttribute('data-product-type') || '').toLowerCase();
    
    const autoClick = (name) => {
      const radios = document.querySelectorAll(`input[name="${name}"]`);
      if (radios.length > 0) {
        radios[0].click();
        return radios[0].value;
      }
      return null;
    };

    if (productType === 'headboard' || productType === 'sofa') {
      // if (!this.size) {
      //   this.size = autoClick('Size');
      // }
    }

    if (productType === 'chair') {
      // if (!this.base) {
      //   this.base = autoClick('Base');
      // }
    }

    if (productType === 'sectional') {
      // if (!this.configuration) {
      //   this.configuration = autoClick('Configuration');
      // }

      // if (!this.leg) {
      //   this.leg = autoClick('properties[Wood Finish]');
      // }
    }

    if (productType === 'sofa' || productType === 'sleeper') {
      // if (!this.seat) {
      //   this.seat = autoClick('Seat');
      // }

      // if (!this.detail) {
      //   this.detail = autoClick('Detail');
      // }
    }
  }

  // setDefaultSize() {
  //   if (this.getAttribute('data-product-type').toLowerCase() == 'headboard' || this.getAttribute('data-product-type').toLowerCase() == 'sofa') {
  //     if (!this.size) {
  //       const sizeRadios = document.querySelectorAll('input[name="Size"]');
  //       if (sizeRadios.length > 0) {
  //         sizeRadios[0].click();
  //         this.size = sizeRadios[0].value;
  //       }
  //     }
  //   }
  //   if (this.getAttribute('data-product-type').toLowerCase() == 'chair') {
  //     if (!this.base) {
  //       const baseRadios = document.querySelectorAll('input[name="Base"]');
  //       if (baseRadios.length > 0) {
  //         baseRadios[0].click();
  //         this.base = baseRadios[0].value;
  //       }
  //     }
  //   }
  //   if (this.getAttribute('data-product-type').toLowerCase() == 'sofa') {
  //     if (!this.seat) {
  //       const seatRadios = document.querySelectorAll('input[name="Seat"]');
  //       if (seatRadios.length > 0) {
  //         seatRadios[0].click();
  //         this.seat = seatRadios[0].value;
  //       }
  //     }

  //     if (!this.detail) {
  //       const detailRadios = document.querySelectorAll('input[name="Detail"]');
  //       if (detailRadios.length > 0) {
  //         detailRadios[0].click();
  //         this.seat = detailRadios[0].value;
  //       }
  //     }
  //   }
  // }

  // setWeltRadio() {
  //   if (!this.welt) return;
  //   const selected = Array.from(this.weltRadios).find(
  //     (weltRadio) => weltRadio.value == `${this.welt.handle}`
  //   );
    
  //   selected.checked = true;
  // }

  updateOptionLegend() {
    if (!this.optionLegend) return;
    this.optionLegend.innerText = this.welt.handle;
  }
   
  updateMedia() {
    if ((!this.size && !this.welt.handle && !this.base) || !this.welt) return;
    const imageBaseString = `${this.detail ? handleize(this.detail) + '-' : ''}${this.size ? handleize(this.size) + '-' : ''}${this.base? handleize(this.base) + '-': ''}selfwelt`;
    const imageString = `${this.detail ? handleize(this.detail) + '-' : ''}${this.size ? handleize(this.size) + '-' : this.base? handleize(this.base) + '-' : '' }${handleize(this.welt.handle)}`;
    // Product Pages
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");

    if (mainSlider && thumbnailSlider) {
      const imageBaseMedia = mainSlider.querySelector(
        `[data-variant="${imageBaseString}"]`
      );
      const imageBaseMediaThumbnail = thumbnailSlider.querySelector(
        `[data-variant="${imageBaseString}"]`
      );

      if (imageBaseMedia) {
        this.imageEl.value = imageBaseMedia.querySelector("img.image-magnify-hover").src;
      }

      if (imageBaseMedia) {
        this.baseWeltImage.value = imageBaseMedia.querySelector('img').src;
        mainSlider?.querySelectorAll('ul.slider li').forEach((slide) => {
          slide.classList.remove('is-active');
        });
        imageBaseMedia.classList.add("is-active");
        mainSlider?.querySelector("ul").scroll({
          top: 0,
          left: imageBaseMedia.offsetLeft,
        });
      }
      
      if (imageBaseMediaThumbnail) {
        thumbnailSlider.querySelectorAll("[data-variant]").forEach((img) => {
          img.classList.add("product__media-item--additional-image");
          img.classList.remove("is-active");
        });
        
        thumbnailSlider.querySelectorAll('ul.slider li').forEach((slide) => {
          slide.classList.remove('is-active');
        })
        thumbnailSlider.querySelectorAll('ul.slider li[data-variant]').forEach((thumbnail) => {
          thumbnail.classList.add("product__media-item--additional-image");
        })
        imageBaseMediaThumbnail.classList.add("is-active");
        imageBaseMediaThumbnail.classList.remove('product__media-item--additional-image');
        thumbnailSlider.querySelector("ul").scroll({
          top: 0,
          left: imageBaseMediaThumbnail.offsetLeft, 
        });
      }

      const existingOverlay = mainSlider.querySelector('.overlay-image.welt-image');
      const existingBaseDesktop = mainSlider.querySelector('.base-image.welt-image');
      const existingBaseMobile = thumbnailSlider.querySelector('.base-image.welt-image');
      existingOverlay?.remove();
      existingBaseDesktop?.remove();
      existingBaseMobile?.remove();

      if (handleize(this.welt.handle) != 'self-welt') {
        const mainThumbnail = mainSlider.querySelector(
          `[data-variant="${imageString}"]`
        );
        const imgSrc = mainThumbnail?.querySelector('img').src;
        if (imgSrc && mainThumbnail) {
          const overlayImage = document.createElement('img');
          overlayImage.srcset =  mainThumbnail?.querySelector('img').srcset;
          overlayImage.src = imgSrc;
          overlayImage.sizes = "100vw";
          overlayImage.loading = "lazy";
          overlayImage.alt = "overlay";
          overlayImage.classList.add('overlay-image', 'welt-image');

          const mediaDiv = imageBaseMedia?.querySelector(".media");
          if (mediaDiv) {
            mediaDiv.appendChild(overlayImage);
          }
         

          if (existingBaseMobile) {
            existingBaseMobile.remove();
          }
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
    if ((!this.size && !this.welt.handle) || !this.welt) return;
    if (handleize(this.welt.handle) == 'self-welt') {
      this.imageCustomizedEl.value = '';
      return;
    }
  
    const mainSlider = document.querySelector(".main-images-slider");
    const existingOverlay = mainSlider.querySelector('.welt-image');
    if (!existingOverlay || !this.imageCache) return;
  
    const canvas = document.getElementById("canvas-custom-builder");
    const ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 1000;
  
    const imageBaseString = `${this.detail ? handleize(this.detail) + '-' : ''}${this.size ? handleize(this.size) + '-' : ''}${this.base ? handleize(this.base) + '-' : ''}selfwelt`;
    const imageString = `${this.detail ? handleize(this.detail) + '-' : ''}${this.size ? handleize(this.size) + '-' : this.base ? handleize(this.base) + '-' : ''}${handleize(this.welt.handle)}`;
  
    const baseImage = this.imageCache.get(imageBaseString);
    const overlayImage = this.imageCache.get(imageString);
    if (!baseImage || !overlayImage) return;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
  
    const file = dataURItoBlob(canvas.toDataURL("image/webp"));
    setupFileInput(this.imageCustomizedEl, file);
    this.imageZoom.src = canvas.toDataURL();
  
    if (document.querySelector('.media .base-image.welt-image')) {
      document.querySelector('.media .base-image.welt-image').src = canvas.toDataURL();
    } else {
      const imageBaseMedia = thumbnailSlider.querySelector(`[data-variant="${imageBaseString}"]`);
      if (imageBaseMedia) {
        const baseImageMobile = document.createElement('img');
        baseImageMobile.src = canvas.toDataURL();
        baseImageMobile.sizes = "100vw";
        baseImageMobile.loading = "eager";
        baseImageMobile.setAttribute('fetchpriority', 'high');
        baseImageMobile.alt = "overlay";
        baseImageMobile.classList.add('base-image', 'welt-image', 'image-magnify-hover');
        imageBaseMedia.querySelector('.media').appendChild(baseImageMobile);

        thumbnailSlider.querySelectorAll('ul.slider li[data-variant]').forEach((thumbnail) => {
          thumbnail.classList.add("product__media-item--additional-image");
        })
        thumbnailSlider.querySelectorAll('ul.slider li').forEach((thumbnail) => {
          thumbnail.classList.remove('is-active');
        });
        imageBaseMedia.classList.remove("product__media-item--additional-image");
        imageBaseMedia.classList.add("is-active");
        thumbnailSlider.querySelector("ul").scroll({
          top: 0,
          left: imageBaseMedia.offsetLeft,
        });
      }
    }
    enableZoomOnHover(2);
  }

  setTrimFromURL() {
    if (!location.search) return;
    const params = Object.fromEntries(new URLSearchParams(location.search));
    if (params.welt && params.welt != 'undefined' && document.querySelectorAll(`input[name="properties[Trim]"]`)) {
      if (params.welt != 'Self Welt') {
        document.querySelector(`input[name="properties[Trim]"][value='Self Welt']`).removeAttribute('checked');
        document.querySelector(`input[name="properties[Trim]"][value='Self Welt']`).checked = false;
      }
      document.querySelector(
        `input[name="properties[Trim]"][value='${params.welt}']`
      ).checked = true;
    }

    if (params.legColor && params.legColor != 'undefined' && document.querySelectorAll(`input[name="properties[Wood Finish]"]`)) {
      if (document.querySelectorAll(`input[name="properties[Wood Finish]"]`))
      document.querySelector(
        `input[name="properties[Wood Finish]"][value='${params.legColor}']`
      ).checked = true;
    } 
    this.onRadioChange();
  }

  getSelectedRadio() {
    this.selectedWeltInput = this.querySelector("input:checked");
    if (!this.selectedWeltInput) return;
    this.welt = {
      handle: this.selectedWeltInput.value,
      type: this.selectedWeltInput.dataset.type,
    };
  }
}
customElements.define("welt-radios", WeltRadios);

class LegRadios extends WeltRadios {
  constructor() {
    super();
    this.optionLegend = this.querySelector(".product-form__input-wood-finish")?.querySelector(".form__label").querySelector("span");
    this.legRadios = document.querySelectorAll('input[name="properties[Wood Finish]"]');
  }

  onRadioChange() {

    this.size = getSelectedSize();
    const productType = (window.productType || '').toLowerCase();
    this.base = productType === 'sectional' ? '' : getSelectedBase();
    this.detail = getSelectedDetail();
    this.setDefaultSize();
    this.getSelectedRadio();
    this.setLegRadio();
    if (!this.leg) return;
    this.updateOptionLegend();
    this.updateMedia();
    this.updateCustomizeImage();
    enableZoomOnHover();

  }

  setDefaultSize() {
    //const productType = (window.productType || '').toLowerCase();

    // if (!this.size) {
    //   const sizeRadios = document.querySelectorAll('input[name="Size"]');
    //   if (sizeRadios.length > 0) {
    //     sizeRadios[0].click();
    //     this.size = sizeRadios[0].value;
    //   }
    // }
    // if (productType !== 'sectional' && !this.base) {
    //   const baseRadios = document.querySelectorAll('input[name="Base"]');
    //   if (baseRadios.length > 0) {
    //     baseRadios[0].click();
    //     this.base = baseRadios[0].value;
    //   }
    // }
    return;
  }

  setLegRadio() {
    if (!this.leg) return;
    const selected = Array.from(this.legRadios).find(
      (legRadio) => legRadio.value == `${this.leg.handle}`
    );
    selected.checked = true;
  }

  updateOptionLegend() {
    if (!this.optionLegend) return;
    this.optionLegend.innerText = this.leg.handle;
  }

  updateMedia() {
    if ((!this.size && !this.leg.type && !this.base) || !this.leg) return;
    const imageBaseString = `${this.detail ? handleize(this.detail) + '-' : ''}${this.size ? handleize(this.size) + '-' : ''}${this.base? handleize(this.base) + '-': ''}selfwelt`;
    const imageString = productType === 'sectional'
      ? `${this.size ? handleize(this.size) + '-' : ''}${handleize(this.leg.handle)}`
      : `${this.size ? handleize(this.size) + '-' : ''}${handleize(this.base)}-${handleize(this.leg.handle)}`;
    // Product Pages
    const mainSlider = document.querySelector(".main-images-slider");
    const thumbnailSlider = document.querySelector(".thumbnail-slider");

    if (mainSlider && thumbnailSlider) {
      const imageBaseMedia = mainSlider.querySelector(
        `[data-variant="${imageBaseString}"]`
      );
      const imageBaseMediaThumbnail = thumbnailSlider.querySelector(
        `[data-variant="${imageBaseString}"]`
      );

      if (imageBaseMedia) {
        this.imageEl.value = imageBaseMedia.querySelector("img.image-magnify-hover").src;
      }

      if (imageBaseMedia) {
        this.baseWeltImage.value = imageBaseMedia.querySelector('img').src;
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

      const existingOverlay = mainSlider.querySelector('.overlay-image.leg-image');
      const existingBaseDesktop = mainSlider.querySelector('.base-image.leg-image');
      const existingBaseMobile = thumbnailSlider.querySelector('.base-image.leg-image');
      const imgSrc = mainThumbnail?.querySelector('img').src;
      existingBaseDesktop?.remove();
      existingOverlay?.remove();
      existingBaseMobile?.remove();

      if (imgSrc && mainThumbnail) {
        const overlayImage = document.createElement('img');
        overlayImage.srcset =  mainThumbnail?.querySelector('img').srcset;
        overlayImage.src = imgSrc;
        overlayImage.sizes = "100vw";
        overlayImage.loading = "lazy";
        overlayImage.alt = "overlay";
        overlayImage.classList.add('overlay-image', 'leg-image');

        const mediaDiv = imageBaseMedia?.querySelector(".media");
        if (mediaDiv) {
          mediaDiv.appendChild(overlayImage);
        }

        if (existingBaseMobile) {
          existingBaseMobile.remove();
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
    if ((!this.size && !this.leg.type && !this.base) || !this.leg) return;
    const mainSlider = document.querySelector(".main-images-slider");
    const existingOverlay = mainSlider.querySelector('.overlay-image.leg-image');

    if (existingOverlay) {
      const canvas = document.getElementById("canvas-custom-builder"),
      ctx = canvas.getContext("2d");
      canvas.width = 1000;
      canvas.height = 1000;

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
        setupFileInput(this.imageCustomizedEl, dataURItoBlob(canvas.toDataURL("image/webp")));
        this.imageZoom.src = canvas.toDataURL();
        if (document.querySelector('.media .base-image.leg-image')) {
          document.querySelector('.media .base-image.leg-image').src = canvas.toDataURL();
        } else {
          const imageBaseString = `${this.detail ? handleize(this.detail) + '-' : ''}${this.size ? handleize(this.size) + '-' : ''}${this.base? handleize(this.base) + '-': ''}selfwelt`;
          const imageBaseMedia = thumbnailSlider.querySelector(`[data-variant="${imageBaseString}"]`);
          if (imageBaseMedia) {
            const baseImageMobile = document.createElement('img');
            baseImageMobile.src = canvas.toDataURL();
            baseImageMobile.sizes = "100vw";
            baseImageMobile.loading = "eager";
            baseImageMobile.alt = "overlay";
            baseImageMobile.classList.add('base-image', 'leg-image', 'image-magnify-hover');
            
            imageBaseMedia.querySelector('.media').appendChild(baseImageMobile);
            
            thumbnailSlider.querySelectorAll('ul.slider li').forEach((slide) => {
              slide.classList.remove('is-active');
            })
            thumbnailSlider.querySelectorAll('ul.slider li[data-variant]').forEach((thumbnail) => {
              thumbnail.classList.add("product__media-item--additional-image");
            })
            imageBaseMedia.classList.remove('product__media-item--additional-image');
            imageBaseMedia.classList.add("is-active");
            thumbnailSlider.querySelector("ul").scroll({
              top: 0,
              left: imageBaseMedia.offsetLeft,
            });
          }
        }
        enableZoomOnHover(2);
      })
      .catch(err => console.error(err));
    }
  }

  getSelectedRadio() {
    this.selectedLegInput = this.querySelector("input:checked");
    if (!this.selectedLegInput) return;
    this.leg = {
      handle: this.selectedLegInput.value
    };
  }
}
customElements.define("leg-radios", LegRadios);

function dataURItoBlob(dataURI) {
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
    `custom-furniture-builder.png`,
    { type: "image/png", lastModified: new Date().getTime() }
  );
  return file;
}

function setupFileInput(imageCustomizedEl, file) {
  let fileInputElement = imageCustomizedEl;
  
  let container = new DataTransfer();
  container.items.add(file);

  fileInputElement.files = container.files;
}

function handleizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getSelectedSize() {
  return document.querySelector('input[name="Size"]:checked')?.value;
}

function getSelectedLeg() {
  return document.querySelector('input[name="properties[Wood Finish]"]:checked')?.value;
}

function getSelectedDetail() {
  const checkedInput = document.querySelector('input[name="Detail"]:checked');
  if (!checkedInput) return undefined;

  return checkedInput.value.includes('Channel') ? 'channel' : 'flat';
}

function getSelectedBase() {
  return document.querySelector('input[name="Base"]:checked')?.value;
}

function getSelectedSeat() {
  return document.querySelector('input[name="Seat"]:checked')?.value;
}

function getSelectedConfiguration() {
  return document.querySelector('input[name="Configuration"]:checked')?.value;
}