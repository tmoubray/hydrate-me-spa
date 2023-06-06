$( () => {

  const input                  = document.createElement( 'input' );
  const hasMultipleFileSupport = 'undefined' !== typeof input.multiple;
  const isIE10OrLess           = /msie/i.test( navigator.userAgent );



  // <input type="file"> plugin
  $.fn.customFile = function () {

    return this.each( function ( i, el ) {

      let $file = $( this ).addClass( 'form__upload--hidden' );

      const $wrap   = $( '<div class="form__upload__wrapper">' );
      const $input  = $( '<input type="text" class="form__upload__input" title="upload a file" placeholder="Upload a File" />' );
      // Button for non-IE browsers.
      const $button = $('<button type="button" class="form__upload__button">Select a File</button>');
      // Hack for IE.
      const $label = $( `<label class="form__upload__button" for="${ $file[ 0 ].id }">Select a File</label>` );

      // Hide element so we can trigger events. Using `display: none;` or
      // `visibility: hidden;` would prevent keyboard navigation.
      $file.css( {
        position: 'absolute',
        left: '-9999px'
      } );

      $wrap
        .insertAfter( $file )
        .append( $file, $input, ( isIE10OrLess ? $label : $button ) );

      // Prevent focus
      $file.attr( 'tabIndex', -1 );
      $input
        .attr( 'tabIndex', -1 )
        .on( 'focus', ( e ) => $input.blur() );

      // Open dialog.
      $button.on( 'click', ( e ) => $file.focus().trigger( 'click' ) );

      $file.on( 'change', function ( e ) {
      // $file.change(function() {

        let files = [];
        let fileArr;
        let filename;

        // If multiple file upload is supported, extract all filenames from the
        // file array.
        if ( hasMultipleFileSupport ) {

            fileArr = $file[ 0 ].files;

            for ( let i = 0, len = fileArr.length; i < len; i++ ) {
              files.push( fileArr[ i ].name );
            }

            filename = files.join( ', ' );

        // If multiple file upload is not supported, take the value and remove
        // the path to show only the filename.
        } else {
          filename = $file.val().split( '\\' ).pop();
        }

        $input
          .val( filename )           // Set value.
          .attr( 'title', filename ) // Show filename in title tooltip.
          .focus();                  // Regain focus

      } ); // $file.on( 'change' )

      $input
        .on( 'blur', ( e ) => $file.trigger( 'blur' ) )
        .on( 'keydown', ( e ) => {

          // Enter.
          if ( 13 === e.which ) {
            if ( !isIE10OrLess ) {
              $file.trigger( 'click' );
            }

          // Backspace OR Delete.
          } else if ( -1 !== [ 8, 46 ].indexOf( e.which ) ) {

            $file
              .replaceWith( $file = $file.clone( true ) )
              .trigger( 'change' )

            $input.val( '' );

          // Tab.
          } else if ( 9 === e.which ) {
            return;

          // All other keys.
          } else {
            return false;
          }

        } );

    } ); // this.each()

  }; // $.fn.customFile

  $( '.form__upload' ).customFile();

  // Add multiple file upload support to browsers that do not support the
  // `multiple` attribute for file inputs.
  // @see https://caniuse.com/#feat=input-file-multiple
  // Todo: ¿Remove?
  if ( !hasMultipleFileSupport ) {

    $( document ).on( 'change', 'input.customfile', function ( e ) {

      const $this   = $( this );
      const uniqId  = `customfile_${ ( new Date() ).getTime() }`;
      const $wrap   = $this.parent();
      const $inputs = $wrap
        .siblings()
        .find( '.form__upload__input' )
        .filter( function ( i, el ) { return !this.value } );
      const $file = $( `<input type="file" id="${ uniqId }" name="${ $this.attr( 'name' ) }"/>` );

      setTimeout( function () {

        if ( $this.val() ) {

          if ( !$inputs.length ) {

            $wrap.after( $file );
            $file.customFile();

          }

        } else {

          $inputs.parent().remove();
          $wrap
            .appendTo( $wrap.parent() )
            .find( 'input' )
            .focus();

        }

      }, 1 ); // setTimeout

    });
  }

  // <select>
  // @status To be retired.
  $( '.form__select' ).each( function ( i, el ) {

    const $container     = $( this );
    const $text          = $container.find( '.form__select__text' );
    const $select        = $container.find( 'select' );
    const selectedOption = $select.find( 'option:selected' ).text();

    $text.text( selectedOption );

    $select
      .on( 'change', function ( e ) {

        const $selected = $select.find( 'option:selected' );

        $selected
          .attr( 'selected','selected' )
          .siblings( $selected )
          .removeAttr( 'selected', 'selected' );

        $text.text( $selected.text() );

      } )
      .on( 'focus', function ( e ) {
        $text.addClass( 'form__select__text--focus' );
      } )
      .on( 'blur', function ( e ) {
        $text.removeClass( 'form__select__text--focus' );
      } );

  } );

} );
