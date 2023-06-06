const $ = require('jquery');

$(() => {
  if ($('.hero__welcome').length > 0) {
    $('.hero__welcome').on('click', function(e) {
      e.preventDefault();
      
      $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 80
      }, 500);
    });
  }
  
  //
  
  if ($('.hero--video').length > 0) {
    const videoAll = document.querySelectorAll('.hero--video video');
    
    const check = function(video, source) {
      if (window.innerWidth >= 768) {
        video.pause();
        source.setAttribute('src', source.getAttribute('data-src'));
        video.load();
        video.play();
      } else {
        source.setAttribute('src', 'javascript:void(0)');
        requestAnimationFrame(() => {
          check(video, source);
        });
      }
    };
    Array.prototype.forEach.call(videoAll, video => {
      const source = video.querySelector('source');
      check(video, source);
    });

  }
  
});
