/**
 * Side Navigation Behaviors and Styles
 * -----------------------------------------------------------------------------
 *
 * @note "Always Open" value for Navigation Styling option in transformation
 * table is currently not available (6/18/19) to end users. This option is
 * implemented in the XSL, though appears to not be finished (rendering issues),
 * and was previously implemented here.
 */

/**
 * Behaviors
 * -----------------------------------------------------------------------------
 *
 * `.subnav__toggle` - used on mobile viewports and is styled like an accordion.
 *   This is a `<button>` element.
 *
 * `.subnav__list--toggle` - used for side navigation dropdown indicators. This
 *   is a `<a>` element with a `#` for its `href` which requires negating the
 *   `click` event.
 */
$( '.subnav' ).on( 'click', '.subnav__toggle, .subnav__list--toggle', function ( e ) {

  const isSubnavListToggle = /subnav__list/i.test( this.className );
  const $toggle            = $( this );

  $toggle.parent().toggleClass( `subnav${ isSubnavListToggle ? '__list' : '' }--active` );

  if ( isSubnavListToggle ) { e.preventDefault(); }

} );



/**
 * Styling
 * -----------------------------------------------------------------------------
 */

/**
 * Make sure `OUC` global exists along with the required properties for the code
 * to function.
 *
 * We do this because our `script.js` file is used by non OU pages. The `OUC`
 * global will not exist on non OU pages and cause the JS to error out and
 * execution of the script will halt. Preventing any additional code from
 * running which may be needed.
 *
 * @return {Boolean} If all required properties have been defined.
 */
function hasRequiredOUCProps() {

  const required = {
    globalProps: [
      'domain',
      'path',
      'extension',
      'index-file',
      'navType'
    ]
  };

  if ( 'undefined' === typeof OUC || 'undefined' === typeof OUC.globalProps ) { return false; }

  const props = required.globalProps;
  const len   = props.length;
  let   i     = 0;

  for ( ; i < len; i++ ) {
    if ( !OUC.globalProps.hasOwnProperty( props[ i ] ) ) { return false; }
  }

  return true;

}

/**
 * Get Side Navigation Dropdown Element (UL)
 *
 * Search for dropdown UL needs to be relative to the provided anchor element as
 * the provided anchor element represents the current page and we only want the
 * dropdown UL related to that anchor.
 *
 * @param  {jQuery} $a Anchor element to use as root of DOM searches for the
 *                     dropdown element.
 * @return {jQuery}    The dropdown element (UL) if it exists.
 */
function getSidenavDropdownUL( $a ) {

  const selector = '.subnav__list--sub';

  return $a.closest( selector ).add( $a.siblings( selector ) );

}



/**
 * Apply Current/Active Classes to Side Navigation
 */
function ApplySideNavigationStyles() {

  if ( !hasRequiredOUCProps() ) { return };

  const ou           = OUC.globalProps;
  const origin       = ou.domain;
  const ext          = ou.extension;
  const indexFile    = `${ou[ 'index-file' ]}.${ext}`;
  const navType      = ou.navType;
  const pageURL      = origin + ou.path;
  const directoryURL = pageURL.replace( indexFile, '' );
  const allowedPaths = [ pageURL, directoryURL ];
  const regex        = new RegExp( `^${origin.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' )}`, 'i' );

  $( '.subnav__list li a' ).each( function ( i, a ) {

    const isSubnavHeadingLink = 0 === i;
    const linkURL             = regex.test( a.href ) ? a.href : `${origin}${a.href}`;
    const linkHasAllowedPath  = -1 !== allowedPaths.indexOf( linkURL );

    // Link is not for the current page, move to next iteration of `each()`.
    if ( isSubnavHeadingLink || !linkHasAllowedPath ) { return true; }

    const $a             = $( a );
    const $li            = $a.parent();
    const $dropdown      = getSidenavDropdownUL( $a );
    const isTopLevelLink = $li.parent().hasClass( 'subnav__list' );

    // Add "current" class to parent LI of A. Append `--sub` when A is in
    // a dropdown.
    $li.addClass( `subnav__current${ isTopLevelLink ? '' : '--sub' }` );

    // Add "active" class to top level LI when A is in or sibling of a
    // dropdown.
    if ( $dropdown.length ) {
      $dropdown.parent().addClass( 'subnav__list--active' );
    }

    return false; // Break out of `each()`.

  } );

}



ApplySideNavigationStyles();
