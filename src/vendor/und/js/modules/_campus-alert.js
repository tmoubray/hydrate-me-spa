/**
 * Campus Alert
 * -----------------------------------------------------------------------------
 *
 * Used for campus emergency notices and closures.
 *
 * - Campus alert is applied at the top of every page.
 * - Alert ID changes on each OU publish.
 * - By default, the alert is collapsed. If cookie does not exist, user has not
 *   collapsed the message, or the Campus Alert ID has changed, un-collapse the
 *   message.
 * - Desired behavior for the Campus Alert cookie is for it to be applied to all
 *   sites within the UND domain (`*.und.edu`). Defaults to the current full
 *   hostname if not within the UND domain.
 */

// Imports.
const $        = require( 'jquery' );
const Cookies  = require( 'js-cookie' );
const location = require( '../util/_location' );



function CampusAlert() {

  // Globals.
  const NAMESPACE = '.und.campus-alert';
  const ClassName = {
    ALERT_COLLAPSED: 'campus-alert--collapsed'
  };
  const $alert  = $( '.campus-alert' );
  const $toggle = $alert.find( '.campus-alert__toggle' );
  const alertID = $alert.attr( 'data-alert-id' );
  const cookie  = {
    name:    'und-campus-alert',
    value:   alertID,
    domain:  location.isUNDDomain() ? 'und.edu' : window.location.hostname,
    expires: 365
  };
  const cookieValue     = Cookies.get( cookie.name );
  let   cookieExists    = undefined !== Cookies.get( cookie.name );
  const hasUpdatedAlert = cookieExists && alertID !== cookieValue;



  /**
   * Add event handlers.
   */
  function events() {
    $alert.on( `click${NAMESPACE}`, onClick );
  }

  /**
   * Click Handler - open/close the Campus Alert.
   *
   * Once closed, a cookie is set so that subsequent page views will display a
   * collapsed alert.
   *
   * When below the medium breakpoint, our header uses fixed positioning to
   * create a sticky navigation. When the Campus Alert, or any site message is
   * active, the header needs to be aware of this and some offsets need to be
   * applied. The code that handles the offsets is in `_header-offset.js`. We
   * trigger a custom event defined by `_header-offset.js` to update the offsets
   * when the Campus Alert is opened/closed.
   *
   * - When collapsed, the whole alert handles clicks.
   * - When un-collapsed, only the toggle handles clicks. Links in the message
   *   need to be clickable.
   *
   * @param {Event} e The browser event.
   */
  function onClick( e ) {

    const collapsed            = $alert.hasClass( ClassName.ALERT_COLLAPSED );
    const alertTargetCollapsed = collapsed && $alert[ 0 ] === e.currentTarget;
    const alertTargetOpen      = !collapsed && $toggle[ 0 ] === e.target;

    if ( alertTargetCollapsed || alertTargetOpen ) {

      // Set cookie so future visits have a collapsed message.
      if ( !cookieExists ) {

        Cookies.set( cookie.name, cookie.value, {
          expires: cookie.expires,
          domain:  cookie.domain
        } );

      }

      $alert.toggleClass( ClassName.ALERT_COLLAPSED, !collapsed );
      $( window ).trigger( 'resize.und.header-offset' );
      toggleText( collapsed );

    }

  }

  /**
   * Toggle the button text for the close/collapse icons.
   *
   * @param {Boolean} collapsed If the campus alert is collapsed.
   */
  function toggleText( collapsed ) {
    $toggle.text( collapsed ? 'Show' : 'Hide' );
  }



  // Setup Campus Alert.
  if ( !$alert.length ) { return; } // Bail, an alert has not been published.

  if ( !cookieExists || hasUpdatedAlert ) {

    // Campus Alert has been updated. Remove cookie until user closes updated
    // message.
    if ( hasUpdatedAlert ) {
      console.log( 'Eat Cookie!!!' );
      cookieExists = !!Cookies.remove( cookie.name, { domain:  cookie.domain } );
      console.log( Cookies.get( cookie.name ) );
    }

    $alert.removeClass( ClassName.ALERT_COLLAPSED );
    toggleText( false );

  }

  events();

}



CampusAlert();
