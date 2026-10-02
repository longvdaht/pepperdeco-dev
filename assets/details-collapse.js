if (!customElements.get("details-collapse")) {
  class DetailsCollapse extends HTMLElement {
    constructor() {
      super();
      this.details = this.querySelector("details");
      this.summary = this.details.querySelector("summary");
      this.breakpoint = this.dataset.collapse;
      this.onResize();

      window.addEventListener("resize", this.onResize.bind(this));
      this.summary.addEventListener("click", this.checkSummaryLink.bind(this));
    }

    onResize() {
      if (!this.breakpoint) return;
      if (
        this.breakpoint === "mobile" &&
        window.matchMedia("(max-width: 40em)").matches
      ) {
        this.details.removeAttribute("open");
      } else if (
        this.breakpoint === "tablet" &&
        window.matchMedia("(max-width: 60em)").matches
      ) {
        this.details.removeAttribute("open");
      } else {
        this.details.setAttribute("open", true);
      }
    }

    collapse() {
      this.details.removeAttribute("open");
    }

    expand() {
      this.details.setAttribute("open", true);
    }

    checkSummaryLink(e) {
      this.hasSummaryLink = this.summary.querySelector("a");
      if (
        this.breakpoint === "mobile" &&
        window.matchMedia("(min-width: 40em)").matches &&
        !this.hasSummaryLink
      ) {
        e.preventDefault();
      } else if (
        this.breakpoint === "tablet" &&
        window.matchMedia("(min-width: 60em)").matches &&
        !this.hasSummaryLink
      ) {
        e.preventDefault();
      }
    }
  }

  customElements.define("details-collapse", DetailsCollapse);
}
