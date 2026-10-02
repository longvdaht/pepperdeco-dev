// add all custom JS code here

//
// Covet.pics customizations
//

function setPopupStyles(node) {
  // product box size
  let customStyles = document.createElement("style");
  node.style.setProperty('--covet-font-family', "'sweet-sans-pro', sans-serif");
  node.style.setProperty('--covet-custom-popup-links-btn-letter-spacing', '1px');
  node.style.setProperty('--covet-custom-popup-links-btn-font-weight', '200');

customStyles.innerHTML = `
.links .product-link { height: 165px !important; }
.links .product-title {    
    white-space: normal !important;
    display: -webkit-box !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    overflow: hidden !important;
    line-height: 12px !important;
    font-weight: 300 !important;
    letter-spacing: .05em !important;
    color: rgb(var(--color-base-text)) !important;
    text-transform: none !important; 
  }
.links .btn-buy .btn-title { color: #7C784E !important; border: none !important; text-decoration: underline; }
.links .btn-buy .btn-title:hover { color: #A49F73 !important; }
.links .btn-buy { background: none !important; color: rgb(var(--color-base-button-background-secondary)) !important; text-decoration: none; text-underline-offset: .5rem !important; }
`;
  node.shadowRoot.appendChild(customStyles);
}

function setWidgetStyles(node) {
  node.style.setProperty('--covet-font-family', "'sweet-sans-pro', sans-serif");
  if (node.shadowRoot) {
    let widgetStyles = document.createElement("style");
    widgetStyles.innerHTML = `
      .load-more .btn-load-more { color: rgb(var(--color-arrow));font-weight: 500;border-color: rgb(var(--color-arrow));transition: background-color .15s ease-in-out;font-size: 1.1rem;line-height: 1;padding-bottom: 0.5rem;letter-spacing: .1em;text-underline-offset: 0.5rem; }
      .load-more .btn-load-more.btn_style_1 { border-color: rgb(var(--color-arrow)); }
      .load-more .btn-load-more:hover { color: #A49F73; }
    `;
    node.shadowRoot.appendChild(widgetStyles);
  } else {
    setTimeout(() => {
      if (node.shadowRoot) {
        let widgetStyles = document.createElement("style");
        widgetStyles.innerHTML = `
          .load-more .btn-load-more { color: rgb(var(--color-arrow));font-weight: 500;border-color: rgb(var(--color-arrow));transition: background-color .15s ease-in-out;font-size: 1.1rem;line-height: 1;padding-bottom: 0.5rem;letter-spacing: .1em;text-underline-offset: 0.5rem; }
          .load-more .btn-load-more.btn_style_1 { border-color: rgb(var(--color-arrow)); }
          .load-more .btn-load-more:hover { color: #A49F73; }
        `;
        node.shadowRoot.appendChild(widgetStyles);
      }
    }, 500);
  }
}

function setUploadFormStyles(node) {
  let uploadWidgetStyle = document.createElement("style");
  uploadWidgetStyle.innerHTML = `
      .btn-skip  { display: none !important }
      .upload-h2, .upload-text-drop, .upload-text.completed { font-weight: var(--font-heading-weight) !important; letter-spacing: var(--font-heading-spacing) !important; }
      .upload-h3 { letter-spacing: var(--font-heading-spacing) !important; }
      .upload-text-drop { text-transform: uppercase }

      .upload-h2 { text-transform: uppercase; }
      .upload-text.completed { color: #000000; margin-top: 160px; }
      .svg-completed { display: none }
      .upload-submit {
        background-color: rgb(var(--color-base-button-background-hover)) !important;
        color: rgb(var(--color-base-button-label)) !important;
        font-size: 1.1rem !important;
        font-weight: var(--font-button-weight) !important;
        letter-spacing: .1em !important;
        text-transform: uppercase !important;
      }
  `;
  node.shadowRoot.appendChild(uploadWidgetStyle);
}

const callbackObserve = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        switch (node.nodeName) {
          case "COVET-PICS-WIDGET":
            setWidgetStyles(node);
            break;
          case "COVET-PICS-POPUP":
            setPopupStyles(node);
            break;
          case "COVET-PICS-UPLOAD":
            // code block
            setUploadFormStyles(node);
            break;
        }
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callbackObserve);
const container = document.documentElement || document.body;
observer.observe(container, {
  attributes: false,
  childList: true,
  subtree: true,
});

// on all slider widgets - always show left / right arrows
document.addEventListener("galleryReady:covetPics", function (e) {
  if (e.detail.el.nodeName == "COVET-PICS-GALLERY-SLIDER") {
    const customArrowStyles = document.createElement("style");
    customArrowStyles.innerHTML = `
      .swiper .swiper-button-next svg, .swiper .swiper-button-prev svg { opacity: 1 !important; background-color: #a49f73 !important; }
    `;
    e.detail.el.appendChild(customArrowStyles);
  }
});

// Use product name from prod. page in Covet.pics popup
function changeTitles() {
  let popup = document.querySelector(
    "covet-pics-popup.covet-pics-popup-open"
  ).shadowRoot;
  let links = popup.querySelectorAll(".product-link");
  links.forEach((link) => {
    fetch(link.href)
      .then((response) => response.text())
      .then((text) => {
        let parser = new DOMParser();
        let htmlDocument = parser.parseFromString(text, "text/html");
        link.querySelector(".product-title").innerHTML =
          htmlDocument.documentElement.querySelector(
            "h1.product__title"
          ).innerHTML;
      });
  });
}

document.addEventListener("modalOpen:covetPics", function (e) {
  setTimeout(changeTitles, 250);
});

document.addEventListener("modalChanged:covetPics", function (e) {
  setTimeout(changeTitles, 250);
});



document.addEventListener("DOMContentLoaded", function() {
  function updateActiveLAbel() {
    const productAddLabels = document.querySelectorAll('.product-slider-mobile li label');
    productAddLabels.forEach(productAddLabel => {
      productAddLabel.addEventListener('click', function() {
        const selectedE = productAddLabel.closest('.product-slider-mobile').querySelector("li label.label-active");
        if (selectedE) {
          selectedE.classList.remove('label-active');
        }
  
        productAddLabel.classList.add('label-active');
      });
    });
  }
  
  function checkAdditionalSection() {
   const additionalS = document.querySelectorAll('.template-product .section-outer.section-product-additional');
   additionalS.forEach(additional => {
    if (additional.classList.contains('hidden')) {
      const divideSection = additional.closest('main').querySelector(".shopify-section.section-divider");
      if (divideSection) {
        divideSection.classList.add('hidden');
      }
    }
  });
  }

  updateActiveLAbel();
  checkAdditionalSection();

  //
  // Covet.pics customizations - end
  //

  document.querySelectorAll(".option-link.option-tooltip--wrapper").forEach((wrapper) => {
    const icon = wrapper.querySelector(".tooltip-icon");
    const tooltip = wrapper.querySelector(".tooltip-fabric-options");

    if (!icon || !tooltip) return;

    icon.addEventListener("click", function (event) {
      event.stopPropagation();
      tooltip.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (!wrapper.contains(event.target)) {
        tooltip.classList.remove("active");
      }
    });
  });

  const switchOptionButtons = document.querySelectorAll('.image-option.image-option-action');
  if (switchOptionButtons) {
    switchOptionButtons.forEach((buttonAction) => {
      buttonAction.addEventListener('click', (event) => switchImageToggle(event));
    }) 
  }
});

function switchImageToggle(event) {
  event.preventDefault();
  console.log(event)
  let target = event.target;
  if (target.nodeName.toLowerCase() === 'span') {
    target = event.target.parentElement;
  }
  const imageListAfter = document.querySelectorAll('.image-option-after');
  if (imageListAfter) {
    if (target.classList.contains('image-option-show')) {
      target.classList.add('hidden');
      const switchHide = document.querySelector('.image-option-hide');
      // const textUnder = document.querySelector('.switch-option-text-under');
      if (switchHide) switchHide.classList.remove('hidden');
      // if (textUnder) textUnder.classList.remove('hidden');
      imageListAfter.forEach((imageAfter) => {
        imageAfter.classList.add('active');
      });
    } else {
      target.classList.add('hidden');
      const switchShow = document.querySelector('.image-option-show');
      // const textUnder = document.querySelector('.switch-option-text-under');
      if (switchShow) switchShow.classList.remove('hidden');
      // if (textUnder) textUnder.classList.add('hidden');
      imageListAfter.forEach((imageAfter) => {
        imageAfter.classList.remove('active');
      });
    }
  }
}
