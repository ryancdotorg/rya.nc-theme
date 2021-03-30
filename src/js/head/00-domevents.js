// strings
var $complete = 'complete'+_, $onDomLoaded = 'onDomLoaded'+_;
var $addEventListener = 'addEventListener'+_;

// function refrences
var $setTimeout = setTimeout;

var $errorLog = window['errorLog'] = [];
window[$addEventListener]('error', function(e){$errorLog.push(e)});

var domEvents = function(fn, states, evt, ary, dispatch) {
  ary = [];
  dispatch = function() {
    window[fn] = $setTimeout;
    while (fn = ary.shift()) $setTimeout(fn);
  };
  window[fn] = ary.push.bind(ary);
  if (states.indexOf(document.readyState) >= 0) {
    dispatch();
  } else {
    window[$addEventListener](evt, dispatch);
  }
};

domEvents($onDomLoaded, [$complete, 'loaded', 'interactive'], 'DOMContentLoaded');
domEvents('onDomComplete', [$complete], 'load');
