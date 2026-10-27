const fs = require('fs');

function inspectFile(file) {
  console.log(`\n=================== ${file} ===================`);
  const c = fs.readFileSync(file, 'utf8');
  const urls = c.match(/https?:\/\/[^\s"'<>]+/g) || [];
  console.log('Total URLs found:', urls.length);
  const sampleUrls = urls.filter(u => !u.includes('schema.org') && !u.includes('cdnjs') && !u.includes('fonts.googleapis') && !u.includes('ibb.co'));
  console.log('Sample content URLs (first 20):');
  sampleUrls.slice(0, 20).forEach(u => console.log('  ', u));
}

inspectFile('public/2ndyear.html');
inspectFile('public/4year.html');
inspectFile('public/under.html');
