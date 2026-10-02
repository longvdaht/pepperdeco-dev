class PipingRadiosEmbroidery extends PipingRadios {
  constructor() {
    super();
    this.optionLegend = this.querySelector('.product-form__input-piping')?.querySelector('aside').querySelector('span');
    this.labels = Array.from(this.querySelectorAll(".js.product-form__input")).map((label) => label.querySelector(".form__label").querySelector("span"));
    this.embroideryOptions = this.closest('embroidery-options');
    this.preventScroll = true;

    this.pipingOptionWrapper = this.querySelector('.trim-options.product-form__input');
    this.trimSideRadios = this.querySelectorAll('input[name="trim-side-proxy"]');
    
    if (this.trimSideRadios.length) {
      this.trimSideRadios.forEach((trimSide) => {
        trimSide.addEventListener('click', () => this.togglePipingOptions(trimSide));
      })
    }
  }

  onRadioChange() {
    this.getSelectedRadio();
    this.getSelectedSize();
    this.setParentTrimRadio();
    this.setPipingRadio();
    this.updateOptionLegend();
    this.updateMedia();
    this.updateEmbroideryMedia();
    this.updateTrimInputValue();
    document.querySelector('piping-radios').onRadioChange();
  }

  togglePipingOptions(trimSide) {
    trimSide.checked = true;
    const trimSideValue = trimSide.value;
    if (trimSideValue == 'None') {
      this.pipingOptionWrapper.classList.add('trim-options-hide');
      const pipingEmbroideryNone = this.pipingOptionWrapper.querySelector('input[name="trim-proxy"][value="None"]');
      const pipingNone = document.querySelector('input[name="Trim Side"][value="None"]');
      if (pipingEmbroideryNone) {
        pipingEmbroideryNone.checked = true;
        pipingNone.checked = true;
        this.onRadioChange();
        return;
      }
    } else {
      this.pipingOptionWrapper.classList.remove('trim-options-hide');
    }
  }

  updateOptionLegend() {
    if (!this.optionLegend || !this.piping) return;
    if (handleize(this.piping.type) === "none") {
      this.labels.forEach((label) => (label.innerText = ""));
    } else {
      this.optionLegend = this.querySelector(`.product-form__input-${handleize(this.piping.type)}`).querySelector("span");
      this.labels.forEach((label) => (label.innerText = ""));
      this.optionLegend.innerText = `${this.piping.handle.replace(" Fringe", "").replace("Pom Pom", "").replace(" Ruffle", "")}`;
    }
  }

  updateEmbroideryMedia() {
    if (!this.embroideryOptions) return;
    this.embroideryOptions.setPillowImage();
    this.embroideryOptions.scrollModalToTop();
  }

  setParentTrimRadio() {
    if (!this.piping) return;
    document.querySelector(`input[name="properties[Trim]"][value="${this.piping.handle}"]`).checked = true;
    if (this.piping.type != 'None') {
      document.querySelectorAll('input[name="Trim Side"]').forEach((trim) => {
        if (trim.value != 'None' && this.piping.type != 'None') {
          trim.value = this.piping.type;
          trim.checked = true
        }
      });
    } else {
      document.querySelector(`input[name="Trim Side"][value="${this.piping.type}"]`).checked = true;
    }
    
    document.querySelector('piping-radios').dispatchEvent(new Event('change', { bubbles: true }))
  }
}

customElements.define('piping-radios-embroidery', PipingRadiosEmbroidery);