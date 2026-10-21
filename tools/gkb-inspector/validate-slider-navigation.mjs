import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const target = process.env.GKB_APP_URL || 'http://127.0.0.1:5173/';
const output = 'validation/slider-navigation';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe' });
const results = { target, testedAt: new Date().toISOString(), views: [], errors: [] };

try {
  for (const [name, width, height, touch] of [['desktop', 1440, 900, false], ['tablet', 768, 1024, true], ['mobile', 390, 844, true]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch });
    const page = await context.newPage();
    page.on('pageerror', error => results.errors.push(`${name}: ${error}`));
    page.on('console', message => { if (message.type() === 'error') results.errors.push(`${name}: ${message.text()}`); });
    page.on('response', response => { if (response.status() >= 400) results.errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(target);
    await page.locator('.gkb-hero').waitFor();
    const initialUrl = page.url();
    const navigations = [];
    page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations.push(frame.url()); });
    const bullets = page.locator('.gkb-hero__bullet');
    const clickAt = (x, y) => touch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y);
    async function selected(index, settle = true) {
      await page.waitForFunction(i => document.querySelector('.gkb-hero__bullet[aria-current="true"]')?.getAttribute('aria-label').startsWith(`Go to slide ${i + 1}:`), index);
      if (settle) {
        await page.waitForFunction(() => !document.querySelector('.gkb-hero').classList.contains('gkb-hero--moving'));
        const slide = await page.locator(`.gkb-hero__slide[data-slide="${index}"]`).boundingBox();
        assert.ok(Math.abs(slide.x) < 2, `${name}: slide ${index + 1} must actually be visible`);
      }
      assert.equal(page.url(), initialUrl, `${name}: selecting a marker must not follow a banner link`);
      assert.equal(navigations.length, 0, `${name}: selecting a marker must not reload the app`);
    }
    async function marker(index, offsetY = 0, edge = false, settle = true) {
      const box = await bullets.nth(index).boundingBox();
      assert.ok(box.height >= 44, `${name}: marker needs a usable hit area above and below the visible line`);
      const x = edge ? box.x + (index % 2 ? box.width - 2 : 2) : box.x + box.width / 2;
      const y = box.y + box.height / 2 + offsetY;
      assert.equal(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('button')?.classList.contains('gkb-hero__bullet'), { x, y }), true);
      await clickAt(x, y);
      await selected(index, settle);
    }

    // Real pointer clicks/taps outside the former 4px line, including button edges.
    for (const index of [2, 5, 1, 7, 3, 0, 6, 4]) await marker(index, index % 2 ? 14 : -14, true);
    console.log(`${name}: all eight enlarged marker targets passed.`);

    // Clicking between markers must not hit the collection link behind the row.
    const first = await bullets.nth(0).boundingBox();
    const second = await bullets.nth(1).boundingBox();
    await clickAt((first.x + first.width + second.x) / 2, first.y + first.height / 2);
    await selected(4);

    // Interrupt several in-progress transitions: the latest chosen marker wins.
    for (const index of [7, 1, 6, 2, 5]) {
      await marker(index, 10, false, false);
      await page.waitForTimeout(45);
    }
    await selected(5);
    await page.waitForTimeout(800);
    await selected(5);

    // Keyboard selection uses the same buttons and retains focus behavior.
    await bullets.nth(2).focus();
    await page.keyboard.press('Enter');
    await selected(2);
    await page.keyboard.press('ArrowRight');
    await selected(3);
    await page.keyboard.press('Tab');

    if (touch) {
      const cdp = await context.newCDPSession(page);
      const y = height / 2;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: width * .8, y }] });
      for (let step = 1; step <= 5; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: width * (.8 - step * .12), y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await selected(4);
      await marker(1, -14);

      // Scrolling from a marker is not a tap and must not select another slide.
      const markerBox = await bullets.nth(5).boundingBox();
      const x = markerBox.x + markerBox.width / 2;
      const markerY = markerBox.y + markerBox.height / 2;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: markerY }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: markerY - 60 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await selected(1);
    }

    // After a manual choice, autoplay must give it its full dwell interval.
    await marker(7, 14);
    await page.evaluate(() => document.activeElement?.blur());
    if (!touch) await page.mouse.move(1, 1);
    const interval = width < 768 ? 3000 : 5000;
    await page.waitForTimeout(interval - 500);
    await selected(7);
    await page.waitForFunction(() => document.querySelector('.gkb-hero__bullet[aria-current="true"]')?.getAttribute('aria-label').startsWith('Go to slide 1:'), null, { timeout: 2500 });
    // A marker click during the cloned first-video wrap must override that wrap.
    await marker(3, -14);
    await page.waitForTimeout(800);
    await selected(3);
    await page.screenshot({ path: `${output}/${name}.png` });
    results.views.push({ name, width, height, pointer: touch ? 'touch' : 'mouse', allMarkers: true, gaps: true, rapidSelection: true, keyboard: true, swipe: touch, cancelledTouch: touch, autoplayDwell: true, wrapInterruption: true, unwantedNavigations: navigations.length });
    await context.close();
    console.log(`${name}: rapid clicks, gaps, keyboard, autoplay, and loop interruption passed.`);
  }
  assert.equal(results.errors.length, 0, JSON.stringify(results.errors));
} finally {
  await browser.close();
  await fs.writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
}
console.log('Slider navigation checks passed.');
