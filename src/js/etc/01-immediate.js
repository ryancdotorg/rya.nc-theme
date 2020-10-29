var runAsync = (function() {
  if (typeof MessageChannel === 'function') {
    var id = 0, tasks = new Map(), chan = new MessageChannel();
    chan.port1.onmessage = function(event) {
      var handle = event.data, task = tasks.get(handle);
      if (task) {
        task();
        tasks.delete(handle);
      }
    }
    return function(callback) {
      tasks.set(++id, callback);
      chan.port2.postMessage(id);
    };
  } else {
    return null;
  }
})();
