# First hero campaign update

The candiclie homepage uses a cleaned copy of the supplied eight-second campaign MP4 with six synchronized HTML caption pairs. The desktop hero now fills the browser width without side gaps. The development site is running at **http://127.0.0.1:5173/**.

## Files changed

Existing application files modified:

- `src/components/GKBHero.slides.js` — only the first slide's desktop/mobile media paths and campaign flag.
- `src/components/GKBHero.jsx` — integrates the first-slide component and waits for the complete native video playback before advancing this slide.
- `src/components/GKBHeader.jsx` and `src/components/GKBHeader.css` — replace the GKB image logo with a responsive candiclie wordmark and update announcement copy.
- `src/index.css` — remove the 1920px page-width cap.
- `index.html` — candiclie page title and description; the carousel accessibility label also uses candiclie.

New application files:

- `src/components/FirstHeroCampaign.jsx` — playback, original-audio controls and timestamp-driven captions.
- `src/components/FirstHeroCampaign.css` — styles scoped to this campaign only, including the revised scene alignment and warm ivory portrait background.
- `public/assets/gkb-hero/Eyewear_campaign_video_sequence_20261021162004.mp4` — exact supplied MP4.
- `public/assets/gkb-hero/Eyewear_campaign_video_sequence_clean.mp4` — displayed copy with the embedded Gemini mark removed locally.
- `public/assets/gkb-hero/first-campaign-manifest.json` — original/cleaned checksums, cleanup region, media metadata and encoded audio verification.

Verification/support files:

- Updated `tools/gkb-inspector/validate.mjs` to account for the first slide's full eight-second playback, measured from native playback start rather than component mount.
- Added `tools/gkb-inspector/inspect-first-campaign.mjs`, `verify-first-campaign-media.mjs`, `validate-first-campaign.mjs`, `check-first-campaign-audio.mjs`, and `report-first-campaign.mjs`.
- Added this report and the screenshots, gallery and JSON evidence under `validation/first-hero-campaign/`. The existing general carousel validation captures were refreshed under `validation/gkb-hero/`.

## Video and audio

- Supplied source: `C:/Users/vikas/Downloads/Eyewear_campaign_video_sequence_20261021162004.mp4`.
- Served locally: `/assets/gkb-hero/Eyewear_campaign_video_sequence_clean.mp4`.
- Cleaned copy: 2,952,297 bytes; 1280 × 720; 16:9; eight seconds; 24 fps; all 192 video frames retained.
- Cleaned SHA-256: `50592c12d00774908a519c9e8f1c62a16fb2aec458fd15a321cd3310e106198f`.
- The original local file remains unchanged: 2,735,128 bytes, SHA-256 `b24219282551c185d641b64ecee7752de09d1a97c6594534c3fdb3c5ed310e2a`.
- Removing the embedded mark requires re-encoding the video. FFmpeg's localized `delogo` filter reconstructs the 56 × 56 region at `(1132, 572)`, using H.264 CRF 16. There is no cropping, scaling, speed change, global shading or added imagery. The reconstructed area can be slightly softer than the surrounding original texture.
- Audio is copied without re-encoding. All 376 original stereo AAC sample payloads match byte-for-byte, SHA-256 `0d9f953add2e9765cfb67c7eedb1177bf63f08e3dc877ea3348c64d25f85bf0d`. Native volume remains 1 and playback rate remains 1.

Reproduce the cleaned asset with a full FFmpeg build:

```text
ffmpeg -i public/assets/gkb-hero/Eyewear_campaign_video_sequence_20261021162004.mp4 -map 0:v:0 -map 0:a:0 -vf delogo=x=1132:y=572:w=56:h=56 -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a copy -map_metadata 0 -movflags +faststart public/assets/gkb-hero/Eyewear_campaign_video_sequence_clean.mp4
```

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

The source video retains its native 16:9 aspect ratio. On desktop, the first campaign fills the existing hero using `object-fit: cover` and top-center positioning, eliminating both side bars without stretching the image. Some vertical or horizontal cropping can occur as the viewport aspect ratio changes; top alignment protects the faces. The page itself is no longer capped at 1920px, so the header and hero also span wider displays. Portrait tablet/mobile layouts retain the complete landscape picture above their captions.

After comparing charcoal, espresso and slate on the actual frames, the woman and shop scenes use the same neutral charcoal (`#181818`). The outdoor man scene restores the earlier dark slate (`#253038`) for contrast against the pale sky. The other three scenes retain white (`#fff`). There are no caption background panels, white gradients, video washes, text shadows or transparency effects. Balanced headline wrapping and shared left edges align each headline with its supporting line. Text anchors and font sizes remain unchanged; the first heading has a compact maximum width on desktop to keep its words clear of the woman's dark hair.

On portrait tablet/mobile screens, the warm ivory background remains. The complete video sits above a consistently left-aligned caption with 30px spacing. This caption is outside the video and retains dark text for contrast on ivory. Playback controls and pagination use dark tones for contrast on ivory; controls also switch to dark icons for the two bright desktop scenes. Existing carousel dimensions, timings, controls and all other slides are preserved.

## Screenshots and validation

[Open the complete 42-image gallery](validation/first-hero-campaign/index.html), or use the running server at http://127.0.0.1:5173/validation/first-hero-campaign/index.html.

[Neutral color comparison on the woman and shop scenes](validation/first-hero-campaign/neutral-color-comparison.png).

Six scenes were captured at **0.50, 1.80, 3.20, 4.45, 5.70 and 7.00 seconds** at each requested size:

| Viewport | First scene | All six scenes |
| --- | --- | --- |
| Ultrawide 2560 × 1440 | [Screenshot](validation/first-hero-campaign/ultrawide-scene-1.png) | [Gallery](validation/first-hero-campaign/index.html#ultrawide) |
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

- Seven viewport layouts and all 42 scene captures passed, including full viewport width, video coverage without side bars, caption bounds and separation from controls. All five boundaries were checked on both sides at every size: 70 boundary checks.
- The production header was separately checked at widths 320, 390, 768, 1024, 1440 and 2560px. The candiclie wordmark and navigation have no overlapping controls or horizontal overflow; mobile menus and announcements work. Run `node tools/gkb-inspector/smoke-app.mjs` with `npm run preview` serving the production build on port 4173 to repeat these checks.
- Pause/seek synchronization, native loop reset, original playback speed and full first-video playback passed.
- Sound-allowed and sound-blocked Chromium policies passed, including manual unmute and retained mute preference. Native-event fallback was tested with `requestVideoFrameCallback` disabled.
- MP4 sample-table verification confirms the complete eight-second duration, 192 video frames and unchanged encoded AAC audio in the cleaned copy. All six scenes were inspected for successful mark removal.
- The general carousel suite checks all eight slides, both real videos' changing frames, video controls, keyboard navigation, mobile touch swipe, hover pause and reduced motion.
- No captured browser console errors, React warnings, failed resource requests, horizontal scrolling or clipped caption words.
- Production build passed.

Evidence: [scene checks](validation/first-hero-campaign/results.json), [audio checks](validation/first-hero-campaign/audio-policy-results.json), [media verification](validation/first-hero-campaign/media-verification.json), [scope verification](validation/first-hero-campaign/scope-verification.json), and [general carousel checks](validation/gkb-hero/results.json).

## Preserved scope and limitations

The seven remaining slide definitions and all 29 original media assets are unchanged. The user-authorized rebrand updates the header wordmark, announcement copy, page metadata and carousel accessibility label. The user-authorized layout change removes the global page-width cap and changes the first campaign's desktop fitting. SHA-256 checks confirm that the app entry, existing general hero stylesheet, routing container, Vite configuration and dependencies remain unchanged. Existing buttons and navigation keep their local destinations. No official-site links or externally hosted media were added to the interface.

No unresolved functional issues were found in the tested Chromium browser. Sound autoplay remains subject to browser policy. Safari/iOS and Firefox were not tested. Narrow layouts intentionally have letterboxing to preserve the whole landscape video and the existing hero dimensions.
