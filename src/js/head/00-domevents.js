// header image stuff
var src = location.origin+'/theme/img/hdr-760.jpg', img = new Image();

// strings
var $complete = 'complete'+_, $onDomLoaded = 'onDomLoaded'+_;
var $addEventListener = 'addEventListener'+_;
var $headerEvent = 7;

// function refrences
var $setTimeout = setTimeout;

var $errorLog = window['errorLog'] = [];

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

var bannerReady = window.dispatchEvent.bind(window, new Event($headerEvent));

window[$addEventListener]('error', function(e){$errorLog.push(e)});
domEvents($onDomLoaded, [$complete, 'loaded', 'interactive'], 'DOMContentLoaded');
domEvents('onDomComplete', [$complete], 'load');
domEvents('onHeader', [$complete], $headerEvent);
