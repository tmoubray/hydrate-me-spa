/**
 * Marketing Landing Page RMI Form
 * -----------------------------------------------------------------------------
 */



// Temporary fix for RMI form overlaying lead-in content on page load for small
// viewports. `.wfCurrentPage` appears to be dynamically created. If outer
// elements are measured before this element exists, we will get incorrect
// values.

const animateTo = require( '../util/_animate-to' );

function applyInitialFormPosition( fn ) {

  if ( ! $( '.wfCurrentPage' ).length ) {
    setTimeout( () => { applyInitialFormPosition( fn ); }, 100 );
  } else {
    fn();
  }

}



$(document).ready(function() {

    var marketingMenu = $(".marketing-form").length > 0;
    

    if (marketingMenu) {

        // var marketingFormTop = document.getElementById("skip-to-form");
        // var mktForm          = $('.marketing-form');

        // $( window ).on( 'scroll resize',positionForm );

        // Initial state



        // applyInitialFormPosition( positionForm );

        // $('.skip-form').on('click', () => {
        //   $( 'html, body' ).animate({
        //     scrollTop: 0,
        //     duration: 400
        //   }, 250, () => {
        //     positionForm();
        //     animateTo(marketingFormTop);
        //     marketingFormTop.focus();
        //   });
        // });

    }

    function positionForm() {

        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        var formHeight = mktForm.outerHeight();
        var formWidth = mktForm.outerWidth();
        var bottomDiv = $('#marketing-form-bottom').offset().top;
        var viewportHeight = $(window).height();
        var viewportWidth = $(window).width();
        

        // values for top position
        var topDiv = $('#marketing-form-top').offset().top;
        var halfHeight = formHeight / 2;
        var bottomPosition = bottomDiv - scrollPos;

        var topDivOffest = topDiv + halfHeight;

        // values for right position
        var offsetLeftVal = $('.scroll-container').offset().left;
        var paddingRight = $('.scroll-container').css('padding-right');
        var rightPosition = offsetLeftVal + parseInt(paddingRight, 10);
        var leftSpace = (viewportWidth - formWidth) / 2;
        var centerHorz = leftSpace;

        // value when bottom div is visible in window
        var viewportBottom = bottomDiv - viewportHeight;

        //
        if ( window.innerWidth <= 1023 ) {
            topDivOffest = topDiv + formHeight;
        }

        if ( scrollPos < topDivOffest ) {

            mktForm .removeClass('invisible');
            mktForm .removeClass( 'fixed' );
            mktForm .removeAttr( 'style' );

        } else if ( scrollPos >= topDivOffest && scrollPos < viewportBottom ) {

                mktForm .addClass('invisible');
                mktForm .removeAttr( 'style' );
                mktForm .removeClass( 'fixed' );

        } else if ( scrollPos >= viewportBottom ) {

            if ( window.innerWidth >= 1024 ) {
                mktForm .removeClass('invisible');
                mktForm .addClass( 'fixed' );
                mktForm .css({
                    position: "fixed",
                    top: bottomPosition + "px",
                    right: rightPosition + "px",
                });
            } else if ( window.innerWidth <= 1023 ) {
                mktForm .removeClass('invisible');
                mktForm .addClass( 'fixed' );
                mktForm .css({
                    position: "fixed",
                    top: bottomPosition + "px",
                    right: centerHorz,
                });
            }
        }

        if ( window.innerWidth >= 1024 ) {
            $('#marketing-form-bottom').removeAttr( 'style' );
            $('#marketing-form-top .scroll-container').removeAttr( 'style' );
        } else if ( window.innerWidth <= 1023 ) {
            // Adds spacing and color for target/spacing div behind form when it's on the bottom
            var setHeight = formHeight;
            $('#marketing-form-bottom').height(setHeight);
            $('#marketing-form-bottom').css('z-index', 0);
            $('#marketing-form-top .scroll-container').height(setHeight);
            bottomPosition = topDiv - scrollPos;
        }
    }

});
