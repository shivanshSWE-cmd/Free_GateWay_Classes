const fs = require('fs');
const vm = require('vm');

function testPageJS(filepath) {
  console.log(`\n=================== TESTING ${filepath} ===================`);
  const html = fs.readFileSync(filepath, 'utf8');
  const scripts = html.match(/<script(?![^>]*src=)(?![^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi) || [];

  console.log(`Found ${scripts.length} inline executable scripts`);

  scripts.forEach((scriptTag, idx) => {
    const code = scriptTag.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    if (code.length < 50) return; // skip tiny contextmenu shims

    console.log(`Testing script #${idx} (length ${code.length})...`);
    try {
      new vm.Script(code);
      console.log(`  ✓ Script #${idx} SYNTAX OK`);
    } catch (e) {
      console.error(`  ❌ SYNTAX ERROR in script #${idx}:`, e.message);
    }
  });
}

testPageJS('public/1year.html');
testPageJS('public/2ndyear.html');
testPageJS('public/3year.html');
testPageJS('public/4year.html');
testPageJS('public/multiatom.html');
testPageJS('public/lectindex.html');
testPageJS('public/under.html');
