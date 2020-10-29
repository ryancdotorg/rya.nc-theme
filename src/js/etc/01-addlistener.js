var addListener = (function(){
  // do feature test and keep results in a closure
  var oPassive, oCapture, oOnce;
  var nop = function(){};
  try {
    var options = {
      get passive() { oPassive = true; return false; },
      get capture() { oCapture = true; return false; },
      get once()    { oOnce    = true; return false; }
    };
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (e) {}

  // return actual function
  return function(target, type, options, listener) {
    // support addListener(target, type, listener) interface
    if (typeof options === 'function' && typeof listener === 'undefined') {
      listener = options;
      options = {};
    }

    var _listener, _remove;
    if (!oOnce && options['once']) {
      _listener = function(event) {
        _remove();
        listener.call(target, event, nop);
        listener = nop;
      };
    } else {
      _listener = function(event) {
        listener.call(target, event, _remove);
      };
    }

    _remove = function() {
      target.removeEventListener(type, _listener, options);
    };

    if (!oCapture) {
      options = options['capture'];
    } else if (!('passive' in options)) {
      options['passive'] = true;
    }

    target.addEventListener(type, listener, options);

    return _remove;
  };
})();
window['addListener'] = addListener;
