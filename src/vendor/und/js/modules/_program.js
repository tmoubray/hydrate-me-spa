const $ = require('jquery');

$(() => {

  $('.program__finder__expand').on('click', function(){
    $(this).parent()
    .toggleClass('program__finder__expand--active')
    .toggleClass('button-expand--active');
  });

});
