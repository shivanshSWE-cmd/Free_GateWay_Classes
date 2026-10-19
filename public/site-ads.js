
// Gateway Classes Clone - Clean Ad-free Shim
(function() {
  window.GWC_ADS = {
    init: function() { console.log('Ad slots neutralized - clean viewing experience active.'); },
    refresh: function() {}
  };
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.ad-slot').forEach(function(el) {
      el.style.display = 'none';
      el.innerHTML = '';
    });
  });
})();
