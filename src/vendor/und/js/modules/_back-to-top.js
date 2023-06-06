/**
 * Back-to-Top Button
 * -----------------------------------------------------------------------------
 */

// Imports.
const {
  BACK_TO_TOP_VISIBLE_AT
}               = require( '../util/_constants' );
const $         = require( 'jquery' );
const throttle  = require( '../util/_throttle' );



function BackToTop() {

  // Globals.
  const NAMESPACE = '.und.back-to-top';
  const ClassName = {
    HAS_BACK_TO_TOP: 'has-back-to-top'
  };
  const $win  = $( window );
  const $body = $( 'body' );
  const $btn  = $( '.back-to-top' );



  /**
   * Add event handlers.
   */
  function events() {

    $btn.on( `click${NAMESPACE}`, onClick );
    $win.on( `scroll${NAMESPACE}`, throttle( showBackToTopButton, 250 ) );

  }

  /**
   * Display Back-to-Top Button.
   */
  function showBackToTopButton() {

    const show   = $win.scrollTop() > BACK_TO_TOP_VISIBLE_AT;
    const config = {
      'visibility': show ? 'visible' : 'hidden',
      'opacity':    show ? 1 : 0
    };

    $body.toggleClass( ClassName.HAS_BACK_TO_TOP, show );
    $btn.css( config );

  }

  /**
   * Click Handler.
   *
   * Scroll user to top of page.
   *
   * @param {Event} e The click event.
   */
  function onClick( e ) {
    $( 'html, body' ).animate( {
      scrollTop: 0
    }, 400 );
  }

  // Setup Back-to-Top Button.
  events();
  showBackToTopButton();

}



BackToTop();
