const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '..', 'raw_data');
const publicDir = path.join(__dirname, '..', 'public');
const jsDir = path.join(publicDir, 'js');
const cssDir = path.join(publicDir, 'css');

[publicDir, jsDir, cssDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

console.log('Preparing public assets...');

// Copy CSS
const cssFiles = ['gwc-ui.css', 'year4-hub.css'];
cssFiles.forEach(file => {
  const src = path.join(rawDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
    fs.copyFileSync(src, path.join(cssDir, file));
    console.log(`Copied CSS: ${file}`);
  }
});

// Copy JS files
const jsFiles = ['year4-data.js', 'year4-hub.js'];
jsFiles.forEach(file => {
  const src = path.join(rawDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
    fs.copyFileSync(src, path.join(jsDir, file));
    console.log(`Copied JS: ${file}`);
  }
});

// Copy PDF.js and worker
if (fs.existsSync(path.join(rawDir, 'pdf.min.js'))) {
  fs.copyFileSync(path.join(rawDir, 'pdf.min.js'), path.join(jsDir, 'pdf.min.js'));
  console.log('Copied js/pdf.min.js');
}
if (fs.existsSync(path.join(rawDir, 'pdf.worker.min.js'))) {
  fs.copyFileSync(path.join(rawDir, 'pdf.worker.min.js'), path.join(jsDir, 'pdf.worker.min.js'));
  console.log('Copied js/pdf.worker.min.js');
}

// Clean site-ads.js (no popups or tracking, but clean helper for UI slots)
const cleanAdsJs = `
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
`;
fs.writeFileSync(path.join(publicDir, 'site-ads.js'), cleanAdsJs, 'utf-8');
console.log('Created clean site-ads.js');

// Copy & clean HTML pages
const htmlFiles = [
  'index.html',
  '1year.html',
  '2ndyear.html',
  '3year.html',
  '4year.html',
  'multiatom.html',
  '3year-multiatom.html',
  '4year-multiatom.html',
  'lectindex.html',
  'under.html',
  'viewer.html'
];

htmlFiles.forEach(file => {
  const src = path.join(rawDir, file);
  if (!fs.existsSync(src)) {
    console.warn(`File not found: ${src}`);
    return;
  }
  let html = fs.readFileSync(src, 'utf-8');

  // 1. Remove annoying right-click / contextmenu disabling
  html = html.replace(/document\.addEventListener\(['"]contextmenu['"],\s*function\s*\([^\)]*\)\s*\{\s*e\.preventDefault\(\);\s*\}\);?/g, '/* contextmenu enabled */');
  html = html.replace(/document\.oncontextmenu\s*=\s*function\s*\(\)\s*\{\s*return false;\s*\};?/g, '');

  // 2. Ensure relative link consistency (.html or route)
  // Fix references to root css/js if needed
  html = html.replace(/href=["']\/gwc-ui\.css["']/g, 'href="gwc-ui.css"');
  html = html.replace(/src=["']\/site-ads\.js["']/g, 'src="site-ads.js"');

  // 3. In under.html, ensure workerSrc points to local js/pdf.worker.min.js
  if (file === 'under.html' || file === 'viewer.html') {
    html = html.replace(/pdfjsLib\.GlobalWorkerOptions\.workerSrc\s*=\s*['"][^'"]+['"];/g, 
      "pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';");
  }

  fs.writeFileSync(path.join(publicDir, file), html, 'utf-8');
  console.log(`Prepared page: ${file}`);
});

console.log('Public assets preparation complete!');
