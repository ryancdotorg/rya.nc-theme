// conditionally load the polyfill script
if (/MSIE|Trident/.test(navigator.userAgent)) {
  var script = document.createElement('script');
  script.src = '/theme/js/svg4everybody.min.js';
  script.onload = function() { svg4everybody(); };
  document.head.appendChild(script);
}
