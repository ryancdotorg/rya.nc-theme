/*
window.onerror = function(e){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/stats');
  xhr.send(JSON.stringify({'error':[].slice.call(arguments)}));
};
*/
var onDomLoaded = [], onDomComplete = [];
