# First hero campaign update

The first hero now uses the supplied eight-second campaign MP4 with six synchronized HTML caption pairs. The development site is running at **http://127.0.0.1:5173/**.

## Files changed

Existing application files modified:

- `src/components/GKBHero.slides.js` — only the first slide's desktop/mobile media paths and campaign flag.
- `src/components/GKBHero.jsx` — integrates the first-slide component and waits for the complete native video playback before advancing this slide.

New application files:

- `src/components/FirstHeroCampaign.jsx` — playback, original-audio controls and timestamp-driven captions.
- `src/components/FirstHeroCampaign.css` — styles scoped to this campaign only, including the revised scene alignment and warm ivory portrait background.
- `public/assets/gkb-hero/Eyewear_campaign_video_sequence_20261021162004.mp4` — exact supplied MP4.
- `public/assets/gkb-hero/first-campaign-manifest.json` — source file, checksum and original media metadata.

Verification/support files:

- Updated `tools/gkb-inspector/validate.mjs` to account for the first slide's full eight-second playback, measured from native playback start rather than component mount.
- Added `tools/gkb-inspector/inspect-first-campaign.mjs`, `verify-first-campaign-media.mjs`, `validate-first-campaign.mjs`, `check-first-campaign-audio.mjs`, and `report-first-campaign.mjs`.
- Added this report and the screenshots, gallery and JSON evidence under `validation/first-hero-campaign/`. The existing general carousel validation captures were refreshed under `validation/gkb-hero/`.

## Video and audio

- Supplied source: `C:/Users/vikas/Downloads/Eyewear_campaign_video_sequence_20261021162004.mp4`.
- Served locally: `/assets/gkb-hero/Eyewear_campaign_video_sequence_20261021162004.mp4`.
- 2,735,128 bytes; 1280 × 720; 16:9; eight-second playback; original H.264 video and stereo AAC audio.
- SHA-256: `b24219282551c185d641b64ecee7752de09d1a97c6594534c3fdb3c5ed310e2a`.
- Local and supplied files have identical checksums. No trimming, re-encoding, audio replacement or speed changes. Native volume remains 1 and playback rate remains 1.

The first video attempts unmuted playback. If browser policy rejects sound autoplay, it retries muted and exposes the existing accessible **Unmute video** button. The chosen mute state persists through the carousel's first-slide buffer. Other videos retain their original muted behavior. Browsers may require a user gesture before allowing sound.

## Final scene timings

Intervals include their start and exclude their end; the native loop resets to scene 1.

| Scene | Seconds | Main headline | Supporting tagline | Desktop placement |
| --- | --- | --- | --- | --- |
| 1 | 0.00–1.29 | Find Your Perfect Fit | Confidence in Every Frame | Left |
| 2 | 1.29–2.63 | Crafted for Clarity | Designed for Everyday Comfort | Upper left |
| 3 | 2.63–3.96 | Own the Sunshine | Bold Looks, Clear Horizons | Right |
| 4 | 3.96–5.17 | Discover Your Look | Find the Frame That Fits | Right, below the background portrait |
| 5 | 5.17–6.50 | Timeless by Design | Confidence Never Fades | Left |
| 6 | 6.50–8.00 | Every Detail Matters | Find Your Signature Frame | Upper left |

Caption selection reads the native video's `currentTime` through `requestVideoFrameCallback`, with `timeupdate` and `seeked` fallbacks. Pauses hold the current text; seeks select the appropriate pair; native looping resets it. A single, fully opaque caption pair is mounted at a time, without fade effects or independent caption timers.

The first video's complete 16:9 picture is contained within the existing hero dimensions. Captions are positioned relative to the actual picture, so their alignment stays consistent across desktop aspect ratios. Desktop captions have no background panels, white gradients, video washes or text shadows. Dark text sits over light scenes and warm white text over dark scenes. Balanced headline wrapping and shared left edges align each headline with its supporting line. The video picture has no added visual effects or transparency.

On portrait tablet/mobile screens, a warm ivory background replaces the black letterboxing. The complete video sits above a consistently left-aligned caption with 30px spacing. Playback controls and pagination use dark tones for contrast on ivory; controls also switch to dark icons for the two bright desktop scenes. Existing carousel dimensions, timings, controls and all other slides are preserved.

## Screenshots and validation

[Open the complete 36-image gallery](validation/first-hero-campaign/index.html), or use the running server at http://127.0.0.1:5173/validation/first-hero-campaign/index.html.

Six scenes were captured at **0.50, 1.80, 3.20, 4.45, 5.70 and 7.00 seconds** at each requested size:

| Viewport | First scene | All six scenes |
| --- | --- | --- |
| Desktop 1920 × 1080 | [Screenshot](validation/first-hero-campaign/desktop-large-scene-1.png) | [Gallery](validation/first-hero-campaign/index.html#desktop-large) |
| Desktop 1440 × 900 | [Screenshot](validation/first-hero-campaign/desktop-scene-1.png) | [Review sheet](validation/first-hero-campaign/desktop-review-sheet.png) |
| Laptop 1366 × 768 | [Screenshot](validation/first-hero-campaign/laptop-scene-1.png) | [Gallery](validation/first-hero-campaign/index.html#laptop) |
| Tablet 768 × 1024 | [Screenshot](validation/first-hero-campaign/tablet-scene-1.png) | [Review sheet](validation/first-hero-campaign/tablet-review-sheet.png) |
| Mobile 390 × 844 | [Screenshot](validation/first-hero-campaign/mobile-scene-1.png) | [Review sheet](validation/first-hero-campaign/mobile-review-sheet.png) |
| Mobile 375 × 812 | [Screenshot](validation/first-hero-campaign/mobile-small-scene-1.png) | [Gallery](validation/first-hero-campaign/index.html#mobile-small) |

Validation commands:

```text
node tools/gkb-inspector/verify-first-campaign-media.mjs
node tools/gkb-inspector/validate-first-campaign.mjs
node tools/gkb-inspector/check-first-campaign-audio.mjs
node tools/gkb-inspector/report-first-campaign.mjs
npm run validate:hero
npm run build
```

- Six viewport layouts and all 36 scene captures passed, including caption bounds and separation from controls. All five boundaries were checked on both sides at every size: 60 boundary checks.
- Pause/seek synchronization, native loop reset, original playback speed and full first-video playback passed.
- Sound-allowed and sound-blocked Chromium policies passed, including manual unmute and retained mute preference. Native-event fallback was tested with `requestVideoFrameCallback` disabled.
- The general carousel suite checks all eight slides, both real videos' changing frames, video controls, keyboard navigation, mobile touch swipe, hover pause and reduced motion.
- No captured browser console errors, React warnings, failed resource requests, horizontal scrolling or clipped caption words.
- Production build passed.

Evidence: [scene checks](validation/first-hero-campaign/results.json), [audio checks](validation/first-hero-campaign/audio-policy-results.json), [media verification](validation/first-hero-campaign/media-verification.json), [scope verification](validation/first-hero-campaign/scope-verification.json), and [general carousel checks](validation/gkb-hero/results.json).

## Preserved scope and limitations

The seven remaining slide definitions and all 29 original media assets are unchanged. SHA-256 checks also confirm the navbar/logo component, its stylesheet, app entry, global styles, existing hero stylesheet, routing container, Vite configuration and dependencies are unchanged. Existing buttons and navigation keep their local destinations. No official-site links or externally hosted media were added to the interface.

No unresolved functional issues were found in the tested Chromium browser. Sound autoplay remains subject to browser policy. Safari/iOS and Firefox were not tested. Narrow layouts intentionally have letterboxing to preserve the whole landscape video and the existing hero dimensions.
