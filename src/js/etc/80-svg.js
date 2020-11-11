// conditionally load the polyfill script
if (/MSIE|Trident/.test(navigator.userAgent)) {
  loadJS('/theme/js/svg4everybody.min.js', function() { svg4everybody(); });
  /*
  var script = document.createElement('script');
  script.src = '/theme/js/svg4everybody.min.js';
  script.onload = function() { svg4everybody(); };
  document.head.appendChild(script);
  */
}
