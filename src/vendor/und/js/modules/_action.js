const $ = require('jquery');
const minimodal = require('../util/_minimodal');
const instadots = require('../util/_instadots');
const embed = require('../modules/_embed');
const log = require('debug')('action');

$( () => {

  const slides = document.querySelectorAll( '.action__grid__item' );

  Array.prototype.forEach.call( slides, ( slide, index ) => {
    slide.classList.add( `item--${index}` );
  } );

  const setupHero = () => {

    const hero = $('.action__hero img');
    const content = $('.action__hero__content');
    const body = $('.action__body');

    body.find('p:last').addClass('last');

    let previousScroll;
    let previousWidth;
    const element = $('.minimodal__element');
    const actPull = $('.action__pull');
    const actBody = $('.action__body');
    const initalActBodyOffset = actBody.offset().top;
    const pullHeight = initalActBodyOffset - actPull.offset().top;
    const pullMargin = -96;
    const watch = () => {
      const scroll = element.scrollTop();
      const winWidth = $(window).width();

      if (scroll !== previousScroll || winWidth !== previousWidth) {
        const imageHeight = hero.height();
        const range = imageHeight;
        const calc = 1 - ((scroll - 96) - imageHeight + range) / range;
        const calcScale = 1 + ((scroll - 96) - imageHeight + range) / range;



        if (winWidth >= 1024) {
          if (scroll <= pullHeight) {
            actPull.css({ 'margin-top': `${pullMargin + scroll}px` });
          }
          else {
            actPull.css({ 'margin-top': '0px' });
          }


          body.css({
            'margin-top': imageHeight + 'px',
          });

          $('.action__hero__content').css({
            'opacity': calc
          });

          hero.css({
            'opacity': calc,
            'transform': 'scale(' + calcScale + ')'
          });

          if (calc > '1') {
            hero.css({
              'opacity': 1,
              'transform': 'scale(1)'
            });

            $('.action__hero__content').css({
              'opacity': 1
            });
          }
          else if (calc < '0') {
            hero.css({
              'opacity': 0,
              'transform': 'scale(1)'
            });

            $('.action__hero__content').css({
              'opacity': 0
            });
          }
        }
        else {
          body.css({
            'margin-top': 'auto',
          });
          hero.css({
            'opacity': 1,
            'transform': 'scale(1)'
          });
          $('.action__hero__content').css({
            'opacity': 1
          });
        }
        previousScroll = scroll;
        previousWidth = winWidth;
      }

      let modalContent = document.querySelector('.minimodal__element');

      if (modalContent) {
        if (modalContent.scrollTop <= 0) {
          modalContent.scrollTop = 1;
        }
        else if (modalContent.scrollTop >= modalContent.scrollHeight - modalContent.clientHeight) {
          modalContent.scrollTop = modalContent.scrollHeight - modalContent.clientHeight - 1;
        }
      }


      requestAnimationFrame(watch);
    }
    watch();
  }

  const selectDot = instadots({
    container: '.minimodal__indicator',
    length: slides.length,
    dotsToShow: 12,
    dotClass: 'dot',
    activeClass: 'active',
    hideClass: '',
    scaledClass: '',
  })

  const hoverArrow = (target, idx, slides) => {

    const prevIdx = idx > 0 ? idx - 1 : slides.length - 1;
    const prevTarget = $(slides[prevIdx]);
    const prevTitle = prevTarget.find('figcaption').find('.h4').text();
    const prevImage = prevTarget.find('img').attr('src');

    const nextIdx = idx < slides.length - 1 ? idx + 1 : 0;
    const nextTarget = $(slides[nextIdx]);
    const nextTitle = nextTarget.find('figcaption').find('.h4').text();
    const nextImage = nextTarget.find('img').attr('src');

    // log(`current index: ${idx}`);

    // log(`previous index ${prevIdx}`);
    // log(`previous title ${prevTitle}`);
    // log(`previous image ${prevImage}`);

    // log(`next index ${nextIdx}`);
    // log(`next title ${nextTitle}`);
    // log(`next image ${nextImage}`);

    const prevNav = $('.minimodal__nav--previous');
    prevNav.on('mouseenter focus', function() {
      $('.action__prev__container').addClass('active')
    });
    prevNav.on('mouseleave blur', function() {
      $('.action__prev__container').removeClass('active');
    });
    const prevCntr = $('.action__prev__container');
    log(prevCntr.find('.action__img').attr('src', prevImage));
    log(prevCntr.find('.action__caption').text(prevTitle));

    const nextNav = $('.minimodal__nav--next');
    nextNav.on('mouseenter focus', function() {
      $('.action__next__container').addClass('active')
    });
    nextNav.on('mouseleave blur', function() {
      $('.action__next__container').removeClass('active');
    });
    const nextCntr = $('.action__next__container');
    nextCntr.find('.action__img').attr('src', nextImage);
    nextCntr.find('.action__caption').text(nextTitle);

  }

  const attachFocus = () => {
    const link = $("<a href='#' aria-hidden='true' tabindex='-1' class='action-focus' />")
    link.appendTo($(".minimodal__element"));
    link.focus();
  }

  const modals = [];

  for ( let i = 0; i < slides.length; i += 1 ) {

    const modal = minimodal( slides[ i ], {
      statusTimeout:   300,
      removeTimeout:   300,
      closeTimeout:    300,
      rootClass:       'action-modal',
      closeButtonHTML: '<span class="button--link">More leaders in action</span><span class="action__grid__icon"></span>',
      dataAttr:        'data-action',
      fixed:           true,
      action:          true,
      onLoaded: ( modal ) => {

        setTimeout( () => {

          setupHero();
          selectDot( modal.index );
          hoverArrow( modal.target, modal.index, slides );
          embed();
          attachFocus();

        }, 301 );

      }
    } );

    modal.init();
    modals.push( modal );

  }

  // Deep linking to open a modal
  // Linking is based on the number of items on the action page
  // Numbering starts at 0
  // <a href="/action.html/target=0"
  setTimeout(() => {
    const selectedRegex = /target=(\d+)/;
    const targetMatch = selectedRegex.exec(window.location.search);

    if (targetMatch) {
      const index = targetMatch[1];
      log(`auto opening modal ${index}`);
      modals[index].open();
    }
  }, 10);
});
