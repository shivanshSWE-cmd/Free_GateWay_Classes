/**
 * GATEWAY CLASSES — STUDENT STUDY TRACKER & ANDROID APP HUB (SAFE & NON-DESTRUCTIVE)
 * Author: Shivansh (@ShivanshSWE-cmd)
 * 
 * Features:
 * 1. Unit completion tracking persisted in localStorage.
 * 2. Floating tracker badge & full modal dashboard.
 * 3. Discreet top navbar APK download button modal.
 * 4. Safe external link intent handler for mobile & Android APK.
 * 5. ZERO DOM layout destruction — no infinite mutation observers.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gwc_unit_completion_data';

  function getStorageData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setStorageData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function isUnitCompleted(unitId) {
    const data = getStorageData();
    return Boolean(data[unitId] && data[unitId].completed);
  }

  function toggleUnitCompletion(unitId, meta) {
    const data = getStorageData();
    const currentlyDone = Boolean(data[unitId] && data[unitId].completed);
    const newStatus = !currentlyDone;

    if (newStatus) {
      data[unitId] = {
        completed: true,
        timestamp: Date.now(),
        title: (meta && meta.title) || unitId,
        subject: (meta && meta.subject) || 'General',
        page: window.location.pathname
      };
    } else {
      delete data[unitId];
    }

    setStorageData(data);
    return newStatus;
  }

  function getCompletedCount() {
    const data = getStorageData();
    return Object.keys(data).filter(k => data[k] && data[k].completed).length;
  }

  // Toast Notification
  let toastTimeout = null;
  function showToast(message, isSuccess = true) {
    let toast = document.getElementById('gwcTrackerToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gwcTrackerToast';
      toast.className = 'gwc-toast';
      document.body.appendChild(toast);
    }

    toast.className = 'gwc-toast ' + (isSuccess ? 'success' : '');
    toast.innerHTML = `<i class="fa ${isSuccess ? 'fa-check-circle' : 'fa-info-circle'}"></i> <span>${message}</span>`;
    setTimeout(() => toast.classList.add('show'), 10);

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  window.showToast = showToast;

  function makeUnitKey(subject, rawTitle) {
    const cleanSub = String(subject || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const cleanTitle = String(rawTitle || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return `u_${cleanSub}__${cleanTitle}`.replace(/_+/g, '_');
  }

  // Attach Checkmarks Safely Inside Existing Links (Zero layout alteration)
  function attachTrackers() {
    // 1. Regular Note Cards (.note-card-link)
    const noteLinks = document.querySelectorAll('.note-card-link');
    noteLinks.forEach(link => {
      if (link.dataset.trackerReady) return;
      link.dataset.trackerReady = 'true';

      const card = link.closest('.subject-card');
      const subName = (card && (card.dataset.subject || card.querySelector('h2')?.textContent)) || 'Subject';
      const noteName = link.querySelector('.note-name')?.textContent || link.textContent.trim();
      const unitKey = makeUnitKey(subName, noteName);

      const checkBtn = document.createElement('span');
      checkBtn.className = 'unit-check-pill';
      checkBtn.title = 'Mark note as completed';

      const isDone = isUnitCompleted(unitKey);
      if (isDone) {
        checkBtn.classList.add('done');
        link.classList.add('unit-done');
        checkBtn.innerHTML = '✓ Done';
      } else {
        checkBtn.innerHTML = '○ Done?';
      }

      checkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = toggleUnitCompletion(unitKey, {
          title: noteName,
          subject: subName
        });

        if (newState) {
          checkBtn.classList.add('done');
          link.classList.add('unit-done');
          checkBtn.innerHTML = '✓ Done';
          showToast(`Completed: ${noteName.slice(0, 26)}...`, true);
        } else {
          checkBtn.classList.remove('done');
          link.classList.remove('unit-done');
          checkBtn.innerHTML = '○ Done?';
          showToast(`Unmarked: ${noteName.slice(0, 26)}...`, false);
        }

        updateFloatingBadge();
      });

      // Insert inside the badge area or at the end
      const badge = link.querySelector('.note-open-badge');
      if (badge) {
        link.insertBefore(checkBtn, badge);
      } else {
        link.appendChild(checkBtn);
      }
    });

    // 2. Video Lecture Buttons (.unit-video-btn)
    const videoBtns = document.querySelectorAll('.unit-video-btn');
    videoBtns.forEach(btn => {
      if (btn.dataset.trackerReady) return;
      btn.dataset.trackerReady = 'true';

      const card = btn.closest('.subject-card');
      const subName = (card && card.querySelector('h2')?.textContent) || 'Course';
      const uTag = btn.querySelector('.unit-tag')?.textContent || '';
      const uTitle = btn.querySelector('.unit-name')?.textContent || '';
      const unitKey = makeUnitKey(subName, `${uTag} ${uTitle}`);

      const checkBtn = document.createElement('span');
      checkBtn.className = 'unit-check-pill';
      checkBtn.title = 'Mark lecture as watched';

      const isDone = isUnitCompleted(unitKey);
      if (isDone) {
        checkBtn.classList.add('done');
        btn.classList.add('unit-done');
        checkBtn.innerHTML = '✓ Watched';
      } else {
        checkBtn.innerHTML = '○ Done?';
      }

      checkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = toggleUnitCompletion(unitKey, {
          title: `${uTag}: ${uTitle}`,
          subject: subName
        });

        if (newState) {
          checkBtn.classList.add('done');
          btn.classList.add('unit-done');
          checkBtn.innerHTML = '✓ Watched';
          showToast(`Watched: ${uTag}`, true);
        } else {
          checkBtn.classList.remove('done');
          btn.classList.remove('unit-done');
          checkBtn.innerHTML = '○ Done?';
          showToast(`Unmarked: ${uTag}`, false);
        }

        updateFloatingBadge();
      });

      const watchIcon = btn.querySelector('.watch-icon');
      if (watchIcon) {
        btn.insertBefore(checkBtn, watchIcon);
      } else {
        btn.appendChild(checkBtn);
      }
    });

    // 3. 4th Year Hub (a.note)
    const year4Notes = document.querySelectorAll('a.note');
    year4Notes.forEach(link => {
      if (link.dataset.trackerReady) return;
      link.dataset.trackerReady = 'true';

      const details = link.closest('details.subject');
      const subName = (details && details.querySelector('summary span')?.textContent) || '4th Year';
      const noteName = link.querySelector('.note-title')?.textContent || link.textContent.trim();
      const unitKey = makeUnitKey(subName, noteName);

      const checkBtn = document.createElement('span');
      checkBtn.className = 'unit-check-pill';
      checkBtn.title = 'Mark note as completed';

      const isDone = isUnitCompleted(unitKey);
      if (isDone) {
        checkBtn.classList.add('done');
        link.classList.add('unit-done');
        checkBtn.innerHTML = '✓ Done';
      } else {
        checkBtn.innerHTML = '○ Done?';
      }

      checkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = toggleUnitCompletion(unitKey, {
          title: noteName,
          subject: subName
        });

        if (newState) {
          checkBtn.classList.add('done');
          link.classList.add('unit-done');
          checkBtn.innerHTML = '✓ Done';
          showToast(`Completed: ${noteName.slice(0, 26)}...`, true);
        } else {
          checkBtn.classList.remove('done');
          link.classList.remove('unit-done');
          checkBtn.innerHTML = '○ Done?';
          showToast(`Unmarked: ${noteName.slice(0, 26)}...`, false);
        }

        updateFloatingBadge();
      });

      const dlSpan = link.querySelector('.download');
      if (dlSpan) {
        link.insertBefore(checkBtn, dlSpan);
      } else {
        link.appendChild(checkBtn);
      }
    });
  }

  // Floating Tracker Button
  function ensureFloatingButton() {
    let btn = document.getElementById('gwcFloatingTrackerBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'gwcFloatingTrackerBtn';
      btn.className = 'gwc-floating-tracker';
      btn.type = 'button';
      btn.title = 'Open Study Tracker';
      btn.innerHTML = `<span class="tracker-icon">🎯</span> <span class="tracker-count" id="trackerFloatingCount">0</span>`;
      btn.onclick = openTrackerModal;
      document.body.appendChild(btn);
    }
    updateFloatingBadge();
  }

  function updateFloatingBadge() {
    const count = getCompletedCount();
    const countEl = document.getElementById('trackerFloatingCount');
    if (countEl) countEl.textContent = count;
  }

  // Study Tracker Dashboard Modal
  function ensureTrackerModal() {
    let modal = document.getElementById('gwcTrackerModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gwcTrackerModal';
      modal.className = 'gwc-modal-backdrop';
      modal.innerHTML = `
        <div class="gwc-modal-box">
          <div class="gwc-modal-header">
            <div class="gwc-modal-title"><span style="font-size:20px;">🎯</span> My Study Tracker</div>
            <button type="button" class="gwc-modal-close" onclick="window.closeGwcTracker()">✕</button>
          </div>
          <div class="gwc-modal-body" id="trackerModalBody">
            <!-- Dynamic content -->
          </div>
        </div>
      `;
      modal.onclick = (e) => {
        if (e.target === modal) closeTrackerModal();
      };
      document.body.appendChild(modal);
    }
  }

  function openTrackerModal() {
    ensureTrackerModal();
    renderTrackerDashboard();
    const modal = document.getElementById('gwcTrackerModal');
    if (modal) modal.classList.add('active');
  }

  function closeTrackerModal() {
    const modal = document.getElementById('gwcTrackerModal');
    if (modal) modal.classList.remove('active');
  }

  window.openGwcTracker = openTrackerModal;
  window.closeGwcTracker = closeTrackerModal;

  function renderTrackerDashboard() {
    const body = document.getElementById('trackerModalBody');
    if (!body) return;

    const data = getStorageData();
    const keys = Object.keys(data).filter(k => data[k] && data[k].completed);
    const count = keys.length;

    if (count === 0) {
      body.innerHTML = `
        <div style="text-align:center; padding:30px 10px;">
          <span style="font-size:40px;">📚</span>
          <h3 style="color:#ffffff; margin:10px 0 6px;">No Units Completed Yet</h3>
          <p style="color:#94a3b8; font-size:13px; max-width:320px; margin:0 auto 16px;">
            Tap the <span style="background:rgba(245,158,11,0.2);color:#f59e0b;padding:2px 6px;border-radius:4px;font-weight:600;">○ Done?</span> button on any note or video to track your exam prep!
          </p>
        </div>
      `;
      return;
    }

    let itemsHtml = keys.map(k => {
      const item = data[k];
      const d = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '';
      return `
        <div class="tracker-item-row">
          <div class="tracker-item-info">
            <span class="tracker-item-sub">${item.subject || 'General'}</span>
            <div class="tracker-item-name">${item.title || k}</div>
          </div>
          <span class="tracker-item-date">${d}</span>
        </div>
      `;
    }).join('');

    body.innerHTML = `
      <div class="tracker-stats-card">
        <div class="tracker-stat-num">${count}</div>
        <div class="tracker-stat-label">Total Units / Notes Completed</div>
      </div>
      <div style="font-size:13px; font-weight:700; color:#cbd5e1; margin:16px 0 8px;">Completed Items (${count}):</div>
      <div class="tracker-items-list">${itemsHtml}</div>
      <div style="text-align:right; margin-top:16px;">
        <button type="button" class="btn-tracker-reset" id="btnResetTracker">Reset Progress</button>
      </div>
    `;

    document.getElementById('btnResetTracker')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all your completed units?')) {
        localStorage.removeItem(STORAGE_KEY);
        document.querySelectorAll('.unit-check-pill').forEach(b => {
          b.classList.remove('done');
          b.innerHTML = '○ Done?';
        });
        document.querySelectorAll('.unit-done').forEach(el => el.classList.remove('unit-done'));
        updateFloatingBadge();
        renderTrackerDashboard();
        showToast('Study progress reset.', false);
      }
    });
  }

  // APK Download Modal (Clean & Discreet)
  function ensureApkModal() {
    let modal = document.getElementById('gwcApkModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gwcApkModal';
      modal.className = 'gwc-modal-backdrop';
      modal.innerHTML = `
        <div class="gwc-modal-box">
          <div class="gwc-modal-header">
            <div class="gwc-modal-title"><i class="fab fa-android" style="color:#10b981;"></i> Gateway Classes Android App</div>
            <button type="button" class="gwc-modal-close" onclick="window.closeApkModal()">✕</button>
          </div>
          <div class="gwc-modal-body" style="padding:20px;">
            <p style="font-size:13.5px; color:#cbd5e1; line-height:1.5; margin-bottom:16px;">
              Get instant offline access to all AKTU B.Tech 1st to 4th Year Notes, PYQ question papers, and unit-wise video lectures on your phone.
            </p>
            <div class="apk-download-card">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="font-size:32px;">📱</div>
                <div>
                  <div style="color:#ffffff; font-weight:700; font-size:14.5px;">GatewayClasses-AKTU-v2.0.apk</div>
                  <div style="color:#94a3b8; font-size:12px;">Android 7.0+ • 100% Free • Offline Ready</div>
                </div>
              </div>
              <a href="downloads/GatewayClasses-AKTU-Notes-v2.0.apk" download class="btn-apk-dl">
                <i class="fa fa-download"></i> Download APK
              </a>
            </div>
            <div style="font-size:12px; color:#64748b; margin-top:14px; line-height:1.4;">
              💡 <b>Note:</b> If prompted with "File might be harmful", tap <b>Download anyway</b>. The APK is built directly with Capacitor for your student circle.
            </div>
          </div>
        </div>
      `;
      modal.onclick = (e) => {
        if (e.target === modal) closeApkModal();
      };
      document.body.appendChild(modal);
    }
  }

  function openApkModal() {
    ensureApkModal();
    const modal = document.getElementById('gwcApkModal');
    if (modal) modal.classList.add('active');
  }

  function closeApkModal() {
    const modal = document.getElementById('gwcApkModal');
    if (modal) modal.classList.remove('active');
  }

  window.openApkModal = openApkModal;
  window.closeApkModal = closeApkModal;

  // External Download Interceptor (Ensures mobile browsers & Capacitor dispatch downloads)
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link || !link.href) return;
    const href = link.href;

    const isDownloadUrl = href.includes('mediafire.com') ||
                          href.includes('drive.google.com') ||
                          href.includes('classplus.co') ||
                          href.endsWith('.pdf');

    if (isDownloadUrl) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
  }, true);

  // Initialize cleanly on DOM load
  function init() {
    attachTrackers();
    ensureFloatingButton();

    // Re-check for lazily rendered items after short delays
    setTimeout(attachTrackers, 300);
    setTimeout(attachTrackers, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
