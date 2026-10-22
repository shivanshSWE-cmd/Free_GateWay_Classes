const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const filePath = path.join(publicDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Home links
  if (content.includes("href='/' id='gwcHomeBtn'")) {
    content = content.replace(/href='\/' id='gwcHomeBtn'/g, "href='index.html' id='gwcHomeBtn'");
    changed = true;
  }
  if (content.includes('href="/" id="gwcHomeBtn"')) {
    content = content.replace(/href="\/" id="gwcHomeBtn"/g, 'href="index.html" id="gwcHomeBtn"');
    changed = true;
  }
  if (content.includes("class='home' href='/'")) {
    content = content.replace(/class='home' href='\/'/g, "class='home' href='index.html'");
    changed = true;
  }
  if (content.includes('href="/4year-multiatom"')) {
    content = content.replace(/href="\/4year-multiatom"/g, 'href="4year-multiatom.html"');
    changed = true;
  }
  if (content.includes("href='/4year-multiatom'")) {
    content = content.replace(/href='\/4year-multiatom'/g, "href='4year-multiatom.html'");
    changed = true;
  }
  if (content.includes('href="/4year"')) {
    content = content.replace(/href="\/4year"/g, 'href="4year.html"');
    changed = true;
  }
  if (content.includes("href='/4year'")) {
    content = content.replace(/href='\/4year'/g, "href='4year.html'");
    changed = true;
  }
  if (content.includes('href="/3year-multiatom"')) {
    content = content.replace(/href="\/3year-multiatom"/g, 'href="3year-multiatom.html"');
    changed = true;
  }
  if (content.includes('href="/3year"')) {
    content = content.replace(/href="\/3year"/g, 'href="3year.html"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Normalized links in:', f);
  }
});
