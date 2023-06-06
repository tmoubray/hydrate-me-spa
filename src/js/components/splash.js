const Flickity = require("flickity");
const fizzyUIUtils = require("fizzy-ui-utils");
require("flickity-imagesloaded");

const sliders = document.querySelectorAll('.splash');

[...sliders].forEach((slider) => {
  
  const slides = slider.querySelector('.splash__slides');

  const flkty = new Flickity(slides, {
    cellAlign: 'left',
    contain: true,
    imagesLoaded: true,
    wrapAround: true,
    accessibility: false,
    autoPlay: true
  });




});
