/MSIE|Trident/.test(navigator.userAgent) && document.addEventListener('DOMContentLoaded', function () {
  [].forEach.call(this.querySelectorAll('svg'), function (s,u,o) {
    if (u = s.querySelector('use')) {
      o = this.createElement('object');
      o.data = u.getAttribute('xlink:href');
      s.parentNode.replaceChild(o, s);
    }
  });
});
