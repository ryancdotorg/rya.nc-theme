!function(document){try{
  var src = location.origin+'/theme/img/hdr-1200.jpg', img = new Image(), sto = setTimeout.bind(this, function(){
    // iterate through the rules
    for (var s, i = 0, r = document.styleSheets[0].cssRules; i < r.length; ++i) {
      // look for the rule for the banner
      if (r[i].selectorText == '#banner') {
        s = r[i].style;
        if (!img.complete) {
          r = s.backgroundImage.split(/,\s*(?=u)/);
          s.backgroundImage = [r[0], r[2]].join(',');
          //img = new Image();
          img.onload = function() {
            s.transition = 'background 2s ease-in-out';
            s.backgroundImage = r.join(',');
          };
          //img.src = img.src;
          //i.style.display = 'none';
          //d.documentElement.appendChild(i);
        }
        return;
      }
    }
  }, 4);
  img.src = src;
  if (document.readyState == 'loading') {
    addEventListener('DOMContentLoaded', sto);
  } else {
    sto();
  }
}catch(e){}}(document);
