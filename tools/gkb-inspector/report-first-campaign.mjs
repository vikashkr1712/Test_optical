import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import slides from '../../src/components/GKBHero.slides.js';

const out = 'validation/first-hero-campaign';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const before = JSON.parse(await fs.readFile(`${out}/before-scope.json`));
const allowed = ['src/components/GKBHero.jsx', 'src/components/GKBHero.slides.js'];
const protectedFiles = [];
for (const [file, original] of Object.entries(before.hashes)) {
  if (allowed.includes(file)) continue;
  const unchanged = hash(await fs.readFile(file)) === original;
  assert.ok(unchanged, `${file} changed outside the first-video scope`);
  protectedFiles.push({ file, unchanged });
}
assert.deepEqual(slides.slice(1), before.slides.slice(1));
for (const field of ['name', 'type', 'href', 'cta']) assert.equal(slides[0][field], before.slides[0][field]);
const manifest = JSON.parse(await fs.readFile('public/assets/gkb-hero/manifest.json'));
const originalAssets = [];
for (const item of manifest.downloads) {
  const file = `public${item.file}`;
  const unchanged = hash(await fs.readFile(file)) === item.sha256;
  assert.ok(unchanged, `${file} original asset was modified`);
  originalAssets.push({ file, unchanged });
}
await fs.writeFile(`${out}/scope-verification.json`, JSON.stringify({ protectedFiles, remainingSevenSlidesUnchanged: true, firstSlideNavigationUnchanged: true, originalAssets }, null, 2));

const views = [
  ['desktop-large', 'Desktop 1920 × 1080'], ['desktop', 'Desktop 1440 × 900'],
  ['laptop', 'Laptop 1366 × 768'], ['tablet', 'Tablet 768 × 1024'],
  ['mobile', 'Mobile 390 × 844'], ['mobile-small', 'Mobile 375 × 812'],
];
const times = ['0.50', '1.80', '3.20', '4.45', '5.70', '7.00'];
const headlines = ['Find Your Perfect Fit', 'Crafted for Clarity', 'Own the Sunshine', 'Discover Your Look', 'Timeless by Design', 'Every Detail Matters'];
const sections = views.map(([name, title]) => `<section id="${name}"><h2>${title}</h2><div class="grid">${times.map((time, i) => `<figure><a href="${name}-scene-${i + 1}.png"><img src="${name}-scene-${i + 1}.png" alt="${title}: scene ${i + 1}, ${headlines[i]}" loading="lazy"></a><figcaption>Scene ${i + 1} · ${time}s · ${headlines[i]}</figcaption></figure>`).join('')}</div></section>`).join('');
await fs.writeFile(`${out}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>First hero campaign — scene screenshots</title><style>body{margin:0;padding:24px;font:16px/1.5 system-ui;background:#111;color:#eee}main{max-width:1600px;margin:auto}a{color:#c9dcff}nav{display:flex;gap:16px;flex-wrap:wrap}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}figure{margin:0;background:#222}img{display:block;width:100%;height:auto}figcaption{padding:12px}section{margin:40px 0}@media(max-width:800px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:500px){.grid{grid-template-columns:1fr}}</style><main><h1>First hero campaign</h1><p>36 screenshots, six scenes at six viewport sizes. Select an image to inspect the original full-resolution capture.</p><nav>${views.map(([name, title]) => `<a href="#${name}">${title}</a>`).join('')}</nav><p><a href="results.json">Scene, timing and layout checks</a> · <a href="audio-policy-results.json">Audio policy checks</a> · <a href="scope-verification.json">Unchanged file verification</a> · <a href="media-verification.json">Original media verification</a></p>${sections}</main></html>`);

// Review sheets combine captures only; the supplied campaign media is never edited.
for (const name of ['desktop', 'tablet', 'mobile']) {
  const captures = await Promise.all(times.map(async (_, i) => PNG.sync.read(await fs.readFile(`${out}/${name}-scene-${i + 1}.png`))));
  const width = name === 'mobile' ? 390 : 480;
  const height = Math.round(captures[0].height * width / captures[0].width);
  const sheet = new PNG({ width: width * 3, height: height * 2 });
  for (let n = 0; n < captures.length; n++) {
    const src = captures[n];
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const from = (Math.min(src.height - 1, Math.floor(y * src.height / height)) * src.width + Math.min(src.width - 1, Math.floor(x * src.width / width))) * 4;
      const to = (((Math.floor(n / 3) * height + y) * sheet.width) + (n % 3 * width + x)) * 4;
      src.data.copy(sheet.data, to, from, from + 4);
    }
  }
  await fs.writeFile(`${out}/${name}-review-sheet.png`, PNG.sync.write(sheet));
}
console.log(`Scope verified: ${protectedFiles.length} protected files, seven slides and ${originalAssets.length} original assets unchanged. Gallery and review sheets written.`);
