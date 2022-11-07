["pageshow", "pagehide", "beforeprint"].forEach(function(t){
  addListener(window, t, logStats.bind(null, {'event':t}));
});

try {
  var logGetter = function(obj, prop) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    var getter = descriptor.get;
    var seen = {};
    descriptor.get = function() {
      var stack = (new Error()).stack;
      if (!seen[stack]) {
        logStats({"getter":prop,"stack":stack});
        seen[stack] = 1;
      }
      return getter.apply(this, arguments);
    };
    Object.defineProperty(obj, prop, descriptor);
  };
  logGetter(HTMLElement.prototype, 'outerText');
  logGetter(HTMLElement.prototype, 'innerText');
  logGetter(HTMLElement.prototype, 'textContent');
  logGetter(Element.prototype, 'outerHTML');
  logGetter(Element.prototype, 'innerHTML');
} catch(e) {}

window[$onDomLoaded](function(){
  logStats({
    'event': 'DOMLoaded',
    'visible': document.visibilityState === 'visible',
    'focus': document.hasFocus(),
    'discarded': document.wasDiscarded || false
  });

  addListener(document, 'xvisibilitychange', function(e) {
    logStats({'event': document.visibilityState});
  });

  var blogPost = document.querySelector('[itemType="http://schema.org/BlogPosting"]');
  if (!blogPost) return;

  var count = 2, handler = function(event) {
    if (--count == 0) {
      removeScrollHandler();
      logStats({'event':'scroll'});
    }
  }, removeScrollHandler = addListener(window, 'scroll', handler);

  if (typeof IntersectionObserver !== 'function') return;
  var endElement = blogPost.querySelector('div.call-to-action, footer.postmeta');
  if (!endElement) return;

  var observer = new IntersectionObserver(function(entries, observer) {
    // don't trigger 'article finished' log event due to a footnote
    //if (!document.querySelector(':target .fn-backref')) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        logStats({'event':'finish'});
        observer.disconnect();
      }
    });
    //}
  });
  observer.observe(endElement);
});
