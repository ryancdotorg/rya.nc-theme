var dispatch = function(ary) {
  for (var i = 0, n = ary.length, f; i < n; ++i) {
    if (typeof (f = ary[i]) === 'function') { try { f(); } catch(e) {} }
  }
};

if (['complete','loaded','interactive'].indexOf(document.readyState) >= 0) {
  dispatch(onDomLoaded);
} else {
  addListener(window, 'DOMContentLoaded', {once: true}, dispatch.bind(null, onDomLoaded));
}

if (document.readyState === 'complete') {
  dispatch(onDomComplete);
} else {
  addListener(window, 'load', {once: true}, dispatch.bind(null, onDomComplete));
}
