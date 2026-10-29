const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const head = orig1.substring(0, orig1.indexOf('</head>'));

const styles = head.match(/<style[\s\S]*?<\/style>/gi) || [];
console.log('Total style tags in original head:', styles.length);
styles.forEach((s, idx) => {
  console.log(`Style ${idx} length: ${s.length}, preview: ${s.substring(0, 150)}...\n`);
});
