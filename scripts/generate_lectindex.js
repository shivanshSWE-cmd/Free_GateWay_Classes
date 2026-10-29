const fs = require('fs');
const path = require('path');

const lecturesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'lectures.json'), 'utf-8'));
const totalCourses = lecturesData.courses.length;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="referrer" content="no-referrer">
  <title>AKTU BTech Video Lectures Hub — All 4 Years & 8 Semesters (3 Channels)</title>
  <link rel="stylesheet" href="gwc-ui.css">
  <link rel="stylesheet" href="gwc-premium.css">
  <link rel="stylesheet" href="css/student-tracker.css">
  <link rel="icon" href="https://i.ibb.co/qYC69dyG/Chat-GPT-Image-Aug-6-2026-10-25-09-PM.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <meta name="description" content="Watch free AKTU B.Tech unit-wise one-shot revision video lectures and full course playlists by Gateway Classes, AH Tutorials, and MultiAtoms for all 4 years and 8 semesters.">
  <meta name="keywords" content="gateway classes aktu, ah tutorials aktu, multiatoms aktu, aktu one shot video, dsa one shot aktu, coa one shot aktu, dstl one shot aktu, daa one shot aktu, os one shot aktu, java one shot aktu, aktu 4th year video, aktu 3rd year video">
  <meta name="author" content="Shivansh (@ShivanshSWE-cmd)">
  <meta name="theme-color" content="#070b14">

  <style>
    /* Classic Dark Video Hub Styles */
    .filter-group-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .filter-label-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }

    .pills-scroll-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .pills-scroll-row::-webkit-scrollbar { display: none; }

    .filter-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 15px;
      border-radius: 999px;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #94a3b8;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      user-select: none;
    }
    .filter-pill-btn:hover {
      border-color: rgba(245, 158, 11, 0.5);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .filter-pill-btn.active {
      background: #f59e0b;
      color: #070b14;
      border-color: #f59e0b;
      font-weight: 700;
      box-shadow: 0 2px 10px rgba(245, 158, 11, 0.35);
    }

    .subject-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      margin-bottom: 18px;
      overflow: hidden;
      transition: all 0.25s ease;
    }
    .subject-card:hover {
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .card-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: #141c30;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
      gap: 12px;
    }

    .card-title-group {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
      min-width: 250px;
    }

    .card-subj-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: #1c2744;
      border: 1px solid rgba(245, 158, 11, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    .card-subj-details h2 {
      font-size: 16.5px;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 4px;
      line-height: 1.3;
    }

    .card-meta-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge-sem {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
    }

    .badge-code {
      font-size: 11px;
      color: #94a3b8;
    }

    /* 3 Channel Buttons Row inside Card Header */
    .channels-action-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-channel-playlist {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-channel-gateway {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24;
    }
    .btn-channel-gateway:hover {
      background: #f59e0b;
      color: #070b14;
    }
    .btn-channel-ah {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
    .btn-channel-ah:hover {
      background: #ef4444;
      color: #ffffff;
    }
    .btn-channel-ma {
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(14, 165, 233, 0.4);
      color: #7dd3fc;
    }
    .btn-channel-ma:hover {
      background: #0ea5e9;
      color: #ffffff;
    }

    .btn-marathon {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 11px;
      border-radius: 6px;
      background: #18181b;
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      font-size: 11.5px;
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
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
      padding: 16px 20px 20px;
      background: #090e1a;
    }

    .unit-video-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px 14px;
      border-radius: 8px;
      background: #131b2e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f8fafc;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    .unit-video-btn:hover {
      background: #1c2744;
      border-color: #f59e0b;
      transform: translateY(-1px);
    }
    .unit-video-btn:hover .unit-tag {
      background: #f59e0b;
      color: #070b14;
    }
    .unit-video-btn:hover .watch-icon {
      color: #f59e0b;
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
      background: #1e293b;
      color: #e2e8f0;
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
      color: #94a3b8;
      margin-left: 8px;
      white-space: nowrap;
    }

    /* Modal Video Player */
    .video-modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.88);
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
      background: #0f172a;
      border: 1px solid rgba(245, 158, 11, 0.35);
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
      background: #141c30;
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
      color: #94a3b8;
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
      padding: 12px 18px;
      background: #141c30;
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
      background: #f59e0b;
      color: #070b14;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .video-modal-yt-btn:hover {
      background: #fbbf24;
    }

    @media (max-width: 640px) {
      .units-grid {
        grid-template-columns: 1fr;
        padding: 12px;
      }
      .card-top-bar {
        padding: 12px 14px;
      }
    }
  </style>
</head>
<body>

  <!-- Top Navigation Home Link -->
  <a href="index.html" id="gwcHomeBtn">← Home</a>

  <!-- Header Section -->
  <header class="hub-header">
    <span class="badge-pill">🎬 ALL 4 YEARS & 8 SEMESTERS • 3 CHANNELS</span>
    <h1>AKTU B.TECH VIDEO LECTURES</h1>
    <p class="hub-subtitle">
      Unit-wise One-Shot revision videos & complete subject playlists by <b>Gateway Classes</b> (@GatewayClasses), <b>AH Tutorials</b> (@AHTUTORIALS2024), and <b>MultiAtoms</b> (@MultiAtoms). Curated & maintained by <b>Shivansh</b>.
    </p>
    <div class="stats-row">
      <span class="stat-chip"><i class="fa fa-layer-group"></i> All 8 Semesters</span>
      <span class="stat-chip"><i class="fab fa-youtube"></i> Gateway Classes</span>
      <span class="stat-chip"><i class="fab fa-youtube"></i> AH Tutorials</span>
      <span class="stat-chip"><i class="fab fa-youtube"></i> MultiAtoms</span>
      <span class="stat-chip"><i class="fa fa-graduation-cap"></i> ${totalCourses} Core Courses</span>
    </div>
  </header>

  <div class="main-wrap">

    <!-- Search & Filters Section -->
    <div class="search-filter-section">
      <div class="search-box-wrapper">
        <span class="search-icon"><i class="fa fa-search"></i></span>
        <input type="text" id="noteSearch" placeholder="Search any course, unit, code, or channel (e.g. AI, Deep Learning, DAA, OS, Cloud, BEE, Java)..." autocomplete="off" />
        <button id="clearSearch" class="clear-btn" style="display:none;" title="Clear search">✕</button>
      </div>

      <div class="filter-group-wrap">
        <!-- 1. Channel Filter Tabs (All 3 Channels have playlists for all subjects) -->
        <div class="filter-label-row"><i class="fab fa-youtube"></i> Filter by Channel:</div>
        <div class="pills-scroll-row" id="channelTabs">
          <button class="filter-pill-btn active" data-channel="all">🎬 All Channels (${totalCourses})</button>
          <button class="filter-pill-btn" data-channel="gateway">⚡ Gateway Classes (${totalCourses})</button>
          <button class="filter-pill-btn" data-channel="ah">🔥 AH Tutorials (${totalCourses})</button>
          <button class="filter-pill-btn" data-channel="multiatoms">⚛️ MultiAtoms (${totalCourses})</button>
        </div>

        <!-- 2. Year Filter -->
        <div class="filter-label-row"><i class="fa fa-calendar-alt"></i> Filter by Year:</div>
        <div class="pills-scroll-row" id="yearTabs">
          <button class="filter-pill-btn active" data-year="all">🎓 All Years (${totalCourses})</button>
          <button class="filter-pill-btn" data-year="1st Year">1st Year (${lecturesData.courses.filter(c => c.year === '1st Year').length})</button>
          <button class="filter-pill-btn" data-year="2nd Year">2nd Year (${lecturesData.courses.filter(c => c.year === '2nd Year').length})</button>
          <button class="filter-pill-btn" data-year="3rd Year">3rd Year (${lecturesData.courses.filter(c => c.year === '3rd Year').length})</button>
          <button class="filter-pill-btn" data-year="4th Year">4th Year (${lecturesData.courses.filter(c => c.year === '4th Year').length})</button>
        </div>

        <!-- 3. Semester Filter -->
        <div class="filter-label-row"><i class="fa fa-clock"></i> Filter by Semester:</div>
        <div class="pills-scroll-row" id="semTabs">
          <button class="filter-pill-btn active" data-sem="all">All Semesters</button>
          <button class="filter-pill-btn" data-sem="1">Sem 1</button>
          <button class="filter-pill-btn" data-sem="2">Sem 2</button>
          <button class="filter-pill-btn" data-sem="3">Sem 3</button>
          <button class="filter-pill-btn" data-sem="4">Sem 4</button>
          <button class="filter-pill-btn" data-sem="5">Sem 5</button>
          <button class="filter-pill-btn" data-sem="6">Sem 6</button>
          <button class="filter-pill-btn" data-sem="7">Sem 7</button>
          <button class="filter-pill-btn" data-sem="8">Sem 8</button>
        </div>
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
      <p style="font-size:13px; color:#a1a1aa;">Try searching with a different subject name, unit, or clear filters.</p>
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
        <span style="font-size:12px; color:#cbd5e1;" id="modalVideoChannel">Channel: Gateway Classes</span>
        <a href="#" target="_blank" rel="noopener" class="video-modal-yt-btn" id="modalExternalYtBtn">
          <i class="fab fa-youtube"></i> Open on YouTube ↗
        </a>
      </div>
    </div>
  </div>

  <!-- Support Footer -->
  <div class="support">
    <span>Created with ❤️ by <b>Shivansh</b></span> &bull;
    <a href="https://github.com/ShivanshSWE-cmd" target="_blank" rel="noopener">
      <i class="fab fa-github"></i> GitHub: @ShivanshSWE-cmd
    </a> &bull;
    <a href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener">
      <i class="fab fa-instagram"></i> Instagram: @Shiva._SWE
    </a>
  </div>

  <!-- Video Engine Client Logic -->
  <script>
    const database = ${JSON.stringify(lecturesData)};
    const courses = database.courses;

    const coursesListEl = document.getElementById('coursesList');
    const yearTabsEl = document.getElementById('yearTabs');
    const semTabsEl = document.getElementById('semTabs');
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

    let activeYear = 'all';
    let activeSem = 'all';
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
        { label: '🤖 AI', q: 'Artificial Intelligence' },
        { label: '🧠 Deep Learning', q: 'Deep Learning' },
        { label: '☁️ Cloud', q: 'Cloud Computing' },
        { label: '🔗 Blockchain', q: 'Blockchain' },
        { label: '🌐 Web Tech', q: 'Web Tech' },
        { label: '💻 DAA', q: 'DAA' },
        { label: '⚡ BEE', q: 'Electrical' },
        { label: '🔢 Maths 1/2', q: 'Mathematics' },
        { label: '🖥️ OS', q: 'Operating' },
        { label: '☕ Java', q: 'Java' },
        { label: '🏗️ DSA', q: 'Data Structures' },
        { label: '🖧 Networks', q: 'Networks' },
        { label: '🛡️ Cyber', q: 'Cyber' }
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
        card.dataset.year = c.year;
        card.dataset.sem = String(c.semester || '');
        card.dataset.search = (c.title + ' ' + c.code + ' sem' + c.semester + ' ' + c.year + ' ' + (c.units ? c.units.map(u => u.title).join(' ') : '')).toLowerCase();

        const pGateway = (c.playlists && c.playlists.gateway) || 'https://www.youtube.com/@GatewayClasses/search?query=' + encodeURIComponent(c.title + ' AKTU One Shot');
        const pAh = (c.playlists && c.playlists.ah) || 'https://www.youtube.com/@AHTUTORIALS2024/search?query=' + encodeURIComponent(c.title + ' AKTU One Shot');
        const pMa = (c.playlists && c.playlists.multiatoms) || 'https://www.youtube.com/@MultiAtoms/search?query=' + encodeURIComponent(c.title + ' AKTU One Shot');

        card.innerHTML = \`
          <div class="card-top-bar">
            <div class="card-title-group">
              <div class="card-subj-icon">\${c.icon || '🎬'}</div>
              <div class="card-subj-details">
                <h2>\${c.title}</h2>
                <div class="card-meta-tags">
                  <span class="badge-sem">Semester \${c.semester}</span>
                  <span class="badge-code">\${c.code} • \${c.year}</span>
                </div>
              </div>
            </div>
            <div class="channels-action-row">
              <a href="\${pGateway}" target="_blank" rel="noopener" class="btn-channel-playlist btn-channel-gateway" title="Gateway Classes Playlist">
                <i class="fab fa-youtube"></i> ⚡ Gateway Classes
              </a>
              <a href="\${pAh}" target="_blank" rel="noopener" class="btn-channel-playlist btn-channel-ah" title="AH Tutorials Playlist">
                <i class="fab fa-youtube"></i> 🔥 AH Tutorials
              </a>
              <a href="\${pMa}" target="_blank" rel="noopener" class="btn-channel-playlist btn-channel-ma" title="MultiAtoms Playlist">
                <i class="fab fa-youtube"></i> ⚛️ MultiAtoms
              </a>
              \${c.marathonUrl ? \`<a href="\${c.marathonUrl}" target="_blank" rel="noopener" class="btn-marathon" title="Watch Complete Syllabus Marathon"><i class="fa fa-bolt"></i> Full Marathon</a>\` : ''}
            </div>
          </div>
          <div class="units-grid">
            \${(c.units || []).map(u => {
              const url = u.url || pGateway;
              return \`
                <div class="unit-video-btn" onclick="openVideo('\${c.title.replace(/'/g, "\\\\\\'")} - \${u.title.replace(/'/g, "\\\\\\'")} ', '\${url}', 'Gateway Classes / AH / MultiAtoms')">
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
        const matchesYear = activeYear === 'all' || card.dataset.year === activeYear;
        const matchesSem = activeSem === 'all' || card.dataset.sem === activeSem;
        const matchesSearch = !searchQuery || card.dataset.search.includes(searchQuery);

        if (matchesYear && matchesSem && matchesSearch) {
          card.style.display = 'block';
          visibleCount++;

          // Highlight selected channel playlist button if specific channel tab is active
          const btnGwc = card.querySelector('.btn-channel-gateway');
          const btnAh = card.querySelector('.btn-channel-ah');
          const btnMa = card.querySelector('.btn-channel-ma');

          if (btnGwc && btnAh && btnMa) {
            btnGwc.style.opacity = (activeChannel === 'all' || activeChannel === 'gateway') ? '1' : '0.4';
            btnAh.style.opacity = (activeChannel === 'all' || activeChannel === 'ah') ? '1' : '0.4';
            btnMa.style.opacity = (activeChannel === 'all' || activeChannel === 'multiatoms') ? '1' : '0.4';

            if (activeChannel === 'gateway') btnGwc.style.fontWeight = '800';
            if (activeChannel === 'ah') btnAh.style.fontWeight = '800';
            if (activeChannel === 'multiatoms') btnMa.style.fontWeight = '800';
          }

        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCount === 0) {
        noResultsEl.style.display = 'block';
        resultsText.textContent = '0 video lectures found';
      } else {
        noResultsEl.style.display = 'none';
        resultsText.textContent = \`Showing \${visibleCount} course playlists with unit-wise one-shots (all 3 channels available)\`;
      }
    }

    // Channel Tabs
    channelTabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill-btn');
      if (!btn) return;
      channelTabsEl.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeChannel = btn.dataset.channel;
      filterCourses();
    });

    // Year Tabs
    yearTabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill-btn');
      if (!btn) return;
      yearTabsEl.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeYear = btn.dataset.year;
      filterCourses();
    });

    // Sem Tabs
    semTabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill-btn');
      if (!btn) return;
      semTabsEl.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSem = btn.dataset.sem;
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

  <script src="site-ads.js"></script>
  <script src="js/student-tracker.js"></script>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'lectindex.html'), htmlContent, 'utf-8');
console.log(`✓ public/lectindex.html successfully updated with ALL 3 CHANNELS playlists for all ${totalCourses} courses across all 8 semesters!`);
