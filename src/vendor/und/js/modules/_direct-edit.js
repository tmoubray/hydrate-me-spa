/**
 * DirectEdit Button
 * -----------------------------------------------------------------------------
 *
 * Replace the `#directedit` element with the content of the `#de` element.
 *
 * OU DirectEdit link markup: `<a id="de" rel="nofollow" href="^0">&copy;</a>`
 * Markup of DirectEdit link can be changed in OU in the site settings.
 */

// Non-jQuery implementation.
/*
function directedit() {
  if(document.getElementById("de") != null && document.getElementById("directedit")) {
    var link = document.getElementById("de").parentNode.innerHTML;
    document.getElementById("de").parentNode.innerHTML = "";
    document.getElementById("directedit").innerHTML = link;
  }
}

window.onload = function() {
  directedit()
};
*/

// jQuery option.
// Wrapped in `$( () => {} )` because OU includes the markup after our scripts.
$( () => $( '#directedit' ).html( $( '#de' ) ) );
