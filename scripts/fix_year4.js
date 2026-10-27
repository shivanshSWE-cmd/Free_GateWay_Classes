const fs = require('fs');

const files = [
  'd:/Github projects/aktu-notes-store/public/year4-hub.js',
  'd:/Github projects/aktu-notes-store/public/js/year4-hub.js'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/action\.textContent = ["']OPEN["'];/g, 'action.textContent = "⬇ Download PDF";');
    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated ' + f);
  }
});
