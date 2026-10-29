const https = require('https');

const pages = [
  '/',
  '/1year.html',
  '/2ndyear.html',
  '/3year.html',
  '/4year.html',
  '/multiatom.html',
  '/under.html',
  '/lectindex.html'
];

async function fetchPage(p) {
  return new Promise((resolve) => {
    https.get('https://getwayclassesnotes.netlify.app' + p, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ page: p, status: res.statusCode, length: data.length, data });
      });
    }).on('error', err => resolve({ page: p, error: err.message }));
  });
}

async function run() {
  for (const p of pages) {
    const res = await fetchPage(p);
    console.log(`${p} -> status: ${res.status}, length: ${res.length || 0}`);
  }
}

run();
