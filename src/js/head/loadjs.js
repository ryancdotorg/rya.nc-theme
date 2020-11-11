var _loadJS_ref;
window['loadJS'] = function(src, cb) {
  _loadJS_ref = _loadJS_ref || document.getElementsByTagName('script')[0];
  var s = document.createElement('script');
  if (cb && typeof cb == 'function') { s.onload = cb; }
  s.src = src;
  _loadJS_ref.parentNode.insertBefore(s, _loadJS_ref);
};
