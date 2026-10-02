class FacetFiltersForm extends HTMLElement {
    constructor() {
      super();
      this.onActiveFilterClick = this.onActiveFilterClick.bind(this);
  
      this.debouncedOnSubmit = debounce((event) => {
        this.onSubmitHandler(event);
      }, 800);
  
      const facetForm = this.querySelector('form');
      facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));
  
      const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
      if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
      const sortMobileOutsideDrawer = document.querySelector('#SortBy-mobile-filter');
      
      if (sortMobileOutsideDrawer) {
        sortMobileOutsideDrawer.addEventListener('change', this.onUpdateSortInDrawer.bind(this));
      }
      
      this.sortLabelDesktop = document.querySelector('.sort-by-desktop label');
      this.sortWrapperDesktop = document.querySelector('#SortBy-desktop-filter');
      this.sortOptionsDesktop = document.querySelectorAll('#SortBy-desktop-filter li');
      if (this.sortLabelDesktop) {
        this.sortOptionsDesktop.forEach((option) => {
          option.addEventListener('click', this.onUpdateSortInDrawer.bind(this));
        })
        // sortOutsideDesktop.addEventListener('change', this.toggleSortOptionDesktop.bind(this));
      }
    }
  
    static setListeners() {
      const onHistoryChange = (event) => {
        const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
        if (searchParams === FacetFiltersForm.searchParamsPrev) return;
        FacetFiltersForm.renderPage(searchParams, null, false);
      };
      window.addEventListener('popstate', onHistoryChange);
    }
  
    static toggleActiveFacets(disable = true) {
      document.querySelectorAll('.js-facet-remove').forEach((element) => {
        element.classList.toggle('disabled', disable);
      });
    }
  
    static renderPage(searchParams, event, updateURLHash = true) {
      FacetFiltersForm.searchParamsPrev = searchParams;
      const sections = FacetFiltersForm.getSections();
      const countContainer = document.getElementById('ProductCount');
      const countContainerDesktop = document.getElementById('ProductCountDesktop');
      const loadingSpinners = document.querySelectorAll(
        '.facets-container .loading__spinner, facet-filters-form .loading__spinner'
      );
      loadingSpinners.forEach((spinner) => spinner.classList.remove('hidden'));
      document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
      if (countContainer) {
        countContainer.classList.add('loading');
      }
      if (countContainerDesktop) {
        countContainerDesktop.classList.add('loading');
      }
      if (!document.querySelector('collection-filters')) {
        sections.forEach((section) => {
          const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
          const filterDataUrl = (element) => element.url === url;
    
          FacetFiltersForm.filterData.some(filterDataUrl)
            ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
            : FacetFiltersForm.renderSectionFromFetch(url, event);
        });
        
        if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
      }
    }
  
    static renderSectionFromFetch(url, event) {
      fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
          const html = responseText;
          FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
          FacetFiltersForm.renderFilters(html, event);
          FacetFiltersForm.renderProductGridContainer(html);
          FacetFiltersForm.renderProductCount(html);
          if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
        });
    }
  
    static renderSectionFromCache(filterDataUrl, event) {
      const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
      FacetFiltersForm.renderFilters(html, event);
      FacetFiltersForm.renderProductGridContainer(html);
      FacetFiltersForm.renderProductCount(html);
      if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
    }
  
    static renderProductGridContainer(html) {
      document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
        .parseFromString(html, 'text/html')
        .getElementById('ProductGridContainer').innerHTML;
  
      document
        .getElementById('ProductGridContainer')
        .querySelectorAll('.scroll-trigger')
        .forEach((element) => {
          element.classList.add('scroll-trigger--cancel');
        });

      const btnGridViewActive = document.querySelector('.view-toggle-mobile .btn-grid.active');
      if (btnGridViewActive) {
        if (btnGridViewActive.classList.contains('view-2-col')) {
          document.getElementById('ProductGridContainer').querySelector('#product-grid')?.classList.replace('grid--1-col-tablet-down', 'grid--2-col-tablet-down');
        } else {
          document.getElementById('ProductGridContainer').querySelector('#product-grid')?.classList.replace('grid--2-col-tablet-down', 'grid--1-col-tablet-down');
        }
      }
      if (document.querySelector('.page-load-status')) {
        const infScroll = new InfiniteScroll('#product-grid', {
          // options
          path: '.pagination__item--next',
          append: '#product-grid > li',
          history: 'replace',
          hideNav: '.pagination-wrapper',
          status: '.page-load-status',
        });
      }
        window.dispatchEvent(new CustomEvent("updateItem"));
    }
  
    static renderProductCount(html) {
      const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML;
      const container = document.getElementById('ProductCount');
      const containerDesktop = document.getElementById('ProductCountDesktop');
      container.innerHTML = count;
      container.classList.remove('loading');
      if (containerDesktop) {
        containerDesktop.innerHTML = count;
        containerDesktop.classList.remove('loading');
      }
      const loadingSpinners = document.querySelectorAll(
        '.facets-container .loading__spinner, facet-filters-form .loading__spinner'
      );
      loadingSpinners.forEach((spinner) => spinner.classList.add('hidden'));
    }
  
    static renderFilters(html, event) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const facetDetailsElementsFromFetch = parsedHTML.querySelectorAll(
        '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
      );
      const facetDetailsElementsFromDom = document.querySelectorAll(
        '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
      );
  
      // Remove facets that are no longer returned from the server
      Array.from(facetDetailsElementsFromDom).forEach((currentElement) => {
        if (!Array.from(facetDetailsElementsFromFetch).some(({ id }) => currentElement.id === id)) {
          currentElement.remove();
        }
      });
  
      const matchesId = (element) => {
        const jsFilter = event ? event.target.closest('.js-filter') : undefined;
        return jsFilter ? element.id === jsFilter.id : false;
      };
  
      const facetsToRender = Array.from(facetDetailsElementsFromFetch).filter((element) => !matchesId(element));
      const countsToRender = Array.from(facetDetailsElementsFromFetch).find(matchesId);
  
      facetsToRender.forEach((elementToRender, index) => {
        const currentElement = document.getElementById(elementToRender.id);
        // Element already rendered in the DOM so just update the innerHTML
        if (currentElement) {
          document.getElementById(elementToRender.id).innerHTML = elementToRender.innerHTML;
        } else {
          if (index > 0) {
            const { className: previousElementClassName, id: previousElementId } = facetsToRender[index - 1];
            // Same facet type (eg horizontal/vertical or drawer/mobile)
            if (elementToRender.className === previousElementClassName) {
              document.getElementById(previousElementId).after(elementToRender);
              return;
            }
          }
  
          if (elementToRender.parentElement) {
            document.querySelector(`#${elementToRender.parentElement.id} .js-filter`).before(elementToRender);
          }
        }
      });
  
      FacetFiltersForm.renderActiveFacets(parsedHTML);
      FacetFiltersForm.renderAdditionalElements(parsedHTML);
  
      if (countsToRender) {
        const closestJSFilterID = event.target.closest('.js-filter').id;
  
        if (closestJSFilterID) {
          FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
          FacetFiltersForm.renderMobileCounts(countsToRender, document.getElementById(closestJSFilterID));
  
          const newFacetDetailsElement = document.getElementById(closestJSFilterID);
          const newElementSelector = newFacetDetailsElement.classList.contains('mobile-facets__details')
            ? `.mobile-facets__summary`
            : `.facets__summary`;
          const newElementToActivate = newFacetDetailsElement.querySelector(newElementSelector);
  
          const isTextInput = event.target.getAttribute('type') === 'text';
  
          if (newElementToActivate && !isTextInput) newElementToActivate.focus();
        }
      }

      window.dispatchEvent(new CustomEvent("filter"));
    }
  
    static renderActiveFacets(html) {
      const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];
  
      activeFacetElementSelectors.forEach((selector) => {
        const activeFacetsElement = html.querySelector(selector);
        if (!activeFacetsElement) return;
        const facetActiveSize = activeFacetsElement.querySelectorAll('facet-remove').length;
        const facetRemoveAllMobile = document.querySelector('.facet-remove-all');
        if (facetActiveSize > 1) {
          facetRemoveAllMobile.classList.remove('hidden');
        } else {
          facetRemoveAllMobile.classList.add('hidden');
        }
        document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
      });

      const activeFacetMobileSelectors = document.querySelectorAll('.active-tags');
      if (activeFacetMobileSelectors) {
        const activeFacetsMobileElement = html.querySelectorAll('.active-tags');
        if (!activeFacetsMobileElement) return;
        activeFacetMobileSelectors.forEach((activeTag, index) => {
          if (activeFacetsMobileElement[index]) {
            activeTag.innerHTML = activeFacetsMobileElement[index].innerHTML;
          }
        })
      }
  
      FacetFiltersForm.toggleActiveFacets(false);
    }
  
    static renderAdditionalElements(html) {
      const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting', '.mobile-facets__count-filter'];
  
      mobileElementSelectors.forEach((selector) => {
        if (!html.querySelector(selector)) return;
        document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
      });

  
      document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
    }
  
    static renderCounts(source, target) {
      const targetSummary = target.querySelector('.facets__summary');
      const sourceSummary = source.querySelector('.facets__summary');
  
      if (sourceSummary && targetSummary) {
        targetSummary.outerHTML = sourceSummary.outerHTML;
      }
  
      const targetHeaderElement = target.querySelector('.facets__header');
      const sourceHeaderElement = source.querySelector('.facets__header');
  
      if (sourceHeaderElement && targetHeaderElement) {
        targetHeaderElement.outerHTML = sourceHeaderElement.outerHTML;
      }
  
      const targetWrapElement = target.querySelector('.facets-wrap');
      const sourceWrapElement = source.querySelector('.facets-wrap');
  
      if (sourceWrapElement && targetWrapElement) {
        const isShowingMore = Boolean(target.querySelector('show-more-button .label-show-more.hidden'));
        if (isShowingMore) {
          sourceWrapElement
            .querySelectorAll('.facets__item.hidden')
            .forEach((hiddenItem) => hiddenItem.classList.replace('hidden', 'show-more-item'));
        }
  
        targetWrapElement.outerHTML = sourceWrapElement.outerHTML;
      }
    }
  
    static renderMobileCounts(source, target) {
      const targetFacetsList = target.querySelector('.mobile-facets__list');
      const sourceFacetsList = source.querySelector('.mobile-facets__list');
  
      if (sourceFacetsList && targetFacetsList) {
        targetFacetsList.outerHTML = sourceFacetsList.outerHTML;
      }
    }
  
    static updateURLHash(searchParams) {
      history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
    }
  
    static getSections() {
      return [
        {
          section: document.getElementById('product-grid') ? document.getElementById('product-grid').dataset.id : document.getElementById('ProductGridContainer').dataset.id,
        },
      ];
    }
  
    createSearchParams(form) {
      const formData = new FormData(form);
      return new URLSearchParams(formData).toString();
    }
  
    onSubmitForm(searchParams, event) {
      FacetFiltersForm.renderPage(searchParams, event);
    }
  
    onSubmitHandler(event, isMobileSort) {
      event.preventDefault();
      const sortFilterForms = document.querySelectorAll('facet-filters-form form');
      if (event.srcElement.className == 'mobile-facets__checkbox') {
        const searchParams = this.createSearchParams(event.target.closest('form'));
        this.onSubmitForm(searchParams, event);
      } else {
        const forms = [];
        const isMobile = isMobileSort ? isMobileSort : event.target.closest('form')?.id === 'FacetFiltersFormMobile';
  
        sortFilterForms.forEach((form) => {
          if (!isMobile) {
            if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm' || form.id === 'FacetSortDrawerForm') {
              forms.push(this.createSearchParams(form));
            }
          } else if (form.id === 'FacetFiltersFormMobile') {
            forms.push(this.createSearchParams(form));
          }
        });
        this.onSubmitForm(forms.join('&'), event);
      }
    }
  
    onActiveFilterClick(event) {
      event.preventDefault();
      FacetFiltersForm.toggleActiveFacets();
      const url =
        event.currentTarget.href.indexOf('?') == -1
          ? ''
          : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
      FacetFiltersForm.renderPage(url);
    }

    onUpdateSortInDrawer(event) {
      const target = event.target;
      const value = target.value ? target.value : target.getAttribute('value');
      const sortInForm = this.querySelector('#SortBy-mobile');

      if (sortInForm) {
        sortInForm.value = value;
        this.sortOptionsDesktop.forEach((option) => {
          option.classList.remove('active');
        });
        this.sortWrapperDesktop.classList.add('hidden');
        this.sortLabelDesktop.innerHTML = value == 'manual' ? 'SORT' : target.innerHTML;
        target.classList.add('active')
        this.onSubmitHandler(event, true);
      }
    }
  }
  
  FacetFiltersForm.filterData = [];
  FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
  FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
  customElements.define('facet-filters-form', FacetFiltersForm);
  FacetFiltersForm.setListeners();
  
  class PriceRange extends HTMLElement {
    constructor() {
      super();
      this.querySelectorAll('input').forEach((element) => {
        element.addEventListener('change', this.onRangeChange.bind(this));
        element.addEventListener('keydown', this.onKeyDown.bind(this));
      });
      this.setMinAndMaxValues();
    }
  
    onRangeChange(event) {
      this.adjustToValidValues(event.currentTarget);
      this.setMinAndMaxValues();
    }
  
    onKeyDown(event) {
      if (event.metaKey) return;
  
      const pattern = /[0-9]|\.|,|'| |Tab|Backspace|Enter|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Delete|Escape/;
      if (!event.key.match(pattern)) event.preventDefault();
    }
  
    setMinAndMaxValues() {
      const inputs = this.querySelectorAll('input');
      const minInput = inputs[0];
      const maxInput = inputs[1];
      if (maxInput.value) minInput.setAttribute('data-max', maxInput.value);
      if (minInput.value) maxInput.setAttribute('data-min', minInput.value);
      if (minInput.value === '') maxInput.setAttribute('data-min', 0);
      if (maxInput.value === '') minInput.setAttribute('data-max', maxInput.getAttribute('data-max'));
    }
  
    adjustToValidValues(input) {
      const value = Number(input.value);
      const min = Number(input.getAttribute('data-min'));
      const max = Number(input.getAttribute('data-max'));
  
      if (value < min) input.value = min;
      if (value > max) input.value = max;
    }
  }
  
  customElements.define('price-range', PriceRange);
  
  class FacetRemove extends HTMLElement {
    constructor() {
      super();
      const facetLink = this.querySelector('a');
      if (!facetLink) return;
      facetLink.setAttribute('role', 'button');
      facetLink.addEventListener('click', this.closeFilter.bind(this));
      facetLink.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
      });
    }
  
    closeFilter(event) {
      event.preventDefault();
      const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
      form.onActiveFilterClick(event);
    }
  }
  
  customElements.define('facet-remove', FacetRemove);
  