/**
 * Course Finder Course Cards Snippet
 * -----------------------------------------------------------------------------
 *
 * TODO: Rename file and CSS selectors.
 */
const $        = require( 'jquery' );
const Flickity = require( 'flickity' );

require( 'flickity-imagesloaded' );



$( () => {

  const sliders = document.querySelectorAll( '.grid--slider' );

  [ ...sliders ].forEach( ( slider ) => {

    new Flickity( slider, {
      cellAlign:     'left',
      imagesLoaded:  true,
      dragThreshold: 6,
      pageDots:      false,
      watchCSS:      true
    } );

  } );

} );
