class CollectionFilters extends HTMLElement {
  constructor() {
    super();
    this.filters = this.querySelectorAll('input:not(.search__input)');
    this.colorFilters = [...this.filters].filter(filter => filter.dataset.tag && filter.dataset.tag.indexOf('color-') > -1);
    this.otherFilters = [...this.filters].filter(filter => filter.dataset.tag && filter.dataset.tag.indexOf('color-') === -1);
    if (document.querySelector('.template-article')) {
      this.collectionForm = document.querySelector('.paint-guides-swatches');
      this.collections = this.collectionForm.querySelectorAll('.paint-guides-swatches-wrapper');
      this.noProducts = document.querySelector('.paint-guides-swatches--empty');
    } else {
      this.collectionForm = document.querySelector('collection-form');
      this.collections = this.collectionForm.querySelectorAll('.collection-block-wrapper');
      this.noProducts = document.querySelector('.collection--empty');
      this.collectionSliders = this.collectionForm.querySelectorAll('slider-component');
    }
    
    this.gridItems = this.collectionForm.querySelectorAll('.grid__item:not(.carousel-cell)');

    this.clearFiltersBtn = document.querySelector('.active-facets__button-remove');
    this.clearFiltersBtnMobile = document.querySelector('.facet-remove-all');
    this.clearFiltersFilterMobileBtn = document.querySelector('.mobile-facets__clear-wrapper');

    this.activeFilters = [];
    this.activeFilters.color = [];
    this.activeFilters.secondary = [];
    this.activeItems = []
    this.inactiveItems = []

    if (this.clearFiltersBtn) {
      this.clearFiltersBtn.addEventListener('click', (e) => this.clearFilters(e));
    }
    if (this.clearFiltersBtnMobile) {
      this.clearFiltersBtnMobile.addEventListener('click', (e) => this.clearFilters(e));
    }
    if (this.clearFiltersFilterMobileBtn) {
      this.clearFiltersFilterMobileBtn.addEventListener('click', (e) => this.clearFilters(e));
    }

    this.filters.forEach(filter => filter.addEventListener('input', (e) => this.handleClick(e)));

  }

  handleClick(e) {
    e.preventDefault();
    const activeTag = e.target.dataset.tag
    const parent = e.target.parentNode
    if (!activeTag) return;
    const color = activeTag?.indexOf('color-') > -1 || false
    if (color && parent.classList.contains('filter-link-active')) {
      this.activeFilters.color = [...this.activeFilters.color].filter(filterName => filterName != activeTag)
    } else if (color && parent.classList.contains('active-facets__button')) {
      this.activeFilters.color = [...this.activeFilters.color].filter(filterName => filterName != activeTag)
    } else if (color) {
      this.activeFilters.color = [...this.activeFilters.color, activeTag];
    } else if (this.activeFilters.secondary && this.activeFilters.secondary.indexOf(activeTag) > -1) {
      this.activeFilters.secondary = [...this.activeFilters.secondary].filter(filterName => filterName != activeTag)
    } else {
      this.activeFilters.secondary = [...this.activeFilters.secondary, activeTag]
    }

    if (!parent.classList.contains('active-facets__button')) {
      parent.classList.toggle('filter-link-active');
    } else {
      const inputElements = this.querySelectorAll(`input[data-tag="${activeTag}"]`);
      inputElements.forEach((input) => {
        input.checked = !input.checked;
        input.parentNode.classList.remove('filter-link-active')
      });
      
    }

    this.filterProducts();
    this.updateGrid();
    this.updateProductCounts();
    this.updateActiveFilterBtn();
    this.updateActiveTagsMobile();
  }

  clearFilters(e) {
    e.preventDefault();
    this.activeFilters.color = [];
    this.activeFilters.secondary = [];
    this.removeColorClasses();
    this.removeOtherClasses();
    this.filterProducts();
    this.updateGrid();
    this.updateProductCounts();
    this.updateActiveFilterBtn();
    this.updateActiveTagsMobile();
  }

  filterProducts() {
    if (!this.activeFilters.color || !this.activeFilters.secondary) return;
    let queryString = "";
    if (this.activeFilters.color.length > 0 || this.activeFilters.secondary.length > 0) {
      const allActiveFilters = this.activeFilters.color.concat(this.activeFilters.secondary);
      const grouped = {};
      allActiveFilters.forEach(item => {
        const [category] = item.split('-');
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(item);
      });
      
      const allGroups = Object.values(grouped);
      const generateCombinations = (groups, prefix = [], index = 0) => {
        if (index === groups.length) {
          return [`.grid__item.${prefix.join('.')}`];
        }
      
        let queryString = [];
        for (const item of groups[index]) {
          queryString = queryString.concat(generateCombinations(groups, [...prefix, item], index + 1));
        }
        return queryString;
      };
      
      const selectors = generateCombinations(allGroups);
      
      queryString = selectors.join(', ');
    } else {
      queryString = `.grid__item`
    }
    
    this.activeItems = this.collectionForm.querySelectorAll(queryString);
    this.inactiveItems = [...this.gridItems].filter(item => ![...this.activeItems].includes(item));
    if (this.activeItems.length == 0) {
      this.noProducts.classList.remove('visually-hidden')
    } else {
      this.noProducts.classList.add('visually-hidden')
    }
    this.updateURL();
  }

  removeColorClasses() {
    this.colorFilters.forEach(colorFilter => {
      colorFilter.parentElement.classList.remove('filter-link-active')
      colorFilter.checked = false;
    })
  }

  removeOtherClasses() {
    this.otherFilters.forEach(otherFilter => {
      otherFilter.parentElement.classList.remove('filter-link-active')
      otherFilter.checked = false
    })
  }

  updateGrid() {
    if (!this.activeItems && !this.inactiveItems) return;
    this.gridItems.forEach(item => item.classList.remove('visually-hidden'))
    this.inactiveItems.forEach(item => item.classList.add('visually-hidden'))
  }

  updateProductCounts() {
    if (!this.collections && !this.activeItems && !this.inactiveItems) return;
    this.collections.forEach(collection => {
      let activeItems = collection.querySelectorAll('.grid__item.grid__item-product-card:not(.visually-hidden)');
      if (document.querySelector('.template-article')) {
        activeItems = collection.querySelectorAll('.grid__item:not(.visually-hidden)');
      }
      collection.dataset.products = activeItems.length;
      if (activeItems.length == 0) {
        collection.classList.add('visually-hidden')
      } else {
        collection.classList.remove('visually-hidden')
      }
    })
    if (this.collectionSliders) {
      this.collectionSliders.forEach(collection => {
        collection.initPages();
      })
    }
  }

  updateActiveFilterBtn() {
    const facetRemoveDesktop = document.querySelectorAll('.active-facets-desktop facet-remove');
    facetRemoveDesktop.forEach((removeButton) => {
      if (!removeButton.classList.contains('active-facets__button-wrapper')) removeButton.remove();
    })
    const facetRemoveMobile = document.querySelector('.facet-remove-all');
    const activeFacet = document.querySelector('.active-facets-desktop');
    const allFilters = this.activeFilters.color.concat(this.activeFilters.secondary);
    const countActiveFilterMobile = document.querySelector('.mobile-facets__count-filter');
    const countActiveFilterDesktop = document.querySelector('.collection-mobile-facets__wrapper .mobile-facets__open-label');


    allFilters.forEach((filter) => {
      let filterName = filter.split('-').slice(1).join(' ');
      if (filter.includes('color-story')) {
        filterName = filter.split('-').slice(2).join(' ');
      } else if (filter.includes('pricing-tier')) {
        filterName = filter.split('-').slice(2).join(' ');
      }

      let facetRemoveButton = document.createElement('facet-remove');
      facetRemoveButton.setAttribute('data-tag', filter);
      let facetRemoveWrapper = document.createElement('a');
      facetRemoveWrapper.className = "active-facets__button active-facets__button--light";
      facetRemoveWrapper.innerHTML = `<span class="active-facets__button-inner button button--tertiary" data-tag="${filter}">${filterName}<span class="svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" fill="none" class="icon icon-close-small" viewBox="0 0 12 13"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8.486 9.33 2.828 3.67M2.885 9.385l5.544-5.77"></path></svg></span></span>`;
      facetRemoveButton.append(facetRemoveWrapper);
      activeFacet.insertBefore(facetRemoveButton, activeFacet.querySelector('.active-facets__button-wrapper'));
    });
    if (allFilters.length) {
      if (facetRemoveMobile) {
        facetRemoveMobile.classList.remove('hidden');
      }
      if (countActiveFilterMobile) {
        countActiveFilterMobile.textContent = ' (' + allFilters.length + ')';
      }
      if (countActiveFilterDesktop) {
        countActiveFilterDesktop.textContent = countActiveFilterDesktop.getAttribute('data-text') + ' (' + allFilters.length + ')';
      }
      
    } else {
      if (facetRemoveMobile) {
        facetRemoveMobile.classList.add('hidden');
      }
      if (countActiveFilterMobile) {
        countActiveFilterMobile.textContent = "";
      }
      if (countActiveFilterDesktop) {
        countActiveFilterDesktop.textContent = countActiveFilterDesktop.getAttribute('data-text');
      }
    }
    
    let activeFilters = document.querySelectorAll('.active-facets-desktop facet-remove');
    activeFilters.forEach((active) => active.addEventListener('click', (evt) => this.handleClick(evt)))
  }

  updateActiveTagsMobile() {
    const fieldsets = document.querySelectorAll('#FacetsWrapperMobile .mobile-facets__details');
    fieldsets.forEach((details) => {
      const activeElement = details.querySelectorAll('.filter-link-active');
      details.querySelector('.active-tags').innerHTML = '';
      if (!activeElement) return;
        activeElement.forEach((active, index) => {
          let textValue = '';
          if (active.classList.contains('swatch-input-wrapper')) {
            textValue = active.parentNode.querySelector('.facet-checkbox__text').textContent.trim();
          } else {
            textValue = active.querySelector('.facet-checkbox__text').textContent.trim();
          }
        
        if (index < activeElement.length - 1) {
          details.querySelector('.active-tags').append(textValue + ', ')
        } else {
          details.querySelector('.active-tags').append(textValue);
        }
      })
    })
  }

  updateURL() {
    if (!this.activeFilters) return;
    // window.history.replaceState({}, '', `${this.dataset.url}?${this.activeFilters.map((key, value) => key + '=' + value).join('&')}`);
  }
}

customElements.define('collection-filters', CollectionFilters);
