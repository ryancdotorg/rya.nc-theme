!function(){
var main = function(){
};
if (['complete','loaded','interactive'].indexOf(document.readyState) >= 0) {
  main();
} else {
  window.addEventListener('DOMContentLoaded', main);
}
}();
