const fs = require('fs');

const origIdx = fs.readFileSync('original_data/index.html', 'utf8');
const pubIdx = fs.readFileSync('public/index.html', 'utf8');

console.log('original index length:', origIdx.length);
console.log('public index length:', pubIdx.length);

// Compare body content
console.log('\nOriginal script tags:');
(origIdx.match(/<script[\s\S]*?<\/script>/gi) || []).forEach((s, i) => {
  console.log(`Script ${i}: length=${s.length}, preview=${s.substring(0, 100)}...`);
});

console.log('\nPublic script tags:');
(pubIdx.match(/<script[\s\S]*?<\/script>/gi) || []).forEach((s, i) => {
  console.log(`Script ${i}: length=${s.length}, preview=${s.substring(0, 100)}...`);
});
