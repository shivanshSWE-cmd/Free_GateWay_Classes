// Global Live Search with API Integration
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('globalSearchInput');
    const dropdown = document.getElementById('globalSearchResults');
    if (!searchInput || !dropdown) return;

    let debounceTimer;

    // Shortcut Ctrl+K or /
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement !== searchInput)) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      if (e.key === 'Escape' && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = searchInput.value.trim();
      if (!query || query.length < 2) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      dropdown.classList.add('active');
      dropdown.innerHTML = '<div class="search-loading">⚡ Searching across 3,600+ subjects, notes & PYQs...</div>';

      debounceTimer = setTimeout(async () => {
        // 1. Offline in-memory search from pre-bundled search index
        if (Array.isArray(window.GWC_SEARCH_INDEX) && window.GWC_SEARCH_INDEX.length > 0) {
          const words = query.toLowerCase().split(/\s+/).filter(Boolean);
          const matches = window.GWC_SEARCH_INDEX.filter(item => {
            const blob = `${item.title} ${item.category} ${item.subCategory}`.toLowerCase();
            return words.every(w => blob.includes(w));
          }).slice(0, 25);
          renderResults(matches, query);
          return;
        }

        // 2. Fallback to API if index not loaded
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=25`);
          const data = await res.json();
          renderResults(data.results, query);
        } catch (err) {
          dropdown.innerHTML = '<div class="search-empty">No notes found or search offline.</div>';
        }
      }, 100);
    });

    function getBadgeClass(category) {
      const c = category.toLowerCase();
      if (c.includes('1st')) return 'badge-1year';
      if (c.includes('2nd')) return 'badge-2year';
      if (c.includes('3rd')) return 'badge-3year';
      if (c.includes('4th')) return 'badge-4year';
      if (c.includes('pyq')) return 'badge-pyq';
      if (c.includes('video')) return 'badge-video';
      return 'badge-1year';
    }

    function renderResults(results, query) {
      if (!results || results.length === 0) {
        dropdown.innerHTML = `<div class="search-empty">No results found for "<b>${escapeHtml(query)}</b>". Try subject name, course code, or topic.</div>`;
        return;
      }

      dropdown.innerHTML = results.map(item => {
        const badgeClass = getBadgeClass(item.category);
        const actionText = item.type === 'video' ? 'Watch ▶' : (item.type === 'pyq' ? 'View Paper 📄' : 'Open PDF ⬇');
        
        let targetUrl = item.url || '#';
        if (targetUrl.startsWith('/') && !targetUrl.includes('.')) {
          targetUrl = targetUrl.replace(/^\//, '') + '.html';
        }
        const targetAttr = (targetUrl.endsWith('.html') || targetUrl.startsWith('#')) ? '' : 'target="_blank" rel="noopener"';

        return `
          <a class="search-item" href="${targetUrl}" ${targetAttr}>
            <div class="search-item-left">
              <span class="search-item-badge ${badgeClass}">${escapeHtml(item.category)}</span>
              <div class="search-item-info">
                <span class="search-item-title">${escapeHtml(item.title)}</span>
                <span class="search-item-sub">${escapeHtml(item.subCategory || '')}</span>
              </div>
            </div>
            <span class="search-item-action">${actionText}</span>
          </a>
        `;
      }).join('');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    }
  });
})();
