const https = require('https');
const fs = require('fs');
const path = require('path');

const assets = [
  'gwc-premium.css',
  'gwc-ui.css',
  'site-ads.js',
  'year4-hub.css',
  'year4-data.js',
  'year4-hub.js',
  '3year-multiatom.html',
  '4year-multiatom.html',
  'js/pdf.min.js'
];

async function downloadAsset(a) {
  return new Promise((resolve) => {
    https.get('https://getwayclassesnotes.netlify.app/' + a, (res) => {
      let data = [];
      res.on('data', c => data.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(data);
        const outPath = path.join(__dirname, '..', 'original_data', a);
        const dir = path.dirname(outPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(outPath, buf);
        console.log(`Saved ${a}: status=${res.statusCode}, size=${buf.length}`);
        resolve();
      });
    }).on('error', err => {
      console.error(`Error downloading ${a}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  for (const a of assets) {
    await downloadAsset(a);
  }
}

run();
