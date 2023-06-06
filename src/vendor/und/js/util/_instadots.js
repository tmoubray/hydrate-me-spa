const $ = require('jquery');
const log = require('debug')('instadots');

module.exports = ({
  container, length, dotsToShow, dotClass, activeClass, hideClass, scaledClass
}) => (selectedIdx) => {
  const dotContainer = $(container);

  if (dotContainer.children().length === 0) {
    log('populating dots');
    for (var i = 0; i < length; i++) {
      dotContainer.append(
        $('<div></div>').addClass(dotClass)
      );
    };

    const dots = dotContainer.children();

    dots.slice(dotsToShow + 1).addClass('hidden');
    $(dots.get(dotsToShow)).addClass('scaled');
  }

  log(`selecting dot ${selectedIdx}`);

  const dots = dotContainer.children();
  const dotWidth = $(dots.get(0)).width() + 4;

  const current = {
    frontHidden: [],
    frontScaled: -1,
    visible: [],
    backScaled: -1,
    backHidden: [],
    firstVisible: -1,
    lastVisible: -1,
  };

  dots.each((idx, dotDomElem) => {
    const dot = $(dotDomElem);

    if (dot.hasClass('hidden')) {
      if (current.firstVisible < 0) current.frontHidden.push(idx);
      if (current.lastVisible >= 0) current.backHidden.push(idx);
    }
    else if (dot.hasClass('scaled')) {
      if (current.firstVisible < 0) current.frontScaled = idx;
      if (current.firstVisible >= 0) current.backScaled = idx;
    }
    else {
      if (current.firstVisible < 0) current.firstVisible = idx;

      current.lastVisible = idx;
      current.visible.push(idx);
    }
  });

  log(current);

  const setSelectedDot = () => {
    dots.removeClass(activeClass);
    $(dots.get(selectedIdx)).addClass(activeClass);
  };

  const hideDot = (idx) => {
    $(dots.get(idx)).addClass('hidden').removeClass('scaled');
  };

  const showDot = (idx) => {
    $(dots.get(idx)).removeClass('hidden').removeClass('scaled');
  };

  const scaleDot = (idx) => {
    $(dots.get(idx)).removeClass('hidden').addClass('scaled');
  };

  const scrollLeft = () => {
    let firstVisible = -1;
    for (let i = 0; i < dots.length; i++) {
      if (i < selectedIdx - 1) hideDot(i);
      else if (i === selectedIdx - 1) scaleDot(i);
      else if (i === selectedIdx + dotsToShow) scaleDot(i);
      else if (i > selectedIdx + dotsToShow) hideDot(i);
      else {
        if (firstVisible < 0) firstVisible = i;
        showDot(i);
      }
    }

    const moveTo = -1 * firstVisible * dotWidth;
    log('moving right to ' + moveTo);
    //dotContainer.css({ 'margin-left': `${moveTo}px` });
  };

  const scrollRight = () => {
    let firstVisible = -1;
    for (let i = 0; i < dots.length; i++) {
      if (i > selectedIdx + 1) hideDot(i);
      else if (i === selectedIdx + 1) scaleDot(i);
      else if (i === selectedIdx - dotsToShow) scaleDot(i);
      else if (i < selectedIdx - dotsToShow) hideDot(i);
      else {
        if (firstVisible < 0) firstVisible = i;
        showDot(i);
      }
    }

    const moveTo = -1 * firstVisible * dotWidth;
    log('moving right to ' + moveTo);
    //dotContainer.css({ 'margin-right': `${moveTo}px` });
  };

  if (current.visible.indexOf(selectedIdx) >= 0) {
    log('selected index is visible, no need for anything else');
    setSelectedDot();
    return;
  }

  if (
    selectedIdx === current.frontScaled ||
    current.frontHidden.indexOf(selectedIdx) >= 0
  ) {
    log('scrolling left');
    scrollLeft();
    setSelectedDot();
  }
  else
  if (
    selectedIdx === current.backScaled ||
    current.backHidden.indexOf(selectedIdx) >= 0
  ) {
    log('scrolling right');
    scrollRight();
    setSelectedDot();
  }
}
