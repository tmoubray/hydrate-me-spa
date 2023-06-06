/**
 * URL, Domain, etc. Helpers
 * -----------------------------------------------------------------------------
 */

// Imports.
const { DOMAIN_UND }  = require( './_constants' );



/**
 * Get the "root" domain.
 *
 * @note will not work with country code TLDs.
 *
 * @static
 * @return {String} The TLD (com, org, edu) plus the domain.
 */
function getRootDomain() {
  return window.location.hostname.split( '.' ).slice( -2 ).join( '.' );
}

/**
 * Is the current domain a UND (und.edu) domain?
 *
 * @return {Boolean} If the current domain is a UND domain.
 */
function isUNDDomain() {
  return DOMAIN_UND === getRootDomain();
}



module.exports = {
  getRootDomain,
  isUNDDomain
};
