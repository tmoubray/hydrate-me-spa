/**
 * Scroll to Anchor
 * -----------------------------------------------------------------------------
 *
 * Scroll to a page anchor on page load (when URL hash is present) or when an
 * anchor element with a hash is clicked.
 *
 * @todo Explain how/when history is applied.
 */

// Imports.
const $         = require( 'jquery' );
const animateTo = require( '../util/_animate-to' );



( function ( document, history, location ) {

  var HISTORY_SUPPORT = !!( history && history.pushState );

  var anchorScrolls = {

    /**
     * Anchor ID Regex
     *
     * @type {RegExp}
     */
    ANCHOR_REGEX: /^#[^ ]+$/,

    /**
     * Event name space for plugin.
     *
     * @type {String}
     */
    NAMESPACE: '.und.anchor',

    /**
     * Establish events, and fix initial scroll position if a hash is provided.
     */
    init: function () {

      this.scrollToCurrent();

      $( window ).on( 'hashchange', $.proxy( this, 'scrollToCurrent' ) );
      $( 'body' ).on( 'click'     , 'a', $.proxy( this, 'delegateAnchors' ) );

    },

    /**
     * If the provided `href` is an anchor which resolves to an element on the
     * page, scroll to it.
     *
     * @param  {String}  href The anchor ID.
     * @return {Boolean}      If the `href` ID was an element on the page.
     */
    scrollIfAnchor: function ( href, pushToHistory ) {

      const delay = pushToHistory ? 150 : 500;
      let   el;
      let   anchorOffset;

      if ( !this.ANCHOR_REGEX.test( href ) ) return false;

      el = document.getElementById( href.slice( 1 ) );

      if ( el ) {

        // Trigger `scrollto` event for other plugins (i.e. accordions/tabs) to
        // observe.
        $( el ).trigger( `scrollto${this.NAMESPACE}`, [ el ] );

        animateTo( el, 0, 400, true, delay );

        // Add the state to history as-per normal anchor links.
        if ( HISTORY_SUPPORT && pushToHistory ) {
          history.pushState( {}, document.title, location.pathname + href );
        }

      }

      return !!el;

    },

    /**
     * Attempt to scroll to the current location's hash.
     *
     * @param {Event} e The browser event.
     */
    scrollToCurrent: function ( e ) {
      if ( this.scrollIfAnchor( window.location.hash ) && e ) e.preventDefault();
    },

    /**
     * If the click event's target was an anchor, fix the scroll position.
     *
     * @param {Event} e The browser event.
     */
    delegateAnchors: function ( e ) {

      var el = e.target;

      if ( this.scrollIfAnchor( el.getAttribute( 'href' ), true ) ) {
        e.preventDefault();
      }

    }
  };

  // Implementation.
  $( document ).ready( $.proxy( anchorScrolls, 'init' ) );

} )( window.document, window.history, window.location );
