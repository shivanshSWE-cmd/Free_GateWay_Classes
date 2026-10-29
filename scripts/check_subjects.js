const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const pub1 = fs.readFileSync('public/1year.html', 'utf8');

function extractSubjects(html) {
  const m = html.match(/const links = \{([\s\S]*?)\n    \};/);
  if (!m) return [];
  const str = m[1];
  const keys = [];
  const regex = /"([^"]+)":\s*\{/g;
  let match;
  while ((match = regex.exec(str)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

console.log('Original 1year subjects:', extractSubjects(orig1));
console.log('Public 1year subjects:', extractSubjects(pub1));
