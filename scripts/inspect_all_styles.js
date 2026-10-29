const fs = require('fs');

['2ndyear.html', '3year.html', '4year.html', 'multiatom.html', 'under.html'].forEach(f => {
  const orig = fs.readFileSync('original_data/' + f, 'utf8');
  const styles = orig.match(/<style[\s\S]*?<\/style>/gi) || [];
  console.log(`original_data/${f}: ${styles.length} style tags, lengths: ${styles.map(s => s.length).join(', ')}`);
});
