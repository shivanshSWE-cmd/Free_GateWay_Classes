const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const p = path.join(publicDir, f);
  let html = fs.readFileSync(p, 'utf8');

  // Replace or add <meta name="referrer" content="no-referrer">
  if (html.includes('content="no-referrer-when-downgrade"')) {
    html = html.replace('content="no-referrer-when-downgrade"', 'content="no-referrer"');
    fs.writeFileSync(p, html, 'utf8');
    console.log(`Updated referrer policy in ${f} -> no-referrer`);
  } else if (!html.includes('name="referrer"')) {
    html = html.replace('<head>', '<head>\n  <meta name="referrer" content="no-referrer">');
    fs.writeFileSync(p, html, 'utf8');
    console.log(`Added referrer policy to ${f}`);
  }
});
