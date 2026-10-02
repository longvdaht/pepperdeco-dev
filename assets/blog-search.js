if (!customElements.get("blog-search")) {
  customElements.define("blog-search", 
    class BlogSearch extends HTMLElement {
			constructor() {
				super();

				this.inputEl = this.querySelector("input");
				this.resultsEl = document.querySelector('#blog-search-result');
				// this.itemsResult = Array.isArray(this.rawData.items) ? data.items : [];
				this.inputEl.addEventListener('input', this.debounce(() => {
					this.updateResults(this.inputEl.value);
				}, 200));
        this.inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleEnter(this.inputEl.value);
          }
        });
				this.loadData();
        // this.initTagFilter();
        
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q) {
          this.inputEl.value = q;
          this.updateResults(q);
        }
      }
			
			debounce(fn, wait) {
				let t;
				return (...args) => {
					clearTimeout(t);
					t = setTimeout(() => fn.apply(this, args), wait);
				};
			}

			loadData() {
				const el = document.getElementById('blog-search-data');
				if (!el) return;
				try {
					const json = JSON.parse(el.textContent);
					this.data = json.items || [];
				} catch (err) {
					console.error('Invalid search JSON', err);
				}
			}

      handleEnter(value) {
        if (!value) return;
        const blogHandle = this.inputEl.getAttribute('data-blog-handle');
        const blogUrl = `/blogs/${blogHandle}?q=` + encodeURIComponent(value); 
        window.location.href = blogUrl;
      }

			searchItems(q) {
				q = q.trim().toLowerCase();
				if (!q || q.length < this.minQuery) return [];
				return this.data.filter(item =>
					(item.title || '').toLowerCase().includes(q) ||
					(item.excerpt || '').toLowerCase().includes(q) ||
					(item.tags || []).join(' ').toLowerCase().includes(q)
				);
			}

			updateResults(value) {
				const results = this.searchItems(value);
				const wrapperClass = document.querySelector('.template-blog .main-article-list');
				if (!wrapperClass) return;

				const container = document.createElement('div');
				
        if (value == '') {
          this.showOtherSections();
        } else {
          this.hideOtherSections();
          if (results.length === 0) {
            container.setAttribute('class', 'blog-no-results');
            container.innerHTML = 'No results';
          } else {
            container.innerHTML = '<div class="search-heading">Search results</div>';
            container.setAttribute('class', wrapperClass.getAttribute('class'));
            results.forEach(item => {
              this.renderCard(item, container);
            });
          }
        }
				
				this.resultsEl.innerHTML = '';
    		this.resultsEl.appendChild(container);
			}

			renderCard(item, container) {
				let tpl = document.querySelector('.template-blog .main-article-list .grid__item.article-card:not(.article-no-media)');
        if (!tpl) {
          tpl = document.querySelector('.template-blog .main-article-list .grid__item.article-card');
        }
				const clone = tpl.cloneNode(true);
        const link = clone.querySelector('a.full-unstyled-link');
        const img = clone.querySelector('.article-card__image-wrapper .media img');
        const title = clone.querySelector('.article-card__title');
        const date = clone.querySelector('.article-card__date');
        const tags = clone.querySelector('.article-card__tags a');
        link.href = item.url;
        if (item.image) {
          clone.querySelector('.article-card__image-wrapper')?.classList.remove('hidden');
          const baseImage = item.image.split('?')[0] + '?v=' + (item.image.split('?v=')[1] || '');
          img.src = `${baseImage}&width=533`;
          img.srcset = `
            ${baseImage}&width=165 165w,
            ${baseImage}&width=360 360w,
            ${baseImage}&width=533 533w,
            ${baseImage}&width=720 720w,
            ${baseImage}&width=1000 1000w
          `;
          img.alt = item.title || '';
        } else {
          clone.querySelector('.article-card__image-wrapper')?.classList.add('hidden');
        }
        title.innerHTML = item.title;
				// date.innerHTML = item.published_at || '';
				if (tags && tags.length) {
          let listTagHTML = '';
          tags.forEach((tag) => {
            const tagHandle = this.shopifyHandleize(tag);
            listTagHTML += `<a href="${item.url}/${tagHandle}" class="full-unstyled-link">${tag}</a>`
          })
					tags.innerHTML = listTagHTML || '';
				}

				container.appendChild(clone);
			}

      shopifyHandleize(str) {
        if (!str) return "";

        return str
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d") 
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .replace(/-+/g, "-");
      }

      initTagFilter() {
        const tagLinks = document.querySelectorAll('.search-blog-wrapper .blog-tag');
        if (!tagLinks.length) return;
        tagLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const tagName = link.textContent.trim();
            const parts = href.split('/tagged/');
            if (parts.length < 2) return;
            const tag = parts[1].toLowerCase();

            const blogUrl = parts[0].split('/blogs/');

            if (document.body.classList.contains('template-article')) {
              const blogHandle = blogUrl[1];
              window.location.href = `/blogs/${blogHandle}?tag=${tag}&tagName=${encodeURIComponent(tagName)}`;
              return;
            }

            if (this.activeTag === tag) {
              this.activeTag = null;
              this.resultsEl.innerHTML = '';
              this.showOtherSections();

              link.classList.remove('active');
            } else {
              this.activeTag = tag;
              this.filterByTag(tag, tagName);

              tagLinks.forEach(el => el.classList.remove('active'));
              link.classList.add('active');
            }
          });
        });

        const params = new URLSearchParams(window.location.search);
        const tag = params.get('tag');
        const tagName = params.get('tagName');
        if (tag && document.body.classList.contains('template-blog')) {
          this.activeTag = tag;
          this.filterByTag(tag, tagName);

          const activeLink = document.querySelector(`.blog-tag[href*="/tagged/${tag}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      }

      filterByTag(tag, tagName) {
        const wrapperClass = document.querySelector('.template-blog .main-article-list');
        if (!wrapperClass) return;

        const results = this.data.filter(item =>
          (item.tags || []).map(t => t.toLowerCase()).includes(tag)
        );

        this.hideOtherSections();

        const container = document.createElement('div');
        container.setAttribute('class', wrapperClass.getAttribute('class'));

        if (results.length === 0) {
          container.innerHTML = `<div class="blog-no-results">No results for tag: ${tagName}</div>`;
        } else {
          container.innerHTML = `<div class="search-heading">Search result for tag: ${tagName}</div>`;
          results.forEach(item => {
            this.renderCard(item, container);
          });
        }

        this.resultsEl.innerHTML = '';
        this.resultsEl.appendChild(container);
      }

      showOtherSections() {
        const sectionBlogFeatured = document.querySelector('section.featured-blog');
				const sectionImageWithText = document.querySelectorAll('section.section-image-content-wrapper');
				const mainBlog = document.querySelector('section.main-blog');

        if (sectionBlogFeatured) {
          sectionBlogFeatured.classList.remove('hidden');
        }
        if (sectionImageWithText) {
          sectionImageWithText.forEach((section) => {
            section.classList.remove('hidden');
          })
        }
        if (mainBlog) {
          mainBlog.classList.remove('hidden');
        }
      }

      hideOtherSections() {
        const sectionBlogFeatured = document.querySelector('section.featured-blog');
				const sectionImageWithText = document.querySelectorAll('section.section-image-content-wrapper');
				const mainBlog = document.querySelector('section.main-blog');

        if (sectionBlogFeatured) {
          sectionBlogFeatured.classList.add('hidden');
        }
        if (sectionImageWithText) {
          sectionImageWithText.forEach((section) => {
            section.classList.add('hidden');
          })
        }
        if (mainBlog) {
          mainBlog.classList.add('hidden');
        }
      }
    }
  )
}