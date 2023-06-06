const $ = require('jquery');
require('jquery-touchswipe');


(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.minimodal = factory();
  }
}(this, function() {

  var minimodal = function(target, options) {

    options = typeof options !== 'undefined' ? options : {};

    var _ = {};

    var option = function(property, value) {
      _.options[property] = typeof options[property] !== 'undefined' ? options[property] : value;
    };

    _.options = {};
    option('rootClass', '');
    option('loadingHTML', 'Loading');
    option('previousButtonHTML', 'Previous');
    option('nextButtonHTML', 'Next');
    option('closeButtonHTML', 'Close');
    option('closeButtonSelector', null);
    option('statusTimeout', 0);
    option('removeTimeout', 0);
    option('closeTimeout', 0);
    option('googleMapsAPIKey', '');
    option('dataAttr', 'data-minimodal');
    option('onLoaded', () => {});
    option('fixed', false);
    option('action', false);

    _.node = function(html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      return div.firstChild;
    };

    _.setup = function() {
      _.current = target;
      _.minimodal = _.node('<div class="minimodal ' + _.options.rootClass + '" tabindex="0">');
      _.overlay = _.node('<div class="minimodal__overlay">');
      _.viewport = _.node('<div class="minimodal__viewport">');
      _.navWrap = _.node('<div class="minimodal__nav__wrapper">');
      if (!_.closeButtonSelector) {
        _.closeButton = _.node('<button class="minimodal__close">' + _.options.closeButtonHTML + '</button>');
      }

      _.indicator = _.node('<div class="minimodal__indicator">');
    };

    _.build = function() {
      _.minimodal.appendChild(_.overlay);
      _.minimodal.appendChild(_.viewport);
      if (!_.options.closeButtonSelector) {
        _.minimodal.appendChild(_.closeButton);
      }
      _.minimodal.appendChild(_.navWrap);
      document.body.appendChild(_.minimodal);
      document.body.classList.add('quick-view--active');
      if (_.options.fixed) {
        document.body.classList.add('stuck');
      }
      _.minimodal.focus();
      _.minimodal.classList.add('minimodal--active');
    };

    _.close = function() {
      var minimodal = _.minimodal;
      minimodal.classList.remove('minimodal--active');
      document.body.classList.remove('quick-view--active');

      if (_.options.fixed) {
        document.body.classList.remove('stuck');
      }
      setTimeout(function() {
        if (minimodal.parentNode) {
          minimodal.parentNode.removeChild(minimodal);
        }
      }, _.options.closeTimeout);
      document.removeEventListener('keydown', _.keydown);
      target.focus();
    };

    _.focusTrap = function(e) {
      if (e.shiftKey) {
        if (_.minimodal === document.activeElement) {
          e.preventDefault();
          _.closeButton.focus();
        }
      } else {
        if (_.closeButton === document.activeElement) {
          e.preventDefault();
          _.minimodal.focus();
        }
      }
    };

    _.keydown = function(e) {
      if (e.keyCode === 9) {
        _.focusTrap(e);
      } else if (e.keyCode === 27) {
        _.close();
      } else if (e.keyCode === 37) {
        if (_.index > -1) {
          _.previous();
        }
      } else if (e.keyCode === 39) {
        if (_.index > -1) {
          _.next();
        }
      }
    };

    _.listen = function() {
      // console.log('minimodal - listen');
      _.overlay.addEventListener('click', _.close);
      if (_.options.closeButtonSelector) {
        _.content.querySelector(_.options.closeButtonSelector).addEventListener('click', _.close);
        // console.log('close click')
      }
      else {
        _.closeButton.addEventListener('click', _.close);
      }
      document.addEventListener('keydown', _.keydown);
    };

    _.reflow = function() {
      var x = _.minimodal.clientWidth;
    };

    _.loading = function() {
      _.status = _.node('<div class="minimodal__status">' + _.options.loadingHTML + '</div>');
      _.item.appendChild(_.status);
      _.reflow();
      _.item.classList.add('minimodal__item--loading');
    };

    _.loaded = function() {
      var status = _.status;
      setTimeout(function() {
        if (status.parentNode) {
          status.parentNode.removeChild(status);
        }
      }, _.options.statusTimeout);
      _.item.appendChild(_.content);
      if (_.current.getAttribute('title')) {
        _.caption = _.node('<div class="minimodal__caption">' + _.current.getAttribute('title'));
        _.item.appendChild(_.caption);
      }
      _.item.classList.remove('minimodal__item--loading');
      _.reflow();
      _.item.classList.add('minimodal__item--loaded');
      _.options.onLoaded(_);
    };

    _.error = function() {
      _.status.innerHTML = 'Error loading resource';
    };

    _.ajax = function() {
      var url = _.url;
      var request = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        request.open('GET', url, true);
        request.onload = function() {
          if (url === _.url) {
            if (request.status >= 200 && request.status < 400) {
              var response = request.responseText;
              _.content = _.node('<div class="minimodal__content"><div class="minimodal__element">' + response);
              _.loaded();
            } else {
              _.error();
            }
            resolve();
          }
        };
        request.onerror = function() {
          if (url === _.url) {
            _.error();
          }
        };
        request.send();
      });

    };

    _.selector = function() {
      var selector = _.current.getAttribute('data-minimodal-selector');
      var html = document.querySelector(selector).innerHTML;
      _.content = _.node('<div class="minimodal__content"><div class="minimodal__element">' + html);
      _.loaded();
    };

    _.iframe = function() {
      _.content = _.node('<div class="minimodal__content"><div class="minimodal__element minimodal__element--iframe"><iframe class="minimodal__iframe" src="' + _.url + '" frameborder="0">');
      _.loaded();
    };

    _.googleMaps = function() {
      var src = 'https://www.google.com/maps/embed/v1/';
      var apiKey = _.options.googleMapsAPIKey;
      if (_.url.indexOf('/maps/place/') > -1) {
        var place = _.url.match('(?:/maps/place/)([^/]+)')[1];
        src += 'place?key=' + apiKey + '&q=' + place;
      } else {
        var coords = _.url.match('(?:/maps/@)([^z]+)')[1];
        coords = coords.split(',');
        var lat = coords[0];
        var long = coords[1];
        var zoom = coords[2];
        src += 'view?key=' + apiKey + '&center=' + lat + ',' + long + '&zoom=' + zoom + 'z';
      }
      _.content = _.node('<div class="minimodal__content"><iframe class="minimodal__element minimodal__element--map" src="' + src + '" frameborder="0">');
      _.loaded();
    };

    _.youtube = function() {
      var id = _.url.split('v=')[1];
      _.content = _.node('<div class="minimodal__content"><div class="minimodal__element minimodal__element--video"><iframe class="minimodal__video" src="https://www.youtube.com/embed/' + id + '?rel=0&autoplay=1" frameborder="0" allowfullscreen>');
      _.loaded();
    };

    _.vimeo = function() {
      var id = _.url.split('vimeo.com/')[1];
      _.content = _.node('<div class="minimodal__content"><div class="minimodal__element minimodal__element--video"><iframe class="minimodal__video" src="https://player.vimeo.com/video/' + id + '?autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>');
      _.loaded();
    };

    _.image = function() {
      var url = _.url;
      var img = document.createElement('img');
      img.onload = function() {
        if (url === _.url) {
          _.content = _.node('<div class="minimodal__content"><img class="minimodal__element" src="' + _.url + '">');
          _.loaded();
        }
      };
      img.onerror = function() {
        if (url === _.url) {
          _.error();
        }
      };
      img.src = url;
    };

    _.type = function() {
      if (_.current.getAttribute('data-minimodal-type')) {
        return _.current.getAttribute('data-minimodal-type');
      } else if (_.current.getAttribute('data-minimodal-selector')) {
        return 'selector';
      } else if (_.url.indexOf('google.com/maps') > -1) {
        return 'googleMaps';
      } else if (_.url.indexOf('youtube.com') > -1) {
        return 'youtube';
      } else if (_.url.indexOf('vimeo.com') > -1) {
        return 'vimeo';
      } else {
        return 'image';
      }
    };

    _.load = function(change) {
      _.url = _.current.getAttribute('href');
      _.item = _.node('<div class="minimodal__item">');
      _.viewport.appendChild(_.item);
      if (change) {
        _.item.classList.add('minimodal__item--added');
        _.item.classList.add('minimodal__item--added--' + change);
        _.reflow();
        _.item.classList.remove('minimodal__item--added');
        _.item.classList.remove('minimodal__item--added--' + change);
      }
      _.loading();
      return Promise.resolve(_[_.type()]());
    };

    _.remove = function(change) {
      var item = _.item;
      item.classList.add('minimodal__item--removed');
      item.classList.add('minimodal__item--removed--' + change);
      setTimeout(function() {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      }, _.options.removeTimeout);
    };

    _.update = function(change) {
      _.remove(change);
      _.current = _.groupItems[_.index];
      _.load(change);
    };

    _.previous = function() {
      if (_.index - 1 < 0) {
        _.index = _.indexMax;
      } else {
        _.index -= 1;
      }
      _.update('previous');
    };

    _.next = function() {
      if (_.index + 1 > _.indexMax) {
        _.index = 0;
      } else {
        _.index += 1;
      }
      _.update('next');
    };

    _.nav = function() {
      _.previousButton = _.node('<button class="minimodal__nav minimodal__nav--previous">' + _.options.previousButtonHTML + '</button>');

      _.nextButton = _.node('<button class="minimodal__nav minimodal__nav--next">' + _.options.nextButtonHTML + '</button>');


      _.navWrap.appendChild(_.previousButton);
      _.navWrap.appendChild(_.nextButton);

      if (_.options.action) {
        _.previousButtonContainer = _.node('<div class="action__prev__container">' +
        '<img class="action__img" src="//via.placeholder.com/770x513" alt="placeholder">' +
        '<div class="action__caption">Prev person</div>' +
        '</div>');
        _.nextButtonContainer = _.node('<div class="action__next__container">' +
        '<img class="action__img" src="//via.placeholder.com/770x513" alt="placeholder">' +
        '<div class="action__caption">Next person</div>' +
        '</div>');


        _.navWrap.appendChild(_.nextButtonContainer);
        _.navWrap.appendChild(_.previousButtonContainer);
      }
      _.previousButton.addEventListener('click', _.previous);
      _.nextButton.addEventListener('click', _.next);

    };

    _.touch = function() {
      $(_.viewport).swipe({
        swipe: (event, direction, distance, duration) => {
          // console.log(`swipe ${direction}`);

          if (direction === 'right') _.previous(event);
          if (direction === 'left') _.next(event);
        },
        allowPageScroll:"auto"
      });
    };

    _.group = function() {
      _.groupID = _.current.getAttribute(_.options.dataAttr);
      if (_.groupID) {
        _.groupItems = document.querySelectorAll('[' + _.options.dataAttr + '="' + _.groupID + '"]');
        _.minimodal.appendChild(_.indicator);
        _.touch();
        if (_.groupItems.length > 1) {
          _.index = Array.prototype.indexOf.call(_.groupItems, _.current);
          _.indexMax = _.groupItems.length - 1;
          _.nav();

        }
      }
    };

    _.open = function(e) {
      if (e) e.preventDefault();
      Promise.resolve()
      .then(() => _.setup())
      .then(() => _.build())
      .then(() => _.load())
      .then(() => _.listen())
      .then(() => _.group());
    };

    _.init = function() {
      target.addEventListener('click', _.open);
    };

    return _;

  };

  return minimodal;

}));
