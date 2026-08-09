import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const PORT = 3000;
const ROOT = process.cwd();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.otf':  'font/otf',
  '.txt':  'text/plain; charset=utf-8',
};

const safeResolve = (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const resolved = path.resolve(ROOT, '.' + decoded);
  return resolved.startsWith(ROOT) ? resolved : null;
};

const server = createServer(async (req, res) => {
  try {
    let target = safeResolve(req.url === '/' ? '/index.html' : req.url);
    if (!target) { res.writeHead(403); res.end('forbidden'); return; }

    let s;
    try { s = await stat(target); } catch { res.writeHead(404); res.end('not found'); return; }
    if (s.isDirectory()) {
      target = path.join(target, 'index.html');
      try { s = await stat(target); } catch { res.writeHead(404); res.end('not found'); return; }
    }

    const body = await readFile(target);
    const type = MIME[path.extname(target).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
    res.end(body);
  } catch (err) {
    res.writeHead(500); res.end('server error');
    console.error(err);
  }
});

server.listen(PORT, () => console.log(`serving ${ROOT} at http://localhost:${PORT}`));
