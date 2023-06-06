/**
 * Program Finder - Search and Results Display
 * -----------------------------------------------------------------------------
 */

// Imports.
const $               = require( 'jquery' );
const log             = require( 'debug')('und:finder' );
const groupBy         = require( 'lodash.groupby' );
const mapValues       = require( 'lodash.mapvalues' );
const mapKeys         = require( 'lodash.mapkeys' );
const _values         = require( 'lodash.values' );
const fromPairs       = require( 'lodash.frompairs' );
const createFocusTrap = require( 'focus-trap' );
const mixItUp         = require( '../util/_mix' );
const Flickity        = require( 'flickity' );

require('lazysizes');



// Variables.
let focusTrapView;
let mixer;
let flkty;

function deactivateQuickView(deactivateTrap = true) {
  $('body').removeClass('quick-view--active');
  if (deactivateTrap) focusTrapView.deactivate();
  $('.quick-view__overlay').remove();
}

function activateQuickView() {
  $('body').addClass('quick-view--active');
  $('.canvas').after('<div class="quick-view__overlay" />');

  focusTrapView = createFocusTrap(
    '.quick-view',
    {
      initialFocus: () => {
        return $('.quick-view__nav').children().get(0);
      },
      clickOutsideDeactivates: true,
      onDeactivate: function() {
        deactivateQuickView(false);
      }
    }
  );
  focusTrapView.activate();
}

function buildItemCard(program, idx) {
  // log('building data for program');
  // log(program);


  const titleButton = $('<button />');
  titleButton.addClass('finder__card__title');
  titleButton.text(program.name);
  titleButton.click(() => {
    $('.quick-view__content')
    .empty()
    .load(program.program);
    activateQuickView();
  });

  const programTypeList = $('<div />');
  programTypeList.addClass('finder__card__type--list');
  programTypeList.text(program.type);

  const cardTop = $('<div />');
  cardTop.addClass('finder__card__top');
  cardTop.append(titleButton);
  cardTop.append(programTypeList);

  const programTypeGrid = $('<span />');
  programTypeGrid.addClass('finder__card__type--grid');
  programTypeGrid.text(program.type);

  const inputId = `add-to-compare-${idx}`;

  const input = $('<input type="checkbox" />');
  input.attr('id', inputId);
  input.attr('value', program.name);
  input.addClass('checkbox__option');
  input.change(() => {
    if (input.prop('checked')) addCompareProgram(program);
    else clearCompareProgram(program);
  });

  const inputLabel = $('<label />');
  inputLabel.attr('for', inputId);
  inputLabel.addClass('checkbox__label');
  inputLabel.append(input);
  inputLabel.append('<span />');
  inputLabel.append('<span>Compare</span>');

  const cardCompare = $('<div />');
  cardCompare.addClass('finder__card__checkbox');
  cardCompare.append(inputLabel);

  const cardBottom = $('<div />');
  cardBottom.addClass('finder__card__bottom');
  cardBottom.append(programTypeGrid);
  cardBottom.append(cardCompare);

  const content = $('<div />');
  content.addClass('finder__card__content');
  content.append(cardTop);
  content.append(cardBottom);

  const programUrl = `${program.program}?index=${idx}`;
  program.program = programUrl;

  const listItem = $('<li />');
  listItem.addClass('finder__card__item');
  listItem.attr('data-bg-img', program.image);
  listItem.attr('data-search-attr', program.search.join(','));
  listItem.attr('data-filter', program.filter.join(','));
  listItem.attr('data-location', program.location.join(','));
  listItem.attr('data-program', programUrl);
  listItem.attr('data-title', program.name);
  listItem.append(content);

  // log(listItem.html());

  return listItem;
}

function setCompareCount() {
  const count = $('.compare__inner .flickity-slider').children().length;

  $('.compare__text__selected').text(count);

  // log(`there are now ${count} compare items selected`);

  if (count >= 2) {
    $('.compare').addClass('compare--show');
  }
  else if (count === 1) {
    $('.compare').removeClass('compare--show').removeClass('compare--open');
    $('body').removeClass('compare-active');
    $('.quick-view__overlay').remove();
  }
  else {
    $('.compare').removeClass('compare--show');
  }
}

function setQuickViewCloseHandler() {
  $('.quick-view__nav__button').click(() => {
    deactivateQuickView();
  });
}

function addCompareProgram(program) {
  // log('adding program to compare window');
  // log(program);

  const programUrl = program.program;

  const programClose = $('<button>Remove</button>');
  programClose.attr('class', 'remove-compare');
  programClose.on('click', function() {
    clearCompareProgram(program);
    setCompareCount();
  });

  const programDiv = $('<div />');
  programDiv.attr('data-program', programUrl);
  programDiv.load(programUrl);

  const containerDiv = $('<div />');
  containerDiv.attr('data-program', programUrl);
  containerDiv.append(programClose);
  containerDiv.append(programDiv);

  flkty.append(containerDiv);
  flkty.reposition();
  setTimeout(() => {
    flkty.resize();
  }, 250);


  setCompareCount();
}

function clearCompareProgram(program) {
  // log('removing program from compare window');
  // log(program);

  $('.compare__inner .flickity-slider').children().each((idx, programDivNode) => {
    const programDiv = $(programDivNode);
    const programUrl = programDiv.attr('data-program');

    if (programUrl === program.program) {
      programDiv.remove();
    }
  });

  $('.finder__card__item').each((idx, programCardNode) => {
    const programCard = $(programCardNode);
    const programUrl = programCard.attr('data-program');

    if (programUrl === program.program) {
      programCard.find('.checkbox__option').prop('checked', false);
    }
  });

  flkty.reposition();
  setTimeout(() => {
    flkty.resize();
  }, 250);


  setCompareCount();
}

function clearAllComparePrograms() {
  $('.compare__inner .flickity-slider').children().each((idx, programDivNode) => {
    const programDiv = $(programDivNode);
    const programUrl = programDiv.attr('data-program');
    programDiv.remove();
  });

  $('.finder__card__item').each((idx, programCardNode) => {
    const programCard = $(programCardNode);
    const programUrl = programCard.attr('data-program');
    programCard.find('.checkbox__option').prop('checked', false);
  });

  $('.compare').removeClass('compare--show').removeClass('compare--open');
  $('body').removeClass('compare-active');
  $('.quick-view__overlay').remove();
}

function setClearAllCompareHandler() {
  $('.clear-compare').on('click', () => {
    clearAllComparePrograms();
  });
}

function buildProgramList(data) {
  // log('fetched and parsed program JSON');
  // log(data);

  const sorted = data.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  sorted.forEach((program, idx) => {
    const listItem = buildItemCard(program, idx);
    listItem.appendTo('.finder__card__list');

  });
}

function setGridViewMode() {
  // log('setting view mode to grid');

  const filter = $('.filter');

  filter.addClass('grid-view');
  filter.find('.finder__card__item').each((idx, item) => {
    const imageUrl = $(item).attr('data-bg-img');
    const imageAlt = $(item).attr('data-title');
    const imageTag = $('<img />')
    .attr('src', 'data:image/gif;base64,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')
    .addClass('lazyload')
    .attr('data-src', imageUrl)
    .attr('alt', imageAlt);
    const imageDiv = $('<a href="#" />')
    .addClass('finder__card__image')
    .append(imageTag)

    .on('click', (e) => {
      e.preventDefault();
      $(item).find('.finder__card__title').click();
    });

    $(item).prepend(imageDiv);
  });

  mixer = mixItUp('.finder__card__list', {
    load: {
      filter: 'none',
    },
    controls: {
      enable: false,
    },
    debug: {
      showWarnings: true
    },
    animation: {
      duration: 300,
      animateResizeTargets: false,
      animateResizeContainer: false,
      effects: "fade scale(0.5)"
    },
    selectors: {
      target: 'li',
    },
  });

  performFilter();
}

function setListViewMode() {
  // log('setting view mode to list');

  const updateClasses = () => {
    const filter = $('.filter');

    filter.removeClass('grid-view');
    filter.find('.finder__card__image').remove();
  };
  updateClasses();


  mixer = mixItUp('.finder__card__list', {
    load: {
      filter: 'none',
    },
    controls: {
      enable: false,
    },
    animation: {
      duration: 200,
      reverseOut: true,
      animateResizeContainer: false,
      effects: 'fade translateX(-50%)'
    },
    selectors: {
      target: 'li',
    },
  });


  performFilter();

}

function setGridToggleButton() {
  // toggle grid/list view
  $('.finder__view__button').on('click', () => {
    const filter = $('.filter');
    mixer.destroy();

    if (filter.hasClass('grid-view')) {

      setListViewMode();
    }
    else {

      setGridViewMode();
    }

  });
}

function setFilterDropdownToggle() {
  $('.finder__nav__label').on('click', function(e) {
    e.preventDefault();

    $(this).parent().toggleClass('finder__nav--active');
  });
}

function getActiveFilter(group, value) {
  return $('.active__filters')
  .children()
  .filter((idx, filterNode) => {
    const filter = $(filterNode);
    const groupMatch = filter.attr('data-filter-group') === group;
    const valueMatch = filter.attr('data-filter') === value;

    return groupMatch && valueMatch;
  });
}

function getFilterLink(group, value) {
  return $('.finder__dropdown__link')
  .filter((idx, linkNode) => {
    const link = $(linkNode);
    const groupMatch = link.attr('data-filter-group') === group;
    const valueMatch = link.attr('data-filter') === value;
    return groupMatch && valueMatch;
  });
}

function isFilterActive(group, value) {
  const active = getActiveFilter(group, value).length > 0;

  // log(`filter ${group}:${value} is ${active ? '' : 'not'} active`);

  return active;
}

function addFilter(group, value) {
  if (!isFilterActive(group, value)) {
    const filterLink = getFilterLink(group, value);
    filterLink.addClass('active');

    const label = filterLink.text();

    const activeFilterButton = $('<button />');
    activeFilterButton.addClass('finder__bar__button');
    activeFilterButton.attr('data-filter-group', group);
    activeFilterButton.attr('data-filter', value);
    activeFilterButton.text(label);
    activeFilterButton.click(() => clearFilter(group, value));

    $('.active__filters').append(activeFilterButton);

    performFilter();
  }
}

function clearFilter(group, value) {
  const filterLink = getFilterLink(group, value);
  filterLink.removeClass('active');

  const activeFilter = getActiveFilter(group, value);
  activeFilter.remove();

  performFilter();
}

function clearAllFilters() {
  // log('clearing all filters');

  $('#program-finder').val('');
  $('.location__filters').find('input').prop('checked', true);
  $('.active__filters').children().remove();
  $('.finder__dropdown__link').removeClass('active');

  performFilter();
}

function setClearAllFiltersHandler() {
  $('.clear-filter').click((e) => {
    e.preventDefault();

    clearAllFilters();

    return false;
  });
}

function setInitialViewType() {
  if ($(window).width() > 768) {
    setGridViewMode();
  }
  else {
    setListViewMode();
  }
}

function setFilterAddHandlers() {
  $('.finder__dropdown__link').on('click', function(e) {
    e.preventDefault();

    const group = $(this).attr('data-filter-group');
    const value = $(this).attr('data-filter');

    if (isFilterActive(group, value)) {
      clearFilter(group, value);
    }
    else {
      addFilter(group, value);
    }
  });
}

function setFilterClearHandlers() {
  $('.finder__bar__button').on('click', function() {
    $(this).remove();
  })
}

let activeFilterNav;

function setFilterNavHeight() {
  const winWidth = $(window).width();

  if (winWidth >= 768) {
    if (activeFilterNav) {
      $('.filter-push').css({
        'margin-top': activeFilterNav.outerHeight() + 'px'
      });
    }
    else {
      $('.filter-push').css({
        'margin-top': 0
      })
    }
  }

  else {
    $('.filter-push').css({
      'margin-top': 0
    })
  }
}

function setFilterDropdownHandlers() {

  $('[class^="finder__nav__button"]').on('click', function(e) {
    e.preventDefault();

    const links = $(this).closest('.finder__nav__list');
    const navItems = $('.finder__nav__item', links);

    const filterNavHeight = $(this).next().outerHeight();

    if ($(this).parent().hasClass('finder__dropdown--active')) {
      $(this).parent().removeClass("finder__dropdown--active");
      activeFilterNav = undefined;
      setFilterNavHeight();
    }

    else if (navItems.hasClass('finder__dropdown--active')) {
      navItems.removeClass('finder__dropdown--active');
      $(this).parent().addClass('finder__dropdown--active');
      activeFilterNav = $(this).next();
      setFilterNavHeight();
    }

    else {
      $(this).parent().addClass('finder__dropdown--active');
      activeFilterNav = $(this).next();
      setFilterNavHeight();
    }
  });

  $(window).on('resize', setFilterNavHeight);

}

function setSearchChangeHandler() {
  $('#program-finder').on('keydown', (e) => {
    if (e.keyCode === 13) {
      performFilter();
      $('.filter').addClass('filter--active');
      scrollToFilter();
    }
  });

  $('.finder__search .search__button--icon').on('click', () => {
    performFilter();
    $('.filter').addClass('filter--active');
    scrollToFilter();
  });

}

function setLocationCheckboxHandlers() {
  $('.location__filters').find('input').on('change', () => {
    performFilter();
  });
}

function getFilters() {

  return {
    search:    $( '#program-finder' ).val().trim(),
    locations: $( '.location__filters' )
      .find('input')
      .filter( ( idx, input ) => $( input ).prop( 'checked' ) )
      .map( ( idx, input ) => $( input ).attr( 'id' ) )
      .get(),
    filters: $( '.active__filters' )
      .children()
      .map( ( idx, child ) => {

        const $child = $( child );

        return {
          group: $child.attr( 'data-filter-group' ),
          value: $child.attr( 'data-filter' ),
          label: $child.text()
        };

      } )
      .get(),
  };

}

function getFilterStringFromUrl() {

  const hash   = window.location.hash.replace(/^#/, '');
  const search = window.location.search
                  .replace(/^\?/, '' )
                  // When `saveFilter()` is called, spaces are converted to `+`
                  // in the URI. On page refresh, the plus needs to be converted
                  // back to a space, which `decodeURIComponent()` does not do.
                  .replace( /\+/g, '%20' );

  return hash || search;

}

function getFilterFromUrl() {
  const queryString = getFilterStringFromUrl();

  if (queryString.length === 0) return {};

  const queryParams = queryString.split(/&/);

  const queryObject = fromPairs(queryParams.map(param => {
    const paramMatch = /^([a-zA-Z-.]+)=(.*)/.exec(param);
    const key = paramMatch[1];
    const decodedVal = decodeURIComponent(paramMatch[2]);

    if (key === 'search') return [key, decodedVal];

    const valList = decodedVal.split(',');
    return [key, valList];
  }));

  // log(queryObject);

  return queryObject;
}


function scrollToFilter() {
  // log('scroll to');

  $('html, body').animate({
    scrollTop: $('.finder__nav').offset().top - 80
  }, 800);
}

function loadFilter() {
  const filtersObject = getFilterFromUrl();

  const search = filtersObject.search;
  if (search) {
    $('#program-finder').val(search);

    setTimeout(function() {
      $('.filter').addClass('filter--active');
    },100)

    scrollToFilter();
  }

  const locations = filtersObject.locations;
  if (locations && locations.length > 0) {
    locations.forEach(loc => {
      if (loc && loc.length > 0) {
        $('.location__filters').find(`#${loc}`).prop('checked', true);
      }
    });

    scrollToFilter();
  }
  else {
    $('.location__filters').find('input').prop('checked', true);
  }

  let filtersDefined = false;
  Object.keys(filtersObject).forEach(filterKey => {
    const filterMatch = /^filter\.(.*)/.exec(filterKey);

    if (!filterMatch) return;

    const group = filterMatch[1];
    const values = filtersObject[filterKey];

    values.forEach(val => {
      filtersDefined = true;
      addFilter(group, val)
    });
  });
  if (filtersDefined) {
    scrollToFilter();
  }
}

function saveFilter() {
  const filters = getFilters();

  const stepOne = groupBy(filters.filters, 'group');
  const stepTwo = mapKeys(stepOne, (val, key) => `filter.${key}`);
  const chainFilters = mapValues(stepTwo, vals => vals.map(v => v.value).join(','));

  const filtersObject = Object.assign(
    {},
    {
      search: filters.search,
      locations: filters.locations.join(','),
    },
    chainFilters

  );
  const filterQuery = decodeURIComponent($.param(filtersObject));

  // log(filtersObject);
  // log(filterQuery);

  history.replaceState(undefined, undefined, 'index.html?' + filterQuery);
}

function doesItemMatchSearch(search, item) {
  const itemSearchStr =
  item.attr('data-title').toLowerCase() +
  item.attr('data-search-attr').toLowerCase();

  return itemSearchStr.indexOf(search.toLowerCase()) >= 0;
}

function doesItemMatchLocation(locations, item) {
  return locations
  .filter(loc => item.attr('data-location').indexOf(loc) >= 0)
  .length > 0;
}

function doesItemMatchFilters(filters, item) {
  const stepOne = groupBy(filters, 'group');
  const stepTwo = mapValues(stepOne, (valueObjs) => valueObjs.map(v => v.value));
  const groups = _values(stepTwo);

  const itemFilterStr = item.attr('data-filter');

  const matchingGroups = groups.filter(group => {
    const filterMatches = group.filter(filterVal => {
      return itemFilterStr.indexOf(filterVal) >= 0;
    });

    return filterMatches.length > 0;
  });

  return groups.length === matchingGroups.length;
}

let moreCardsToShow = false;

function performFilter() {
  const filters = getFilters();

  // log('filtering items according to');
  // log(filters);

  const allCards = $('.finder__card__item');

  const activeCards = allCards.filter((idx, itemNode) => {
    const item = $(itemNode);

    const matchesSearch = doesItemMatchSearch(filters.search, item);
    const matchesLocation = doesItemMatchLocation(filters.locations, item);
    const matchesFilters  = doesItemMatchFilters(filters.filters, item);

    const matchesAll = matchesSearch && matchesLocation && matchesFilters;

    return matchesAll;
  });

  // log(`filtered to ${activeCards.length} items`);
  // log(activeCards);

  const inPage = activeCards.slice(0, 20);
  const notInPage = activeCards.slice(20);

  if (notInPage.length > 0) moreCardsToShow = true;


  allCards.removeClass('filter--on');
  allCards.removeClass('page--hidden');
  allCards.removeClass('page--visible');

  activeCards.addClass('filter--on');

  inPage.addClass('page--visible');
  notInPage.addClass('page--hidden');

  if (mixer) {
    mixer.filter(inPage.get());
  }

  // log('filtering finished');

  if (filters.filters.length) $('.filter').addClass('filter--active');
  else $('.filter').removeClass('filter--active');

  if (activeCards.length) {
    $('.finder__no__matches').hide();
  }
  else {
    $('.finder__no__matches').show();
  }

  // count number of active cards in result
  const count = activeCards.length;
  $('#finder__result span').text(count);

  saveFilter();
}

function showNextPage() {
  const hiddenCards = $('.page--hidden');
  const nextPageOfCards = hiddenCards.slice(0, 20);
  const currentPageOfCards = $('.page--visible');

  const newPageOfCards = $.merge(currentPageOfCards, nextPageOfCards);

  newPageOfCards.removeClass('page--hidden');
  newPageOfCards.addClass('page--visible');

  mixer.filter(newPageOfCards.get());

  if (hiddenCards.length > nextPageOfCards.length) {
    moreCardsToShow = true;
  } else {
    moreCardsToShow = false;
  }
}

const showMore = $('#show-more').get(0);
function setupLoadMoreWatcher() {
  const watcher = () => {
    if (moreCardsToShow) {
      const showMorePos = showMore.offsetTop;
      const screenBottomPos = window.pageYOffset + window.innerHeight + 50;

      if (screenBottomPos > showMorePos) showNextPage();
    }

    requestAnimationFrame(watcher);
  }

  requestAnimationFrame(watcher);
}

function createCompareSlider() {
  flkty = new Flickity('.compare__inner', {
    initalIndex: 1,
    dragThreshold: 20,
    pageDots: false,
    groupCells: true,
    contain: true,
    accessibility: false
  });
  Flickity.prototype._createResizeClass = function() {
    this.element.classList.add('flickity-resize');
  };

  Flickity.createMethods.push('_createResizeClass');

  var resize = Flickity.prototype.resize;
  Flickity.prototype.resize = function() {
    this.element.classList.remove('flickity-resize');
    resize.call( this );
    this.element.classList.add('flickity-resize');
  };
}

$(() => {
  if ($('.filter').length > 0) {
    $.getJSON('json/finder.json')
    .fail(err => {
      // log('error loading program JSON');
      // log(err);
    })
    .done(data => buildProgramList(data))
    .done(() => {

      setGridToggleButton();
      setFilterDropdownToggle();
      setFilterAddHandlers();
      setFilterClearHandlers();
      setFilterDropdownHandlers();
      setSearchChangeHandler();
      setLocationCheckboxHandlers();
      setClearAllFiltersHandler();
      setQuickViewCloseHandler();
      setClearAllCompareHandler();
      createCompareSlider();
      loadFilter();
      setInitialViewType();
      performFilter();
      setupLoadMoreWatcher();
    });
  }
});
