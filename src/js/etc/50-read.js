["pageshow", "pagehide", "beforeprint"].forEach(function(t){
  addListener(window, t, logStats.bind(null, {'event':t}));
});

try {
  var logGetter = function(obj, prop) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    var getter = descriptor.get;
    descriptor.get = function() {
      logStats({"getter":prop,"stack":(new Error()).stack});
      return getter.apply(this, arguments);
    };
    Object.defineProperty(obj, prop, descriptor);
  };
  logGetter(HTMLElement.prototype, 'outerText');
  logGetter(HTMLElement.prototype, 'innerText');
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
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        logStats({'event':'finish'});
        observer.disconnect();
      }
    });
  });
  observer.observe(endElement);
});
