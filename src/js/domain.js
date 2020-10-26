document.addEventListener('DOMContentLoaded', function(s){
  if (location.hostname == 'ryanc.org') {
    s = this.createElement('script');
    s.src = 'https://rya.nc/theme/js/redir.min.js';
    this.body.appendChild(s);
  }
});
