const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// 1. Fix 1year.html
(function fix1Year() {
  const file = path.join(publicDir, '1year.html');
  let c = fs.readFileSync(file, 'utf8');

  // Remove security-shield
  c = c.replace(/<script src="js\/security-shield\.js"><\/script>\s*/g, '');

  // Fix unitTabs listener
  c = c.replace(
    /notesGrid\.querySelectorAll\('\.note-card-link'\)\.forEach\(noteEl =>\s*\{[\s\S]*?if\s*\(targetGroup === 'all' \|\| noteEl\.dataset\.group === targetGroup\) \{[\s\S]*?noteEl\.style\.display = 'flex';[\s\S]*?\} else \{[\s\S]*?noteEl\.style\.display = 'none';[\s\S]*?\}\s*\}\);/,
    `notesGrid.querySelectorAll('.note-card-link').forEach(noteEl => {
          const item = noteEl.closest('.note-item-wrapper') || noteEl;
          if (targetGroup === 'all' || noteEl.dataset.group === targetGroup) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });`
  );

  // Fix handleSearch
  c = c.replace(
    /notes\.forEach\(n =>\s*\{[\s\S]*?const searchText = n\.dataset\.search \|\| '';[\s\S]*?if\s*\(searchText\.includes\(q\)\) \{[\s\S]*?n\.style\.display = 'flex';[\s\S]*?cardHasMatch = true;[\s\S]*?totalMatchedNotes\+\+;[\s\S]*?\} else \{[\s\S]*?n\.style\.display = 'none';[\s\S]*?\}\s*\}\);/,
    `notes.forEach(n => {
        const item = n.closest('.note-item-wrapper') || n;
        const searchText = n.dataset.search || '';
        if (searchText.includes(q)) {
          item.style.display = 'flex';
          cardHasMatch = true;
          totalMatchedNotes++;
        } else {
          item.style.display = 'none';
        }
      });`
  );

  // Action badge label
  c = c.replace(
    /const actionLabel = isZip \? "Open Zip ➔" : "Download ➔";/g,
    'const actionLabel = isZip ? "📂 Open Zip" : "⬇ Download PDF";'
  );

  fs.writeFileSync(file, c, 'utf8');
  console.log('✓ 1year.html fixed');
})();

// 2. Fix 2ndyear.html
(function fix2ndYear() {
  const file = path.join(publicDir, '2ndyear.html');
  let c = fs.readFileSync(file, 'utf8');

  c = c.replace(/<script src="js\/security-shield\.js"><\/script>\s*/g, '');

  c = c.replace(
    /notesGrid\.querySelectorAll\('\.note-card-link'\)\.forEach\(noteEl =>\s*\{[\s\S]*?if\s*\(targetUnit === 'all' \|\| noteEl\.dataset\.unit === targetUnit\) \{[\s\S]*?noteEl\.style\.display = 'flex';[\s\S]*?\} else \{[\s\S]*?noteEl\.style\.display = 'none';[\s\S]*?\}\s*\}\);/,
    `notesGrid.querySelectorAll('.note-card-link').forEach(noteEl => {
          const item = noteEl.closest('.note-item-wrapper') || noteEl;
          if (targetUnit === 'all' || noteEl.dataset.unit === targetUnit) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });`
  );

  c = c.replace(
    /notes\.forEach\(n =>\s*\{[\s\S]*?const searchText = n\.dataset\.search \|\| '';[\s\S]*?if\s*\(searchText\.includes\(q\)\) \{[\s\S]*?n\.style\.display = 'flex';[\s\S]*?cardHasMatch = true;[\s\S]*?totalMatchedNotes\+\+;[\s\S]*?\} else \{[\s\S]*?n\.style\.display = 'none';[\s\S]*?\}\s*\}\);/,
    `notes.forEach(n => {
        const item = n.closest('.note-item-wrapper') || n;
        const searchText = n.dataset.search || '';
        if (searchText.includes(q)) {
          item.style.display = 'flex';
          cardHasMatch = true;
          totalMatchedNotes++;
        } else {
          item.style.display = 'none';
        }
      });`
  );

  c = c.replace(
    /const actionLabel = isZip \? "Open Zip ➔" : "Download ➔";/g,
    'const actionLabel = isZip ? "📂 Open Zip" : "⬇ Download PDF";'
  );

  fs.writeFileSync(file, c, 'utf8');
  console.log('✓ 2ndyear.html fixed');
})();

// 3. Fix 3year.html
(function fix3Year() {
  const file = path.join(publicDir, '3year.html');
  let c = fs.readFileSync(file, 'utf8');

  c = c.replace(/<script src="js\/security-shield\.js"><\/script>\s*/g, '');

  c = c.replace(
    /grid\.querySelectorAll\('\.note-card-link'\)\.forEach\(linkEl =>\s*\{[\s\S]*?if\s*\(target === 'all' \|\| linkEl\.dataset\.unit === target\) \{[\s\S]*?linkEl\.style\.display = 'flex';[\s\S]*?\} else \{[\s\S]*?linkEl\.style\.display = 'none';[\s\S]*?\}\s*\}\);/,
    `grid.querySelectorAll('.note-card-link').forEach(linkEl => {
            const item = linkEl.closest('.note-item-wrapper') || linkEl;
            if (target === 'all' || linkEl.dataset.unit === target) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });`
  );

  c = c.replace(
    /notes\.forEach\(n =>\s*\{[\s\S]*?const searchText = n\.dataset\.search \|\| '';[\s\S]*?if\s*\(searchText\.includes\(q\)\) \{[\s\S]*?n\.style\.display = 'flex';[\s\S]*?cardHasMatch = true;[\s\S]*?totalMatchedNotes\+\+;[\s\S]*?\} else \{[\s\S]*?n\.style\.display = 'none';[\s\S]*?\}\s*\}\);/,
    `notes.forEach(n => {
        const item = n.closest('.note-item-wrapper') || n;
        const searchText = n.dataset.search || '';
        if (searchText.includes(q)) {
          item.style.display = 'flex';
          cardHasMatch = true;
          totalMatchedNotes++;
        } else {
          item.style.display = 'none';
        }
      });`
  );

  c = c.replace(
    /<span class="note-open-badge">Download ➔<\/span>/g,
    '<span class="note-open-badge">⬇ Download PDF</span>'
  );

  fs.writeFileSync(file, c, 'utf8');
  console.log('✓ 3year.html fixed');
})();

// 4. Fix multiatom.html
(function fixMultiatom() {
  const file = path.join(publicDir, 'multiatom.html');
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/<script src="js\/security-shield\.js"><\/script>\s*/g, '');
    c = c.replace(
      /notesGrid\.querySelectorAll\('\.note-card-link'\)\.forEach\(noteEl =>\s*\{[\s\S]*?if\s*\(targetGroup === 'all' \|\| noteEl\.dataset\.group === targetGroup\) \{[\s\S]*?noteEl\.style\.display = 'flex';[\s\S]*?\} else \{[\s\S]*?noteEl\.style\.display = 'none';[\s\S]*?\}\s*\}\);/,
      `notesGrid.querySelectorAll('.note-card-link').forEach(noteEl => {
            const item = noteEl.closest('.note-item-wrapper') || noteEl;
            if (targetGroup === 'all' || noteEl.dataset.group === targetGroup) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });`
    );
    c = c.replace(
      /const actionLabel = isZip \? "Open Zip ➔" : "Download ➔";/g,
      'const actionLabel = isZip ? "📂 Open Zip" : "⬇ Download PDF";'
    );
    fs.writeFileSync(file, c, 'utf8');
    console.log('✓ multiatom.html fixed');
  }
})();

// 5. Fix 4year.html
(function fix4Year() {
  const file = path.join(publicDir, '4year.html');
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/<script src="js\/security-shield\.js"><\/script>\s*/g, '');
    fs.writeFileSync(file, c, 'utf8');
    console.log('✓ 4year.html fixed');
  }
})();
