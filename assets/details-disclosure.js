class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector("details");
    this.submenu = this.querySelector(".header__submenu");
    this.headerLinks = document
      .querySelector(".header__inline-menu")
      .querySelectorAll("a.text-link:not(.caption-large)");

    if (!this.mainDetailsToggle) return;

    this.mainDetailsToggle.addEventListener(
      "focusout",
      this.onFocusOut.bind(this)
    );
    
    if (
      this.classList.contains("header") &&
      window.matchMedia(`(hover: hover)`).matches
    ) {
      this.mainDetailsToggle.addEventListener(
        "mouseenter",
        this.open.bind(this)
      );
      this.submenu.addEventListener("mouseleave", this.close.bind(this));
      if (this.headerLinks) {
        this.headerLinks.forEach((link) =>
          link.addEventListener("mouseover", this.close.bind(this))
        );
      }
      if (this.classList.contains('mobile--header')) {
        this.mainDetailsToggle.addEventListener("mouseleave", this.close.bind(this));
      }
    } else if (
      this.classList.contains("header") &&
      !window.matchMedia(`(hover: hover)`).matches
    ) {
      this.mainDetailsToggle.addEventListener("click", this.open.bind(this));
    }
    if (this.classList.contains("header")) {
      this.mainLinkInDetails = this.querySelectorAll('details summary span[data-href]');
      if (this.mainLinkInDetails.length) {
          this.mainLinkInDetails.forEach((link) => {
          link.addEventListener('click', () => {
            const href = link.getAttribute('data-href');
            window.location.href = href;
          })
        })
      }
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  open(e) {
    // console.log(e, e.currentTarget, e.target, e.target.nodeName);
    if (e.target.nodeName == "A" && !e.target.classList.contains("text-link")) {
      e.preventDefault();
    } else if (e.target.nodeName == "SUMMARY" || e.target.nodeName == "SPAN") {
      e.preventDefault();
    }
    document
      .querySelector(".header__inline-menu")
      .querySelectorAll("details-disclosure")
      .forEach((detailsDisclosure) => {
        if (detailsDisclosure == this) {
          return;
        }
        detailsDisclosure.close();
      });
    document
      .querySelector(".header__inline-mobile-menu")
      .querySelectorAll("details-disclosure")
      .forEach((detailsDisclosure) => {
        if (detailsDisclosure == this) {
          return;
        }
        detailsDisclosure.close();
      });
    this.mainDetailsToggle.setAttribute("open", true);
  }

  close() {
    this.mainDetailsToggle.removeAttribute("open");
    this.mainDetailsToggle
      .querySelector("summary")
      .setAttribute("aria-expanded", false);
  }
}

customElements.define("details-disclosure", DetailsDisclosure);
