/**
 * GATEWAY CLASSES — STUDENT UNIT COMPLETION TRACKER
 * Official Gateway Classes Student Study Tracker
 * Author: Shivansh (@ShivanshSWE-cmd)
 * 
 * Tracks unit-wise progress across 1st, 2nd, 3rd, 4th Year Notes & Video Lectures.
 * Persists in localStorage, provides subject progress bars, floating stats, and dashboard modal.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gwc_unit_completion_data';

  // ── Storage Helpers ──────────────────────────────────────────
  function getStorageData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('GWC Tracker: localStorage read error', e);
      return {};
    }
  }

  function setStorageData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('GWC Tracker: localStorage save error', e);
    }
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

  function resetAllTrackerData() {
    if (confirm('Are you sure you want to reset all your completed units and progress? This cannot be undone.')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      showToast('Study progress has been reset.', false);
      updateAllUI();
      // If modal is open, re-render
      const modal = document.getElementById('trackerModalBackdrop');
      if (modal && modal.classList.contains('active')) {
        renderModalContent();
      }
    }
  }

  // ── Toast Notification ───────────────────────────────────────
  let toastTimeout = null;
  function showToast(message, isSuccess = true) {
    let toast = document.getElementById('gwcTrackerToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gwcTrackerToast';
      toast.className = 'gwc-toast';
      document.body.appendChild(toast);
    }

    const icon = isSuccess ? 'fa-check-circle' : 'fa-info-circle';
    toast.className = 'gwc-toast ' + (isSuccess ? 'success' : '');
    toast.innerHTML = `<i class="fa ${icon} toast-icon"></i> <span>${message}</span>`;
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ── Slugify / Unique ID Generator ────────────────────────────
  function makeUnitKey(subject, rawTitle, extra = '') {
    const cleanSub = String(subject || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const cleanTitle = String(rawTitle || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const cleanExtra = String(extra || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return `u_${cleanSub}__${cleanExtra}__${cleanTitle}`.replace(/_+/g, '_');
  }

  // ── Identify Units in Common Note Pages ──────────────────────
  function attachTrackersToNoteCards() {
    // 1. Regular Hub Cards (.note-card-link) in 1year, 2ndyear, 3year, multiatom
    const noteLinks = document.querySelectorAll('.note-card-link');
    noteLinks.forEach(link => {
      if (link.dataset.trackerAttached) return;
      link.dataset.trackerAttached = 'true';

      const card = link.closest('.subject-card');
      const subName = (card && (card.dataset.subject || card.querySelector('h2')?.textContent)) || 'Subject';
      const noteName = link.querySelector('.note-name')?.textContent || link.textContent.trim();
      const group = link.dataset.group || '';
      const unitKey = makeUnitKey(subName, noteName, group);

      // Create checkbox button
      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'unit-check-btn';
      checkBtn.title = 'Mark this unit / file as completed';

      const isDone = isUnitCompleted(unitKey);
      if (isDone) {
        checkBtn.classList.add('completed');
        link.classList.add('unit-done');
        checkBtn.innerHTML = '<i class="fa fa-check"></i> <span>Done</span>';
      } else {
        checkBtn.innerHTML = '<i class="far fa-circle"></i> <span>Done?</span>';
      }

      checkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = toggleUnitCompletion(unitKey, {
          title: noteName,
          subject: subName
        });

        if (newState) {
          checkBtn.classList.add('completed');
          link.classList.add('unit-done');
          checkBtn.innerHTML = '<i class="fa fa-check"></i> <span>Done</span>';
          showToast(`Marked "${noteName.slice(0, 30)}" as completed! 🎉`, true);
        } else {
          checkBtn.classList.remove('completed');
          link.classList.remove('unit-done');
          checkBtn.innerHTML = '<i class="far fa-circle"></i> <span>Done?</span>';
          showToast(`Unmarked "${noteName.slice(0, 30)}"`, false);
        }

        updateAllUI();
      });

      // Insert button right before the open badge or at the end
      const openBadge = link.querySelector('.note-open-badge');
      if (openBadge) {
        link.insertBefore(checkBtn, openBadge);
      } else {
        link.appendChild(checkBtn);
      }
    });

    // 2. Video Lecture Hub (.unit-video-btn) in lectindex.html
    const videoBtns = document.querySelectorAll('.unit-video-btn');
    videoBtns.forEach(btn => {
      if (btn.dataset.trackerAttached) return;
      btn.dataset.trackerAttached = 'true';

      const card = btn.closest('.subject-card');
      const subName = (card && card.querySelector('.subject-title')?.textContent) || 'Lecture';
      const uTag = btn.querySelector('.unit-tag')?.textContent || '';
      const uTitle = btn.querySelector('.unit-name')?.textContent || '';
      const unitKey = makeUnitKey(subName, `${uTag} ${uTitle}`);

      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'unit-check-btn';
      checkBtn.title = 'Mark this video lecture as watched / completed';

      const isDone = isUnitCompleted(unitKey);
      if (isDone) {
        checkBtn.classList.add('completed');
        btn.classList.add('unit-done');
        checkBtn.innerHTML = '<i class="fa fa-check"></i> <span>Done</span>';
      } else {
        checkBtn.innerHTML = '<i class="far fa-circle"></i> <span>Done?</span>';
      }

      checkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = toggleUnitCompletion(unitKey, {
          title: `${uTag}: ${uTitle}`,
          subject: subName
        });

        if (newState) {
          checkBtn.classList.add('completed');
          btn.classList.add('unit-done');
          checkBtn.innerHTML = '<i class="fa fa-check"></i> <span>Done</span>';
          showToast(`Marked "${uTag}" as completed! 🎉`, true);
        } else {
          checkBtn.classList.remove('completed');
          btn.classList.remove('unit-done');
          checkBtn.innerHTML = '<i class="far fa-circle"></i> <span>Done?</span>';
          showToast(`Unmarked "${uTag}"`, false);
        }

        updateAllUI();
      });

      const watchIcon = btn.querySelector('.watch-icon');
      if (watchIcon) {
        btn.insertBefore(checkBtn, watchIcon);
      } else {
        btn.appendChild(checkBtn);
      }
    });

    // 3. 4th Year Hub (.note) in 4year.html
    const year4Notes = document.querySelectorAll('a.note');
    year4Notes.forEach(link => {
      if (link.dataset.trackerAttached) return;
      link.dataset.trackerAttached = 'true';

      const details = link.closest('details.subject');
      const subName = (details && details.querySelector('summary span')?.textContent) || '4th Year';
      const noteName = link.querySelector('.note-title')?.textContent || link.textContent.trim();
      const unitKey = makeUnitKey(subName, noteName);

      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'unit-check-btn';
      checkBtn.title = 'Mark this note as studied';

      const isDone = isUnitCompleted(unitKey);
      if (isDone) {
        checkBtn.classList.add('completed');
        link.classList.add('unit-done');
        checkBtn.innerHTML = '<i class="fa fa-check"></i> <span>Done</span>';
      } else {
        checkBtn.innerHTML = '<i class="far fa-circle"></i> <span>Done?</span>';
      }

      checkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newState = toggleUnitCompletion(unitKey, {
          title: noteName,
          subject: subName
        });

        if (newState) {
          checkBtn.classList.add('completed');
          link.classList.add('unit-done');
          checkBtn.innerHTML = '<i class="fa fa-check"></i> <span>Done</span>';
          showToast(`Marked "${noteName.slice(0, 30)}" as completed! 🎉`, true);
        } else {
          checkBtn.classList.remove('completed');
          link.classList.remove('unit-done');
          checkBtn.innerHTML = '<i class="far fa-circle"></i> <span>Done?</span>';
          showToast(`Unmarked "${noteName.slice(0, 30)}"`, false);
        }

        updateAllUI();
      });

      const dlSpan = link.querySelector('.download');
      if (dlSpan) {
        link.insertBefore(checkBtn, dlSpan);
      } else {
        link.appendChild(checkBtn);
      }
    });
  }

  // ── Subject Progress Bars Injection ──────────────────────────
  function updateSubjectProgressBars() {
    // 1. Subject cards (.subject-card) in notes hub
    const cards = document.querySelectorAll('.subject-card');
    cards.forEach(card => {
      const unitLinks = card.querySelectorAll('.note-card-link, .unit-video-btn');
      if (unitLinks.length === 0) return;

      let completedCount = 0;
      unitLinks.forEach(link => {
        if (link.classList.contains('unit-done')) completedCount++;
      });

      const totalCount = unitLinks.length;
      const percent = Math.round((completedCount / totalCount) * 100);

      // Locate or create progress bar
      let progContainer = card.querySelector('.subject-progress-container');
      if (!progContainer) {
        progContainer = document.createElement('div');
        progContainer.className = 'subject-progress-container';
        progContainer.innerHTML = `
          <div class="subject-progress-track">
            <div class="subject-progress-fill" style="width: 0%;"></div>
          </div>
          <span class="subject-progress-text">0 / ${totalCount} Units (0%)</span>
        `;

        // Prefer appending inside .subject-title-area or .subject-header or card header
        const titleArea = card.querySelector('.subject-title-area, .subject-title-wrap, .subject-header-top');
        if (titleArea) {
          titleArea.appendChild(progContainer);
        } else {
          const header = card.querySelector('.subject-card-header, .subject-header');
          if (header) header.appendChild(progContainer);
        }
      }

      const fill = progContainer.querySelector('.subject-progress-fill');
      const text = progContainer.querySelector('.subject-progress-text');
      if (fill) fill.style.width = `${percent}%`;
      if (text) {
        if (completedCount === totalCount && totalCount > 0) {
          text.className = 'subject-progress-text completed';
          text.innerHTML = `🏆 All ${totalCount} Units Completed! (100%)`;
        } else {
          text.className = 'subject-progress-text';
          text.innerHTML = `${completedCount} of ${totalCount} Units (${percent}%)`;
        }
      }
    });

    // 2. 4th Year Details Elements (details.subject)
    const detailsCards = document.querySelectorAll('details.subject');
    detailsCards.forEach(details => {
      const notes = details.querySelectorAll('a.note');
      if (notes.length === 0) return;

      let completedCount = 0;
      notes.forEach(n => {
        if (n.classList.contains('unit-done')) completedCount++;
      });
      const totalCount = notes.length;
      const percent = Math.round((completedCount / totalCount) * 100);

      let progContainer = details.querySelector('.subject-progress-container');
      if (!progContainer) {
        progContainer = document.createElement('div');
        progContainer.className = 'subject-progress-container';
        progContainer.style.maxWidth = '260px';
        progContainer.style.marginLeft = 'auto';
        progContainer.style.marginRight = '12px';
        progContainer.innerHTML = `
          <div class="subject-progress-track">
            <div class="subject-progress-fill" style="width: 0%;"></div>
          </div>
          <span class="subject-progress-text">0 / ${totalCount} (0%)</span>
        `;
        const summary = details.querySelector('summary');
        if (summary) summary.appendChild(progContainer);
      }

      const fill = progContainer.querySelector('.subject-progress-fill');
      const text = progContainer.querySelector('.subject-progress-text');
      if (fill) fill.style.width = `${percent}%`;
      if (text) {
        if (completedCount === totalCount && totalCount > 0) {
          text.className = 'subject-progress-text completed';
          text.innerHTML = `🏆 Done! (100%)`;
        } else {
          text.className = 'subject-progress-text';
          text.innerHTML = `${completedCount}/${totalCount} (${percent}%)`;
        }
      }
    });
  }

  // ── Floating Action Button & Top Nav Pill ─────────────────────
  function ensureFloatingButton() {
    let btn = document.getElementById('floatingTrackerBtn');
    if (!btn) {
      btn = document.createElement('div');
      btn.id = 'floatingTrackerBtn';
      btn.title = 'Open Student Unit Completion Tracker';
      btn.innerHTML = `
        <i class="fa fa-chart-pie"></i>
        <span>My Tracker</span>
        <span class="tracker-badge-count">0</span>
      `;
      btn.onclick = () => window.openGwcTracker();
      document.body.appendChild(btn);
    }

    const count = getCompletedCount();
    const badge = btn.querySelector('.tracker-badge-count');
    if (badge) badge.textContent = count;
  }

  function updateTopNavPills() {
    const count = getCompletedCount();
    document.querySelectorAll('.nav-tracker-btn, .tracker-nav-pill').forEach(pill => {
      pill.innerHTML = `<i class="fa fa-chart-pie"></i> 🎯 Tracker (${count})`;
    });
  }

  // ── Home Hero Banner Widget (#homeTrackerBanner) ─────────────
  function updateHomeBanner() {
    const banner = document.getElementById('homeTrackerBanner');
    if (!banner) return;

    const count = getCompletedCount();
    let milestone = 'Getting Started';
    let subMsg = 'Track your syllabus unit-by-unit and stay exam ready!';

    if (count > 0 && count < 6) {
      milestone = '🌱 Great Start!';
      subMsg = `You have completed <strong>${count} unit${count > 1 ? 's' : ''}</strong>. Consistency is key!`;
    } else if (count >= 6 && count < 20) {
      milestone = '⚡ Syllabus Sprinter';
      subMsg = `Impressive! <strong>${count} units completed</strong> across your AKTU subjects.`;
    } else if (count >= 20) {
      milestone = '👑 AKTU Topper Pace';
      subMsg = `Outstanding dedication! <strong>${count} units finished</strong>. Keep leading the pack!`;
    }

    banner.innerHTML = `
      <div class="home-tracker-left">
        <div class="home-tracker-icon" aria-hidden="true">🎯</div>
        <div class="home-tracker-text">
          <div class="home-tracker-title">${milestone} • Student Unit Tracker</div>
          <div class="home-tracker-desc">${subMsg}</div>
        </div>
      </div>
      <div class="home-tracker-right">
        <button type="button" class="home-tracker-open-btn" onclick="window.openGwcTracker()">
          <i class="fa fa-chart-bar"></i> View Progress (${count})
        </button>
      </div>
    `;
  }

  // ── Tracker Dashboard Modal ──────────────────────────────────
  function ensureModal() {
    let backdrop = document.getElementById('trackerModalBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'trackerModalBackdrop';
      backdrop.className = 'tracker-modal-backdrop';
      backdrop.innerHTML = `
        <div class="tracker-modal-box" role="dialog" aria-modal="true" aria-labelledby="trackerModalTitle">
          <div class="tracker-modal-header">
            <div class="tracker-modal-title" id="trackerModalTitle">
              <i class="fa fa-graduation-cap"></i> Student Unit Completion Dashboard
            </div>
            <button type="button" class="tracker-modal-close" id="closeTrackerModalBtn" aria-label="Close modal">✕</button>
          </div>
          <div class="tracker-modal-body" id="trackerModalBody">
            <!-- Dynamically populated -->
          </div>
          <div class="tracker-modal-footer">
            <button type="button" class="btn-reset-tracker" id="resetTrackerBtn">
              <i class="fa fa-trash-alt"></i> Reset All Progress
            </button>
            <span style="font-size: 11.5px; color: #94a3b8;">Maintained with ❤️ by <b>Shivansh</b> (@ShivanshSWE-cmd)</span>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);

      // Close handlers
      backdrop.querySelector('#closeTrackerModalBtn').addEventListener('click', () => {
        backdrop.classList.remove('active');
      });
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('active');
      });
      backdrop.querySelector('#resetTrackerBtn').addEventListener('click', resetAllTrackerData);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop.classList.contains('active')) {
          backdrop.classList.remove('active');
        }
      });
    }
  }

  function renderModalContent() {
    const modalBody = document.getElementById('trackerModalBody');
    if (!modalBody) return;

    const completedTotal = getCompletedCount();
    const storedData = getStorageData();

    // Determine Milestone / Badge
    let rankBadge = '🌱 Novice Learner';
    let rankColor = '#fbbf24';
    if (completedTotal >= 5 && completedTotal < 15) {
      rankBadge = '⚡ Rising Scholar';
      rankColor = '#38bdf8';
    } else if (completedTotal >= 15 && completedTotal < 30) {
      rankBadge = '🔥 AKTU Warrior';
      rankColor = '#f59e0b';
    } else if (completedTotal >= 30) {
      rankBadge = '👑 Master of Units';
      rankColor = '#10b981';
    }

    // Page Subject Breakdown (if on a notes page)
    const cards = document.querySelectorAll('.subject-card, details.subject');
    let subjectRowsHtml = '';

    if (cards.length > 0) {
      cards.forEach((card, idx) => {
        let title = 'Subject';
        if (card.matches('details.subject')) {
          title = card.querySelector('summary span')?.textContent || `Subject ${idx + 1}`;
        } else {
          title = card.dataset.subject || card.querySelector('h2, .subject-title')?.textContent || `Subject ${idx + 1}`;
        }

        const unitElements = card.querySelectorAll('.note-card-link, .unit-video-btn, a.note');
        const total = unitElements.length;
        if (total === 0) return;

        let done = 0;
        unitElements.forEach(u => {
          if (u.classList.contains('unit-done')) done++;
        });

        const pct = Math.round((done / total) * 100);

        subjectRowsHtml += `
          <div class="tracker-subject-item">
            <div class="tracker-sub-item-header">
              <span class="tracker-sub-name">${title}</span>
              <span class="tracker-sub-count">${done} / ${total} Units (${pct}%)</span>
            </div>
            <div class="subject-progress-track">
              <div class="subject-progress-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      });
    }

    // Recently completed list if available
    const completedList = Object.keys(storedData)
      .map(k => storedData[k])
      .filter(item => item && item.title)
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 6);

    let recentUnitsHtml = '';
    if (completedList.length > 0) {
      recentUnitsHtml = `
        <div style="margin-top: 20px;">
          <div class="tracker-subjects-title">Recently Completed Units</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${completedList.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: #141f36; padding: 8px 12px; border-radius: 6px; font-size: 12.5px; border: 1px solid rgba(255,255,255,0.06);">
                <span style="color: #ffffff; font-weight: 500;"><i class="fa fa-check-circle" style="color: #10b981; margin-right: 6px;"></i> ${item.title}</span>
                <span style="color: #94a3b8; font-size: 11px;">${item.subject || ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    modalBody.innerHTML = `
      <!-- Stats Row -->
      <div class="tracker-stats-summary">
        <div class="tracker-stat-card">
          <div class="tracker-stat-num">${completedTotal}</div>
          <div class="tracker-stat-label">Units Completed</div>
        </div>
        <div class="tracker-stat-card">
          <div class="tracker-stat-num" style="color: ${rankColor}; font-size: 17px; padding-top: 4px;">${rankBadge}</div>
          <div class="tracker-stat-label">Your Study Rank</div>
        </div>
        <div class="tracker-stat-card">
          <div class="tracker-stat-num">${cards.length || 8}+</div>
          <div class="tracker-stat-label">Subjects Available</div>
        </div>
      </div>

      <!-- Current Page Subject Breakdown -->
      ${subjectRowsHtml ? `
        <div class="tracker-subjects-title">Current Page Subjects</div>
        <div>${subjectRowsHtml}</div>
      ` : `
        <div class="tracker-overall-card">
          <div class="tracker-overall-top">
            <span class="tracker-overall-label">AKTU Study Progress</span>
            <span class="tracker-overall-percent">${completedTotal > 0 ? 'Active' : 'Not started'}</span>
          </div>
          <p style="font-size: 13px; color: #94a3b8; margin: 0;">
            ${completedTotal > 0 
              ? `You have actively completed <b>${completedTotal} units</b> across the platform! Open any year portal to view unit checkboxes and subject progress bars.`
              : `Explore any Year portal (1st, 2nd, 3rd, 4th Year or Video Lectures) and click <b>[Done?]</b> on any unit to mark your progress!`}
          </p>
        </div>
      `}

      ${recentUnitsHtml}
    `;
  }

  window.openGwcTracker = function () {
    ensureModal();
    renderModalContent();
    const backdrop = document.getElementById('trackerModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
  };

  // ── Global Update Pipeline ───────────────────────────────────
  function updateAllUI() {
    attachTrackersToNoteCards();
    updateSubjectProgressBars();
    ensureFloatingButton();
    updateTopNavPills();
    updateHomeBanner();
  }

  // ── Initialize on DOM and DOM changes ────────────────────────
  function init() {
    updateAllUI();

    // Check periodically for lazy/dynamic content rendering
    setTimeout(updateAllUI, 300);
    setTimeout(updateAllUI, 800);
    setTimeout(updateAllUI, 1800);

    // Watch for dynamic card expansions / tab switches
    const observer = new MutationObserver(() => {
      attachTrackersToNoteCards();
      updateSubjectProgressBars();
    });

    const targets = [
      document.getElementById('subjectsList'),
      document.getElementById('coursesList'),
      document.getElementById('subjects'),
      document.getElementById('portalGrid')
    ].filter(Boolean);

    targets.forEach(t => {
      observer.observe(t, { childList: true, subtree: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
