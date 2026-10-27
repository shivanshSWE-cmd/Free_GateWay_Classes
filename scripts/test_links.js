const fs = require('fs');
const https = require('https');

async function testUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request({
        method: 'HEAD',
        host: u.host,
        path: u.pathname + u.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }, (res) => {
        resolve({ url, status: res.statusCode, headers: res.headers });
      });
      req.on('error', (err) => resolve({ url, error: err.message }));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ url, error: 'Timeout' });
      });
      req.end();
    } catch (e) {
      resolve({ url, error: e.message });
    }
  });
}

async function run() {
  console.log('Testing Classplus CDN:');
  const r1 = await testUrl('https://ali-cdn-wl-assets.classplus.co/production/single/mvxiz/43b005d6-b7c9-46df-9027-393ec5f7b1ab.pdf');
  console.log('Classplus:', r1.status || r1.error);

  console.log('Testing MediaFire:');
  const r2 = await testUrl('https://www.mediafire.com/file/2zs2c8ikbk7u8j4/M-2_U-1_Lec-1_Notes__42132331_2025_05_08_18_11.pdf/file');
  console.log('MediaFire:', r2.status || r2.error);
}

run();
