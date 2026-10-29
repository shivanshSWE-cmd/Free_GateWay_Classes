const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');

// Find all script tags in original_data/1year.html
const scripts = orig1.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Total script tags in original:', scripts.length);
scripts.forEach((s, idx) => {
  console.log(`Script ${idx}: length=${s.length}`);
  console.log(s.substring(0, 200) + '...\n');
});

// Also check what DOM structure is in <body>
const bodyStart = orig1.indexOf('<body');
const firstScript = orig1.indexOf('<script', bodyStart);
console.log('Body HTML before first script in body:');
console.log(orig1.substring(bodyStart, Math.min(bodyStart + 2000, firstScript)));
