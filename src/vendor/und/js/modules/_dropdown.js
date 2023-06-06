const $ = require('jquery');
const log = require('debug')('und:dropdowns');

$(() => {

  const dropItems = document.querySelectorAll('.dropdown');
  const targets = document.querySelectorAll('.dropdown__toggle');


  const click = function(e) {
    if (this.parentNode.classList.contains('dropdown--active')) {
      this.parentNode.classList.remove('dropdown--active');
    }
    else {
      for (let i = 0; i < dropItems.length; i += 1) {
        dropItems[i].classList.remove('dropdown--active');
      }
      this.parentNode.classList.add('dropdown--active');
    }
  }


  for (let i = 0; i < targets.length; i += 1) {
    targets[i].addEventListener('click', click);
  }
});
