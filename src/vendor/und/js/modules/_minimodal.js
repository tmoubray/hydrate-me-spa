var minimodal = require('../util/_minimodal');

var targets = document.querySelectorAll('[data-minimodal]');

for (var i = 0; i < targets.length; i += 1) {
  var modal = minimodal(targets[i], {
    statusTimeout: 600,
    removeTimeout: 600,
    closeTimeout: 600,
    closeButtonHTML: '<span class="cross"></span>',
    fixed: true
  });
  modal.init();
}
