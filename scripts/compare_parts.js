const fs = require('fs');

const orig1 = fs.readFileSync('original_data/1year.html', 'utf8');
const pub1 = fs.readFileSync('public/1year.html', 'utf8');

// Find where orig1 and pub1 diverge
console.log('Comparing parts of orig1:');
const headEndOrig = orig1.indexOf('</head>');
const headEndPub = pub1.indexOf('</head>');

console.log('Head length in orig:', headEndOrig);
console.log('Head length in pub:', headEndPub);

const bodyOrig = orig1.substring(headEndOrig);
const bodyPub = pub1.substring(headEndPub);

console.log('Body length in orig:', bodyOrig.length);
console.log('Body length in pub:', bodyPub.length);

// What is in orig head vs pub head?
console.log('\nOrig head preview:');
console.log(orig1.substring(headEndOrig - 1500, headEndOrig));
