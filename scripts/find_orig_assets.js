const fs = require('fs');

const origFiles = ['index.html', '1year.html', '2ndyear.html', '3year.html', '4year.html', 'multiatom.html', 'under.html', 'lectindex.html'];

const allAssets = new Set();
origFiles.forEach(f => {
  const c = fs.readFileSync('original_data/' + f, 'utf8');
  const links = c.match(/(?:href|src)=["']([^"']+)["']/g) || [];
  links.forEach(l => {
    const val = l.match(/(?:href|src)=["']([^"']+)["']/)[1];
    if (!val.startsWith('http') && !val.startsWith('#') && !val.startsWith('mailto:')) {
      allAssets.add(val);
    }
  });
});

console.log('Internal assets referenced across all pages:');
allAssets.forEach(a => console.log('  ', a));
