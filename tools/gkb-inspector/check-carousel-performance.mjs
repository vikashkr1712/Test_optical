import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe' });
const results = { testedAt: new Date().toISOString(), views: {}, errors: [] };
for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: name === 'mobile' });
  const page = await context.newPage();
  page.on('pageerror', e => results.errors.push(String(e)));
  page.on('console', e => { if (e.type() === 'error') results.errors.push(e.text()); });
  const remote = [];
  page.on('request', request => { if (request.url().startsWith('http') && new URL(request.url()).origin !== 'http://127.0.0.1:5173') remote.push(request.url()); });
  await page.goto('http://127.0.0.1:5173/');
  await page.waitForFunction(() => document.querySelector('[data-slide="0"] video')?.readyState >= 2);
  await page.mouse.move(300, 150);
  const firstStartup = await page.locator('video').evaluateAll(videos => videos.map(v => ({ playing: !v.paused, src: v.currentSrc, frames: v.getVideoPlaybackQuality().totalVideoFrames })));
  assert.equal(firstStartup.filter(v => v.playing).length, 1);
  assert.equal(firstStartup[1].src, '', 'Distant video is not requested at startup');
  assert.equal(firstStartup[2].src, '', 'Loop buffer is not requested at startup');
  await page.locator('.gkb-hero__bullet').nth(1).evaluate(b => b.click());
  await page.waitForTimeout(750);
  await page.waitForFunction(() => document.querySelector('[data-slide="2"] video')?.readyState >= 1);
  assert.equal(await page.locator('video').evaluateAll(videos => videos.every(v => v.paused)), true, 'Static slides do not decode background video');
  const preparedNext = await page.locator('[data-slide="2"] video').evaluate(v => ({ state: v.readyState, paused: v.paused }));
  await page.locator('.gkb-hero__bullet').nth(2).evaluate(b => b.click());
  await page.waitForTimeout(750);
  assert.equal(await page.locator('video').evaluateAll(videos => videos.filter(v => !v.paused).length), 1);
  assert.equal(await page.locator('[data-slide="0"] video').evaluate(v => v.paused), true);

  // Hold past the old deadline, change slides while hovered, then resume.
  await page.waitForTimeout(name === 'mobile' ? 3300 : 5300);
  await page.locator('.gkb-hero__bullet').nth(3).evaluate(b => b.click());
  await page.waitForTimeout(750);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(850);
  assert.equal(await page.locator('.gkb-hero__bullet[aria-current="true"]').getAttribute('aria-label'), 'Go to slide 4: New Arrivals', 'Hover resume must not instantly skip a slide');
  await page.mouse.move(300, 150);

  // Last-to-first autoplay should travel one panel forward, then reset instantly.
  await page.locator('.gkb-hero__bullet').nth(7).evaluate(b => b.click());
  await page.waitForTimeout(750);
  await page.evaluate(() => {
    window.wrapSamples = [];
    window.wrapRaf = requestAnimationFrame(function sample() {
      const track = document.querySelector('.gkb-hero__track');
      window.wrapSamples.push({ x: new DOMMatrixReadOnly(getComputedStyle(track).transform).m41, duration: getComputedStyle(track).transitionDuration });
      window.wrapRaf = requestAnimationFrame(sample);
    });
  });
  await page.mouse.move(0, 0);
  await page.waitForTimeout((name === 'mobile' ? 3000 : 5000) + 900);
  await page.mouse.move(300, 150);
  const wrap = await page.evaluate(() => { cancelAnimationFrame(window.wrapRaf); return window.wrapSamples; });
  const duringWrap = wrap.filter(s => s.duration !== '0s' && s.x < -7 * width - 1);
  assert.ok(duringWrap.length > 0, 'The loop animates forward into its first-slide buffer');
  assert.ok(wrap.every(s => s.duration === '0s' || s.x <= -7 * width + 1), 'The loop never animates backwards through intermediate banners');
  assert.equal(await page.locator('.gkb-hero__bullet[aria-current="true"]').getAttribute('aria-label'), 'Go to slide 1: Ray-Ban Meta');
  assert.ok(Math.abs(await page.locator('.gkb-hero__track').evaluate(t => new DOMMatrixReadOnly(getComputedStyle(t).transform).m41)) < 1);
  await page.locator('.gkb-hero__bullet').nth(1).evaluate(b => b.click());
  await page.waitForTimeout(80);
  const restoredTransition = await page.locator('.gkb-hero__track').evaluate(t => getComputedStyle(t).transitionDuration);
  assert.equal(restoredTransition, '.6s'.replace(/^\./, '0.'));
  await page.waitForTimeout(650);

  if (name === 'mobile') {
    const cdp = await context.newCDPSession(page);
    // Slow short drag returns to the same panel without a frozen drag offset.
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 250, y: 400 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y: 400 }] });
    await page.waitForTimeout(400);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(750);
    const offset = await page.locator('.gkb-hero__track').evaluate(t => new DOMMatrixReadOnly(getComputedStyle(t).transform).m41);
    assert.ok(Math.abs(offset + width) < 1, `Short drag did not settle: ${offset}`);
  }
  assert.deepEqual(remote, []);
  results.views[name] = { startup: firstStartup, preparedNext, hoverResume: true, forwardLoop: true, transitionAfterLoop: restoredTransition, shortDrag: name === 'mobile' ? 'passed' : 'not applicable', externalRequests: remote };
  console.log(name, JSON.stringify(results.views[name]));
  await context.close();
}
await browser.close();
await fs.writeFile('validation/gkb-hero/carousel-performance-checks.json', JSON.stringify(results, null, 2));
assert.deepEqual(results.errors, []);
console.log('Carousel loading, pause/resume, looping and drag checks passed.');
