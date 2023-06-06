/**
 * Mobile Navigation
 *
 * Used below 64em breakpoint.
 *
 * NOTE: Some code here is applied to the Sticky Navigation (_condensed.js) for
 * the Search (🔎) toggle.
 */
const $     = require( 'jquery' );
const $body = $( 'body' );



$( () => {

  const lookup = {
    'mobile': 'input#search',
    'sticky': 'input#search-condensed'
  };
  let searchButtonContext;

  const activateSearch = () => {

    $body.addClass( 'search-active' );

    // Determine which search input to focus.
    const $input = $( lookup[ searchButtonContext ] );

    /**
     * Search input is not always visible to the browser at this point in code
     * execution so we delay applying focus.
     *
     * This is presumably due to the `visibility` property on `.header__search`
     * (or elsewhere).
     */
    if ( $input.length ) setTimeout( () => $input.focus(), 50 );

  }

  const deactivateSearch  = () => $body.removeClass( 'search-active' );
  const toggleSearch      = () => $body.hasClass( 'search-active' ) ? deactivateSearch() : activateSearch();
  const activateMenu      = () => $body.addClass( 'menu-active' );
  const deactivateMenu    = () => $body.removeClass( 'menu-active' );
  const toggleMenu        = () => $body.hasClass( 'menu-active' ) ? deactivateMenu() : activateMenu();
  const mobileOrStickyNav = ( el ) => el.classList.contains( 'condensed__search__button' ) ? 'sticky' : 'mobile';

  // Search (🔎) for Mobile AND Sticky navigations!!!
  $( '.toggle-search' ).on( 'click', ( e ) => {

    searchButtonContext = mobileOrStickyNav( e.currentTarget );

    deactivateMenu();
    toggleSearch();

    if ( $body.hasClass( 'condensed__list--active' ) ) $body.removeClass( 'condensed__list--active' );

  } );

  // Hamburger Menu (☰)
  $( '.toggle-menu' ).on( 'click', () => {

    deactivateSearch();
    toggleMenu();

  } );

});

const searchForm = $('.search__form');
const searchFormAction = searchForm.attr('action');
const searchFormPartials = $('.search-partial');

$('.radio__label.search-scope__option').click(function(event) {
  var radio_selector = 'input[type="radio"]',
    $radio;

  if (!$(event.target).is(radio_selector)) {
    $radio = $(this).find(radio_selector);

    if ($radio.hasClass('search-scope__input--und')){
      searchForm.attr('action', "//www.search.und.edu/s/search.html");
      searchFormPartials.attr('disabled','disabled')
    }
    else {
      searchForm.attr('action', searchFormAction);
      searchFormPartials.removeAttr('disabled')
    }

    event.stopImmediatePropagation();

    event.preventDefault();
    if (!$radio.is(':checked')) $radio.prop('checked', true);
  }

  $('.radio__option.search-scope__input').on('change click touchstart', function(event) {

    if ($(event.target).hasClass('search-scope__input--und')){
      searchForm.attr('action', "//www.search.und.edu/s/search.html");
    }
    else {
      searchForm.attr('action', searchFormAction);
    }
  });


});
