const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'original_data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pages = [
  'index.html',
  '1year.html',
  '2ndyear.html',
  '3year.html',
  '4year.html',
  'multiatom.html',
  'under.html',
  'lectindex.html'
];

async function download(p) {
  return new Promise((resolve, reject) => {
    const url = 'https://getwayclassesnotes.netlify.app/' + p;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(path.join(outDir, p), data, 'utf8');
        console.log(`Saved ${p} (${data.length} bytes)`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const p of pages) {
    await download(p);
  }
  console.log('All original files downloaded.');
}

run();
