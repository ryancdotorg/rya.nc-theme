// This needs to be an inline script in <head> any stylesheet <link>s for which
// async loading is desired. Styles to be loaded async should have the
// following format:
//
// <link rel="stylesheet" href="..." onload="this.media='all'">
//
// The mutation observer will convert them to use "print" media which should
// normally be non-matching and will cause them not to block page render.
// When they do finish loading, the onload event will trigger and convert
// them to the "all" media type, applying them to the page.
//
// If JavaScript is blocked by the browser, the style will be loaded normally
// blocking render.
//
// Why all this trouble, why fallback could be implemented via <noscript>? In
// testing, I found that uBlock Origin ignores <noscript> blocks, probably due
// to sites using them to activate a style that prevents the page from being
// used. This is why we can't have nice things.

try {
  new MutationObserver(function(mutationsList, mutation, node) {
    while (mutation = mutationsList.pop()) {
      mutation = [].slice.call(mutation.addedNodes);
      while (node = mutation.pop()) {
        if (node.rel == "stylesheet" && node.onload && !node.media) {
          node.media = "print";
          // Approximate WOFF2 support check - false negative for:
          // * Chrome 36-41
          // * macOS Safari 10.x-11.x (Sierra and newer)
          // * iOS Safari 10.x-11.x
          if (!(navigator.vendor.match(/^A/) ? [].flat : window.fetch)) {
            node.href = node.href.replace('woff2','woff');
          }
        //} else if (/noscript/.test(node.href)) {
        //  node.href = 'data:text/css,';
        }
      }
    }
  }).observe(document.head,{childList:1});
}catch(e){}
