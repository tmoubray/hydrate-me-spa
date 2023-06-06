const $ = require('jquery');

$(() => {
  $('.event__title').on('mouseenter', function() {
    $(this).parent().parent().parent().addClass('event--hover');
  });

  $('.event__title').on('mouseleave', function() {
    $(this).parent().parent().parent().removeClass('event--hover');
  });
});
