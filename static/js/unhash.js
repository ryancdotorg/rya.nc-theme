try {
  if (/#\w+\/\w+$/.test(location.href)) {
    history.replaceState(null, document.title, location.href.replace(/#.*/, ''));
  }
} catch (e) {}
