import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const assets = [
  ['logo.png', 'https://media.gkboptical.com/media/logo/stores/1/Online-GKB-New-Logo.png'],
  ['eye-test.png', 'https://www.gkboptical.com/icons/EYE.png'],
  ['avenir-book.woff2', 'https://www.gkboptical.com/_next/static/media/Avenir_Book-s.p.17sg~f7r9jpe_.woff2'],
];
await fs.mkdir('public/assets/gkb-header', { recursive: true });
const manifest = { source: 'https://www.gkboptical.com/', capturedAt: new Date().toISOString(), downloads: [] };
for (const [name, url] of assets) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(`public/assets/gkb-header/${name}`, bytes);
  manifest.downloads.push({ file: `/assets/gkb-header/${name}`, sourceURL: url, contentType: response.headers.get('content-type'), bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
  console.log(name, bytes.length);
}
await fs.writeFile('public/assets/gkb-header/manifest.json', JSON.stringify(manifest, null, 2));
