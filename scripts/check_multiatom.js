const fs = require('fs');

['public/3year-multiatom.html', 'public/4year-multiatom.html'].forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(f, 'does not exist');
    return;
  }
  const c = fs.readFileSync(f, 'utf8');
  console.log(f, 'length:', c.length);
  const scripts = c.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log(f, 'scripts count:', scripts.length);
});
