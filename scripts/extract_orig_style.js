const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const head = orig1.substring(0, orig1.indexOf('</head>'));
const styles = head.match(/<style[\s\S]*?<\/style>/gi) || [];

console.log('Writing original style to scripts/orig_style.css...');
fs.writeFileSync('scripts/orig_style.css', styles[0].replace(/<\/?style>/gi, ''), 'utf8');
console.log('Saved scripts/orig_style.css, length:', styles[0].length);
