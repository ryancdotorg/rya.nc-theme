onDomLoaded.push(function(){
  if (location.hostname == 'ryanc.org') {
    s = document.createElement('script');
    s.src = 'https://rya.nc/theme/js/redir.min.js';
    document.body.appendChild(s);
  }
});
