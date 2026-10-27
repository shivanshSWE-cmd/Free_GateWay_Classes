const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
console.log('=== STARTING AUTOMATED VERIFICATION ===\n');

// 1. Check Key HTML files exist
const requiredFiles = [
  'index.html',
  '1year.html',
  '1styear.html',
  '2ndyear.html',
  '2year.html',
  '3year.html',
  '3rdyear.html',
  '4year.html',
  '4thyear.html',
  'lectindex.html',
  'under.html',
  'viewer.html',
  'multiatom.html',
  'gwc-ui.css',
  'css/gwc-ui.css',
  'css/student-tracker.css',
  'js/student-tracker.js'
];

let allExist = true;
requiredFiles.forEach(f => {
  const p = path.join(publicDir, f);
  const exists = fs.existsSync(p);
  if (!exists) {
    console.error(`❌ MISSING FILE: public/${f}`);
    allExist = false;
  } else {
    const size = fs.statSync(p).size;
    console.log(`✓ public/${f} exists (${size} bytes)`);
  }
});

// 2. Check lectindex.html courses count & semesters
const lectContent = fs.readFileSync(path.join(publicDir, 'lectindex.html'), 'utf8');
const lecturesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'lectures.json'), 'utf8'));

console.log(`\n✓ Video Hub Courses: ${lecturesData.courses.length} courses`);
const semCounts = {};
lecturesData.courses.forEach(c => {
  semCounts[c.semester] = (semCounts[c.semester] || 0) + 1;
});
console.log('✓ Semesters represented:', semCounts);

if (lectContent.includes('All 8 Semesters') && lectContent.includes('filter-pill-btn') && lectContent.includes('yearTabs') && lectContent.includes('semTabs')) {
  console.log('✓ lectindex.html contains Year and Semester filter tabs and full 8 semester support!');
} else {
  console.error('❌ lectindex.html missing filter controls!');
}

// 3. Check Branding
const pages = ['1year.html', '2ndyear.html', '2year.html', '3year.html', '4year.html', 'lectindex.html', 'under.html', 'index.html'];
console.log('\nChecking creator branding:');
pages.forEach(p => {
  const content = fs.readFileSync(path.join(publicDir, p), 'utf8');
  const hasAuthor = content.includes('Shivansh');
  const hasGh = content.includes('ShivanshSWE-cmd');
  const hasIg = content.includes('Shiva._SWE');
  console.log(`  ${p}: Shivansh: ${hasAuthor}, @ShivanshSWE-cmd: ${hasGh}, @Shiva._SWE: ${hasIg}`);
});

// 4. Check under.html download search fallback
const underContent = fs.readFileSync(path.join(publicDir, 'under.html'), 'utf8');
if (underContent.includes('google.com/search?q=AKTU+') && underContent.includes('Search Opened')) {
  console.log('\n✓ under.html has instant Google/AKTU repository search fallback for papers!');
} else {
  console.error('❌ under.html missing search fallback!');
}

// 5. Check CSS mobile defensiveness
const cssContent = fs.readFileSync(path.join(publicDir, 'gwc-ui.css'), 'utf8');
if (cssContent.includes('.note-card-link') && cssContent.includes('overflow-x: hidden')) {
  console.log('✓ gwc-ui.css has note-card-link styling and mobile overflow protection!');
} else {
  console.error('❌ gwc-ui.css missing note-card-link styling!');
}

console.log('\n=== VERIFICATION FINISHED ===');
