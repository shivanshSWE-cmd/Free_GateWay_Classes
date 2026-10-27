const fs = require('fs');
const path = require('path');

const underPath = path.join(__dirname, '..', 'public', 'under.html');
let underHtml = fs.readFileSync(underPath, 'utf8');

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
        window.showToast('Direct server busy. Opened Google/AKTU repository search for ' + code, true);
      }`;

if (regexFail.test(underHtml)) {
  underHtml = underHtml.replace(regexFail, replacement);
  fs.writeFileSync(underPath, underHtml, 'utf8');
  console.log('✓ Successfully replaced Retry failure block with instant Google Search fallback in under.html!');
} else {
  console.log('Regex fail did not match. Checking if already replaced:');
  console.log(underHtml.includes('Search Opened'));
}
