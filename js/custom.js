/**
 * UND WordPress Theme
 * -----------------------------------------------------------------------------
 *
 * NOTE: You might need to use `require()` instead of `import`.
 */

//jQuery Scripts
if ( undefined !== typeof jQuery && undefined !== $ ) {
  document.dispatchEvent( new Event( 'jquery.loaded' ) );
}


jQuery( '[data-jquery-chosen]' ).chosen( { width: '100%' } );



jQuery('.menu__item:last-child .menu__link').attr("data-minimodal-type","iframe");



jQuery(document).ready(function() {
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
  	var header_image = jQuery('.header').data("ios-header");
  	console.log(header_image);
    jQuery('.banner__video').replaceWith('<img src="'+header_image+'" >');
  }
});


