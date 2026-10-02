if (!customElements.get('bundle-button')) {
  customElements.define('bundle-button', class BundleButton extends HTMLElement {
    constructor() {
      super();
      this.bundleVariants = this.querySelectorAll('[data-variant-id]')
      this.productForm = document.querySelector('product-form')
      this.variantInput = this.productForm.querySelector('input[name="id"]')
      this.addButton = this.productForm.querySelector('button[name="add"]')
      this.addBundleButton = this.querySelector('button[name="bundle"]')
      this.cartDrawer = document.querySelector('cart-drawer');

      this.addBundleButton.addEventListener('click', this.handleAddClick.bind(this))
      this.variantInput.addEventListener('change', this.handleVariantChange.bind(this))
    }
    connectedCallback() {
      document.querySelector('.product-form__quantity').classList.add('visually-hidden')
      document.querySelector('.product-form__buy').classList.add('visually-hidden')

      this.addButton.disabled = true;
      this.variantId = this.getVariantId()
      this.variantJSON = this.getVariantJSON()
    }
    handleVariantChange() {
      this.variantId = this.getVariantId()
      this.variantJSON = this.getVariantJSON()

      setTimeout(() => {
        this.addButton.disabled = true;
        this.addBundleButton.innerHTML = this.addButton.innerHTML;
      }, 250);
    }

    handleAddClick() {
      const items = JSON.parse(this.variantJSON.textContent);
      const body = { "items": items }

      fetch(`${window.routes.cart_add_url}.js`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then(response => {
          if (response.status) {
            return
          }
        })
        .then(() => {
          this.cartDrawer.fetchAndOpenCart();
        })
        .catch(err => console.error(err))
    }

    getVariantId() {
      return this.variantInput.value;
    }
    getVariantJSON() {
      return Array.from(this.bundleVariants).find(bundleJSON => bundleJSON.dataset.variantId === this.variantId);
    }
  }
  )
}
