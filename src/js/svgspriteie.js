// conditionally load the polyfill script
/MSIE|Trident/.test(navigator.userAgent) && !function(document){
  var script = document.createElement('script');
  script.src = '/theme/js/svg4everybody.min.js';
  script.onload = function() { svg4everybody(); };
  document.head.appendChild(script);
}(document);
/*
// from https://css-tricks.com/svg-sprites-use-better-icon-fonts/ - but broken
/MSIE|Trident/.test(navigator.userAgent) && document.addEventListener('DOMContentLoaded', function () {
  [].forEach.call(document.querySelectorAll('svg'), function (s,u,o) {
    if (u = s.querySelector('use')) {
      o = document.createElement('object');
      o.data = u.getAttribute('xlink:href');
      o.className = s.getAttribute('class');
      console.log(s,u,o);
      s.parentNode.replaceChild(o, s);
    }
  });
});
*/
