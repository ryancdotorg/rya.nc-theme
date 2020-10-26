// get a reference to the web crypto object
var _crypto = crypto || msCrypto;

// wrap the subtlecrypto api, handling either promise or event based
var _subtle = function() {
  var args = [].slice.call(arguments),
    method = args.shift(),
    callback = args.pop(),
    res = _crypto.subtle[method].apply(_crypto.subtle, args);

  if (typeof res.then === 'function') {
    res.then(callback)
  } else {
    res.oncomplete = callback;
  }
};

// get a unique id from session storage
var getUid = function(gotUid) {
  var uid, __test = '__test';

  var result = function(u8) {
    // increment and save the unique id if sessionStorage is working
    if (typeof uid !== 'undefined') {
      for (var carry = u8.length; --carry >= 0 && u8[carry]++ == 255;);
      try {
        sessionStorage.setItem('uid', JSON.stringify([].slice.call(u8)));
      } catch (e) {}
    }

    // dispatch result
    (getUid = function(gotUid) {
      gotUid(String.fromCharCode.apply(null, u8).replace(/[\s\S]/mg, function(c) {
        return ("0"+c.charCodeAt(0).toString(16)).substr(-2);
      }));
    })(gotUid);
  };

  // feature test and attempt read
  try {
    if (!navigator.doNotTrack) {
      sessionStorage.setItem(__test, __test);
      sessionStorage.removeItem(__test);
      uid = sessionStorage.getItem('uid') || null;
    }
  } catch (e) {}

  // simple case - a unique id is already in session storage
  if (typeof uid === 'string') {
    result(new Uint8Array(JSON.parse(uid)));
  } else {
    runAsync((function(){
      // background timer - works well even with low resolution Date.now()
      var p = 32, cnt = 0, si = setInterval(function(){++cnt},1);

      // collected entropy goes in an array buffer with a data view
      var entropy = new ArrayBuffer(1024), dv = new DataView(entropy);

      // reference count, iterations, etc
      var ref = cnt, i = 0, ua = navigator.userAgent;

      // loops async until the next time setInterval updates the counter
      var gather = function() {
        ++i;
        if (cnt > ref) {
          i = (i >> 16) ^ (i & 65535);
          i = (i >>  8) ^ (i &   255);
          dv.setUint8(++p, i);
        }

        if (p < 40) {
          runAsync(gather);
        } else {
          // once we have enough data, pull in some other crap
          clearInterval(si);
          dv.setFloat64(p, Math.random()); p += 8;
          dv.setFloat64(p, Date.now()); p += 8;
          // grab ua client hints data if present
          if ("userAgentData" in navigator) {
            ua += JSON.stringify(navigator.userAgentData.brands);
            navigator.userAgentData.getHighEntropyValues([
              "architecture", "model", "platform",
              "platformVersion", "uaFullVersion"
            ]).then(function(d) {
              ua += JSON.stringify(d);
              mixUserAgent();
            });
          } else {
            mixUserAgent();
          }
        }
      };

      var mixUserAgent = function() {
        for (i = 0, ref = ua.length; i < ref; ++i) {
          dv.setUint16(p, ua.charCodeAt(i));
          p += 2;
        }

        // hash everything together for a uniform value
        var P = _subtle('digest', {name:"SHA-256"}, entropy, function(d){
          d = new Uint8Array(d);
          // use last 64 bits as a sequence number starting with zero
          for (i = 24; i < 32; ++i) { d[i] = 0; }
          result(d);
        });
      };

      // getRandomValues is non-random for some bots
      _crypto.getRandomValues(new Uint8Array(entropy, 0, p));

      // return gather function for async callback
      return gather;
    })());
  }
};

window['getUid'] = function(n){ getUid(n); };
