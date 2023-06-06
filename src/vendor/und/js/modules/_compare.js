const $ = require('jquery');
const Flickity = require('flickity');

const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isSafari && iOS) {
  $('body').addClass('safari');
}


function deactivateCompare() {
  $('body').removeClass('compare-active');
  $('.compare').removeClass('compare--open');
  $('.quick-view__overlay').remove();
  $('.compare__content').scrollTop(0);
}

function activateCompare() {
  $('body').addClass('compare-active');
  $('.compare').addClass('compare--open');
  $('.canvas').after('<div class="quick-view__overlay" />');
  
  
  $(document).on('keydown', (e) => {
    if (e.keyCode === 27) {
      deactivateCompare();
    }
  });
}

function toggleCompare() {
  if ($('body').hasClass('compare-active')) deactivateCompare();
  else activateCompare();
}

$(() => {
  
  $('.compare__toggle__button').on('click', function() {
    toggleCompare();
    
  });
});
