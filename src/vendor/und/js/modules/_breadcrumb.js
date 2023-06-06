const $ = require('jquery');

$(() => {
  const items = $('.breadcrumb__item');
  const firstCrumb = $(items.get(2));
  const pageCrumb = $(items.last());

  if (items.length > 2) {
    const showPreviousCrumb = () => {
      const shownItem = $('.breadcrumb__item.show');
      $('.breadcrumb__item').addClass('show');
      $('.breadcrumb__expand').remove();
    };

    const button = $('<button></button>')
      .addClass('breadcrumb__expand')
      .attr('aria-label', "Expand breadcrumb")
      .click((e) => {
        e.preventDefault();
        showPreviousCrumb();
        return false;
      });

    $('.breadcrumb__item:first').append(button);
  }

});


