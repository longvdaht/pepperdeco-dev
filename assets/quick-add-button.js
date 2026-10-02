
class QuickAddButton extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector('button[data-variant-id]');
    this.button.addEventListener('click', (e) => this.handleClick(e))
  }
  handleClick(e) {
    const variant = e.target.dataset?.variantId;
    if (!variant) return;
    const body = {
      items: [{
        id: variant,
        quantity: 1
      }]
    };
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
    }).catch(err => console.error(err));
  }
}

customElements.define('quick-add-button', QuickAddButton);
