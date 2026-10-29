const fs = require('fs');

console.log('=== Comparing Original Netlify Files with Public Files ===');

const files = [
  'index.html',
  '1year.html',
  '2ndyear.html',
  '3year.html',
  '4year.html',
  'multiatom.html',
  'under.html',
  'lectindex.html'
];

files.forEach(f => {
  const orig = fs.readFileSync('original_data/' + f, 'utf8');
  const pub = fs.readFileSync('public/' + f, 'utf8');
  console.log(`\n--- ${f} ---`);
  console.log(`Original: ${orig.length} bytes`);
  console.log(`Public:   ${pub.length} bytes`);

  // Count notes / items in original vs public
  if (f === '1year.html' || f === '2ndyear.html' || f === '3year.html' || f === 'multiatom.html') {
    const urlsOrig = (orig.match(/https?:\/\/[^\s"'<>]+/g) || []).filter(u => u.includes('mediafire') || u.includes('classplus') || u.includes('drive.google'));
    const urlsPub = (pub.match(/https?:\/\/[^\s"'<>]+/g) || []).filter(u => u.includes('mediafire') || u.includes('classplus') || u.includes('drive.google'));
    console.log(`Original note URLs: ${urlsOrig.length}`);
    console.log(`Public note URLs:   ${urlsPub.length}`);
  }
});
