window[$onDomLoaded](function(){
  var O = {}, M = {}, H = document.head, X = new XMLHttpRequest(),
  rt = function() {
    var ret = [], res = performance.getEntriesByType("resource");
    res.push(performance.getEntriesByType("navigation"));
    res.forEach(function(x){
      if (x.transferSize) {
        ret.push((1000*(x.responseStart-x.requestStart))|0);
      }
    });
    O.reqTime = ret;
    return ret.length;
  },
  uh = function(u) { return u.href.replace(u.hash, ''); },
  pf = function(e) {
    var l, t = e.target, T = (O.reqTime||[]).slice(), navConn = navigator.connection || {}, rtt;
    T.push(O.connInfo&&O.connInfo.rtt||Infinity);
    // skip prefetches if the round trip time is under 40ms or saveData is on
    if (navConn.saveData || ((rtt = Math.min.apply(0, T) < 40000) && !(navConn.rtt >= 500))) return;
    // skip prefetches on hover unless the connection has high latency and okayish bandwidth
    if (e.type == "mouseenter" && rtt < 100000 && !(navConn.rtt >= 1000) && !(navConn.downlink < 0.25)) return;
    if (t.tagName == 'A' && t.origin == self.origin && !e.button && uh(t) != uh(location) && t.getAttribute('download') === null && !M[t.href]) {
      M[t.href] = 1;
      l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = t.href;
      l.onload = function() {
        H.removeChild(this);
      };
      H.appendChild(l);
    }
  },
  tg = function(e) {
    var t = e.target, to = setTimeout(pf, 100, e), le = function() {
      t.removeEventListener('mouseleave', le);
      clearTimeout(to);
    };
    e.target.addEventListener('mouseleave', le);
  },
  links = document.getElementsByTagName('A'), _len = links.length, i;
  setTimeout(function(){
    if (!rt()) {
      X.addEventListener('load',function(){try{O.connInfo=JSON.parse(this.responseText)}catch(e){}});
      X.open('GET', '/conn.json?'+Date.now());
      X.send();
    }
  }, 100);
  for (var i = 0; i < 2; ++i) {
    this.addEventListener((['mousedown','touchstart'])[i], pf, {passive: !0});
  }
  for (i = 0; i < _len; ++i) {
    links[i].addEventListener('mouseenter', tg);
  }
});
