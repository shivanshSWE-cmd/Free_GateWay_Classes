const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Copy 2ndyear.html -> 2year.html
fs.copyFileSync(path.join(publicDir, '2ndyear.html'), path.join(publicDir, '2year.html'));
console.log('✓ Created public/2year.html from 2ndyear.html');

// Copy 1year.html -> 1styear.html
fs.copyFileSync(path.join(publicDir, '1year.html'), path.join(publicDir, '1styear.html'));
console.log('✓ Created public/1styear.html from 1year.html');

// Copy 3year.html -> 3rdyear.html
fs.copyFileSync(path.join(publicDir, '3year.html'), path.join(publicDir, '3rdyear.html'));
console.log('✓ Created public/3rdyear.html from 3year.html');

// Copy 4year.html -> 4thyear.html
fs.copyFileSync(path.join(publicDir, '4year.html'), path.join(publicDir, '4thyear.html'));
console.log('✓ Created public/4thyear.html from 4year.html');
