const {
  CONDENSED_NAV_HEIGHT,
  MOBILE_NAV_HEIGHT,
  STICKY_NAV_HEIGHT
}                    = require( './_constants' );
const $              = require( 'jquery' );
const { MediaQuery } = require( './_media-query' );



/**
 * Animate (scroll) to page anchor.
 *
 * This helper takes into consideration elements that might overlap the target
 * element if not accounted for, like sticky navs and campus alerts.
 *
 * @todo  Refine default parameters and how they are set.
 *
 * @param {DOMNode} el        The element to scroll to.
 * @param {Number}  offset    Optional. Adjustment to final `scrollTop` position
 *                            value. Useful if you want to offset the target
 *                            element from the top of the viewport or ensure the
 *                            whole target element is visible.
 * @param {Mixed}   duration  Optional. How long the animation should last. This
 *                            can be a Number or Function. The function option
 *                            will be passed a single parameter, calculated
 *                            offset (`scrollTop`), and should return a Number.
 * @param {Mixed}   headers   Optional. If fixed elements should be considered
 *                            in the final calculation.
 * @param {Number}  delay     Optional. Amount of time, in milliseconds, to wait
 *                            before animating to the target element. If
 *                            animating to an element on page load, it is
 *                            suggested to set a delay so that JS powered page
 *                            features can render and do not affect the final
 *                            offset height to the target element.
 * @param {Function} complete Optional. Function to call once the target element
 *                            has been scrolled to. Function is passed a single
 *                            argument `el` that references the element that has
 *                            been scrolled to.
 */
function animateTo( el, offset = 0, duration = 400, headers = true, delay = 500, complete = function ( el ) {} ) {

  if ( el && 1 === el.nodeType ) {

    MediaQuery._init();

    offset = offset + 16;

    let headersOffset = STICKY_NAV_HEIGHT + ( document.body.classList.contains( 'condensed__list--active' ) ? CONDENSED_NAV_HEIGHT : 0 );

    setTimeout( function () {

      // When above the medium breakpoint, campus alert stays at the top of
      // the page.
      if ( headers && !MediaQuery.atLeast( 'md' ) ) {

        const alert = document.querySelector( '.campus-alert' );

        headersOffset = MOBILE_NAV_HEIGHT + ( alert ? Math.floor( alert.getBoundingClientRect().height ) : 0 );

      }

      const scrollTop = el.getBoundingClientRect().top + window.pageYOffset - ( headersOffset + offset );

      duration = 'function' === typeof duration ? duration( scrollTop ) : duration;

      $( 'html, body' )
        .animate( { scrollTop }, duration )
        .promise()
        .then( () => complete( el ) );

    }, delay );

  }

}



module.exports = animateTo;
