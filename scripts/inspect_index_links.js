const fs = require('fs');

const c = fs.readFileSync('public/index.html', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<a') && (l.includes('year') || l.includes('lect') || l.includes('under') || l.includes('multi'))) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
