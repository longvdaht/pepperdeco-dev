class ChildRadios extends HTMLElement {
  constructor() {
    super();
    this.helperTexts = this.querySelectorAll(".construction-helper");
    this.addEventListener("change", this.onRadioChange.bind(this));
  }

  connectedCallback() {
    this.saveCurrentOptions();
    if (this.savedOptions.construction) {
      this.renderProductSelects(
        document.querySelector(
          `input[name="construction"][value='${this.savedOptions.construction}']`
        ).dataset.url
      );
    }
    this.updateOptionLegend(this.savedOptions.construction);
    this.updateHelperText(this.savedOptions.construction);
  }

  onRadioChange({ target }) {
    this.selects =
      document.querySelector("variant-radios") ||
      document.querySelector("variant-selects");
    this.selects.onVariantChange();
    this.saveCurrentOptions();
    this.renderProductSelects(target.dataset.url);
    this.updateOptionLegend(target.value);
    this.updateHelperText(target.value);
  }

  updateHelperText(type) {
    if (typeof productType != "undefined" && productType == 'Sheer Curtain') {
      this.helperTexts.forEach((helperText) => {
        helperText.classList.add("visually-hidden");
      });
      const rockPoket = document.querySelector(`.construction-helper-${'Rod Pocket'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const ringTop = document.querySelector(`.construction-helper-${'Ring Top'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const grommet = document.querySelector(`.construction-helper-${'Grommet'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const pinchPleat = document.querySelector(`.construction-helper-${'Pinch Pleat'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      const tailoredPleat = document.querySelector(`.construction-helper-${'Tailor Pleat'.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`);
      switch (type) {
        case 'Rod Pocket':
          if (grommet) {
            grommet.classList.remove('visually-hidden');
          }
          break;
        case 'Ring Top': 
          if (ringTop) {
            ringTop.classList.remove('visually-hidden');
          }
          break;
        case 'Grommet':
          if (grommet) {
            grommet.classList.remove('visually-hidden');
          }
          break;
        case 'Pinch Pleat':
          if (pinchPleat) {
            pinchPleat.classList.remove('visually-hidden');
          }
          break;
        case 'Tailored Pleat':
          if (tailoredPleat) {
            tailoredPleat.classList.remove('visually-hidden');
          }
          break;
        default:
          if (grommet) {
            grommet.classList.remove('visually-hidden');
          } 
          break;
      }
    } else {
      if (!type) return;
      this.helperTexts.forEach((helperText) => {
        if (
          helperText.classList.contains(
            `construction-helper-${type.toLowerCase().replace(/[\s/]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`
          )
        ) {
          helperText.classList.remove("visually-hidden");
        } else {
          helperText.classList.add("visually-hidden");
        }
      });
    }
  }

  renderProductSelects(url) {
    if (!url) return;
    fetch(`${url}?&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const radioId = `variant-radios-${this.dataset.section}`;
        const priceId = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const radioDestination = document.getElementById(radioId);
        const radioSource = html.getElementById(radioId);
        const priceDestination = document.getElementById(priceId);
        const priceSource = html.getElementById(priceId);

        if (radioSource && radioDestination)
          radioDestination.innerHTML = radioSource.innerHTML;
        if (priceSource && priceDestination)
          priceDestination.innerHTML = priceSource.innerHTML;

        this.setSavedOptions();
      });
  }

  updateOptionLegend(value) {
    const label = document.getElementById(
      `${this.dataset.section}-option-construction`
    );
    if (label && value) {
      label.innerText = value;
    }
  }

  saveCurrentOptions() {
    // Get from URL?
    const params = Object.fromEntries(new URLSearchParams(location.search));
    this.savedOptions = params;
  }

  setSavedOptions() {
    // set the values first
    const constructionE = document.querySelector(
      `input[name="construction"][value='${this.savedOptions.construction}']`
    );
    
    if (constructionE) {
      constructionE.checked = true;
    }
    

    const lengthE = document.querySelector(
      `input[name="Length"][value='${this.savedOptions.lengthRadio}']`
    );
    
    if (lengthE) {
      lengthE.checked = true;
    }

    const widthE = document.querySelector(
      `input[name="Width"][value='${this.savedOptions.width}']`
    );
    
    if (widthE) {
      widthE.checked = true;
    }

    const lengthInput = document.querySelector('select[name="properties[Length]"]');
    if (lengthInput) {
      lengthInput.value = this.savedOptions.length;
    }

    const liningE = document.querySelector(
      `input[name="properties[Lining]"][value='${this.savedOptions.lining}']`
    );
    if (liningE) {
      liningE.checked = true;
    }

    const trimStyleE = document.querySelector(
      `input[name="properties[Trim Style]"][value='${this.savedOptions.trimStyle}']`
    );
    if (trimStyleE) {
      trimStyleE.checked = true;
    }

    const trimSideE = document.querySelector(
      `input[name="properties[Trim]"][value='${this.savedOptions.trimSide}']`
    );
    if (trimSideE) {
      trimSideE.checked = true;
    }

    const trimE = document.querySelector(
      `input[name="Trim"][value='${this.savedOptions.trimEl}'`
    );
    
    if (trimE) {
      trimE.checked = true;
    }

    this.selects =
      document.querySelector("variant-radios") ||
      document.querySelector("variant-selects");
    this.trimOptions =
      document.querySelector("trim-radios") ||
      document.querySelector("variant-selects");
    // let the other elements know values have changed
    this.selects.onVariantChange();
    if (this.trimOptions) {
      this.trimOptions.onRadioChange();
    }
  }
}
customElements.define("child-radios", ChildRadios);

class ConstructionRadios extends ChildRadios {
  constructor() {
    super();
  }
}
customElements.define("construction-radios", ConstructionRadios);

class CafeConstructionRadios extends ChildRadios {
  constructor() {
    super();
  }
}
customElements.define("cafe-construction-radios", CafeConstructionRadios);

class ShowerLiningRadios extends ChildRadios {
  constructor() {
    super();
  }

  connectedCallback() {
    this.saveCurrentOptions();
    if (this.savedOptions.lining) {
      this.renderProductSelects(
        document.querySelector(
          `input[name="lining"][value='${this.savedOptions.lining}']`
        ).dataset.url
      );
    }
    this.updateOptionLegend(this.savedOptions.lining);
    this.updateHelperText(this.savedOptions.lining);
  }

  updateOptionLegend(value) {
    const label = document.getElementById(
      `${this.dataset.section}-option-sc-lining`
    );
    if (label && value) {
      label.innerText = value;
    }
  }

  setSavedOptions() {
    const liningE = document.querySelector(
      `input[name="lining"][value='${this.savedOptions.lining}']`
    );
    if (liningE) {
      liningE.checked = true;
    }

    const lengthSelect = document.querySelector(`select[name="properties[Length]"]`);
    if (lengthSelect) {
      lengthSelect.value = this.savedOptions.length;
    }

    const widthE = document.querySelector(
      `input[name="Width"][value='${this.savedOptions.width}']`
    );
    if (widthE) {
      widthE.checked = true;
    }

    const trimStyleE = document.querySelector(`input[name="properties[Trim Style]"][value='${this.savedOptions.trimStyle}']`);
    if (trimStyleE) {
      trimStyleE.checked = true;
    }

    const trimSideE = document.querySelector(`input[name="properties[Trim]"][value='${this.savedOptions.trimSide}']`);
    if (trimSideE) {
      trimSideE.checked = true;
    }

    const trimE = document.querySelector(`input[name="Trim"][value='${this.savedOptions.trimEl}']`);
    if (trimE) {
      trimE.checked = true;
    }

    this.selects =
      document.querySelector("variant-radios") ||
      document.querySelector("variant-selects");
    this.trimOptions =
      document.querySelector("shower-curtain-trim-radios") ||
      document.querySelector("variant-selects");
    this.selects.onVariantChange();
    if (this.trimOptions) {
      this.trimOptions.onRadioChange();
    }
  }
}

customElements.define("shower-lining-radios", ShowerLiningRadios);
