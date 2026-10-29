const fs = require('fs');
const path = require('path');

const pubDir = path.join(__dirname, '..', 'public');

const files = fs.readdirSync(pubDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const p = path.join(pubDir, f);
  let html = fs.readFileSync(p, 'utf8');
  let changed = false;

  if (html.includes('cyber_raj1')) {
    html = html.replace(/https?:\/\/instagram\.com\/cyber_raj1/gi, 'https://instagram.com/Shiva._SWE');
    html = html.replace(/https?:\/\/t\.me\/cyber_raj1/gi, 'https://github.com/ShivanshSWE-cmd');
    html = html.replace(/cyber_raj1/gi, 'ShivanshSWE-cmd');
    changed = true;
  }
  if (html.includes('Cyber Raj')) {
    html = html.replace(/Cyber Raj/gi, 'Shivansh');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(p, html, 'utf8');
    console.log(`Updated branding in ${f}`);
  }
});
