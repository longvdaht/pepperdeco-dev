const infScroll = new InfiniteScroll('#product-grid', {
  // options
  path: '.pagination__item--next',
  append: '#product-grid > li',
  history: 'replace',
  hideNav: '.pagination-wrapper',
  status: '.page-load-status',
});

// vanilla JS
infScroll.on('append', function (response, path, items) {
  for (var i = 0; i < items.length; i++) {
    reloadSrcsetImgs(items[i]);
  }
});

function reloadSrcsetImgs(item) {
  var imgs = item.querySelectorAll('img[srcset]');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    img.outerHTML = img.outerHTML;
  }
}
