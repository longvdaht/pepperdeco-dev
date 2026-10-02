class GallerySwitcher extends HTMLElement {
  constructor() {
    super();
    this.collections = this.querySelectorAll('input[name="shop_by"]');
    this.collectionImages = this.querySelectorAll('[data-collection]');
    this.galleries = this.querySelectorAll('[data-gallery]');
    this.galleryCards = this.querySelectorAll('.card-gallery');
    this.addEventListener('change', this.onCollectionChange);
    this.galleryCards.forEach(card => {
      card.addEventListener('click', this.onGalleryChange.bind(this));
    })
  }
  connectedCallback() {
    this.params = new URL(document.location).searchParams;
    this.currentCollection = this.params.get('collection');
    this.currentGallery = {}
    this.currentGallery.handle = this.params.get('gallery');
    this.currentGallery.id = document.querySelector(`[data-gallery-handle="${this.currentGallery.handle}"]`)?.dataset.id
    if (!this.currentCollection) return;
    this.querySelector(`input[name="shop_by"][value=${this.currentCollection}]`).checked = true;
    this.updateCollection();
    if (!this.currentGallery) return;
    this.updateGallery();
  }
  updateURL() {
    if (!this.currentCollection) return;

    window.history.replaceState({}, '', `${this.dataset.url}?collection=${this.currentCollection}`);

    if (!this.currentGallery) return;

    window.history.replaceState({}, '', `${this.dataset.url}?collection=${this.currentCollection}&gallery=${this.currentGallery.handle}`);
  }
  updateCollection() {
    if (!this.currentCollection) return;
    this.querySelectorAll(`[data-collection]`).forEach(collection => {
      collection.classList.add('hidden');
    })
    this.querySelectorAll(`[data-gallery]`).forEach(gallery => {
      gallery.classList.add('hidden');
    })
    this.querySelector(`[data-collection=${this.dataset.section}-${this.currentCollection}]`).classList.remove('hidden');
  }
  updateGallery() {
    if (!this.currentGallery) return;
    document.querySelectorAll(`[data-gallery]`).forEach(gallery => {
      gallery.classList.add('hidden');
    })
    document.querySelector(`[data-gallery=${this.currentGallery.id}]`).classList.remove('hidden')
    window.scroll({
      top: document.querySelector(`[data-gallery=${this.currentGallery.id}]`).offsetTop - 30
    })
  }
  onGalleryChange(e) {
    e.preventDefault();
    this.currentGallery = {
      id: e.target.dataset.id,
      handle: e.target.dataset.galleryHandle,
    }
    this.updateURL()
    this.updateGallery();
  }
  onCollectionChange(e) {
    e.preventDefault();
    this.currentCollection = Array.from(this.collections).find((collection) => {
      return collection.value === e.target.value
    }).value;
    this.currentGallery = null;
    this.updateURL();
    this.updateCollection();
  }
}

customElements.define('gallery-switcher', GallerySwitcher);
