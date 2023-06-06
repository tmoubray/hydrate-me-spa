const $ = require('jquery');

$(() => {

  function getFilterSearchVal() {
    const searchVal = $('#program-filter').val();

    window.location = 'programs/index.html?search=' + searchVal
  }

  $('#program-filter').on('keydown', function(e) {
    if (e.keyCode === 13) {
      getFilterSearchVal();
    }
  });

  $('.filter__search__button').on('click', function() {
    getFilterSearchVal();
  });
});
