/**
* Course Finder - Search and Results Display
* -----------------------------------------------------------------------------
*/

// Imports.
const log            = require( 'debug' )( 'und:course-finder' );
const animateTo      = require( '../util/_animate-to' );
const { MediaQuery } = require( '../util/_media-query' );

if (document.querySelector('.courses')) {

  const status = {
    'career': [],
    'subject': [],
    'search': '',
    'session': []
  }

  let searchTimeout;
  let coursesSearchTimeout;
  const today = Date.parse(serverdatetime);

  const displaySpeaEnrollAfterDate = new Date(
    (new Date()).valueOf() + (daysToDisplayBeforeEnrollOpenSPEA * 24 * 60 * 60 * 1000)
  ).toJSON().slice(0, 10);

  const displaySemesterEnrollAfterDate = new Date(
    (new Date()).valueOf() + (daysToDisplayBeforeEnrollOpenSemester * 24 * 60 * 60 * 1000)
  ).toJSON().slice(0, 10);

  const coursesFilters = document.querySelector('.courses-filters');
  const coursesList = document.querySelector('.courses__list');
  const levelFilter = document.querySelector('[data-filter-level]');
  const sessionFilter = document.querySelector('[data-filter-session]');
  const subjectFilter = document.querySelector('[data-filter-subject]');
  const info = document.querySelector('.courses__info');
  const searchInput = document.querySelector('.course__input');
  const coursesNavLabel = document.querySelector('.courses__nav__label');

  const itemTemplate = (course) => {

    const makeSessionBlock = (classObj) => {
      const startSessionYear = classObj.session_start.substr(0, 4);
      const startSessionMonth = classObj.session_start.substring(5, 7);
      const startSessionDay = classObj.session_start.substring(8, 10);

      const endSessionYear = classObj.session_end.substring(0, 4);
      const endSessionMonth = classObj.session_end.substring(5, 7);
      const endSessionDay = classObj.session_end.substring(8, 10);

      const enrollmentOpenYear = classObj.enroll_open.substr(0, 4);
      const enrollmentOpenMonth = classObj.enroll_open.substr(5, 2);
      const enrollmentOpenDay = classObj.enroll_open.substr(8, 10);

      const enrollmentOpen = Date.parse(classObj.enroll_open);

      let enrollment;
      let enrollmentClose = classObj.enroll_close;
      let enrollmentCloseYear;
      let enrollmentCloseDay;
      let enrollmentCloseMonth;


      if (classObj.type === "SPEA") {
        return `<p class="course__block">
        <span class="course__block__title">${classObj.season}</span>
        <span>${speaCourseText}</span>
        </p>`
      }
      else {
        if (enrollmentClose != null) {
          enrollmentClose = Date.parse(classObj.enroll_close);

          enrollmentCloseYear = classObj.enroll_close.substr(0, 4);
          enrollmentCloseMonth = classObj.enroll_close.substr(5, 2);
          enrollmentCloseDay = classObj.enroll_close.substr(8, 10);

          if (today < enrollmentOpen) {
            enrollment = `<span>Enroll ${enrollmentOpenMonth}/${enrollmentOpenDay}/${enrollmentOpenYear}</span>`;
          }
          else if (today > enrollmentOpen && today < enrollmentClose) {
            enrollment = `<span>Enroll until ${enrollmentCloseMonth}/${enrollmentCloseDay}/${enrollmentCloseYear}</span>`;
          }
          else {
            enrollment = '<span class="course__status">Registration Closed</span>';
          }
        }
        else {
          enrollment = '<span>Enrollment close is undefined</span>'
        }

        return `<p class="course__block">
        <span class="course__block__title">${classObj.season}</span>
        <span>${startSessionMonth}/${startSessionDay}/${startSessionYear} - ${endSessionMonth}/${endSessionDay}/${endSessionYear}</span>
        <span>${enrollment}</span>
        </p>`
      }

    };

    const makeSemesterButton = () => {
      if (course.hasSemester) {
        return `<a class="button" href="${semesterCourseLinkUrl}">${semesterCourseLinkText}</a>`
      }
      else {
        return ``;
      }
    }

    const html = `<li class="course__card">
    <div class="course__card__first">
    <p class="course__title">${course.full_course_name}</p>
    </div>
    <div class="course__card__second">
    <p class="course__paragraph__trim">
    ${course.course_descrlong}
    </p>


    ${course.prerequisites
      ? `<p class="course__hidden">${course.prerequisites}</p>`
      : ''
    }

    <button class="button--link course__collapse__toggle course__collapse__btn--desktop">Details</button>

    </div>
    <div class="course__card__third">
    <div class="course__card__third--top">
    <button class="button--link course__collapse__toggle course__collapse__btn--mobile">Details</button>
    <dl class="courses-definition-list">

    <div>
    <dt>Subject:</dt>
    <dd>${course.subject_descrformal}</dd>
    </div>

    <div>
    <dt>Academic Level:</dt>
    <dd>${course.career}</dd>
    </div>

    ${course.credits
      ? `<div><dt>Credits:</dt><dd> ${course.credits}</dd></div>`
      : ''
    }

    <div>
    <dt>Session:</dt>
    <dd>${course.class.map(item => `${item.season}`).join(', ')}</dd>
    </div>

    </dl>

    <div>

    ${course.class.map(item => `${item.type}` === "SPEA"
    ? `<a class="button" href="${speaBaseUrl}${course.subject.replace( /[&]/g, '' )}${course.catalog_nbr}.html">${speaLinkText}</a>`
    : ''
    ).join('')}

    ${makeSemesterButton()}
    </div>
    </div>
    <div class="course__card__third--bottom">
    <div class="course__session__blocks">
    ${course.class.map(makeSessionBlock).join('')}
    </div>
    </div>
    </div>
    </li>`;


    const wrapperElem = document.createElement('div');
    wrapperElem.innerHTML = html;

    const elem = wrapperElem.firstChild;
    elem.setAttribute('data-course-json', JSON.stringify(course));
    elem.classList.add('active');


    const paragraphBlock = elem.querySelector('.course__paragraph__trim');
    const fullText = paragraphBlock.innerHTML.trim();
    let longText = true;

    const truncate = (paragraphBlock, limit) => {
      let text = paragraphBlock.innerHTML.trim();
      if (text.length > limit) {
        let newText = text.substr(0, limit) + ' ...';
        paragraphBlock.innerHTML = newText;
        longText = false;
      }
    };

    truncate(paragraphBlock, 250);

    const btns = elem.querySelectorAll('.course__collapse__toggle');

    Array.from(btns).forEach((btn) => {
      btn.addEventListener('click', () => {
        elem.classList.toggle('collapse--active');
        if (!longText) {
          paragraphBlock.innerHTML = fullText;
          longText = true;
        }
        else {
          truncate(paragraphBlock, 250);
        }
      });
    });


    return elem;
  };

  const filterCourses = () => {
    const activeLevelFilters = Array.from(
      document
      .querySelector('[data-filter-level]')
      .querySelectorAll('.courses__filter__btn.active')
      )
      .map(e => e.textContent.trim());

    const activeSessionFilters = Array.from(
      document
      .querySelector('[data-filter-session]')
      .querySelectorAll('.courses__filter__btn.active')
      ).map(e => e.textContent.trim());

    const activeSubjectFilters = Array.from(
      document
      .querySelector('[data-filter-subject]')
      .querySelectorAll('.courses__filter__btn.active')
      ).map(e => e.textContent.trim());

    const courseCard = Array.from(document.querySelectorAll('.course__card'));

    courseCard.forEach(card => {
      const course = JSON.parse(card.getAttribute('data-course-json'));

      let levelMatch = true;
      if (activeLevelFilters.length > 0) {
        levelMatch = false;
        activeLevelFilters.forEach(filterLevel => {
          if (course.career === filterLevel) levelMatch = true;
        });
      }

      let sessionMatch = true;
      if (activeSessionFilters.length > 0) {
        sessionMatch = false;
        activeSessionFilters.forEach(filterSession => {
          course.class.forEach(courseSession => {
            if (filterSession === courseSession.season) sessionMatch = true;
          });
        });
      }

      let subjectMatch = true;
      if (activeSubjectFilters.length > 0) {
        subjectMatch = false;
        activeSubjectFilters.forEach(filterSubject => {
          if (course.subject_descrformal === filterSubject) subjectMatch = true;
        });
      }

      let searchMatch = true;
      if (status.search) {
        const searchText = course.full_course_name + ' ' + course.course_descrlong;
        searchMatch = searchText.toLowerCase().includes(status.search.toLowerCase());
      }

      if (levelMatch && sessionMatch && subjectMatch && searchMatch) {
        card.classList.add('active');
        card.classList.add('page--hidden');
      } else {
        card.classList.remove('active');
        card.classList.remove('page--hidden');
      }
    });

    updateInfo();
    MediaQuery._init();
    loadMore();
  };

  const updateFilters = (courses) => {
    const levels = Object.keys(
      courses
      .reduce((acc, course) => Object.assign(acc, { [course.career]: true }),{}));

    const subjects = Object.keys(
      courses
      .reduce((acc, course) => Object.assign(acc, { [course.subject_descrformal]: true }),{}));

    const sessions = Object.keys(
      courses
      .map(course => course.class)
      .reduce((acc, sessions) => [...acc, ...sessions], [])
      .map(session => session.season)
      .reduce((acc, session) => Object.assign(acc, { [session]: true }),{}));

    levelFilter.innerHTML = levels
      .map(career => `
      <li class="courses__dropdown__item">
      <button class="courses__filter__btn" data-type="level" data-value="${career}">${career}
      </button>
      </li>
      `).join('');

    const subjectFilterSearch = `<div class="courses__dropdown__search">
    <label class="hide" for="search-subjects">Search Subjects</label>
    <input placeholder="Search" id="search-subjects" class="courses__search__input" type="text" autocomplete="off">
    </div>`;

    subjectFilter.innerHTML = subjectFilterSearch + `<ul>` + subjects.sort().map(subject => `
    <li class="courses__dropdown__item">
    <button class="courses__filter__btn" data-type="subject" data-value="${subject}">${subject}
    </button>
    </li>`).join('') + `<li class="alert alert--info no-results"></li></ul>`;

    const coursesSearchInput = subjectFilter.querySelector('.courses__search__input');
    const subjectOptions = subjectFilter.querySelectorAll('.courses__filter__btn');

    const filterCourseSubjects = () => {

      const searchValue = coursesSearchInput.value;
      const searchRegex = new RegExp(searchValue, 'i');

      let matchesFound = false;
      Array.from(subjectOptions).forEach((option) => {
        const optionValue = option.getAttribute('data-value');

        let match = searchRegex.exec(optionValue);

        if (match) {
          matchesFound = true;
          option.parentNode.style.display = 'block';
          option.innerHTML = optionValue.replace(match[0], `<span>${match[0]}</span>`);
        }
        else {
          option.parentNode.style.display = 'none';
          option.innerHTML = optionValue;
        }
      });

      const noResultsBlock = subjectFilter.querySelector('.no-results');

      if (!matchesFound) {
        noResultsBlock.style.display = 'list-item';
        const html = `No Results Found for <span>${searchValue}</span>`;
        noResultsBlock.innerHTML = html;
      }
      else {
        noResultsBlock.style.display = 'none';
      }
    };



    coursesSearchInput.addEventListener('input', () => {
      clearTimeout(coursesSearchTimeout);
      coursesSearchTimeout = setTimeout(() => {
        filterCourseSubjects();
      }, 300);
    });


    sessionFilter.innerHTML = sessions
    .map(session => `
      <li class="courses__dropdown__item">
      <button class="courses__filter__btn" data-type="session" data-value="${session}">${session}
      </button></li>
      `).join('');


    const navBtns = document.querySelectorAll('.courses__nav__btn');

    const closeAllNavs = () => {
      Array.from(navBtns).forEach((navBtn) => {
        navBtn.parentNode.classList.remove('courses__nav__item--active');
      });
    }

    Array.from(navBtns).forEach((targetNavBtn) => {
      targetNavBtn.addEventListener('click', (e) => {
        Array.from(navBtns).forEach((navBtn) => {
          if (navBtn === targetNavBtn) {
            if (targetNavBtn.parentNode.classList.contains('courses__nav__item--active')) {
              navBtn.parentNode.classList.remove('courses__nav__item--active');
            }
            else {
              navBtn.parentNode.classList.toggle('courses__nav__item--active');
            }
          }
          else {
            navBtn.parentNode.classList.remove('courses__nav__item--active');
          }
        });

        e.preventDefault();
      });

    });

    // document.addEventListener('scroll', closeAllNavs);

    document.addEventListener('click', function(e) {
      const navItemActives = document.querySelectorAll('.courses__nav__item--active');
      Array.from(navItemActives).forEach((navItemActive) => {
        let element = navItemActive;
        if (!element.contains(e.target)) {
          closeAllNavs();
        }
      });
    });


    const filterBtns = document.querySelectorAll('.courses__filter__btn');

    const handleFilter = function handleFilter() {
      this.classList.toggle('active');
      filterCourses();
    };

    Array.from(filterBtns).forEach((el) => {
      el.addEventListener('click', handleFilter);
    });
  };

  const updateInfo = () => {
    let html = '';
    let labelGroup = '';
    const total = document.querySelectorAll('.course__card').length;
    const count = document.querySelectorAll('.course__card.active').length;
    const activeFilters = document.querySelectorAll(".courses__filter__btn.active");

    status.level = [];
    status.session = [];
    status.subject = [];

    Array.from(activeFilters).forEach(activeFilter => {
      if (activeFilter) {
        const type = activeFilter.getAttribute("data-type");
        const label = activeFilter.textContent.trim();
        labelGroup += `<button class="course__remove" data-type="${type}" data-value="${label}">${label}</button>`;

        status[type].push(label);
      }
    });

    if (status.search) {
      labelGroup += `<button class="course__remove" data-type="search" data-value="${status.search}">${status.search}</button>`;
    }

    if (activeFilters.length || status.search) {
      html += `<div class="courses__label__group"><p class="courses__label">Filter:</p>${labelGroup}</div>`;
      html += `<button class="courses__reset">Clear All</button>`;
    }

    html += `<p class="courses__count">${count} of ${total} Results</p>`;
    info.innerHTML = html;

    const fixValue = (val) => val.replace(/ /g, '-');

    const query =
    `search=${status.search}&` +
    `level=${status.level.map(fixValue).join(',')}&` +
    `session=${status.session.map(fixValue).join(',')}&` +
    `subject=${status.subject.map(fixValue).join(',')}`;

    history.replaceState(null, null, `index.html?${query}`);
  };

  info.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('course__remove')) {
      const type = target.getAttribute('data-type');
      const value = target.getAttribute('data-value');
      const input = document.querySelector(`[data-type="${type}"][data-value="${value}"]`);

      if (type === 'search') {
        searchInput.value = '';
        status.search = '';
      }
      else {
        input.click();
      }

      filterCourses();
    }

    if (target.classList.contains('courses__reset')) {
      while (document.querySelectorAll('.course__remove').length) {
        document.querySelector('.course__remove').click();
      }
    }
  });

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      status.search = searchInput.value;
      filterCourses();
    }, 300);
  });

  coursesNavLabel.addEventListener('click', (e) => {
    coursesNavLabel.parentNode.classList.toggle('courses__nav--active');
    e.preventDefault();
  });

  const checkURL = () => {
    const search = new URLSearchParams(window.location.search);

    let valuesFound = false;

    search.forEach((value, key) => {
      valuesFound = true;
      if (key === 'search') {
        searchInput.value = value;
        status.search = value;
      }
      else {
        const values = value.split(',').map(v => v.replace(/-/g, ' '));
        values.forEach((val) => {
          if (val === 'Self Paced Enroll Anytime') {
            val = 'Self-Paced Enroll Anytime'
          }
          const el = document.querySelector(`[data-type="${key}"][data-value="${val}"]`);
          if (el) {
            el.click();
          }
        });
      }
    });

    if (valuesFound) {
      animateTo(coursesFilters)
    }
    else {
      const el = document.querySelector(`[data-type="session"][data-value="Self-Paced Enroll Anytime"]`);
      if (el) {
        el.click();
      }
    }
  };

  const updateItems = (courses) => {
    courses.sort((a, b) => {
      return a.full_course_name.localeCompare(b.full_course_name);
    }).forEach((course) => {
      coursesList.append(itemTemplate(course));
    });
  };

  const sortClasses = (course) => {
    const speaClasses = course.class
      .filter(c => c.type === 'SPEA')
      .sort((a, b) => b.enroll_open.localeCompare(a.enroll_open));
    const semClasses = course.class
      .filter(c => c.type !== 'SPEA')
      .sort((a, b) => b.enroll_open.localeCompare(a.enroll_open));

    course.class = [...speaClasses, ...semClasses];

    return course;
  }

  const removeDuplicateClasses = (course) => {
    const seenClasses = {};
    const newClasses = [];

    course.class.forEach(classEntry => {
      const name = `${classEntry.name}-${classEntry.session_start}-${classEntry.session_end}`;

      if (!seenClasses[name]) {
        seenClasses[name] = true;
        newClasses.push(classEntry);
      }
    });

    course.class = newClasses;

    return course;
  }

  const setHasSemesterClasses = (course) => {
    let hasSemester = false;
    course.class.forEach(classEntry => {
      if (classEntry.type === 'SEMESTER') {
        hasSemester = true;
      }
    });

    course.hasSemester = hasSemester;

    return course;
  }

  const fixCourseType = (course) => {
    course.class.forEach(classEntry => {
      if (classEntry.type !== 'SPEA') {
        classEntry.type = 'SEMESTER'
      }
    });
    return course;
  }

  const fixCourseName = (course) => {
    course.class.forEach(classEntry => {
      if (classEntry.type === 'SPEA') {
        classEntry.season = speaCourseName;
      }
      else {
        classEntry.season += ' ' + classEntry.year;
      }
    });
    return course;
  };

  const filterPastCourses = (course) => {
    return course.class.length > 0;
  };

  const removePastClasses = (course) => {
    course.class = course.class
      .filter(classEntry => {
        const result = serverdatetime <= classEntry.session_end;
        return result;
      });
      return course;
  };

  const removeFarFuture = (course) => {
    course.class = course.class.filter(classEntry => {
      if (classEntry.type === 'SPEA') {
        return displaySpeaEnrollAfterDate > classEntry.enroll_open;
      } else {
        return displaySemesterEnrollAfterDate > classEntry.enroll_open;
      }
    })
    return course;
  };

  const fixCourses = (courses) => {
    return courses
      .map(fixCourseType)
      .map(fixCourseName)
      .map(removeDuplicateClasses)
      .map(removePastClasses)
      .map(removeFarFuture)
      .filter(filterPastCourses)
      .map(setHasSemesterClasses)
      .map(sortClasses);
  };

  const loadMore = () => {
    const hiddenCards = Array.from(
      document.querySelectorAll('.courses__list > .page--hidden')
    );

    const showCard = card => card.classList.remove('page--hidden');

    if (MediaQuery.atLeast( 'md' )) {
      hiddenCards.slice(0, 10).forEach(showCard);
    }
    else {
      hiddenCards.slice(0, 5).forEach(showCard);
    }

    const stillHiddenCards = Array.from(
      document.querySelectorAll('.courses__list > .page--hidden')
    );

    if (stillHiddenCards.length === 0) {
      loadMoreButton.style.display = 'none';
    }
    else {
      loadMoreButton.style.display = 'block';
    }
  }

  const loadMoreButton = document.getElementById('load-more');

  loadMoreButton.addEventListener('click', loadMore);

  // https://und.edu/_resources/data/online-course-finder/online-course-finder.json

  // ./json/courses.json
  $.getJSON(courseJSON)
  .fail(err => {
    log('error loading courses JSON');
    log(err);
  })
  .done((data) => {
    const fixedData = fixCourses(data);
    updateItems(fixedData);
    updateFilters(fixedData);
    checkURL();
    filterCourses();
  });
}
