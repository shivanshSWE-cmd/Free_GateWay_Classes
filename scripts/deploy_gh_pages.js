const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: 'inherit' });
}

try {
  run('git checkout main');
  run('git checkout gh-pages');
  run('git checkout main -- public/');

  const publicDir = path.join(__dirname, '..', 'public');
  const rootDir = path.join(__dirname, '..');

  function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcP = path.join(src, entry.name);
      const destP = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        if (!fs.existsSync(destP)) fs.mkdirSync(destP, { recursive: true });
        copyRecursive(srcP, destP);
      } else {
        fs.copyFileSync(srcP, destP);
      }
    }
  }

  copyRecursive(publicDir, rootDir);

  run('git checkout main -- data/');
  run('git add -A');
  try {
    run('git commit -m "deploy: update complete working clone on gh-pages"');
  } catch (e) {
    console.log('No new changes to commit on gh-pages');
  }

  run('git push origin gh-pages');
  console.log('✓ Successfully pushed gh-pages!');
} catch (err) {
  console.error('Error during gh-pages deployment:', err);
} finally {
  run('git checkout main');
}
