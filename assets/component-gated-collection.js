if (!customElements.get('gated-collection')) {
  class GatedCollection extends HTMLElement {
    constructor() {
      super()
      this.form = this.querySelector('form')
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this))
      this.companyId = "MJeKYj"
      this.selectors = ['.collection-filters', '.custom-filters', '#CollectionProductGrid', '.section-page-hero']
    }
    connectedCallback() {
      if (window.sessionStorage) {
        const signedUp = sessionStorage.getItem("SampleSale") || false
        if (!signedUp) {
          this.hideCollection()
          return
        }
        this.showCollection()
      }
    }
    onSubmitHandler(e) {
      e.preventDefault();
      const formData = new FormData(this.form)
      const email = formData.get('email')
      if (!this.validateEmail(email)) return this.showMessage('error-email');
      const data = {
        method: "POST",
        headers: {
          accept: "application/json",
          revision: "2023-12-15",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              custom_source: 'Sample Sale',
              profile: {
                data: {
                  type: 'profile',
                  attributes: {
                    email: email
                  }
                }
              }
            },
            relationships: { list: { data: { type: 'list', id: 'JH63iL' }}}
          }
        })
      }
      this.sendRequest(data)
    }
    sendRequest(e) {
      fetch("https://a.klaviyo.com/client/subscriptions/?company_id=" + this.companyId, e).then(response => {
        202 === response.status ? this.showMessage("success") : this.showMessage("error")
        if (window.sessionStorage) {
          sessionStorage.setItem("SampleSale", "true")
        }
        this.showCollection()
      }
      ).catch(e=>{
        console.error(e),
        this.showMessage("error")
      })
    }
    validateEmail(e) {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)
    }
    showMessage(e) {
      document.querySelector(".notify-message__" + e).classList.remove("hidden"),
      setTimeout(()=>{
        document.querySelector(".notify-message__" + e) && document.querySelector(".notify-message__" + e).classList.add("hidden")
      }
      , 6e3)
    }
    hideCollection() {
      this.selectors.forEach(selector => document.querySelector(selector).classList.add('hidden'))
    }
    showCollection() {
      this.selectors.forEach(selector => document.querySelector(selector).classList.remove('hidden'))
      this.classList.add('hidden')
    }
  }
  customElements.define('gated-collection', GatedCollection)
}
