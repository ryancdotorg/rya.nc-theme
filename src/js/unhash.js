try {
  if (/^#\w+\/\w+$/.test(location.hash) || location.search) {
    history.replaceState(null, document.title, location.pathname);
  }
} catch (e) {}
