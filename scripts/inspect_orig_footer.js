const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const idx = orig1.indexOf('<div class="support"');
console.log(orig1.substring(idx, idx + 800));
