/**
 * Accordions
 * -----------------------------------------------------------------------------
 *
 * Each accordion behaves independently, meaning that opening one accordion does
 * not close all other accordions in the same accordion group.
 */

// Imports.
const $         = require( 'jquery' );
const animateTo = require( '../util/_animate-to' );



class Accordion {

  constructor( $el, options = {} ) {

    this.$el     = $el; // .accordion
    this.$toggle = this.$el.find( `> ${Accordion.Selector.ACCORDION_TOGGLE}` ); // .accordion__toggle
    this.options = Object.assign( {}, Accordion.Defaults, options );

    if ( this.options.autoFocus ) this._autoFocus( window.location.hash );

    this._addClickHandler();

  }

  /**
   * Scroll to the tab/accordion defined by the URL hash.
   */
  _autoFocus( hash ) {

    if ( hash ) {

      // Hash provided, but it's not this accordion. Bail.
      if ( hash !== this.$toggle.data( 'id' ) ) return;

      animateTo( this.$el[ 0 ] );
      this._toggleAccordion();

    }

  }

  /**
   * Apply Accordion click handler.
   *
   * Namespaced for easy removal.
   */
  _addClickHandler() {
    this.$toggle.on( `click${Accordion.NAMESPACE}`, this._toggleAccordion.bind( this ) );
  }

  /**
   * Open/Close an Accordion.
   *
   * Accordion ID is only added to the URL on initial accordion open. Closing
   * ANY accordion will remove an accordion ID from the URL.
   *
   * Constructing the URL with individual values from the `location` object
   * prevents hash compounding (#alpha#beta#charlie) and allows for removal of
   * the hash.
   *
   * @param {Event} e The browser event.
   */
  _toggleAccordion( e ) {

    const isActive = this.$el.hasClass( Accordion.ClassName.ACCORDION_ACTIVE );
    const id       = this.$toggle.data( 'id' );
    const l        = window.location;
    const url      = `${l.origin}${l.pathname}${l.search}${!isActive ? id : ''}`;

    this.$el.toggleClass( Accordion.ClassName.ACCORDION_ACTIVE );

    // History API is used so that we don't create unwanted history when opening
    // tabs then using browser back button.
    history.replaceState( {}, '', url );

  }

  /**
   * Remove event handlers and references.
   *
   * @todo ¿Close all accordions?
   */
  destroy() {

    this.$el.removeClass( Accordion.ClassName.ACCORDION_ACTIVE );
    this.$toggle.off( Accordion.NAMESPACE );

  }

  /**
   * Initialize a Accordion instance on the current element.
   *
   * @param {jQuery} $collection jQuery collection of each set of tabs on the
   *                             page.
   */
  static init( $collection ) {

    $collection.each( function () {

      const $el = $( this );

      $el.data( Accordion.DATA_KEY, new Accordion( $el ) );

    } );

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
Accordion.Defaults = {
  autoFocus: true
};

/**
 * Property name for plugin instance store with jQuery `data()`.
 *
 * @type {String}
 */
Accordion.DATA_KEY = 'und.accordion';

/**
 * Event name space for plugin.
 *
 * @type {String}
 */
Accordion.NAMESPACE = '.und.accordion';

/**
 * Plugin class names.
 *
 * @type {Object}
 */
Accordion.ClassName = {
  ACCORDION:         'accordion',         // Container element for an accordion.
  ACCORDION_ACTIVE:  'accordion--active',
  ACCORDION_TOGGLE:  'accordion__toggle',
  ACCORDION_TRIGGER: 'accordion__toggle', // Element that has data-id.
  ACCORDION_CONTENT: 'accordion__content' // Element that TAB_TRIGGER points to via `data-id`.
};

/**
 * Plugin CSS Selector values.
 *
 * Based off of `ClassName` values.
 *
 * @type {Object}
 */
Accordion.Selector = {};

Object.keys( Accordion.ClassName ).map( key => Accordion.Selector[ key ] = `.${Accordion.ClassName[ key ]}` );



/**
 * Implementation
 * -----------------------------------------------------------------------------
 */
Accordion.init( $( Accordion.Selector.ACCORDION ) );



module.exports = { Accordion };
