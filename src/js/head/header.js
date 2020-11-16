try{
  var src = location.origin+'/theme/img/hdr-760.jpg', img = new Image(), sto = setTimeout.bind(this, function(){
    // iterate through the rules
    for (var z, s, i = 0, r = document.styleSheets[0].cssRules; i < r.length; ++i) {
      // look for the rule for the banner
      if (r[i].selectorText == '#banner') {
        s = r[i].style;
        if (!img.complete) {
          z = s.backgroundImage;
          r = z.split(/,\s*(?=u)/);
          r.splice(1,1); // delete one element at offset 1
          s.backgroundImage = r.join(',');
          //img = new Image();
          img.onload = function() {
            s.transition = 'background 2s ease-in-out';
            s.backgroundImage = z;
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
}catch(e){}
