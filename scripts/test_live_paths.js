const https = require('https');

async function test(path) {
  return new Promise((resolve) => {
    https.get('https://shivanshswe-cmd.github.io/Free_GateWay_Classes' + path, (res) => {
      console.log(`Path: ${path} -> Status: ${res.statusCode}, Location: ${res.headers.location || 'none'}`);
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        console.log(`  Length: ${body.length}, Title: ${(body.match(/<title>([^<]+)<\/title>/i) || [])[1]}`);
        resolve();
      });
    });
  });
}

async function run() {
  await test('/');
  await test('/index.html');
  await test('/public/');
  await test('/public/index.html');
  await test('/1year.html');
  await test('/public/1year.html');
}

run();
