const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: 'inherit' });
}

try {
  // Ensure we are in clean state on main
  run('git checkout main');

  // Switch to gh-pages
  run('git checkout gh-pages');

  // Checkout files directly from main's public directory
  run('git checkout main -- public/');

  // Copy all files from public/ into the root of gh-pages
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

  // Copy data directory as well if needed
  run('git checkout main -- data/');

  // Stage everything on gh-pages
  run('git add -A');
  try {
    run('git commit -m "deploy: update all 4 year pages, 8 semester video hub, downloads fallback, and assets on gh-pages"');
  } catch (e) {
    console.log('No new changes to commit on gh-pages');
  }

  // Push gh-pages
  run('git push origin gh-pages');
  console.log('✓ Successfully pushed gh-pages!');
} catch (err) {
  console.error('Error during gh-pages deployment:', err);
} finally {
  // Always return to main
  run('git checkout main');
}
