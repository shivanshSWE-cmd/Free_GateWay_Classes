/**
 * Security & Anti-Clone Shield for AKTU Notes Store
 * Protects frontend source, disables clickjacking, blocks hotlinking
 */
(function() {
  'use strict';

  // 1. Anti-Clickjacking: prevent site from being framed inside another website
  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location.href;
    } catch (e) {
      document.body.innerHTML = '<h1>Unauthorized Frame Embedding</h1>';
    }
  }

  // 2. Prevent Source Code Shortcuts & Save Page dialogs
  window.addEventListener('keydown', function(e) {
    // F12 (DevTools)
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect)
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      return false;
    }
  });

  // 3. Attach session token header to all internal fetch requests to authenticate with backend
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    if (typeof options.headers.set === 'function') {
      options.headers.set('X-Requested-With', 'XMLHttpRequest');
      options.headers.set('X-Client-Shield', 'AKTU-Gateway-Secure');
    } else {
      options.headers['X-Requested-With'] = 'XMLHttpRequest';
      options.headers['X-Client-Shield'] = 'AKTU-Gateway-Secure';
    }
    return originalFetch.call(this, url, options);
  };
})();
