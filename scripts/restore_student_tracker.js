const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'public', 'js', 'student-tracker.js');
let code = fs.readFileSync(srcPath, 'utf8');

// Replace noteLink insertion logic in attachTrackersToNoteCards
// 1. For .note-card-link
const oldNoteCardInsert = `      // Insert button right before the open badge or at the end
      const openBadge = link.querySelector('.note-open-badge');
      if (openBadge) {
        link.insertBefore(checkBtn, openBadge);
      } else {
        link.appendChild(checkBtn);
      }`;

const newNoteCardInsert = `      // Wrap link with a dedicated row wrapper so interactive elements don't nest illegally
      let wrapper = link.parentElement;
      if (!wrapper || !wrapper.classList.contains('note-item-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'note-item-wrapper';
        if (link.dataset.group) wrapper.dataset.group = link.dataset.group;
        if (link.dataset.unit) wrapper.dataset.unit = link.dataset.unit;
        if (link.dataset.subject) wrapper.dataset.subject = link.dataset.subject;
        if (link.dataset.search) wrapper.dataset.search = link.dataset.search;
        link.parentNode.insertBefore(wrapper, link);
        wrapper.appendChild(link);
      }
      wrapper.appendChild(checkBtn);`;

// 2. For .unit-video-btn
const oldVideoInsert = `      const watchIcon = btn.querySelector('.watch-icon');
      if (watchIcon) {
        btn.insertBefore(checkBtn, watchIcon);
      } else {
        btn.appendChild(checkBtn);
      }`;

const newVideoInsert = `      let wrapper = btn.parentElement;
      if (!wrapper || !wrapper.classList.contains('video-item-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'video-item-wrapper';
        btn.parentNode.insertBefore(wrapper, btn);
        wrapper.appendChild(btn);
      }
      wrapper.appendChild(checkBtn);`;

// 3. For 4th year a.note
const oldYear4Insert = `      const dlSpan = link.querySelector('.download');
      if (dlSpan) {
        link.insertBefore(checkBtn, dlSpan);
      } else {
        link.appendChild(checkBtn);
      }`;

const newYear4Insert = `      let wrapper = link.parentElement;
      if (!wrapper || !wrapper.classList.contains('note-item-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'note-item-wrapper';
        link.parentNode.insertBefore(wrapper, link);
        wrapper.appendChild(link);
      }
      wrapper.appendChild(checkBtn);`;

if (code.includes(oldNoteCardInsert)) {
  code = code.replace(oldNoteCardInsert, newNoteCardInsert);
}
if (code.includes(oldVideoInsert)) {
  code = code.replace(oldVideoInsert, newVideoInsert);
}
if (code.includes(oldYear4Insert)) {
  code = code.replace(oldYear4Insert, newYear4Insert);
}

// Add Android WebView & Capacitor download safety helper at the bottom
const webViewHelper = `
  // ── Global Download & External Link Interceptor for Android APK & Mobile Browsers ──
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link || !link.href) return;
    const href = link.href;

    const isDownloadUrl = href.includes('mediafire.com') ||
                          href.includes('drive.google.com') ||
                          href.includes('classplus.co') ||
                          href.includes('.pdf') ||
                          link.hasAttribute('download');

    if (isDownloadUrl) {
      // Ensure target="_blank" and rel="noopener"
      link.target = '_blank';
      link.rel = 'noopener';

      // If inside Capacitor / Android App WebView, invoke system browser/intent
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
        // Let Capacitor handle external intent
        link.target = '_system';
      }
    }
  }, true);
`;

code = code.replace('if (document.readyState === \'loading\')', webViewHelper + '\n  if (document.readyState === \'loading\')');

fs.writeFileSync(path.join(__dirname, '..', 'public', 'js', 'student-tracker.js'), code, 'utf8');
fs.writeFileSync(path.join(__dirname, '..', 'public', 'js', 'unit-tracker.js'), code, 'utf8');
console.log('✓ student-tracker.js and unit-tracker.js successfully restored and enhanced! Total length:', code.length);
