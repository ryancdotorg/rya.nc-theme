// This doesn't work right in Safari
if (/(Chrom|Firefox)/.test(navigator.userAgent)) {
window[$onDomLoaded](function(){
  var $bg = 'background'+_;
  var $bgImg = $bg+'Image';
    //, sto = setTimeout.bind(this, function(){
  // iterate through the rules
  for (var z, s, i = 0, r = document.styleSheets[0].cssRules; i < r.length; ++i) {
    // look for the rule for the banner
    if (r[i].selectorText == '#banner') {
      s = r[i].style;
      if (!img[$complete]) {
        z = s[$bgImg];
        r = z.split(/,\s*(?=u)/);
        r.splice(1,1); // delete one element at offset 1
        s[$bgImg] = r.join(',');
        //img = new Image();
        img.onload = function() {
          s.transition = $bg+' 2s ease-in-out';
          s[$bgImg] = z;
          $setTimeout(bannerReady, 2100);
        };
        //img.src = img.src;
        //i.style.display = 'none';
        //d.documentElement.appendChild(i);
      } else {
        bannerReady();
      }
      return;
    }
  }
});//, 4);
img.src = src;
//window[$onDomLoaded](sto);
/*
if (document.readyState == 'loading') {
  addEventListener('DOMContentLoaded', sto);
} else {
  sto();
}
*/
} else {
  bannerReady()
}
