const fs = require('fs');

const d = JSON.parse(fs.readFileSync('data/lectures.json', 'utf8'));
d.courses.forEach(c => {
  console.log(`${c.id}: ${c.title} -> ${c.playlistUrl}`);
});
