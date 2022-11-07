var footnoteReturnHandler = function(evt) {
  if (this == document.querySelector(':target .fn-backref')) {
    history.back();
    evt.preventDefault();
  };
}

var footnoteForwardHandler = function(evt) {
  var hash = this.href.split(/(?=#)/)[1]
  var rev = document.querySelector(hash + ' .fn-backref');
  var cancel = addListener(
    rev, 'click',
    {once: true, passive: false},
    footnoteReturnHandler
  );

  var observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) {
        cancel();
        if (location.hash == hash) {
          // randomize the hash to clear the :target selector
          location.hash = '#' + Math.random();
          history.replaceState(null, '', location.pathname + location.search);
        }
        observer.disconnect();
      }
    });
  }, {threshold: 0.1});
  observer.observe(rev);

  addListener(window, 'hashchange', function() {
    cancel();
    observer.disconnect();
  });
}

document.querySelectorAll('a.footnote-reference').forEach(function(node){
  addListener(node, 'click', footnoteForwardHandler);
});
