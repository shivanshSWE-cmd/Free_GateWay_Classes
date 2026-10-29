const fs = require('fs');

function findVars(file) {
  const c = fs.readFileSync(file, 'utf8');
  console.log('=== ' + file + ' ===');
  const vars = c.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/g) || [];
  console.log(vars.slice(0, 15).join('\n'));
}

findVars('original_data/1year.html');
findVars('original_data/2ndyear.html');
findVars('original_data/3year.html');
findVars('original_data/4year.html');
