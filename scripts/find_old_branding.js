const fs = require('fs');

const files = [
  'index.html',
  '1year.html',
  '2ndyear.html',
  '3year.html',
  '4year.html',
  'multiatom.html',
  '3year-multiatom.html',
  '4year-multiatom.html',
  'under.html',
  'lectindex.html'
];

files.forEach(f => {
  const p = 'original_data/' + f;
  if (!fs.existsSync(p)) return;
  const c = fs.readFileSync(p, 'utf8');
  console.log(`\n=== ${f} ===`);
  const matches = c.match(/(?:cyber|raj|telegram|instagram|github|creator|developer|author)[^\n<>]*/gi) || [];
  [...new Set(matches.slice(0, 5))].forEach(m => console.log('  ', m));
});
