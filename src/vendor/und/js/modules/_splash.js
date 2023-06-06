/**
 * Splash Slider
 * -----------------------------------------------------------------------------
 *
 * Initializes Flickity plugin and updates Flickity controls positioning for
 * smaller viewports.
 *
 * @see https://flickity.metafizzy.co/
 *
 * Landing and College Templates.
 * - College Template: Uses the snippet as a built-in feature of the template
 *   via MultiEdit.
 * - Landing Template: User can place slider like a regular snippet in the
 *   Additional Content region only.
 */

// Imports.
const $              = require( 'jquery' );
const Flickity       = require( 'flickity' );
const { MediaQuery } = require( '../util/_media-query' );
const throttle       = require( '../util/_throttle' );

require( 'flickity-imagesloaded' );



function splashSlider() {

  const NAMESPACE = '.und.splash';
  // Converting jQuery collection of elements to an array of jQuery objects
  // (from those elements).
  const sliders   = $( '.splash' ).map( ( i, el ) => $( el ) );
  const offsetEls = [
    '.flickity-prev-next-button',
    '.flickity-page-dots'
  ];
  let applyOffsetOnceAtMD = false;



  /**
   * Initialize Flickity.
   *
   * @param {jQuery} $el Snippet container element. This is not the element
   *                     that Flickity is applied to.
   */
  function init( $el ) {

    const slider = $el.find( '.splash__slides' );
    const flkty   = new Flickity( '.splash__slides', {
      imagesLoaded:  true,
      dragThreshold: 6,
      wrapAround:    false,
      accessibility: false
    } );

    // Set prev/next button positions on page load.
    applyOffsets();

  }

  /**
   * Window Resize Event Handler
   *
   * Applies offsets to Flickity control elements.
   *
   * These offsets need to be applied when:
   * 1. As the viewport is resized below the `sm` breakpoint (768px).
   * 2. When the viewport is above the `sm` breakpoint, but only once.
   */
  function applyOffsets() {

    const atLeastMD = MediaQuery.atLeast( 'md' );

    if ( !atLeastMD || !applyOffsetOnceAtMD ) {

      let offsets = [ 0, 0 ]; // When above `sm` breakpoint offsets.

      sliders.each( function ( i, $el ) {

        // Below `sm` breakpoint offsets.
        if ( !atLeastMD ) {

          offsets = [
            $el.find( '.splash__media' ).height()
          ];

        }

        const offsetTotal = offsets.reduce( ( acc, val ) => acc += val, 0 );
        const CSSValue    = 0 !== offsetTotal ? offsetTotal + 'px' : ''; // Empty string ('') removes the inline `top` property.

        offsetEls.map( ( el ) => $el.find( el ).css( { top: CSSValue } ) );

      } );

    }

    applyOffsetOnceAtMD = atLeastMD;

  }

  /**
   * Add event handlers.
   */
  function events() {
    $( window ).on( `resize${NAMESPACE}`, throttle( applyOffsets, 25 ) );
  }



  // Setup Landing Page Sliders.
  if ( !sliders.length ) return;


  MediaQuery._init();
  events();
  sliders.map( ( i, $el ) => init( $el ) );

}


$( window ).on( "load", function() {
  splashSlider();
});
