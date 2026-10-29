const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const idx = orig1.indexOf('const links =');
console.log('const links preview (first 1000 chars):');
console.log(orig1.substring(idx, idx + 1000));
