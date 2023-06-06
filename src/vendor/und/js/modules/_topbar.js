/**
 * Tactical Navigation Behaviors
 * -----------------------------------------------------------------------------
 *
 * - Displays the drawer (`.mega`) contents of a `button.topbar__link` element
 *   on click.
 */
const $              = require( 'jquery' );
const { MediaQuery } = require( '../util/_media-query' );
const throttle       = require( '../util/_throttle' );



function SetTacticalNavDrawerHeight() {

  // Globals.
  const NAMESPACE     = '.und.tactical-nav-drawer';
  const $menu         = $( '.menu' );
  const $topbarLinks  = $( 'button.topbar__link' );
  let $activeTopbarEl;



  /**
   * Add event handlers.
   */
  function events() {

    $topbarLinks.on( `click${NAMESPACE}`, onClick );
    $( window ).on( `resize${NAMESPACE}`, throttle( applyOffsets, 100 ) );

  }

  /**
   * Click Handler - open/close/adjust the Tactical Navigation drawer.
   *
   * @param {Event} e The browser event.
   */
  function onClick( e ) {

    const $this     = $( this );
    const $parent   = $this.parent();
    const $links    = $this.closest( '.topbar__list' );
    const $navItems = $links.find( '.topbar__item' );
    const isSearch  = $this.hasClass( 'topbar__link--search' );

    // If tactical navigation drawer is open, close it.
    if ( $parent.hasClass( 'topbar__item--active' ) ) {

      $parent.removeClass('topbar__item--active');

      $activeTopbarEl = undefined;

    // Switch between tactical navigation drawers.
    } else if ( $navItems.hasClass( 'topbar__item--active' ) ) {

      $navItems.removeClass( 'topbar__item--active' );
      $parent.addClass('topbar__item--active');

      $activeTopbarEl = $this.next();

    // Open tactical navigation drawer.
    } else {

      $parent.addClass( 'topbar__item--active' );

      /**
       * Search input is not always visible to the browser at this point in code
       * execution so we delay applying focus.
       *
       * This is presumably due to the `visibility` property on `.header__search`
       * (or elsewhere).
       */
      if ( isSearch ) setTimeout( () => $( 'input#query' ).focus(), 50 );

      $activeTopbarEl = $this.next();

    }

    applyOffsets();

  }

  /**
   * Apply Offset to `.menu` for Tactical Navigation Drawer spacing.
   */
  function applyOffsets() {

    const tacticalNavDrawerHeight = $activeTopbarEl ? `${$activeTopbarEl.outerHeight()}px` : 0;
    const topMargin               = MediaQuery.atLeast( 'md' ) ? tacticalNavDrawerHeight : 0;

    $menu.css( 'margin-top', topMargin );

  }



  // Setup Tactical Navigation Behaviors.
  if ( !$topbarLinks.length ) { return; } // Bail, nothing to act on.

  MediaQuery._init();

  applyOffsets();
  events();

}



SetTacticalNavDrawerHeight();
