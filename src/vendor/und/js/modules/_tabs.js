/**
 * Responsive Tabs
 * -----------------------------------------------------------------------------
 *
 * Tabs become accordions when the viewport is below the small breakpoint,
 * 768px.
 *
 * @note As of 02.05.2019, the XSL improperly wraps each `.tabs__main__item` in
 * a DIV with `.tabs__main`. All `.tabs__main_item` elements should be in a
 * single `.tabs__main` element. This can affect how you obtain the index of an
 * active element.
 */

// Imports.
const { MediaQuery } = require( '../util/_media-query' );
const { Accordion }  = require( './_accordion' );
const $              = require( 'jquery' );
const animateTo      = require( '../util/_animate-to' );



class ResponsiveTabs {

  constructor( $el, options = {} ) {

    this.$el        = $el; // `.tabs`
    this.$tabs      = this.$el.find( `> ${ResponsiveTabs.Selector.TABS_NAV} > ${ResponsiveTabs.Selector.TABS_TOGGLE}` );   // `> .tabs__nav > .tabs__nav__item`
    this.$tabPanels = this.$el.find( `> ${ResponsiveTabs.Selector.TABS_PANELS} > ${ResponsiveTabs.Selector.TABS_PANEL}` ); // `> .tabs__main > .tabs__main__item`
    this.options    = Object.assign( {}, ResponsiveTabs.Defaults, options );

    MediaQuery._init();
    this._events();
    this._checkMediaQuery(); // Initialize as Tab/Accordion depending on viewport size on page load.

    if ( this.options.autoFocus ) this._autoFocus();

  }

  /**
   * Scroll to the tab/accordion defined by the URL hash.
   */
  _autoFocus() {

    const $root = this[ 'ACCORDION' === this.currentState ? '$tabPanels' : '$tabs' ];

    animateTo( $root.find( `> [data-id="${window.location.hash}"]` )[ 0 ] );

  }

  /**
   * Global events to respond to.
   */
  _events() {

    this.mediaQueryHandler = this._checkMediaQuery.bind( this );

    $( window ).on( 'changed.und.mq', this.mediaQueryHandler );

  }

  /**
   * Apply ResponsiveTabs click handler.
   *
   * Namespaced for easy removal.
   */
  _addClickHandler() {

    const _this = this;

    // Delegated handler.
    this.$el.on( `click${ResponsiveTabs.NAMESPACE}`, ResponsiveTabs.Selector.TABS_TOGGLE, function ( e ) {

      const $target = $( this );

      if ( $target.hasClass( ResponsiveTabs.ClassName.TABS_TOGGLE_ACTIVE ) ) return; // Already active, bail.

      _this._closeTab();
      _this._openTab( $target );

    } );

  }

  /**
   * Remove ResponsiveTabs event handlers.
   */
  _removeHandlers() {
    this.$el.off( ResponsiveTabs.NAMESPACE );
  }

  /**
   * Close tab.
   *
   * @param {jQuery} $target Tab element to close.
   */
  _closeTab() {

    this.$tabs.removeClass( ResponsiveTabs.ClassName.TABS_TOGGLE_ACTIVE );
    this.$tabPanels.removeClass( ResponsiveTabs.ClassName.TABS_PANEL_ACTIVE );

  }

  /**
   * Open tab.
   *
   * URL Hash Behavior
   * -----------------
   * - Tabs: URL is updated with tab ID on tab selection.
   * - Accordions: URL is only updated with tab ID when accordion is opened. Tab
   *   ID is removed from URL when an accordion is closed, even if more than one
   *   accordion is open.
   *
   * Constructing the URL with individual values from the `location` object
   * prevents hash compounding (#alpha#beta#charlie).
   *
   * @param {jQuery} $target Tab element to open.
   */
  _openTab( $target ) {

    const id  = $target.find( ResponsiveTabs.Selector.TABS_TRIGGER ).data( 'id' );
    const l   = window.location;
    const url = `${l.origin}${l.pathname}${l.search}${id}`;

    $target.addClass( ResponsiveTabs.ClassName.TABS_TOGGLE_ACTIVE );
    this.$tabPanels
      .filter( `[data-id="${id}"]` )
      .first()
      .addClass( ResponsiveTabs.ClassName.TABS_PANEL_ACTIVE );

    // History API is used so that we don't create unwanted history when opening
    // tabs then using browser back button.
    history.replaceState( {}, '', url );

  }

  /**
   * Initialize a ResponsiveTabs instance on the current element.
   *
   * @param {jQuery} $collection jQuery collection of each set of tabs on the
   *                             page.
   */
  static init( $collection ) {

    $collection.each( function () {

      const $el = $( this );

      $el.data( ResponsiveTabs.DATA_KEY, new ResponsiveTabs( $el ) );

    } );

  }

  /**
   * Set ResponsiveTabs state.
   *
   * State is determined by checking the breakpoint when Tab/Accordion
   * transitions.
   */
  _checkMediaQuery() {

    let newState  = MediaQuery.atLeast( 'sm' ) ? 'TAB' : 'ACCORDION';
    let prevState = this.currentState;

    if ( newState !== prevState ) {

      this._handleMarkupChanges( newState );

      this.currentState = newState;

      if ( 'ACCORDION' === newState ) {
        this._removeHandlers();
      } else {
        this._addClickHandler();
      }

    }

  }

  /**
   * Handle markup changes between Tabs and Accordion states.
   *
   * Transitions (Active Tab/Accordion Behavior)
   * -------------------------------------------
   * - No URL Hash: First tab is selected, no scrolling. Accordion is selected.
   * - w/URL Hash: Hash will determine the active tab and scrolled to.
   * - Tabs to Accordions: As only one tab can be active at any given time, the
   *   active tab will be the active accordion.
   * - Accordions to Tabs: If available, hash will be used to determine the
   *   active tab. Without a hash, the first active accordion will be the active
   *   tab.
   *
   * @param {String} toState The desired ResponsiveTabs state. Will be
   */
  _handleMarkupChanges( toState ) {

    let fromState = 'ACCORDION';

    if ( 'ACCORDION' === toState ) fromState = 'TAB';

    const fromClasses = ResponsiveTabs.MarkupChangeLookups[ fromState ]; // getClassCollection( fromState );
    const toClasses   = ResponsiveTabs.MarkupChangeLookups[ toState ];   // getClassCollection( toState );
    const hash        = window.location.hash;
    const $root       = this[ 'ACCORDION' === fromState ? '$tabs' : '$tabPanels' ];
    let   activeIndex;

    if ( hash ) {
      activeIndex = $root.children( 'button' ).index( $root.find( `[data-id="${hash}"]` ) );
    } else {
      activeIndex = this.$tabPanels.index( this.$tabPanels.filter( fromClasses.active.selector ) );
    }

    // -1 occurs on page load when there's no hash.
    // On page load, DO NOT make first accordion active by setting index to `0`.
    if ( -1 === activeIndex ) {
      activeIndex = 'ACCORDION' === toState ? null : 0;
    }

    // Updated CSS classes inside the `.tabs__main` element between Tabs/Accordion.
    this.$tabPanels.each( function ( i, panel ) {

      const activeClass = i === activeIndex ? ` ${toClasses.active.className}` : '';
      const $panel      = $( panel );
      const plugin      = $panel.data( Accordion.DATA_KEY );

      $panel
        .removeClass( `${fromClasses.target.className} ${fromClasses.active.className}` )
        .addClass( `${toClasses.target.className} ${activeClass}` )
        .find( `> ${fromClasses.toggle.selector}` )
          .removeClass( fromClasses.toggle.className )
          .addClass( toClasses.toggle.className )
          .end()
        .find( `> ${fromClasses.content.selector}` )
          .removeClass( fromClasses.content.className )
          .addClass( toClasses.content.className );

      // Add/Remove Accordion plugin instance.
      if ( 'ACCORDION' === toState && !plugin ) {
        $panel.data( Accordion.DATA_KEY, new Accordion( $panel, { autoFocus: false } ) );
      }

      if ( 'TAB' === toState && plugin ) {

        plugin.destroy();
        $panel.data( Accordion.DATA_KEY, null );

      }

    } );

    if ( 'TAB' === toState ) {

      this.$tabs
        .removeClass( ResponsiveTabs.ClassName.TABS_TOGGLE_ACTIVE )
        .eq( activeIndex )
        .addClass( ResponsiveTabs.ClassName.TABS_TOGGLE_ACTIVE );

    }

  }

  /**
   * Remove event handlers and references.
   *
   * @todo ¿Close tabs or set to first tab?
   */
  destroy() {

    // Remove handlers.
    this._removeHandlers();
    $( window ).off( 'changed.und.mq', this.mediaQueryHandler );

    if ( this.accordionPlugin ) this.accordionPlugin.destroy();

  }

}



/**
 * Static Properties
 * -----------------------------------------------------------------------------
 */

/**
 * Default plugin options.
 *
 * @type {Object}
 */
ResponsiveTabs.Defaults = {

  /**
   * Scoll to tab defined by URL hash.
   *
   * @type {Boolean}
   */
  autoFocus: true
};

/**
 * Property name for plugin instance store with jQuery `data()`.
 *
 * @type {String}
 */
ResponsiveTabs.DATA_KEY = 'und.responsive-tabs';

/**
 * Event name space for plugin.
 *
 * @type {String}
 */
ResponsiveTabs.NAMESPACE = '.und.responsive-tabs';

/**
 * Plugin class names.
 *
 * @type {Object}
 */
ResponsiveTabs.ClassName = {
  TABS:               'tabs',                    // Container element for a set of tabs.
  TABS_NAV:           'tabs__nav',
  TABS_TOGGLE:        'tabs__nav__item',         // TABS_TRIGGER container element.
  TABS_TOGGLE_ACTIVE: 'tabs__nav__item--active',
  TABS_TRIGGER:       'tabs__nav__link',         // Element that has data-id.
  TABS_PANELS:        'tabs__main',
  TABS_PANEL:         'tabs__main__item',        // Element that TABS_TRIGGER points to via data-id.
  TABS_PANEL_ACTIVE:  'tabs__main__item--active',
  TABS_PANEL_TOGGLE:  'tabs__main__toggle',
  TABS_PANEL_CONTENT: 'tabs__main__content'
};

/**
 * Plugin CSS Selector values.
 *
 * Based off of `ClassName` values.
 *
 * @type {Object}
 */
ResponsiveTabs.Selector = {};

Object
  .keys( ResponsiveTabs.ClassName )
  .map( ( key, value ) => ResponsiveTabs.Selector[ key ] = `.${ResponsiveTabs.ClassName[ key ]}` );


/**
 * Dictionary that maps a tab class/selector to its respective accordion class
 * (and visa versa).
 *
 * @type {Object}
 */
ResponsiveTabs.MarkupChangeLookups = {

  'ACCORDION': {
    'target': {
      className: Accordion.ClassName.ACCORDION
    },
    'toggle': {
      className: Accordion.ClassName.ACCORDION_TOGGLE,
      selector:  Accordion.Selector.ACCORDION_TOGGLE
    },
    'content': {
      className: Accordion.ClassName.ACCORDION_CONTENT,
      selector:  Accordion.Selector.ACCORDION_CONTENT
    },
    'active': {
      className: Accordion.ClassName.ACCORDION_ACTIVE,
      selector:  Accordion.Selector.ACCORDION_ACTIVE
    }
  },

  'TAB': {
    'target': {
      className: ResponsiveTabs.ClassName.TABS_PANEL
    },
    'toggle': {
      className: ResponsiveTabs.ClassName.TABS_PANEL_TOGGLE,
      selector:  ResponsiveTabs.Selector.TABS_PANEL_TOGGLE
    },
    'content': {
      className: ResponsiveTabs.ClassName.TABS_PANEL_CONTENT,
      selector:  ResponsiveTabs.Selector.TABS_PANEL_CONTENT
    },
    'active': {
      className: ResponsiveTabs.ClassName.TABS_PANEL_ACTIVE,
      selector:  ResponsiveTabs.Selector.TABS_PANEL_ACTIVE
    }
  }

};



/**
 * Implementation
 * -----------------------------------------------------------------------------
 */
ResponsiveTabs.init( $( ResponsiveTabs.Selector.TABS ) );
