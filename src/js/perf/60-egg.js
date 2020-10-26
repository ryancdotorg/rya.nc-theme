onDomComplete.push(function(){
  var span = document.querySelector('footer span');
  addListener(span, 'click', function(e){
    var k, v, l = [];
    for (k in e) {
      v = e[k];
      if (typeof v == 'boolean') {
        l.push(k+'='+v);
      }
    }
    l.sort();
    crypto.subtle.digest(
      {name:'SHA-256'},
      (new TextEncoder()).encode(l.join('&'))
    ).then(function(ab){
      console.log(l.join('&'));
      console.log(Array.from(new Uint8Array(ab), function(b) {
        return ('0'+b.toString(16)).substr(-2);
      }).join(''));
    });
  });
});
