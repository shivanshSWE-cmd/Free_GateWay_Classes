const fs = require('fs');
const path = require('path');

const lecturesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'lectures.json'), 'utf-8'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="referrer" content="no-referrer-when-downgrade" />
  <title>AKTU BTech Video Lectures Hub — Unit-Wise One-Shots & Playlists</title>
  <link rel="stylesheet" href="gwc-ui.css">
  <link rel="icon" href="https://i.ibb.co/qYC69dyG/Chat-GPT-Image-Aug-6-2026-10-25-09-PM.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <meta name="description" content="Watch free AKTU B.Tech unit-wise one-shot revision video lectures and full course playlists by AH Tutorials and MultiAtoms for CSE, IT, AIML, and all branches.">
  <meta name="keywords" content="ah tutorials aktu, multiatoms aktu, aktu one shot video, dsa one shot aktu, coa one shot aktu, dstl one shot aktu, daa one shot aktu, os one shot aktu, java one shot aktu">
  <meta name="author" content="Shivansh (@ShivanshSWE-cmd)">
  <meta name="theme-color" content="#000000">

  <style>
    /* Classic Black & White Video Hub Styles */
    .channel-tabs {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 10px 0 16px;
      margin-bottom: 8px;
      scrollbar-width: none;
    }
    .channel-tabs::-webkit-scrollbar { display: none; }

    .channel-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 999px;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #a1a1aa;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .channel-btn:hover {
      border-color: rgba(255, 255, 255, 0.4);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .channel-btn.active {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
    }

    .subject-card {
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      margin-bottom: 16px;
      overflow: hidden;
      transition: all 0.2s ease;
    }
    .subject-card:hover {
      border-color: rgba(255, 255, 255, 0.35);
    }

    .card-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: #141417;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
      gap: 12px;
    }

    .card-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .card-subj-icon {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      background: #1c1c20;
      border: 1px solid rgba(255, 255, 255, 0.14);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .card-subj-details h2 {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 3px;
    }

    .card-meta-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge-channel {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      background: #27272a;
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #fafafa;
    }
    .badge-ah {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
      color: #ffffff;
    }
    .badge-ma {
      background: #18181b;
      border-color: rgba(255, 255, 255, 0.2);
      color: #e4e4e7;
    }

    .badge-code {
      font-size: 11px;
      color: #a1a1aa;
    }

    .card-actions-top {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-playlist {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 6px;
      background: #ffffff;
      color: #000000;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-playlist:hover {
      background: #e4e4e7;
      transform: translateY(-1px);
    }

    .btn-marathon {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 6px;
      background: #18181b;
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-marathon:hover {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
    }

    .units-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 10px;
      padding: 16px 20px 20px;
      background: #0d0d0f;
    }

    .unit-video-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px 14px;
      border-radius: 8px;
      background: #18181b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fafafa;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .unit-video-btn:hover {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      transform: translateY(-1px);
    }
    .unit-video-btn:hover .unit-tag {
      background: #000000;
      color: #ffffff;
    }
    .unit-video-btn:hover .watch-icon {
      color: #000000;
    }

    .unit-info {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .unit-tag {
      font-size: 10.5px;
      font-weight: 700;
      padding: 3px 6px;
      border-radius: 4px;
      background: #27272a;
      color: #e4e4e7;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .unit-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12.5px;
    }

    .watch-icon {
      font-size: 12px;
      color: #a1a1aa;
      margin-left: 8px;
      white-space: nowrap;
    }

    /* Modal Video Player */
    .video-modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .video-modal-backdrop.active {
      display: flex;
    }

    .video-modal-box {
      width: 100%;
      max-width: 900px;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
      display: flex;
      flex-direction: column;
    }

    .video-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      background: #18181b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .video-modal-title {
      font-size: 14.5px;
      font-weight: 600;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80%;
    }
    .video-modal-close {
      background: transparent;
      border: none;
      color: #a1a1aa;
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
    }
    .video-modal-close:hover {
      color: #ffffff;
    }

    .video-player-container {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
      background: #000000;
    }
    .video-player-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }

    .video-modal-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 18px;
      background: #141417;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
      gap: 10px;
    }

    .video-modal-yt-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 6px;
      background: #ffffff;
      color: #000000;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .video-modal-yt-btn:hover {
      background: #e4e4e7;
    }
  </style>
</head>
<body>

  <!-- Top Navigation Home Link -->
  <a href="/" id="gwcHomeBtn">← Home</a>

  <!-- Header Section -->
  <header class="hub-header">
    <span class="badge-pill">🎬 AKTU VIDEO LECTURES HUB</span>
    <h1>AKTU B.TECH VIDEO LECTURES</h1>
    <p class="hub-subtitle">
      Unit-wise One-Shot revision videos & complete subject playlists by <b>AH Tutorials</b> (@AHTUTORIALS2024), <b>MultiAtoms</b>, and <b>Gateway Classes</b>. Curated & maintained by <b>Shivansh</b>.
    </p>
    <div class="stats-row">
      <span class="stat-chip"><i class="fa fa-play-circle"></i> Unit 1 to 5 One-Shots</span>
      <span class="stat-chip"><i class="fab fa-youtube"></i> Full YouTube Playlists</span>
      <span class="stat-chip"><i class="fa fa-graduation-cap"></i> 28 Core Courses</span>
    </div>
  </header>

  <div class="main-wrap">

    <!-- Search Section -->
    <div class="search-filter-section">
      <div class="search-box-wrapper">
        <span class="search-icon"><i class="fa fa-search"></i></span>
        <input type="text" id="noteSearch" placeholder="Search subject, course code, unit, or channel (e.g. DAA, OS, Java, COA, AH Tutorials, MultiAtoms)..." autocomplete="off" />
        <button id="clearSearch" class="clear-btn" style="display:none;" title="Clear search">✕</button>
      </div>

      <!-- Channel Tabs Filter -->
      <div class="channel-tabs" id="channelTabs">
        <button class="channel-btn active" data-channel="all">🎬 All Channels (${lecturesData.courses.length})</button>
        <button class="channel-btn" data-channel="ah-tutorials">🔥 AH Tutorials (${lecturesData.courses.filter(c => c.channelId === 'ah-tutorials').length})</button>
        <button class="channel-btn" data-channel="multiatoms">⚛️ MultiAtoms (${lecturesData.courses.filter(c => c.channelId === 'multiatoms').length})</button>
      </div>

      <!-- Quick Subject Chips -->
      <div class="chips-container" id="subjectChips"></div>

      <div class="results-count" id="resultsCount">
        <span id="resultsText">Showing all video lectures</span>
        <button id="toggleAllBtn">Expand All</button>
      </div>
    </div>

    <!-- Video Courses List -->
    <div class="subjects-list" id="coursesList"></div>

    <div id="noResults" class="no-results" style="display:none; text-align:center; padding:40px 20px;">
      <span style="font-size:32px;">🎬</span>
      <p style="font-size:15px; font-weight:600; color:#fff; margin-top:8px;">No video lectures found!</p>
      <p style="font-size:13px; color:#a1a1aa;">Try searching with a different subject name, unit, or clear search filter.</p>
    </div>

  </div>

  <!-- In-Page YouTube Video Modal Player -->
  <div class="video-modal-backdrop" id="videoModal">
    <div class="video-modal-box">
      <div class="video-modal-header">
        <div class="video-modal-title" id="modalVideoTitle">Watch Video Lecture</div>
        <button class="video-modal-close" id="closeVideoModal" title="Close Video">✕</button>
      </div>
      <div class="video-player-container">
        <iframe id="videoIframe" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="video-modal-footer">
        <span style="font-size:12px; color:#a1a1aa;" id="modalVideoChannel">Channel: AH Tutorials</span>
        <a href="#" target="_blank" rel="noopener" class="video-modal-yt-btn" id="modalExternalYtBtn">
          <i class="fab fa-youtube"></i> Open on YouTube
        </a>
      </div>
    </div>
  </div>

  <!-- Support Footer -->
  <div class="support">
    <span>Created with ❤️ by <b>Shivansh</b></span>
    <a href="https://github.com/ShivanshSWE-cmd" target="_blank" rel="noopener">
      <i class="fab fa-github"></i> GitHub: @ShivanshSWE-cmd
    </a>
    <a href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener">
      <i class="fab fa-instagram"></i> Instagram: @Shiva._SWE
    </a>
  </div>

  <!-- Video Engine Client Logic -->
  <script>
    const database = ${JSON.stringify(lecturesData)};
    const courses = database.courses;

    const coursesListEl = document.getElementById('coursesList');
    const channelTabsEl = document.getElementById('channelTabs');
    const subjectChipsEl = document.getElementById('subjectChips');
    const searchInput = document.getElementById('noteSearch');
    const clearSearchBtn = document.getElementById('clearSearch');
    const noResultsEl = document.getElementById('noResults');
    const resultsText = document.getElementById('resultsText');
    const toggleAllBtn = document.getElementById('toggleAllBtn');

    // Video Modal Elements
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    const modalVideoTitle = document.getElementById('modalVideoTitle');
    const modalVideoChannel = document.getElementById('modalVideoChannel');
    const modalExternalYtBtn = document.getElementById('modalExternalYtBtn');
    const closeVideoModal = document.getElementById('closeVideoModal');

    let activeChannel = 'all';
    let searchQuery = '';
    let allExpanded = false;

    // Convert standard YouTube watch/playlist URL to embed URL
    function getEmbedUrl(url) {
      if (!url) return '';
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
      }
      if (url.includes('playlist?list=')) {
        const playlistId = url.split('list=')[1].split('&')[0];
        return 'https://www.youtube.com/embed/videoseries?list=' + playlistId + '&rel=0';
      }
      return url;
    }

    function openVideo(title, url, channelName) {
      if (!url) return;
      modalVideoTitle.textContent = title;
      modalVideoChannel.textContent = 'Provider: ' + channelName;
      modalExternalYtBtn.href = url;

      const embed = getEmbedUrl(url);
      if (embed && embed.includes('embed')) {
        videoIframe.src = embed;
        videoModal.classList.add('active');
      } else {
        window.open(url, '_blank', 'noopener');
      }
    }

    function closePlayer() {
      videoIframe.src = '';
      videoModal.classList.remove('active');
    }

    closeVideoModal.onclick = closePlayer;
    videoModal.onclick = (e) => {
      if (e.target === videoModal) closePlayer();
    };
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) closePlayer();
    });

    function initSubjectChips() {
      subjectChipsEl.innerHTML = '';
      const chips = [
        { label: 'All Subjects', q: '' },
        { label: 'DAA', q: 'DAA' },
        { label: 'Operating Systems', q: 'Operating' },
        { label: 'OOP Java', q: 'Java' },
        { label: 'COA', q: 'COA' },
        { label: 'DSTL', q: 'DSTL' },
        { label: 'DSA', q: 'Data Structures' },
        { label: 'Python', q: 'Python' },
        { label: 'DBMS', q: 'DBMS' },
        { label: 'Compiler Design', q: 'Compiler' },
        { label: 'Cyber Security', q: 'Cyber' },
        { label: 'Web Technology', q: 'Web' }
      ];

      chips.forEach((c, idx) => {
        const btn = document.createElement('button');
        btn.className = 'subject-chip' + (idx === 0 ? ' active' : '');
        btn.textContent = c.label;
        btn.onclick = () => {
          subjectChipsEl.querySelectorAll('.subject-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          searchInput.value = c.q;
          searchQuery = c.q.toLowerCase();
          clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
          filterCourses();
        };
        subjectChipsEl.appendChild(btn);
      });
    }

    function renderCourses() {
      coursesListEl.innerHTML = '';

      courses.forEach((c) => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.dataset.id = c.id;
        card.dataset.channel = c.channelId;
        card.dataset.search = (c.title + ' ' + c.code + ' ' + c.channelName + ' ' + (c.units ? c.units.map(u => u.title).join(' ') : '')).toLowerCase();

        const channelBadgeClass = c.channelId === 'ah-tutorials' ? 'badge-ah' : 'badge-ma';

        card.innerHTML = \`
          <div class="card-top-bar">
            <div class="card-title-group">
              <div class="card-subj-icon">\${c.icon || '🎬'}</div>
              <div class="card-subj-details">
                <h2>\${c.title}</h2>
                <div class="card-meta-tags">
                  <span class="badge-channel \${channelBadgeClass}">\${c.channelBadge || c.channelName}</span>
                  <span class="badge-code">\${c.code} • \${c.year || 'AKTU B.Tech'}</span>
                </div>
              </div>
            </div>
            <div class="card-actions-top">
              \${c.marathonUrl ? \`<a href="\${c.marathonUrl}" target="_blank" rel="noopener" class="btn-marathon" title="Watch Complete Syllabus Marathon"><i class="fa fa-bolt"></i> Full Marathon</a>\` : ''}
              <a href="\${c.playlistUrl}" target="_blank" rel="noopener" class="btn-playlist" title="Open Full YouTube Playlist">
                <i class="fab fa-youtube"></i> Full Playlist ➔
              </a>
            </div>
          </div>
          <div class="units-grid">
            \${(c.units || []).map(u => {
              const url = u.url || c.playlistUrl;
              return \`
                <div class="unit-video-btn" onclick="openVideo('\${c.title} - \${u.title}', '\${url}', '\${c.channelName}')">
                  <div class="unit-info">
                    <span class="unit-tag">\${u.unit}</span>
                    <span class="unit-name" title="\${u.title}">\${u.title}</span>
                  </div>
                  <span class="watch-icon">Watch ▶</span>
                </div>
              \`;
            }).join('')}
          </div>
        \`;

        coursesListEl.appendChild(card);
      });
    }

    function filterCourses() {
      let visibleCount = 0;
      const cards = coursesListEl.querySelectorAll('.subject-card');

      cards.forEach(card => {
        const matchesChannel = activeChannel === 'all' || card.dataset.channel === activeChannel;
        const matchesSearch = !searchQuery || card.dataset.search.includes(searchQuery);

        if (matchesChannel && matchesSearch) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCount === 0) {
        noResultsEl.style.display = 'block';
        resultsText.textContent = '0 video lectures found';
      } else {
        noResultsEl.style.display = 'none';
        resultsText.textContent = \`Showing \${visibleCount} course playlists with unit-wise one-shots\`;
      }
    }

    // Channel Tabs
    channelTabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.channel-btn');
      if (!btn) return;
      channelTabsEl.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeChannel = btn.dataset.channel;
      filterCourses();
    });

    // Search events
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
      filterCourses();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      filterCourses();
      searchInput.focus();
    });

    // Expand/Collapse
    toggleAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      document.querySelectorAll('.units-grid').forEach(g => {
        g.style.display = allExpanded ? 'none' : 'grid';
      });
      toggleAllBtn.textContent = allExpanded ? 'Show All Units' : 'Hide All Units';
    });

    // Initialize
    initSubjectChips();
    renderCourses();
    filterCourses();
  </script>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'lectindex.html'), htmlContent, 'utf-8');
console.log('✓ public/lectindex.html successfully updated with AH Tutorials and MultiAtoms unit-wise one-shots & playlists!');
