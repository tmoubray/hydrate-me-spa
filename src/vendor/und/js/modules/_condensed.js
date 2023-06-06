/**
 * Sticky Navigation
 *
 * Used when user scrolls past primary navigation.
 */
const $       = require( 'jquery' );
const $win    = $( window );
const $body   = $( 'body' );
const $header = $( 'header' );



$( () => {

  const headerFixedCheck = () => {

    const contentOffset = $( '.page' ).offset().top;
    const winWidth      = $win.width();
    const scroll        = window.scrollY || window.pageYOffset;
    const method        = scroll > contentOffset ? 'addClass' : 'removeClass';

    $header[ method ]( 'condensed--show' );

    requestAnimationFrame( headerFixedCheck );

  }

  headerFixedCheck();

  /**
   * Hamburger Menu (☰) ONLY!! Search (🔎) for sticky navigation is handled by the
   * code in `_header.js` and the `.toggle-search` selector.
   */
  $( '.condensed__list__button' ).on( 'click', function () {

    $body.toggleClass( 'condensed__list--active' );
    if ( $body.hasClass( 'search-active' ) ) $body.removeClass( 'search-active' );

  } );

  // Dropdowns
  let prevent = true;
  let enable;
  let close;

  // Todo: Document.
  const click = function ( e ) {

    if ( prevent || !this.parentNode.classList.contains( 'condensed__item--active' ) ) {
      over.call( this.parentNode );
      e.preventDefault();
    }

  };

  const targets = document.querySelectorAll( '.condensed__button' );

  for ( let i = 0; i < targets.length; i += 1 ) {
    targets[ i ].addEventListener( 'click', click );
  }

  const items = document.querySelectorAll( '.condensed__item' );

  // Todo: Document.
  const reset = function () {

    prevent = true;

    clearTimeout( enable );
    clearTimeout( close );

    for ( let i = 0; i < items.length; i += 1 ) {
      items[ i ].classList.remove( 'condensed__item--active' );
    }

    document.body.removeEventListener( 'click', outClick );
    // document.removeEventListener( 'scroll', reset );

  };

  // Todo: Document.
  var over = function ( e ) {

    reset();
    this.classList.add( 'condensed__item--active' );

    enable = setTimeout( function () {
      prevent = false;
    }, 100 );

    document.body.addEventListener( 'click', outClick );
    document.addEventListener( 'scroll', reset );

  };

  // Todo: Document.
  var out = function ( e ) {
    close = setTimeout( reset, 300 );
  };

  // Todo: Document.
  var outClick = function( e ) {

    const el = document.querySelector( '.condensed__item--active' );

    if ( !el.contains( e.target ) ) out();

  };

} );
