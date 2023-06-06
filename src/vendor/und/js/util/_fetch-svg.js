/**
 * Fetch SVGStore Sprite
 * -----------------------------------------------------------------------------
 *
 * Make Ajax request for `svgstore.svg` and embed at the top of the page.
 *
 * To make use of the sprite, use inline SVGs with a `<use>` element referencing
 * the desired icon.
 *
 * Example
 * -------
 *
 * <svg>
 *   <use xlink:href="#svgstore--warning"></use>
 * </svg>
 *
 * Typically, additional markup is used to properly size the icons and looks
 * like this:
 *
 * <span class="svgstore svgstore--warning">
 *   <svg>
 *     <use xlink:href="#svgstore--warning"></use>
 *   </svg>
 * </span>
 */

// Imports.
const { SVGSTORE_HASH } = require( '../util/_constants' );
const $                 = require( 'jquery' );



// Variables.
const host = !/localhost/.test( window.location.hostname ) ? 'https://hydrateme-columbus.com/wp-content/themes/hydrateme/dist' : '';
//const host = !/localhost/.test( window.location.hostname ) ? 'https://und.edu/_resources' : '';
const url  = `${host}/img/svgstore.svg?v=${SVGSTORE_HASH}`;



/**
 * Get `svgstore.svg` and append to page.
 * -----------------------------------------------------------------------------
 */

$.get( url, function ( data ) {

  const div = document.createElement( 'div' );

  div.style.display = 'none';
  div.innerHTML     = new XMLSerializer().serializeToString( data.documentElement );

  document.body.insertBefore( div, document.body.childNodes[ 0 ] );

  // SVG polyfill for better xlink support.
  var svg4everybody = require( 'svg4everybody' );

  svg4everybody();

} );
