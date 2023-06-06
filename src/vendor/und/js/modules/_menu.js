const $ = require('jquery');
const debounce = require('../util/_debounce');
$(() => {


  function setMenuToggleZindex() {
    const winWidth = $(window).width();

    if (winWidth >= 1024) {
      $('.menu__link--toggle').attr('tabindex', -1);
    }

    else {
      $('.menu__link--toggle').attr('tabindex', 0);
    }
  }

  $(window).on('load resize', debounce(function() {
    setMenuToggleZindex();
  }, 250));



  let prevent = true;
  let enable;
  let close;

  const click = function(e) {
    if (prevent || !this.parentNode.classList.contains('menu__item--active')) {
      over.call(this.parentNode);
      e.preventDefault();
    }
    else {
      out();
    }
  };

  const targets = document.querySelectorAll('.menu__link--toggle');

  for (let i = 0; i < targets.length; i += 1) {
    targets[i].addEventListener('click', click);
  }


  const items = document.querySelectorAll('.menu__item');

  const reset = function() {
    prevent = true;
    clearTimeout(enable);
    clearTimeout(close);
    for (let i = 0; i < items.length; i += 1) {
      items[i].classList.remove('menu__item--active');
    }
    document.body.removeEventListener('click', outClick);
    // document.removeEventListener('scroll', reset);
  };

  var over = function(e) {
    reset();
    this.classList.add('menu__item--active');
    enable = setTimeout(function() {
      prevent = false;
    }, 100);
    document.body.addEventListener('click', outClick);
    // document.addEventListener('scroll', reset);
  };

  var out = function(e) {
    close = setTimeout(reset, 300);
  };

  var outClick = function(e) {
    var el = document.querySelector('.menu__item--active');
    if (!el.contains(e.target)) {
      out();
    }
  };

});
