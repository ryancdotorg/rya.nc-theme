// This needs to be an inline script in <head> before any stylesheet <link>s
// for which async loading is desired. Styles to be loaded async should have
// the following format:
//
// <link rel="stylesheet" href="..." data-async>
//
// The mutation observer will add an event handler and set the media attribute
// to "print". The non-matching media type will prevent the stylesheet from
// blocking page render. When they do finish loading, the load event will
// trigger and change the media attribute to "all", applying them to the page.
//
// If JavaScript is blocked by the browser, the style will be loaded normally,
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
        if (node.rel == "stylesheet") {
          if ('async' in node.dataset) {
            node.media = "print";
            node.addEventListener("load", function() { this.media = "all"; });
          //} else if ("noscript" in node.dataset) {
          //  node.parentNode.removeChild(node);
          }
        }
      }
    }
  }).observe(document.head,{childList:1});
}catch(e){}
