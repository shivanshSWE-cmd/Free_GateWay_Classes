const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const pub1 = fs.readFileSync('public/1year.html', 'utf8');

console.log('Original length:', orig1.length);
console.log('Public length:', pub1.length);

// Compare the links object in both
function getLinksObject(str) {
  const m = str.match(/const links = (\{[\s\S]*?\n    \};)/);
  return m ? m[1] : null;
}

const origLinks = getLinksObject(orig1);
const pubLinks = getLinksObject(pub1);

console.log('Original links match found:', Boolean(origLinks), origLinks ? origLinks.length : 0);
console.log('Public links match found:', Boolean(pubLinks), pubLinks ? pubLinks.length : 0);

// Check CSS and HTML differences
console.log('\nOriginal has stylesheets:');
(orig1.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/g) || []).forEach(l => console.log('  ', l));

console.log('\nPublic has stylesheets:');
(pub1.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/g) || []).forEach(l => console.log('  ', l));

console.log('\nOriginal script tags:');
(orig1.match(/<script[^>]*src=["'][^"']+["'][^>]*>/g) || []).forEach(s => console.log('  ', s));

console.log('\nPublic script tags:');
(pub1.match(/<script[^>]*src=["'][^"']+["'][^>]*>/g) || []).forEach(s => console.log('  ', s));
