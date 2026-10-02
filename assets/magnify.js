// create a container and set the full-size image as its background
function createOverlay(image) {
  const overlayImage = document.createElement('img');
  overlayImage.setAttribute('src', `${image.src}`);
  overlay = document.createElement('div');
  if (image.classList.contains('overlay-image') && !image.classList.contains('image-magnify-hover')) {
    const imageSrc = document.querySelector('.overlay-image-zoom img').src;
    overlayImage.setAttribute('src', `${imageSrc}`);
  }
  
  prepareOverlay(overlay, overlayImage);

  image.style.opacity = '50%';

  overlayImage.onload = () => {
    image.parentElement.insertBefore(overlay, image);
    image.style.opacity = '100%';
  };

  return overlay;
}

function prepareOverlay(container, image) {
  container.setAttribute('class', 'image-magnify-full-size');
  container.setAttribute('aria-hidden', 'true');
  container.style.backgroundImage = `url('${image.src}')`;
  container.style.backgroundColor = 'var(--gradient-background)';
}

function moveWithHover(image, event, zoomRatio) {
  // calculate mouse position
  const ratio = image.height / image.width;
  const container = event.target.getBoundingClientRect();
  const xPosition = event.clientX - container.left;
  const yPosition = event.clientY - container.top;
  const xPercent = `${xPosition / (image.clientWidth / 100)}%`;
  const yPercent = `${yPosition / ((image.clientWidth * ratio) / 100)}%`;

  // determine what to show in the frame
  overlay.style.backgroundPosition = `${xPercent} ${yPercent}`;
  overlay.style.backgroundSize = `${image.width * zoomRatio}px`;
}

function magnify(image, zoomRatio, isOverlay) {
  const overlay = createOverlay(image, isOverlay);
  overlay.onclick = () => overlay.remove();
  overlay.onmousemove = (event) => moveWithHover(image, event, zoomRatio);
  overlay.onmouseleave = () => overlay.remove();
}

function enableZoomOnHover(zoomRatio) {
  const images = document.querySelectorAll('.enable-zoom .image-magnify-hover');
  images.forEach((image) => {
    destroyZoom(image);
    
    const parentSliderComponent = image.parentElement.parentElement.parentElement.parentElement;

    if (window.matchMedia('(max-width: 640px)').matches && parentSliderComponent.classList.contains('enable-zoom') && !image.classList.contains('base-image')) {
      const el = image.parentElement;
      const instance = new PinchZoom.default(el, { minZoom: 1 });
      el.pzInstance = instance;

      const container = el.parentElement;
      const zoomInBtn = document.querySelector('.zoom-in');
      const zoomOutBtn = document.querySelector('.zoom-out');
      el.addEventListener('pz_doubletap_done', () => {
        const zoomFactor = el.pzInstance?.zoomFactor ?? 1;
        if (zoomFactor <= 1.01) {
          zoomInBtn.classList.remove('hidden');
          zoomOutBtn.classList.add('hidden');
          container.style.pointerEvents = 'none';
        } else {
          zoomInBtn.classList.add('hidden');
          zoomOutBtn.classList.remove('hidden');
          container.style.pointerEvents = 'auto';
        }
      });
    } else {
      image.onmouseover = (event) => {
        magnify(image, zoomRatio);
        moveWithHover(image, event, zoomRatio);
      };
    }
  });

function destroyZoom(image) {
  const pzContainer = image.closest('.pinch-zoom-container');
  if (pzContainer) {
    const parent = pzContainer.parentElement;
    while (pzContainer.firstChild) {
      parent.insertBefore(pzContainer.firstChild, pzContainer);
    }
    pzContainer.remove();
  }

  const el = image.parentElement;
  if (el?.pzInstance) {
    el.pzInstance = null;
  }

  image.onmouseover = null;
}

  // const imageBases = document.querySelectorAll('.main-images-slider.enable-zoom .base-image');
  // if (imageBases.length) {
  //   imageBases.forEach((base) => {
  //     const el = base.parentElement;
  //     new PinchZoom.default(el, {
  //       minZoom: 1
  //     });
  //   });
  // }

  const imagesOverlay = document.querySelectorAll('.enable-zoom .overlay-image'); 
  if (imagesOverlay.length) {
    imagesOverlay.forEach((overlay) => {
      overlay.onmouseover = (event) => {
        magnify(overlay, zoomRatio, true);
        moveWithHover(overlay, event, zoomRatio);
      };
    })
  }
  
  
  const zoomIn = document.querySelector('.main-images-slider.enable-zoom .zoom-in');
  const zoomOut = document.querySelector('.main-images-slider.enable-zoom .zoom-out');
  if (zoomIn) {
    zoomIn.addEventListener('click', () => {
      const slider = document.querySelector('.main-images-slider.enable-zoom');
      const activeSlide = getCurrentSlide(slider);
      const activeEl = activeSlide.querySelector('.base-image')
        ? activeSlide.querySelector('.base-image').parentElement
        : activeSlide.querySelector('.image-magnify-hover').parentElement;

      const pz = activeEl.pzInstance;
      if (pz) {
        const rect = pz.el.getBoundingClientRect();
        const center = {
          x: rect.width / 2,
          y: rect.height / 2
        };
        const targetZoom = 2;
        pz.scaleTo(targetZoom, center);
        pz.update();

        zoomOut.classList.remove('hidden');
        zoomIn.classList.add('hidden');
        activeEl.parentElement.style.pointerEvents = 'auto';
        slider.initPages();
      }
    });
  }

  if (zoomOut) {
    zoomOut.addEventListener('click', () => {
      const slider = document.querySelector('.main-images-slider.enable-zoom');
      const activeSlide = getCurrentSlide(slider);
      const activeEl = activeSlide.querySelector('.base-image')
        ? activeSlide.querySelector('.base-image').parentElement
        : activeSlide.querySelector('.image-magnify-hover').parentElement;

      const pz = activeEl.pzInstance;
      if (pz) {
        const targetZoom = 1;
        pz.scaleTo(targetZoom, { x: 0, y: 0 });
        pz.offset = { x: 0, y: 0 };
        pz.update();

        zoomOut.classList.add('hidden');
        zoomIn.classList.remove('hidden');
        activeEl.parentElement.style.pointerEvents = 'none';
        slider.initPages();
      }
    });
  }
}

function zoomIn(pzInstance, step = 0.5) {
  const center = pzInstance.getCurrentZoomCenter();
  const newZoom = Math.min(pzInstance.zoomFactor + step, pzInstance.options.maxZoom);
  pzInstance.scaleTo(newZoom, center);
  pzInstance.update();
}

function zoomOut(pzInstance, step = 0.5) {
  const center = pzInstance.getCurrentZoomCenter();
  const newZoom = Math.max(pzInstance.zoomFactor - step, pzInstance.options.minZoom);
  pzInstance.scaleTo(newZoom, center);
  pzInstance.update();
}

function simulateDoubleTap(target) {
  const touchObj = new Touch({
    identifier: Date.now(),
    target: target,
    clientX: 100,
    clientY: 100,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  });

  const touchstart = new TouchEvent("touchstart", {
    bubbles: true,
    cancelable: true,
    touches: [touchObj],
    targetTouches: [touchObj],
    changedTouches: [touchObj]
  });

  const touchend = new TouchEvent("touchend", {
    bubbles: true,
    cancelable: true,
    touches: [],
    targetTouches: [],
    changedTouches: [touchObj]
  });

  target.dispatchEvent(touchstart);
  target.dispatchEvent(touchend);

  setTimeout(() => {
    target.dispatchEvent(touchstart);
    target.dispatchEvent(touchend);
  }, 100);
}

function getCurrentSlide(sliderComponent) {
  const scrollContainer = sliderComponent.querySelector('ul.slider');
  const slides = sliderComponent.querySelectorAll(
    'li.product__media-item--additional-image.is-active, li:not(.product__media-item--additional-image)'
  );
  const slideWidth = slides[0]?.offsetWidth || 1;
  const scrollLeft = scrollContainer.scrollLeft;
  const currentIndex = Math.round(scrollLeft / slideWidth);

  return slides[currentIndex];
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}


document.addEventListener("DOMContentLoaded", function() {
  enableZoomOnHover(2);

  const handleResize = debounce(() => {
    enableZoomOnHover(2);
  }, 300);

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
});
  