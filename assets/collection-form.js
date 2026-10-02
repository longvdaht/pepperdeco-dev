
class CollectionForm extends HTMLElement {
  constructor() {
    super();
    this.cartCount = document.querySelector('.cart__indicator');
    this.buttons = this.querySelectorAll('button[data-variant-id]');
    
    this.products = [];

    this.productBar = this.querySelector('[id^="ProductBar-"]');
    if (!this.productBar) {
      this.productBar = document.querySelector('[id^="ProductBar-"]');
    }
    this.addAllButton = this.productBar.querySelector('button[type="submit"]');
    this.productCount = this.productBar.querySelector('[id^="ProductBarCount-"]');
    this.productBarImages = this.productBar.querySelector('[id^="ProductBar-Images-"]');

    this.addAllButton.addEventListener('click', this.addAllToCart.bind(this));

    this.productBarImages.addEventListener('click', this.removeVariant.bind(this));

    this.buttons.forEach(btn => btn.addEventListener('click', (e) => this.handleClick(e)))
    // this.toggleBeforeUnload.bind(this)
  }

  handleClick(e) {
    const image = this.querySelector(`[data-product-image="${e.currentTarget.dataset.variantId}"]`)
    this.variant = {
      id: e.currentTarget.dataset.variantId,
      image: image
    }
    if (!this.products.includes(this.variant.id)) {
      e.preventDefault();
      this.addOneToCart();
      this.products = [...this.products, this.variant.id];
      this.addVariantToBar()
      e.currentTarget.classList.add('in-cart');
    } else {
      e.preventDefault();
      this.products = this.products.filter(id => id !== e.currentTarget.dataset.variantId)
      this.removeOneFromCart();
      e.currentTarget.classList.remove('in-cart');
      this.productBar.querySelector(`li[data-variant-id="${e.currentTarget.dataset.variantId}"]`).remove();
      this.updateCount();
    }
  }

  addVariantToBar() {
    if (!this.variant) return;
    if (!this.productBar.classList.contains('is-active')) {
      this.productBar.classList.add('is-active');
      if (document.querySelector('.swatch-collection-filter')) {
        document.querySelector('.swatch-collection-filter').classList.add('bar-is-active');
      }
    }
    const li = document.createElement('li');
    li.dataset.variantId = this.variant.id;
    li.append(this.variant.image.cloneNode(true));
    this.productBarImages.append(li);
    this.updateCount();
  }

  removeVariant(e) {
    const parent = e.target.parentElement.tagName === 'LI' ? e.target.parentElement : e.target;
    if (!parent) return;
    this.products = this.products.filter(id => id !== parent.dataset.variantId)
    if (!parent.dataset.variantId) return;
    parent.remove();
    this.querySelector(`button[data-variant-id="${parent.dataset.variantId}"]`).classList.remove('in-cart');
    this.variant.id = parent.dataset.variantId;
    this.removeOneFromCart();
    this.updateCount();
  }

  updateCount() {
    if (!this.products) return;
    this.productCount.innerText = `(${this.products.length})`;
    if (this.products.length === 0) {
      this.productBar.classList.remove('is-active');
      if (document.querySelector('.swatch-collection-filter')) {
        document.querySelector('.swatch-collection-filter').classList.remove('bar-is-active');
      }
    }
    this.cartDrawer = document.querySelector('cart-drawer');
    this.cartDrawer.fetchCart();
    if (this.productBar) {
      const productBarSlider = this.productBar.querySelector('slider-component');
      if (productBarSlider) {
        productBarSlider.initPages();
      }
    }
    // this.toggleBeforeUnload();
  }

  addOneToCart() {
    // console.log('add one to cart', this.variant);
    if (!this.variant.id) return;
    const body = {
      items: [{
        id: this.variant.id,
        quantity: 1
      }]
    }

    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          // console.log(response)
          this.updateCount()
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  removeOneFromCart() {
    // console.log('remove one to cart', this.variant);
    if (!this.variant.id) return;
    const body = {
      updates: { [this.variant.id]: 0 }
    }

    fetch("/cart/update.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          // console.log(response)
          this.updateCount()
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  addAllToCart() {
    if (!this.products) return;
    const items = this.products.map(variant => {
      return {
        id: variant,
        quantity: 1
      }
    })

    const body = {
      items: items
    }

    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then(response => {
      return response.json();
    }).then(responseData => {
      document.querySelector('cart-drawer').fetchAndOpenCart();
    }).finally(() => {
      this.productBarImages.innerHTML = '';
      this.products = [];
      this.variant = null;
      this.productBar.classList.remove('is-active');
      this.buttons.forEach(button => {
        button.classList.remove('in-cart')
      })
    });
  }
  showWarning() {
    this.querySelector('.alert').classList.remove('visually-hidden');
  }
  hideWarning() {
    this.querySelector('.alert').classList.add('visually-hidden');
  }
  toggleBeforeUnload() {
    if (this.products.length == 0) return;
    const that = this;
    window.addEventListener('beforeunload', function (e) {
      that.showWarning();
      setTimeout(() => {
        that.hideWarning();
      }, 5000);
      that.addAllButton.focus();
      e.preventDefault();
      (e || window.event).returnValue = "You have items waiting to be added to your cart";
      return "You have items waiting to be added to your cart";
    });
  }
}

customElements.define('collection-form', CollectionForm);
