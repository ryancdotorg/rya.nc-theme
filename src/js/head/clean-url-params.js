try {
  if (/^#\w+(\/\w+)+$/.test(location.hash) || (location.search && !/^\/placeholder\b/.test(location.pathname))) {
    history.replaceState(null, document.title, location.pathname);
  }
} catch (e) {};
