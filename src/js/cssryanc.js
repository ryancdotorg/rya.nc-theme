//! loadCSS [c]2017 Filament Group, MIT License
(function(w, _createElement, _getElementsByTagName, _addEventListener, _getAttribute, _load, _link){
  var doc = w.document, _setTimeout = setTimeout, _preload = "pre"+_load;
  var loadCSS = function( href, before, media ){
    // Arguments explained:
    // `href` [REQUIRED] is the URL for your CSS file.
    // `before` [OPTIONAL] is the element the script should use as a reference
    //     for injecting our stylesheet <link> before
    // By default, loadCSS attempts to inject the link after the last
    //     stylesheet or script in the DOM. However, you might desire a more
    //     specific location in your document.
    // `media` [OPTIONAL] is the media type or query of the stylesheet. By
    //     default it will be 'all'
    var ss = doc[_createElement]( _link );
    var ref = before || ( doc.body || doc[_getElementsByTagName]( "head" )[ 0 ] ).lastChild;

    var sheets = doc.styleSheets;
    ss.rel = "stylesheet";
    ss.href = href;
    // temporarily set media to something inapplicable to ensure it'll fetch
    // without blocking render
    //ss.media = "only x";
    ss.media = "print";

    // wait until body is defined before injecting link. This ensures a
    // non-blocking load in IE11.
    !function ready(){
      if( doc.body ){
        // Inject link
        return ref.parentNode.insertBefore( ss, ( before || null ) );
      }
      _setTimeout(ready);
    }();
    // A method (exposed on return object for external use) that mimics onload
    // by polling document.styleSheets until it includes the new sheet.
    var onloadcssdefined = function( cb ){
      if (cb) {
        var i = sheets.length;
        while( i-- ){
          if( sheets[ i ].href === ss.href ){
            return cb();
          }
        }
        _setTimeout(onloadcssdefined, 10, cb);
      }
    };

    function loadCB(){
      ss.removeEventListener( _load, loadCB );
      ss.media = media || "all";
    }

    // once loaded, set link's media back to `all` so that the stylesheet
    // applies once it loads
    ss[_addEventListener]( _load, loadCB);
    ss.next = onloadcssdefined;
    onloadcssdefined( loadCB );
    return ss;
  };
  // rel=preload support test
  var rp = {};
  rp._support = function(){
    try {
      return doc[_createElement]( _link ).relList.supports( _preload );
    } catch (e) {
      return 0;
    }
  };

  // loop preload links and fetch using loadCSS
  rp._poly = function(){
    var link, i, links = doc[_getElementsByTagName]( _link );
    for( i = 0; i < links.length; i++ ){
      link = links[ i ];
      if( link.rel === _preload && link[_getAttribute]( "as" ) === "style" ){
        loadCSS( link.href, link, link[_getAttribute]( "media" ) );
        link.rel = null;
      }
    }
  };

  // if link[rel=preload] is not supported, we must fetch using loadCSS
  if( !rp._support() ){
    rp._poly();
    var run = setInterval( rp._poly, 300 );
    w[_addEventListener]( _load, function(){
      rp._poly();
      clearInterval( run );
    } );
  }

  w["loadCSS"] = loadCSS;
})(window, "createElement", "getElementsByTagName", "addEventListener", "getAttribute", "load", "link");
