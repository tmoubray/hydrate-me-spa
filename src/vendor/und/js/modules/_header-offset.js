/**
 * Header Offset
 * -----------------------------------------------------------------------------
 *
 * Adds an offset to the page header when various campus alerts or messages are
 * posted.
 *
 * Offset is measured when the page is resized.
 */

// Imports.
const $              = require( 'jquery' );
const { MediaQuery } = require( '../util/_media-query' );
const throttle       = require( '../util/_throttle' );



function HeaderOffset() {

  // Globals.
  const NAMESPACE   = '.und.header-offset';
  const $body       = $( 'body' );
  const observables = [
    $( '#campus-communications' )
  ];
  const headers = [
    $( '.header__menu' ),
    $( '.header__small' ),
    $( '.header__search' )
  ];
  const $page = $( '.page' );



  /**
   * Add event handlers.
   */
  function events() {
    $( window ).on( `resize${NAMESPACE}`, throttle( applyOffsets, 100 ) );
  }

  /**
   * Get heights from elements to use as offset values on other elements.
   *
   * `getBoundingClientRect()` will provide floats while jQuery appears to
   * provide integers. Using integers will sometimes leave a 1px gap between the
   * alert and navigation below it.
   */
  function getHeights() {

    const observablesHeight = observables.reduce( ( acc, $el ) => $el[ 0 ].getBoundingClientRect().height, 0 );
    const headerHeight      = headers[ 1 ][ 0 ].getBoundingClientRect().height;

    return {
      observables: !isNaN( observablesHeight ) ? Math.floor( observablesHeight ) : 0,
      header:      !isNaN( headerHeight )      ? Math.floor( headerHeight )      : 0
    };

  }

  /**
   * Apply Offset to elements for Campus Alert spacing.
   *
   * This only needs to be applied when our menus use fixed positioning as the
   * elements are no longer a part of the normal document flow.
   */
  function applyOffsets() {

    if ( !MediaQuery.atLeast( 'md' ) ) {

      const heights = getHeights();

      headers.map( ( $el ) => $el.css( 'top', heights.observables ) );
      $page.css( 'padding-top', heights.observables + heights.header );

    }

  }

  // Setup Header Offsets.
  MediaQuery._init();

  applyOffsets();
  events();

}



HeaderOffset();
