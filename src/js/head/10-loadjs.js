var _loadJS_ref;
window['loadJS'] = function(src, cb, s) {
  s = 'script';
  _loadJS_ref = _loadJS_ref || document.getElementsByTagName(s)[0];
  s = document.createElement(s);
  s.onload = cb || '';
  s.src = src;
  _loadJS_ref.parentNode.insertBefore(s, _loadJS_ref);
};
try{Z}catch(e){}
