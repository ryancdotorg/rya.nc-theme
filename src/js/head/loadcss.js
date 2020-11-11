// shim that queues stylesheets to be loaded
var _loadCSS = 'loadCSS', _cssQueue = [], _cssTriggered = 0;
if (!(_loadCSS in window)) {
  window[_loadCSS] = function() {
    var entry = [arguments];
    _cssQueue.push(entry);
    if (!_cssTriggered) {
      _cssTriggered = loadJS('/theme/js/cssryanc.min.js', function(args) {
        while (args = _cssQueue.shift()) {
          loadCSS.apply(0, args[0]).next(args[1]);
        }
      });
    }
    return {next:entry.push.bind(entry)};
  };
}
