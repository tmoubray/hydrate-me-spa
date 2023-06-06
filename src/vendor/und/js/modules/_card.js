const $ = require("jquery");
const Flickity = require("flickity");
require("flickity-imagesloaded");

$(() => {
  const slider = $(".card__slider");

  if (slider.length > 0) {
    const flkty = new Flickity(".card__slider", {
      imagesLoaded: true,
      dragThreshold: 6,
      wrapAround: true,
      adaptiveHeight: true,
      accessibility: false
    });
  }

  //

  const expander = $(".card__expand__container");

  if (expander.length > 0) {
    const flkty = new Flickity(".card__expand__container", {
      imagesLoaded: true,
      prevNextButtons: false,
      dragThreshold: 6,
      wrapAround: true,
      watchCSS: true,
      accessibility: false
    });
  }

  const click = function(e) {
    const cardItem = $(this);
    const cardGroup = $(".card__expand__container", cardItem);

    if ($(this).hasClass("card__expand--active")) {
      $(".card__expand").each(function(idx, item) {
        $(item).removeClass("card__expand--inactive");
      });
      $(this)
      .removeClass("card__expand--active")
      .removeClass("card__expand--inactive");
    } else if ($(".card__expand").hasClass("card__expand--active")) {
      $(".card__expand").each(function(idx, item) {
        $(item)
        .removeClass("card__expand--active")
        .addClass("card__expand--inactive");
      });
      $(this)
      .addClass("card__expand--active")
      .removeClass("card__expand--inactive");
    } else {
      $(".card__expand").each(function(idx, item) {
        $(item).addClass("card__expand--inactive");
      });
      $(this)
      .addClass("card__expand--active")
      .removeClass("card__expand--inactive");
    }
  };



  $(".card__expand").on("click", () => {
    if ($("html").attr("data-whatinput", "touch")) {
      click();
    }
  });

});
