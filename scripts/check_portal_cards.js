const fs = require('fs');

const orig = fs.readFileSync('original_data/index.html', 'utf8');
const pub = fs.readFileSync('public/index.html', 'utf8');

// Find all cards or links in orig index
const cardMatchesOrig = orig.match(/class=["'][^"']*portal-card[^"']*["']/g) || [];
console.log('Original portal cards:', cardMatchesOrig.length);

const cardMatchesPub = pub.match(/class=["'][^"']*portal-card[^"']*["']/g) || [];
console.log('Public portal cards:', cardMatchesPub.length);

// What links are on orig index?
const linksOrig = orig.match(/href=["'][^"']+["']/g) || [];
console.log('\nOriginal links:');
[...new Set(linksOrig)].forEach(l => console.log('  ', l));

console.log('\nPublic links:');
const linksPub = pub.match(/href=["'][^"']+["']/g) || [];
[...new Set(linksPub)].forEach(l => console.log('  ', l));
