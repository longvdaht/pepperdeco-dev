class KassatexPersonalization extends HTMLElement {
  constructor() {
    super();
    this.personalization = this.querySelector(
      'input[name="properties[Personalization]"]'
    );
    this.embroideryInput = this.querySelectorAll(
      'input[name="properties[_Embroidery]"]'
    );

    this.addEventListener("change", this.handleChange.bind(this));
    this.personalization.addEventListener(
      "input",
      this.handleChange.bind(this)
    );
    Array.from(this.embroideryInput).forEach((el) =>
      el.addEventListener("change", this.toggleEmbroidery.bind(this))
    );
  }

  handleChange(e) {
    this.type = this.querySelector(
      'input[name="properties[_Embroidery Type]"]:checked'
    );
    this.checkCharacterLimit(this.type?.value || null);
    this.showHelperText(this.type?.value);
    this.setTypefaces(this.type?.value);
    this.setOptionLegends();
    if (
      e.target ===
      this.querySelector('input[name="properties[_Embroidery]"][value="true"]')
    )
      return;
    this.querySelector(
      'input[name="properties[_Embroidery]"][value="true"]'
    ).checked = true;
  }

  setOptionLegends() {
    this.querySelector("#type-option-legend").textContent =
      this.getTypeface() || "";
    this.querySelector("#embroidery-color-legend").textContent =
      this.getColor() || "";
  }

  checkCharacterLimit(type) {
    this.personalization.value = this.personalization.value
      .replace(/'\b/g, "\u2018")
      .replace("\u2026", "...")
      .replace(/\b'/g, "\u2019")
      .replace(/"\b/g, "\u201c")
      .replace(/\b"/g, "\u201d")
      .replace(
        /[^a-zA-Z0-9 \~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\:\”\“\;\u2019\u2018\u2032\u2033\u2034\<\>\?\,\.\/\'\"]/g,
        ""
      )
      .replace("  ", " ");
    if (type === "Monogram") {
      this.personalization.value = this.personalization.value
        .slice(0, 3)
        .toUpperCase();
    } else {
      this.personalization.value = this.personalization.value.slice(0, 15);
    }
  }

  setTypefaces(type) {
    if (!type) return;
    Array.from(this.querySelectorAll(".typeface-wrapper")).forEach((el) =>
      el.classList.add("hidden")
    );
    if (type === "Monogram") {
      Array.from(this.querySelectorAll(".typeface-wrapper")).forEach((el) => {
        el.classList.remove("hidden");
      });
      Array.from(this.querySelectorAll("[data-text]")).forEach((el) => {
        {
          el.querySelector('input[type="radio"]').checked = false;
          el.classList.add("hidden");
        }
      });
    } else {
      Array.from(this.querySelectorAll("[data-text]")).forEach((el) =>
        el.classList.remove("hidden")
      );
      Array.from(this.querySelectorAll("[data-monogram]")).forEach((el) => {
        el.querySelector('input[type="radio"]').checked = false;
        el.classList.add("hidden");
      });
    }
  }

  showHelperText(type = "Monogram") {
    Array.from(this.querySelectorAll(".personalization-helper")).forEach((el) =>
      el.classList.add("hidden")
    );
    this.querySelector(`#Helper-${type}`).classList.remove("hidden");
  }

  toggleEmbroidery() {
    if (
      this.querySelector('input[name="properties[_Embroidery]"]:checked')
        ?.value !== "true"
    ) {
      Array.from(this.querySelectorAll('input[type="radio"]')).forEach(
        (el) => (el.checked = false)
      );
      this.personalization.value = "";
      this.removeRequiredFields();
    } else {
      this.setRequiredFields();
    }
  }

  setRequiredFields() {
    Array.from(this.querySelectorAll('input[type="radio"]')).forEach((el) =>
      el.setAttribute("required", "required")
    );
    this.personalization.setAttribute("required", "required");
  }
  removeRequiredFields() {
    Array.from(this.querySelectorAll('input[type="radio"]')).forEach((el) =>
      el.removeAttribute("required")
    );
    this.personalization.removeAttribute("required");
  }

  getEmbroideryType() {
    // gets checked input and returns monogram or text
    return this.querySelector(
      'input[name="properties[_Embroidery Type]"]:checked'
    )?.value;
  }

  getColor() {
    // gets checked input and returns color value
    return this.querySelector('input[name="properties[Thread Color]"]:checked')
      ?.value;
  }

  getTypeface() {
    // gets checked input and returns typeface name
    return this.querySelector('input[name="properties[Typeface]"]:checked')
      ?.value;
  }
}

customElements.define("kassatex-personalization", KassatexPersonalization);
