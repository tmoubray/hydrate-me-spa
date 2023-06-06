/**
 * Media Query Evaluation
 * -----------------------------------------------------------------------------
 *
 * Test media queries that you would use in CSS (with the same accuracy) to
 * modify behaviors in JS.
 *
 * Cribbed and modified from Zurb Foundation.
 * @see https://github.com/zurb/foundation-sites/blob/develop/js/foundation.util.mediaQuery.js
 */

// Imports.
const {
  BREAKPOINT_XS,
  BREAKPOINT_SM,
  BREAKPOINT_MD,
  BREAKPOINT_LG,
  BREAKPOINT_XL
}       = require( '../util/_constants' );
const $ = require( 'jquery' );



// Variables.

// This list should mimic the common breakpoints defined in the SASS variables.
// The `key` value is a value that methods with a `size` argument will expect.
const breakpoints = {
  'xs': BREAKPOINT_XS,
  'sm': BREAKPOINT_SM,
  'md': BREAKPOINT_MD,
  'lg': BREAKPOINT_LG,
  'xl': BREAKPOINT_XL
};



const MediaQuery = {

  queries: [],

  /**
   * Get the current matching breakpoint name.
   *
   * `$( window ).width()` does not return the dimensions that CSS media queries
   * use. The `window.matchMedia` API is consistent with CSS media queries so we
   * use it when we need CSS breakpoint equivalents in JS.
   *
   * `$( window ).width()` will be off by the scrollbar width, ~17px on Windows.
   *
   * @return {String} Name of the last (largest) matched breakpoint. `undefined`
   *                  if there are not matches.
   */
  getCurrentSize() {

    let matched;

    for ( let i in this.queries ) {

      const query = this.queries[ i ];

      if ( window.matchMedia( this.getSize( query.name ) ).matches ) matched = query.name;

    }

    return matched;

  },

  /**
   * Get media query breakpoint.
   *
   * @param  {String}      size Name of breakpoint to get.
   * @return {String|null}      The breakpoint or `null` if not found.
   */
  getSize( size ) {

    for ( let key in this.queries ) {

      const query = this.queries[ key ];

      if ( size === query.name ) return query.value;

    }

    return null;

  },

  /**
   * Check if the viewport matches the named breakpoint. Assumes media query is
   * a `min-width` media query, hence the name `atLeast`.
   *
   * @param  {String}  size Breakpoint, by name, to check against.
   * @return {Boolean}      If viewport matches the named breakpoint.
   */
  atLeast( size ) {
    return window.matchMedia( this.getSize( size ) ).matches;
  },

  /**
   * Initialize the MediaQuery helper object.
   */
  _init() {

    if ( true === this.initialized ) {
      return;
    } else {
      this.initialized = true;
    }

    const _this = this;

    Object.keys( breakpoints )
      .map( ( key, value ) => {

        _this.queries.push( {
          name: key,
          value: `(min-width: ${breakpoints[ key ]}px)`
        } );

      } );

    this.currentSize = this.getCurrentSize();

    this._watch();

  },

  /**
   * `resize` event handler.
   *
   * Emits namespaced `changed` event for plugins to hook onto.
   */
  _watch() {

    const _this = this;
    const $win  = $( window );

    $win
      .off( `resize${this.NAMESPACE}` )
      .on( `resize${this.NAMESPACE}`, function ( e ) {

        let prevSize = _this.currentSize;
        let newSize  = _this.getCurrentSize();

        if ( newSize !== prevSize ) {

          _this.currentSize = newSize;

          $win.trigger( `changed${_this.NAMESPACE}`, [ newSize, prevSize ] );

        }

      } );

  },

  /**
   * Events namespace.
   *
   * @type {String}
   */
  NAMESPACE: '.und.mq'

};



module.exports = { MediaQuery };
