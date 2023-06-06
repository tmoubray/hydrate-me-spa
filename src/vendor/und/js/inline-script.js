// focus within polyfill
var focusWithin = require('ally.js/style/focus-within');
focusWithin();

// get the type of user input
require('what-input');

// global jquery
global.jQuery = require('jquery');

// modernzir to detect touch
require('./util/_modernizr');

const pageWrapper = document.querySelector('.content-wrapper');

if (pageWrapper != null) {
  pageWrapper.classList.add('page');
}


// required modules for stripped inline page
require('./modules/_back-to-top.js');
require('./modules/_form.js');
require('./modules/_event.js');
require('./modules/_header.js');
require('./modules/_menu.js');
require('./modules/_topbar.js');
require('./modules/_condensed.js');
