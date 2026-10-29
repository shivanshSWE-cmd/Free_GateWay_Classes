const fs = require('fs');

function checkElements(filepath) {
  console.log(`\n=== Checking IDs in ${filepath} ===`);
  const html = fs.readFileSync(filepath, 'utf8');

  // Find all document.getElementById calls in scripts
  const matches = html.match(/document\.getElementById\(['"]([^'"]+)['"]\)/g) || [];
  const ids = [...new Set(matches.map(m => m.match(/document\.getElementById\(['"]([^'"]+)['"]\)/)[1]))];

  console.log(`Found ${ids.length} getElementById queries:`);
  ids.forEach(id => {
    const hasElement = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
    if (!hasElement) {
      console.error(`  ❌ MISSING ELEMENT: id="${id}"`);
    } else {
      console.log(`  ✓ id="${id}" found`);
    }
  });
}

checkElements('public/1year.html');
checkElements('public/2ndyear.html');
checkElements('public/3year.html');
checkElements('public/4year.html');
checkElements('public/multiatom.html');
checkElements('public/lectindex.html');
checkElements('public/under.html');
