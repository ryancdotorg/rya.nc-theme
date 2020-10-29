onDomComplete.push(function(){
  var cmap = 'bcdfghjklmnpqrstvwxzaeiouy',
      remap = function(c) { return cmap.charAt(c.charCodeAt(0)-97); },
      tag = (Math.round(Math.random()*900+100)*1e13+(new Date()).getTime()).toString(30);

  tag = tag.replace(/[a-z]/g, remap);

  try {
    var m, e, i, _len, unob;
    var elmnts = document.getElementsByClassName ? document.getElementsByClassName("email") : document.getElementsByTagName("a");
    for (i = 0, _len = _len = elmnts.length; i < _len; ++i) {
      e = elmnts[i];
      if (!e.className.match(/\bemail\b/)) continue;
      if (m = e.href.match(/^mailto:no_js_([a-z]+)$/)) {
        unob = m[1].replace(/[a-z]/g, remap);
        unob = unob.replace(/xxdotxx/g, '.');
        unob = unob.replace(/xxatxx/, '+'+tag+'@');
        e.href = 'mailto:' + unob;
      }
    }
  } catch(e){}
});
