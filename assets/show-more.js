// show-more.js
if (!customElements.get('show-more-button')) {
  customElements.define(
    'show-more-button',
    class ShowMoreButton extends HTMLElement {
      constructor() {
        super();

        this.button = this.querySelector('button');
        this.parentDisplay = this.closest('.parent-display');
        this.description = this.parentDisplay?.querySelector('.product__descriptions');

        if (!this.button || !this.description) return;

        requestAnimationFrame(() => {
          this.init();
        });

        this.button.addEventListener('click', () => {
          this.toggleDescription();
        });
      }

      init() {
        // Fix Shopify richtext weird wrappers
        const firstParagraph = this.description.querySelector('p') || this.description;

        const computedStyle = window.getComputedStyle(firstParagraph);

        let lineHeight = parseFloat(computedStyle.lineHeight);

        // fallback if line-height = normal
        if (isNaN(lineHeight)) {
          lineHeight = parseFloat(computedStyle.fontSize) * 1.2;
        }

        this.collapsedHeight = lineHeight * 2;

        // Important:
        // product.description often contains nested <p>, <meta>, etc
        // so use full content height AFTER rendering
        const fullHeight = this.description.scrollHeight;

        // Only collapse if actually exceeds 2 lines
        if (fullHeight > this.collapsedHeight + 4) {
          this.description.style.maxHeight = `${this.collapsedHeight}px`;
          this.description.style.overflow = 'hidden';
          this.description.style.transition = 'max-height 0.3s ease';

          this.classList.remove('hidden');
        } else {
          this.classList.add('hidden');
        }

        this.description
        .querySelectorAll('style, script')
        .forEach((el) => el.remove());
      }

      toggleDescription() {
        const isExpanded = this.description.classList.toggle('is-expanded');

        if (isExpanded) {
          this.description.style.maxHeight = `${this.description.scrollHeight}px`;
        } else {
          this.description.style.maxHeight = `${this.collapsedHeight}px`;
        }

        this.querySelector('.label-show-more')?.classList.toggle('hidden', isExpanded);
        this.querySelector('.label-show-less')?.classList.toggle('hidden', !isExpanded);
      }
    }
  );
}