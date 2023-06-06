const $ = require("jquery");
const Flickity = require("flickity");
require("flickity-imagesloaded");

$(() => {
  const slider = $(".home-card__slider");

  if (slider.length > 0) {
    const flkty = new Flickity(".home-card__slider", {
      imagesLoaded: true,
      dragThreshold: 6,
      wrapAround: true,
      adaptiveHeight: true,
      accessibility: false
    });
  }

  //

  const expander = $(".home-card__expand__container");

  if (expander.length > 0) {
    const flkty = new Flickity(".home-card__expand__container", {
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
    const cardGroup = $(".home-card__expand__container", cardItem);

    if ($(this).hasClass("home-card__expand--active")) {
      $(".home-card__expand").each(function(idx, item) {
        $(item).removeClass("home-card__expand--inactive");
      });
      $(this)
      .removeClass("home-card__expand--active")
      .removeClass("home-card__expand--inactive");
    } else if ($(".home-card__expand").hasClass("home-card__expand--active")) {
      $(".home-card__expand").each(function(idx, item) {
        $(item)
        .removeClass("home-card__expand--active")
        .addClass("home-card__expand--inactive");
      });
      $(this)
      .addClass("home-card__expand--active")
      .removeClass("home-card__expand--inactive");
    } else {
      $(".home-card__expand").each(function(idx, item) {
        $(item).addClass("home-card__expand--inactive");
      });
      $(this)
      .addClass("home-card__expand--active")
      .removeClass("home-card__expand--inactive");
    }
  };



  $(".home-card__expand").on("click", () => {
    if ($("html").attr("data-whatinput", "touch")) {
      click();
    }
  });

});
