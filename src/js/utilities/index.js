/**
 * Utility Functions
 * -----------------------------------------------------------------------------
 *
 * These functions can be used anywhere, even outside of this projected. For
 * utility functions that are project specific, place the function in its own
 * file within this directory.
 */

/**
 * Decode HTML entities in a string ofHTML.
 *
 * Example
 * -------
 *
 * &lt;div&gt;Hello World!&lt;/div&gt; => <div>Hello World!</div>
 * 
 * @param  {String} html HTML string to decode HTML entities to actual HTML
 *                       characters.
 * @return {String}      HTML string with HTML entities decoded.
 */

export function decodeHTMLEntities( html ) {

  const txt = document.createElement( 'textarea' );

  txt.innerHTML = html;

  return txt.value;

}



/**
 * Singleton to perform various type checks.
 */

const toStr = Object.prototype.toString;

export const Is = {
  str:  ( a ) => '[object String]' === toStr.call( a ),
  obj:  ( a ) => '[object Object]' === toStr.call( a ),
  fn:   ( a ) => '[object Function]' === toStr.call( a ),
  arr:  ( a ) => '[object Array]' === toStr.call( a ),
  date: ( a ) => '[object Date]' === toStr.call( a ),
  uon:  ( a ) => null == a, // double equals is intentional.
  dom:  ( a ) => 1 === a.nodeType,
  domText: ( a ) => 3 === a.nodeType
};



/**
 * Parse an HTML template to replace placeholders with content.
 * 
 * @param  {String} tpl  HTML template.
 * @param  {Object} data Object of key/value pairs with they key matching the
 *                       placeholder string inside `{{}}` and the value being
 *                       what will replace the placeholder.
 * @return {String}      The HTML template with placeholders replaced.
 */

export function parseTemplate( tpl, data ) {

  Object
    .keys( data )
    .map( ( key, i, a ) => tpl = tpl.replace( '{{' + key + '}}', data[ key ] ) );

  return tpl;

}