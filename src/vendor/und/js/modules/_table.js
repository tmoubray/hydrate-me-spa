/**
 * DataTables
 * -----------------------------------------------------------------------------
 * @see https://datatables.net/
 * @version 1.10.16
 *
 * Custom config DataTables are added in a files PCF source, inside the
 * `<footcode>` node. DataTables cannot be configured on a table more than once,
 * an alert/error will be thrown if this happens.
 *
 * Wrapping our function in `$()` makes it a callback that will get fired on the
 * `DOMContentLoaded` event. If we did not do this, custom config DataTables
 * would run into a table that is already an instance of DataTables. Then we'd
 * have to implement code to check for and destroy that instance of DataTables.
 * That code would need to be applied for each custom config DataTable. To
 * simplify the process, and keep things DRY, the preferred method is to perform
 * those checks here.
 */

// Imports.
const $ = require('jquery');

require( 'datatables.net' )( window, $ );
require( 'datatables.net-responsive' )( window, $ );



// Variables.
const defaults = {
  language: {
    search: 'Search Table'
  },
  responsive: true
};



/**
 * Implementation
 * -----------------------------------------------------------------------------
 */
// Wrapping our function in `$()` is deliberate, we want to delay the default
// implementation of DataTables so we can see if a custom instance exists.
$( () => {

  $( 'table.dataTable' ).each( ( i, table ) => {

    if ( !$.fn.dataTable.isDataTable( table ) ) {
      $( table ).DataTable( defaults );
    }

  } );

} );
