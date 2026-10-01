// Tiny static server for the mock booking site (no dependencies).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/') p = '/login.html';
    if (!path.extname(p)) p += '.html';
    const file = path.join(root, path.normalize(p));
    if (!file.startsWith(root) || !fs.existsSync(file)) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'text/plain' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(process.env.PORT ?? 4321, () => console.log('Mock HealthHub on http://localhost:4321'));
