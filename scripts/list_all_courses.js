const fs = require('fs');

const d = JSON.parse(fs.readFileSync('data/lectures.json', 'utf8'));
console.log('Total courses:', d.courses.length);
d.courses.forEach((c, i) => {
  console.log(`${i+1}. [Sem ${c.semester} | ${c.year}] ${c.code} - ${c.title} (${c.channelName})`);
});
