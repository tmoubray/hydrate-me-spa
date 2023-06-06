const $ = require("jquery");
const debounce = require("../util/_debounce");
const Flickity = require("flickity");

$(() => {
  const statsSlider = $(".stats--slider");

  if (statsSlider.length > 0) {
    const flkty = new Flickity(".stats--slider", {
      dragThreshhold: 6,
      wrapAround: true,
      contain: true,
      cellAlign: "left",
      pageDots: false,
      groupCells: true,
      accessibility: false
    });

    $(window).on("load resize", debounce(() => {
        const winWidth = $(window).width();
        if (flkty.cells.length < 4) {
          if (winWidth >= 1024) {
            flkty.unbindDrag();
          }
          else {
            flkty.bindDrag();
          }
        }
      }, 250)).resize();
  }
});
