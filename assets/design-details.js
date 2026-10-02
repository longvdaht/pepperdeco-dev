const expandDesignDetails = function () {
  const designDetails = document.querySelector('.section-design-hub').querySelectorAll('details');
  designDetails.forEach((detail) => {
    if (window.matchMedia('(min-width: 40em)').matches) {
      detail.addEventListener('mouseover', (e) => {
        designDetails.forEach((details) => {
          details.removeAttribute('open')
        });
        e.currentTarget.setAttribute('open', '')
      })
    } else {
      detail.addEventListener('click', (e) => {
        designDetails.forEach((details) => {
          details.removeAttribute('open')
        });
      })
    }
  });
}
window.addEventListener('resize', expandDesignDetails);
expandDesignDetails();
