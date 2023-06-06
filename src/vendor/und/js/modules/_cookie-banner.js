/**
 * Cookie Banner
 * -----------------------------------------------------------------------------
 *
 * Displays a cookie policy notification to the user as a sticky footer at the
 * bottom of the page.
 *
 * - Desired behavior for the Cookie Banner cookie is for it to be the
 *   domain of the site loading the script and all subdomains.
 */

// Imports.
const $        = require( 'jquery' );
const Cookies  = require( 'js-cookie' );
const location = require( '../util/_location' );



function CookieBanner() {

  // Globals.
  const NAMESPACE = '.und.cookie-banner';
  const $body     = $( 'body' );
  const $banner   = $( '.cookie-banner' );
  const $button   = $banner.find( '.cookie-banner__button' );
  const cookie    = {
    name:    'und-cookie-banner',
    value:   'accepted',
    expires: 365,
    domain:  location.getRootDomain()
  };
  const cookieValue  = Cookies.get( cookie.name );
  const cookieExists = undefined !== Cookies.get( cookie.name );
  const animation    = {
    duration: 1250
  };
  let height;


  /**
   * Add event handlers.
   */
  function events() {
    $button.on( `click${NAMESPACE}`, onClick );
  }

  /**
   * Display Cookie Banner.
   *
   * Due to CSS position value, element needs to be visible so the proper height
   * can be determined.
   */
  function showBanner() {

    $banner
      .show()
      .css( 'bottom', height = -Math.floor( $banner[ 0 ].getBoundingClientRect().height ) )
      .animate( { bottom: 0 }, animation.duration );

  }

  /**
   * Click Handler.
   *
   * A cookie is set so that subsequent page views will not display the cookie
   * banner.
   *
   * @param {Event} e The click event.
   */
  function onClick( e ) {

    // By default, if `domain` is not set, the cookie is only visible to the
    // domain or subdomain of the page where it was created. Manually setting
    // the domain allows the cookie to be visible to the domain and ALL
    // subdomains.
    Cookies.set( cookie.name, cookie.value, {
      expires: cookie.expires,
      domain:  cookie.domain
    } );
    $banner.animate( { bottom: height }, animation.duration / 2, destroy );

  }

  /**
   * Destroy Cookie Banner.
   */
  function destroy() {

    $button.off( NAMESPACE )
    $banner.remove();

  }



  // Setup Cookie Banner.
  if ( cookieExists || !$banner.length ) { return; } // Bail, user has excepted cookies or banner does not exist.

  showBanner();
  events();

}



CookieBanner();
