import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe' });
const errors = [];
const results = { testedAt: new Date().toISOString(), target: 'http://127.0.0.1:4173/', views: [], errors };
for (const [name, width, height] of [['ultrawide', 2560, 1440], ['desktop', 1440, 900], ['desktop-compact', 1024, 768], ['tablet', 768, 1024], ['mobile', 390, 844], ['mobile-small', 320, 812]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(results.target);
  await page.waitForSelector('.gkb-hero');
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
  await page.locator('.gkb-header img').evaluateAll(images => Promise.all(images.filter(img => img.getBoundingClientRect().width).map(img => img.decode())));
  const rect = await page.locator('.gkb-header').boundingBox();
  assert.equal(rect.height, width >= 1024 ? 112 : 56);
  assert.equal(rect.x, 0);
  assert.equal(rect.width, width);
  assert.equal(await page.title(), 'candiclie — Featured Collections');
  const brand = page.getByRole('link', { name: 'candiclie home', exact: true });
  assert.equal(await brand.locator('img').getAttribute('src'), '/assets/candiclie/logo.png');
  assert.equal(await brand.locator('img').getAttribute('alt'), 'CandiClie Consultancy');
  assert.equal(await brand.locator('img').evaluate(img => img.complete && img.naturalWidth === 200 && img.naturalHeight === 200), true);
  assert.doesNotMatch(await page.locator('header').innerText(), /\bGKB\b/);
  const headerLinks = await page.locator('.gkb-header__navigation a, .gkb-header__navigation button').evaluateAll(items => items.map(el => ({label: el.textContent || el.getAttribute('aria-label'), rect: el.getBoundingClientRect().toJSON()})).filter(item => item.rect.width && item.rect.height));
  for (let i=0;i<headerLinks.length;i++) for(let j=i+1;j<headerLinks.length;j++) {
    const a=headerLinks[i].rect,b=headerLinks[j].rect;
    assert.ok(!(a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y), `${width}px header overlap: ${headerLinks[i].label} / ${headerLinks[j].label}`);
  }
  assert.equal(await page.locator('.gkb-hero__slide').count(), 8);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  if (width < 1024) {
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    assert.equal(await page.locator('#mobile-navigation').isVisible(), true);
    assert.equal(await page.locator('#mobile-navigation a').count(), 8);
    await page.getByRole('button', { name: 'Close menu', exact: true }).click();
    assert.equal(await page.locator('#mobile-navigation').count(), 0);
  } else {
    const before = await page.locator('.gkb-header__announcement a').textContent();
    await page.getByRole('button', { name: 'Next announcement' }).click();
    assert.notEqual(await page.locator('.gkb-header__announcement a').textContent(), before);
    await page.getByRole('button', { name: 'Previous announcement' }).click();
  }
  await page.mouse.move(0, 0);
  await page.screenshot({ path: `validation/gkb-hero/production-${name}.png` });
  results.views.push({ name, width, height, headerHeight: rect.height, headerControls: 'passed', heroPresent: true });
  await page.close();
}
await browser.close();
await fs.writeFile('validation/gkb-hero/production-results.json', JSON.stringify(results, null, 2));
assert.equal(errors.length, 0, JSON.stringify(errors));
console.log('Production app smoke checks passed at all six sizes.');
