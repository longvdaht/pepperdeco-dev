if (!customElements.get("paint-guide-search")) {
  customElements.define("paint-guide-search", 
    class SwatchSearch extends HTMLElement {
			constructor() {
				super();

				this.inputEl = this.querySelector("input");
        this.items = document.querySelectorAll(`.paint-guides-swatches-wrapper .paint-guide-swatch-item`);

				this.inputEl.addEventListener('input', this.debounce(() => {
					this.handleSearch(this.inputEl.value);
				}, 200));

        // this.toggleDetailsByScreen();
        // window.addEventListener("resize", this.toggleDetailsByScreen);
        
      }
			
			debounce(fn, wait) {
				let t;
				return (...args) => {
					clearTimeout(t);
					t = setTimeout(() => fn.apply(this, args), wait);
				};
			}

			handleSearch(value) {
        const query = value.toLowerCase().trim();
        console.log(query)

        this.items.forEach(item => {
          const text = item.innerText.toLowerCase();
          if (query === "" || text.includes(query)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      }

      toggleDetailsByScreen() {
        const detailsEls = document.querySelectorAll("#FacetsWrapperDesktop details");

        detailsEls.forEach(el => {
          if (window.innerWidth <= 767) {
            el.setAttribute("open", "");
          } else {
            el.removeAttribute("open");
          }
        });
      }
    }
  )
}