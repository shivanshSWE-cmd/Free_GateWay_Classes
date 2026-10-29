const fs = require('fs');

const tracker = fs.readFileSync('public/js/student-tracker.js', 'utf8');

const idx = tracker.indexOf('MutationObserver');
console.log('MutationObserver in student-tracker.js:');
console.log(tracker.substring(idx - 100, idx + 500));
