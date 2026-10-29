const fs = require('fs');
const path = require('path');

const pubDir = path.join(__dirname, '..', 'public');
const files = fs.readdirSync(pubDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const p = path.join(pubDir, f);
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('instagram.com/ShivanshSWE-cmd') || html.includes('instagram.com/cyber_raj1')) {
    html = html.replace(/https?:\/\/(?:www\.)?instagram\.com\/(?:ShivanshSWE-cmd|cyber_raj1)/gi, 'https://instagram.com/Shiva._SWE');
    fs.writeFileSync(p, html, 'utf8');
    console.log(`Fixed Instagram link in ${f}`);
  }
});
