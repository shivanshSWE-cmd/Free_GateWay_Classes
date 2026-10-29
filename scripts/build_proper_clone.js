const fs = require('fs');
const path = require('path');

const origDir = path.join(__dirname, '..', 'original_data');
const pubDir = path.join(__dirname, '..', 'public');

console.log('=== BUILDING 100% WORKING PROPER CLONE ===\n');

// 1. Copy CSS & Assets
['gwc-premium.css', 'gwc-ui.css', 'year4-hub.css', 'year4-data.js', 'year4-hub.js'].forEach(file => {
  const src = path.join(origDir, file);
  const dest = path.join(pubDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied asset ${file} (${fs.statSync(dest).size} bytes)`);
  }
});

// Also copy into public/css/ and public/js/ for backward compatibility
if (fs.existsSync(path.join(pubDir, 'gwc-ui.css'))) {
  fs.copyFileSync(path.join(pubDir, 'gwc-ui.css'), path.join(pubDir, 'css', 'gwc-ui.css'));
}
if (fs.existsSync(path.join(pubDir, 'year4-hub.js'))) {
  fs.copyFileSync(path.join(pubDir, 'year4-hub.js'), path.join(pubDir, 'js', 'year4-hub.js'));
}
if (fs.existsSync(path.join(pubDir, 'year4-data.js'))) {
  fs.copyFileSync(path.join(pubDir, 'year4-data.js'), path.join(pubDir, 'js', 'year4-data.js'));
}

// 2. Transformer function for HTML pages
function transformHtml(html, filename) {
  let res = html;

  // A. Meta Referrer & Author
  if (res.includes('<meta name="referrer"')) {
    res = res.replace(/<meta name="referrer"[^>]*>/i, '<meta name="referrer" content="no-referrer">');
  } else {
    res = res.replace('<head>', '<head>\n  <meta name="referrer" content="no-referrer">');
  }

  res = res.replace(/Cyber Raj \(@cyber_raj1\)/g, 'Shivansh (@ShivanshSWE-cmd)');
  res = res.replace(/Cyber Raj/g, 'Shivansh');
  res = res.replace(/@cyber_raj1/g, '@ShivanshSWE-cmd');
  res = res.replace(/https:\/\/t\.me\/cyber_raj1/g, 'https://github.com/ShivanshSWE-cmd');
  res = res.replace(/https:\/\/instagram\.com\/cyber_raj1/g, 'https://instagram.com/Shiva._SWE');

  // B. Footer Support replacement
  const newFooter = `<div class="support">
    <span>Created with ❤️ by <b>Shivansh</b></span> &bull;
    <a href="https://github.com/ShivanshSWE-cmd" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub: @ShivanshSWE-cmd</a> &bull;
    <a href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener"><i class="fab fa-instagram"></i> Instagram: @Shiva._SWE</a>
  </div>`;

  res = res.replace(/<div class="support"[\s\S]*?<\/div>/, newFooter);

  // In 4year.html footer
  res = res.replace(/<footer>[\s\S]*?<\/footer>/, `<footer>Created with ❤️ by <b>Shivansh</b> &bull; <a href="https://github.com/ShivanshSWE-cmd" target="_blank" rel="noopener"><i class="fab fa-github"></i> @ShivanshSWE-cmd</a> &bull; <a href="https://instagram.com/Shiva._SWE" target="_blank" rel="noopener"><i class="fab fa-instagram"></i> @Shiva._SWE</a></footer>`);

  // C. Normalize Links for Static Hosting (GitHub Pages / Local / WebViews)
  res = res.replace(/href=['"]\/1year['"]/g, "href='1year.html'");
  res = res.replace(/href=['"]\/2ndyear['"]/g, "href='2ndyear.html'");
  res = res.replace(/href=['"]\/3year['"]/g, "href='3year.html'");
  res = res.replace(/href=['"]\/4year['"]/g, "href='4year.html'");
  res = res.replace(/href=['"]\/multiatom['"]/g, "href='multiatom.html'");
  res = res.replace(/href=['"]\/3year-multiatom['"]/g, "href='3year-multiatom.html'");
  res = res.replace(/href=['"]\/4year-multiatom['"]/g, "href='4year-multiatom.html'");
  res = res.replace(/href=['"]\/lectindex['"]/g, "href='lectindex.html'");
  res = res.replace(/href=['"]\/under['"]/g, "href='under.html'");
  res = res.replace(/href=['"]\/['"]/g, "href='index.html'");

  // D. Gateway Classes Theme Transformation (Black & White, Obsidian & Golden Amber)
  // Convert glowing cyan to elegant Gateway amber #f59e0b
  res = res.replace(/#00eaff/g, '#f59e0b');
  res = res.replace(/rgba\(0,\s*234,\s*255,\s*([0-9\.]+)\)/g, 'rgba(245, 158, 11, $1)');
  res = res.replace(/#060913/g, '#070b14');
  res = res.replace(/#050816/g, '#070b14');
  res = res.replace(/#00ffaa/g, '#10b981');

  // E. Inject FontAwesome and Tracker Stylesheet in <head>
  if (!res.includes('student-tracker.css')) {
    res = res.replace('</head>', '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">\n  <link rel="stylesheet" href="css/student-tracker.css">\n</head>');
  }

  // F. Inject Tracker Script before </body>
  if (!res.includes('student-tracker.js')) {
    res = res.replace('</body>', '  <script src="js/student-tracker.js"></script>\n</body>');
  }

  // G. Special Handling for under.html (PYQ Downloads Fallback)
  if (filename === 'under.html') {
    const regexFail = /if\s*\(btn\)\s*\{\s*btn\.innerHTML\s*=\s*['"]❌ Retry['"];[\s\S]*?setTimeout\(\(\)\s*=>\s*\{\s*btn\.innerHTML\s*=\s*originalText;\s*\}\s*,\s*2500\);\s*\}/;
    const replacement = `// Fallback: If local proxy and serverless are offline, open instant verified educational repository search
      const searchUrl = 'https://www.google.com/search?q=AKTU+' + encodeURIComponent((code || '') + ' ' + (title || 'paper') + ' question paper pdf download');
      window.open(searchUrl, '_blank', 'noopener');
      if (btn) {
        btn.innerHTML = '🔍 Search Opened';
        btn.style.pointerEvents = 'auto';
        setTimeout(() => { btn.innerHTML = originalText; }, 3000);
      }
      if (typeof window.showToast === 'function') {
        window.showToast('Opened instant AKTU question paper search for ' + code, true);
      }`;

    res = res.replace(regexFail, replacement);

    // Also update modal error
    res = res.replace(/<div id="modalErrorOverlay"[\s\S]*?<\/div>\s*<\/div>/, `<div id="modalErrorOverlay" class="modal-error-overlay" style="display:none;">
          <span style="font-size: 32px;">⚠️</span>
          <h3 style="color:#f87171; margin-top:8px;">Live Paper Stream Offline</h3>
          <p id="modalErrorMsg">Direct streaming is temporarily busy. You can download or search this question paper directly online.</p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
            <button type="button" class="paper-download-btn" id="modalSearchBtn" style="background:#f59e0b;color:#070b14;font-weight:700;">🔍 Download via AKTU Search</button>
            <button type="button" class="paper-download-btn" id="modalRetryBtn">↺ Retry</button>
          </div>
        </div>`);
  }

  // H. Special Handling for index.html (Add small top APK button)
  if (filename === 'index.html') {
    if (!res.includes('nav-apk-btn')) {
      const topLinks = `<div class="top-bar-links" style="display:flex;gap:10px;align-items:center;padding:12px 18px;justify-content:flex-end;">
        <button type="button" class="nav-apk-btn" onclick="window.openApkModal()" style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#cbd5e1;border-radius:6px;font-size:12px;cursor:pointer;"><i class="fab fa-android" style="color:#10b981;"></i> APK</button>
        <button type="button" class="nav-tracker-btn" onclick="window.openGwcTracker()" style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.35);color:#f59e0b;border-radius:6px;font-size:12px;cursor:pointer;"><i class="fa fa-chart-pie"></i> 🎯 Tracker</button>
      </div>`;
      res = res.replace('<body>', '<body>\n  ' + topLinks);
    }
  }

  return res;
}

// 3. Process All HTML Files
const htmlFiles = [
  'index.html',
  '1year.html',
  '2ndyear.html',
  '3year.html',
  '4year.html',
  'multiatom.html',
  '3year-multiatom.html',
  '4year-multiatom.html',
  'under.html'
];

htmlFiles.forEach(f => {
  const origPath = path.join(origDir, f);
  if (!fs.existsSync(origPath)) {
    console.warn(`Original ${f} not found, skipping.`);
    return;
  }
  const origHtml = fs.readFileSync(origPath, 'utf8');
  const transformed = transformHtml(origHtml, f);
  const destPath = path.join(pubDir, f);
  fs.writeFileSync(destPath, transformed, 'utf8');
  console.log(`✓ Rebuilt public/${f} (${transformed.length} bytes)`);
});

// 4. Create Aliases
fs.copyFileSync(path.join(pubDir, '1year.html'), path.join(pubDir, '1styear.html'));
console.log('✓ Created alias public/1styear.html');

fs.copyFileSync(path.join(pubDir, '2ndyear.html'), path.join(pubDir, '2year.html'));
console.log('✓ Created alias public/2year.html');

fs.copyFileSync(path.join(pubDir, '3year.html'), path.join(pubDir, '3rdyear.html'));
console.log('✓ Created alias public/3rdyear.html');

fs.copyFileSync(path.join(pubDir, '4year.html'), path.join(pubDir, '4thyear.html'));
console.log('✓ Created alias public/4thyear.html');

console.log('\n=== REBUILD COMPLETED SUCCESSFULLY ===');
