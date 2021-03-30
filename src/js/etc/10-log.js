var logStats = (function() {
  var target = '/stats', queue = [], send = queue.push.bind(queue);

  getUid(function(uid) {
    var serialize = function(data) {
      data['uid'] = uid;
      return JSON.stringify(data);
    };

    if (typeof fetch === 'function' && 'keepalive' in Request.prototype) {
      send = function(data) {
        fetch(target, {
          keepalive: true,
          method: 'POST',
          body: serialize(data)
        });
      };
    } else if (typeof navigator.sendBeacon === 'function') {
      send = function(data) {
        navigator.sendBeacon(target, serialize(data));
      };
    } else {
      send = function(data) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', target, false); // synchronous
        xhr.send(serialize(data));
      };
    }

    while (queue.length) send(queue.shift());
  });

  return function(data) {
    var page = location.pathname;
    if (page.charAt(0) != '/') { page = '/' + page; }
    data['page'] = page;
    data['time'] = Date.now();
    send(data);
  };
})();

var $errorLog = 'errorLog'+_, errorPush = function(_err) {
  if (_err) {
    logStats({error:{
      name:_err.name,
      message:_err.message,
      stack:_err.stack
    }});
  }
};
while (window[$errorLog] && window[$errorLog].length) {
  errorPush(window[$errorLog].shift());
}

window[$errorLog].push = errorPush;
