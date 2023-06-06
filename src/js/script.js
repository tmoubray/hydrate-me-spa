/**
 * UND WordPress Theme
 * -----------------------------------------------------------------------------
 *
 * NOTE: You might need to use `require()` instead of `import`.
 */

// Imports
// const { Is } = require('./utilities/index');

// Polyfills
// focus within polyfill
var focusWithin = require('ally.js/style/focus-within');
focusWithin();

// get the type of user input
require('what-input');

// object-fit polyfill
var objectFitImages = require('object-fit-images');
objectFitImages();

// Base
require('../vendor/und/js/util/_fetch-svg');
require('../vendor/und/js/modules/_menu');
require('../vendor/und/js/modules/_header');
require('../vendor/und/js/modules/_accordion');
require('./modules/_splash');

require('./components/splash');
require('./components/sidebar');



// Components - site code goes here, imported or not.
// import './components/modal';

// console.log( Is.str( 'hello' ) );

// var el = document.querySelector('#menu-main-menu > .menu__item:last-child > .menu__link');
// el.setAttribute('data-foo', 'Hello World!');

// Array.from(document.querySelectorAll('#menu-main-menu > .menu__item > .menu__link')).forEach((element,index) =>
// {
// 	 console.log(element.textContent);
//      if(element.textContent === "Book Now") {
//      	element.href = "#"
//      	element.setAttribute('data-minimodal-selector', '#shop');
//      	element.setAttribute('data-minimodal', '');
//      }
// });








var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}



var minimodal = require('./modules/_minimodal');

var targets = document.querySelectorAll('.menu__item:last-child .menu__link');

for (var i = 0; i < targets.length; i += 1) {
  var modal = minimodal(targets[i], {
    statusTimeout: 600,
    removeTimeout: 600,
    closeTimeout: 600,
    closeButtonHTML: '<span class="cross"></span>',
    fixed: true
  });
  modal.init();
}
