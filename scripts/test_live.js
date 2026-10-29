const https = require('https');

const base = 'https://shivanshswe-cmd.github.io/Free_GateWay_Classes';
const endpoints = [
  '/',
  '/index.html',
  '/1year.html',
  '/2year.html',
  '/2ndyear.html',
  '/3year.html',
  '/4year.html',
  '/lectindex.html',
  '/under.html',
  '/gwc-ui.css',
  '/js/student-tracker.js'
];

async function checkUrl(path) {
  return new Promise((resolve) => {
    https.get(base + path, {
      headers: { 'User-Agent': 'StatusVerifier/1.0' }
    }, (res) => {
      let len = 0;
      res.on('data', c => len += c.length);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, length: len });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function verifyAll() {
  console.log('Verifying Live GitHub Pages Deployment:');
  for (const ep of endpoints) {
    const r = await checkUrl(ep);
    if (r.status === 200) {
      console.log(`✓ [${r.status}] ${ep} (${r.length} bytes)`);
    } else {
      console.log(`? [${r.status || 'ERR'}] ${ep} - ${r.error || 'Status ' + r.status}`);
    }
  }
}

verifyAll();
