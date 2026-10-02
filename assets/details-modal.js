class DetailsModal extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector("details");
    this.summaryToggle = this.querySelector("summary");

    if (this.detailsContainer) {
      this.detailsContainer.addEventListener(
        "keyup",
        (event) => event.code.toUpperCase() === "ESCAPE" && this.close()
      );
    }
    if (this.summaryToggle) {
      this.summaryToggle.addEventListener(
        "click",
        this.onSummaryClick.bind(this)
      );
    }

    if (this.summaryToggle) {
      this.summaryToggle.setAttribute("role", "button");
      this.summaryToggle.setAttribute("aria-expanded", "false");
    }
    this.addEventListener('click', (e) => {
      if (e.target.closest('button[type="button"].modal__close-button')) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.detailsContainer.hasAttribute("open");
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest("details").hasAttribute("open")
      ? this.close()
      : this.open(event);
  }

  onBodyClick(event) {
    if (event.target.classList.contains("modal-overlay")) this.close(false);
  }

  open(event) {
    this.onBodyClickEvent =
      this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest("details").setAttribute("open", true);
    document.querySelector("sticky-header").preventReveal = true;
    document.body.addEventListener("click", this.onBodyClickEvent);
    document.body.classList.add("overflow-hidden");
    // used for embroidery
    this.dispatchEvent(new CustomEvent("modal-open", { bubbles: true }));
    window.scrollTo({ top: 0, behavior: "instant" });

    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    );

    // The search modal animates in, so on browsers that still report it as
    // hidden during that first frame the focus above is dropped. Re-assert it
    // on the next frame, and only when it did not land.
    if (this.classList.contains("header__search")) {
      const searchInput = this.detailsContainer.querySelector(".search__input");
      if (searchInput && document.activeElement !== searchInput) {
        requestAnimationFrame(() => searchInput.focus());
      }
    }
  }

  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    this.detailsContainer.removeAttribute("open");
    document.body.removeEventListener("click", this.onBodyClickEvent);
    document.body.classList.remove("overflow-hidden");
    this.dispatchEvent(new CustomEvent("modal-close", { bubbles: true }));
  }

}

customElements.define("details-modal", DetailsModal);
