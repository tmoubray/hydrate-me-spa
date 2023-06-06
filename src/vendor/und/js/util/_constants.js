/**
 * Element Dimensions
 * -----------------------------------------------------------------------------
 */
const CONDENSED_NAV_HEIGHT = 80; // .condensed__list__container
const MOBILE_NAV_HEIGHT    = 64; // .header__small
const STICKY_NAV_HEIGHT    = 71; // .header__menu > .condensed



/**
 * Media Query Breakpoints
 * -----------------------------------------------------------------------------
 *
 * @todo ¿Convert to strings with unit value? i.e. 512 => '512px'
 */
const BREAKPOINT_XS = 512;  // $break-xs
const BREAKPOINT_SM = 768;  // $break-sm
const BREAKPOINT_MD = 1024; // $break-md
const BREAKPOINT_LG = 1280; // $break-lg
const BREAKPOINT_XL = 1440; // $break-xl



/**
 * Back-to-Top Button
 * -----------------------------------------------------------------------------
 */
const BACK_TO_TOP_VISIBLE_AT = 800; // px



/**
 * Domains
 * -----------------------------------------------------------------------------
 */
const DOMAIN_UND = 'und.edu';


/**
 * SVGStore Cache Buster
 * -----------------------------------------------------------------------------
 *
 * Used as query param to bust user cache. Each time the contents of
 * `svgstore.svg` is changed, update this value.
 */

const SVGSTORE_HASH = 1;



module.exports = {
  CONDENSED_NAV_HEIGHT,
  MOBILE_NAV_HEIGHT,
  STICKY_NAV_HEIGHT,
  BREAKPOINT_XS,
  BREAKPOINT_SM,
  BREAKPOINT_MD,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BACK_TO_TOP_VISIBLE_AT,
  DOMAIN_UND,
  SVGSTORE_HASH
};
