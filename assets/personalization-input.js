if (!customElements.get('personalization-input')) {
  class PersonalizationInput extends HTMLElement {
    constructor() {
      super();

    }
    connectedCallback() {
      this.input = this.querySelector('input')
      this.output = this.querySelector(`#Customization-Output-${this.dataset.section}`)
      this.errorMessage = this.querySelector(`#Customization-Error-${this.dataset.section}`)
      this.letterColors = document.querySelectorAll(`input[name="properties[Letter Color]"]`)
      this.spacerOption = this.dataset.spacerOption
      this.details = this.querySelector('details')
      this.symbols = this.querySelectorAll('.symbol')

      this.input.addEventListener('input', debounce((event) => {
        this.onChange(event);
      }, 300).bind(this));

      this.symbols.forEach(symbol => symbol.addEventListener('click', this.insertSymbol.bind(this)))

      if (this.letterColors.length > 0) {
        this.letterColors.forEach(color => color.addEventListener('change', this.letterColorChange.bind(this)))
      }
    }

    onChange(e) {
      // Validate letters, spaces, allowed symbols
      // this.input.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
      this.input.value = e.target.value.replace(/[^a-zA-Z0-9 \♥]/g, "").toUpperCase();
      if (this.spacerOption === 'heart') {
        this.input.value = this.input.value.replace(/ /g, '♥');
      }
      this.output.innerHTML = this.splitText(e.target.value);
      if (this.input.value.length < 10) {
        this.errorMessage.textContent = ''
      }
    }

    insertSymbol(e) {
      if (this.input.value.length < 10) {
        this.input.value += e.currentTarget.textContent;
        this.errorMessage.textContent = ''
      } else {
        this.errorMessage.textContent = 'Only 10 characters allowed'
      }
      this.details.removeAttribute('open');
      this.input.dispatchEvent(new Event('input'))
    }

    letterColorChange() {
      this.letterColor = document.querySelector(`input[name="properties[Letter Color]"]:checked`)?.value.toLowerCase()
      if (!this.letterColor) return

      this.letterColors.forEach(color => {
        this.classList.remove(`letter__color-${color.value.toLowerCase()}`)
      })
      this.classList.add(`letter__color-${this.letterColor}`)
    }

    splitText(string) {
      const newString = Array.from(string).map(
        (char, i) => {
          if (char === " " && this.spacerOption != 'large-spacer' && this.spacerOption != 'spacer') {
            return `<span class="circle heart">&hearts;</span>${this.spacerOption === 'small-spacer' && i != string.length - 1 ? `<span class="circle spacer"></span>` : ``}`
          } else if (char === " " && this.spacerOption == 'large-spacer') {
            return `<span class="circle spacer ${this.spacerOption}"></span>`
          } else if (this.spacerOption == 'small-spacer') {
            return `<span class="circle">${char}</span>${i != string.length - 1 ? `<span class="circle spacer"></span>` : ''}`
          } else if (char === " " && this.spacerOption == 'spacer') {
            return `<span class="circle spacer"></span>`
          } else {
            return `<span class="circle${char === '♥' ? ' heart' : ''}">${char}</span>`
          }
        }
      );
      return newString.join("");
    }
  }
  customElements.define('personalization-input', PersonalizationInput);
}
