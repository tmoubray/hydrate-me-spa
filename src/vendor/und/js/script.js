// Load svg from cross origin
require('./util/_fetch-svg');

// focus within polyfill
var focusWithin = require('ally.js/style/focus-within');
focusWithin();

// get the type of user input
require('what-input');

// global jquery
global.jQuery = global.$ = require( 'jquery' );

const body = document.querySelector('body');

// modernzir to detect touch
require('./util/_modernizr');

// srcset picture polyfill
require('respimage');

// object-fit polyfill
var objectFitImages = require('object-fit-images');
objectFitImages();

// load youtube embed video
const embed = require('./modules/_embed');
embed();

// Manually include each module.
require( './modules/_cookie-banner' );
require( './modules/_campus-alert' );
require( './modules/_header-offset' );
require( './modules/_anchor' );
require( './modules/_topbar' );
require( './modules/_subnav' );

require( './modules/_accordion' );
require( './modules/_action' );
require( './modules/_back-to-top' );
require( './modules/_breadcrumb' );
require( './modules/_card' );
require( './modules/_college' );
require( './modules/_compare' ); // Program Finder
require( './modules/_condensed' );
require( './modules/_count-up' );
require( './modules/_course-finder.js' );
require( './modules/_direct-edit' );
require( './modules/_dropdown' );
// require( './modules/_embed' ); // Included above.
require( './modules/_event' );
require( './modules/_form' );
require( './modules/_grid' ); // Course Finder
require( './modules/_header' );
require( './modules/_hero' );
require( './modules/_home-card' );
require( './modules/_home' );
// require( './modules/_marketing-menu' );
require( './modules/_menu' );
require( './modules/_minimodal' );
require( './modules/_program-finder' );
require( './modules/_program' );
require( './modules/_share' );
require( './modules/_slider' );
require( './modules/_splash' );
require( './modules/_stats' );
require( './modules/_table' );
require( './modules/_tabs' );
require( './modules/_tuition-calc' );
require( './modules/_tuition-table' );
