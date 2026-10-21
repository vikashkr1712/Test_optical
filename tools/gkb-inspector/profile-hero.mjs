import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const label = process.argv[2] || 'profile';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe' });
const results = { measuredAt: new Date().toISOString(), label, views: {} };
for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const requests = new Map();
  cdp.on('Network.responseReceived', event => requests.set(event.requestId, { url: event.response.url, bytes: 0 }));
  cdp.on('Network.dataReceived', event => { const request = requests.get(event.requestId); if (request) request.bytes += event.dataLength; });
  await page.addInitScript(() => {
    window.heroProfile = { firstFrameMs: null };
    new MutationObserver(() => {
      const video = document.querySelector('.gkb-hero video');
      if (video && !video.dataset.profiled) {
        video.dataset.profiled = 'true';
        video.requestVideoFrameCallback?.(() => { window.heroProfile.firstFrameMs = performance.now(); });
      }
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.gkb-hero');
  await page.mouse.move(300, 150); // Hold the first slide while measuring startup work.
  await page.waitForTimeout(2500);
  const startup = await page.evaluate(() => ({
    ...window.heroProfile,
    videos: [...document.querySelectorAll('.gkb-hero video')].map(v => ({ src: v.currentSrc, paused: v.paused, time: v.currentTime, frames: v.getVideoPlaybackQuality().totalVideoFrames, width: v.videoWidth })),
    imagesLoaded: [...document.querySelectorAll('.gkb-hero img')].filter(i => i.complete && i.naturalWidth > 0).length,
  }));
  const videoTransfers = [...requests.values()].filter(r => r.url.includes('.mp4'));
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => {
    window.frameTimes = [];
    let last = performance.now();
    window.profileRaf = requestAnimationFrame(function frame(now) {
      window.frameTimes.push(now - last); last = now;
      window.profileRaf = requestAnimationFrame(frame);
    });
  });
  await page.locator('.gkb-hero__bullet').nth(1).evaluate(b => b.click());
  await page.waitForTimeout(80);
  const motion = await page.locator('.gkb-hero__track').evaluate(e => ({ duration: getComputedStyle(e).transitionDuration, easing: getComputedStyle(e).transitionTimingFunction }));
  await page.waitForTimeout(1200);
  const transition = await page.evaluate(() => {
    cancelAnimationFrame(window.profileRaf);
    const values = window.frameTimes.slice(1).sort((a, b) => a - b);
    return { samples: values.length, p95FrameMs: values[Math.floor(values.length * .95)], framesOver34ms: values.filter(v => v > 34).length, duration: getComputedStyle(document.querySelector('.gkb-hero__track')).transitionDuration, easing: getComputedStyle(document.querySelector('.gkb-hero__track')).transitionTimingFunction };
  });
  results.views[name] = { startup, videoTransfers, videoBytes: videoTransfers.reduce((sum, r) => sum + r.bytes, 0), transition: { ...transition, ...motion } };
  await context.close();
  console.log(name, JSON.stringify(results.views[name]));
}
await browser.close();
await fs.mkdir('validation/gkb-hero', { recursive: true });
await fs.writeFile(`validation/gkb-hero/performance-${label}.json`, JSON.stringify(results, null, 2));
