const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const pub1 = fs.readFileSync('public/1year.html', 'utf8');

// Find the main <script> tag in orig1
const origScripts = orig1.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi);
const pubScripts = pub1.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi);

console.log('origScripts count:', origScripts.length);
console.log('pubScripts count:', pubScripts.length);

// In orig1, which script has links?
const sOrig = origScripts.find(s => s.includes('const links ='));
const sPub = pubScripts.find(s => s.includes('const links ='));

console.log('sOrig length:', sOrig ? sOrig.length : 0);
console.log('sPub length:', sPub ? sPub.length : 0);

// Where do they differ?
const linesOrig = sOrig ? sOrig.split('\n') : [];
const linesPub = sPub ? sPub.split('\n') : [];

console.log('Lines in orig:', linesOrig.length);
console.log('Lines in pub:', linesPub.length);

let diffCount = 0;
for (let i = 0; i < Math.max(linesOrig.length, linesPub.length); i++) {
  const lO = linesOrig[i] || '';
  const lP = linesPub[i] || '';
  if (lO !== lP) {
    if (diffCount < 20) {
      console.log(`Line ${i + 1} diff:\n  ORIG: ${lO.substring(0, 80)}\n  PUB:  ${lP.substring(0, 80)}`);
    }
    diffCount++;
  }
}
console.log('Total line diffs in main script:', diffCount);
