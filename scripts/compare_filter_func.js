const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const pub1 = fs.readFileSync('public/1year.html', 'utf8');

function getFunc(html, name) {
  const idx = html.indexOf('function ' + name);
  return html.substring(idx, idx + 1000);
}

console.log('ORIGINAL selectSubjectFilter:');
console.log(getFunc(orig1, 'selectSubjectFilter'));

console.log('\nPUBLIC selectSubjectFilter:');
console.log(getFunc(pub1, 'selectSubjectFilter'));
