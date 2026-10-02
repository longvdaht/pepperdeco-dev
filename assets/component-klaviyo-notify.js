if (!customElements.get("klaviyo-notify")) {
  class KlaviyoNotify extends HTMLElement {
    constructor() {
      super(),
      this.form = this.querySelector("form"),
      this.form.addEventListener("submit", this.onSubmitHandler.bind(this)),
      this.companyId = "MJeKYj"
    }
    onSubmitHandler(e) {
      e.preventDefault();
      var e = new FormData(this.form),
        t = e.get("email"),
        e = e.get("variant");
      if (!this.validateEmail(t))
        return this.showMessage("error-email"),
        !1;
      t = {
        method: "POST",
        headers: {
          accept: "application/json",
          revision: "2023-10-15",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          data: {
            type: "back-in-stock-subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: {
                    email: "" + t
                  }
                }
              },
              channels: ["EMAIL"]
            },
            relationships: {
              variant: {
                data: {
                  type: "catalog-variant",
                  id: "$shopify:::$default:::" + e
                }
              }
            }
          }
        })
      };
      this.sendRequest(t)
    }
    sendRequest(e) {
      const t = this;
      fetch("https://a.klaviyo.com/client/back-in-stock-subscriptions/?company_id=" + this.companyId, e).then(e => {
        202 === e.status ? t.showMessage("success") : t.showMessage("error")
      }
      ).catch(e=>{
        console.error(e),
        t.showMessage("error")
      }
      )
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
  }
  customElements.define("klaviyo-notify", KlaviyoNotify)
}
