# GKB homepage hero implementation

Reviewed and validated on 21 October 2026 (Asia/Kolkata). Reference: [GKB homepage](https://www.gkboptical.com/).

## Integration status

The user authorised creating the app in this folder. The hero is now integrated into a complete minimal React/Vite project at the root, with a responsive supporting header to retain the reference's hero positioning. The homepage contains only the header and hero; no product sections, footer, backend, account or checkout implementation is included. All header and hero destinations now remain on the local app. Destination pages beyond the homepage are not yet implemented.

The attached COPILOT_PROMPT.md, IMPLEMENTATION_PLAN.md and ZIP were read as supporting instructions. Their suggested capture helper was inspected. A targeted capture was implemented because the supplied helper can collect unrelated large images and does not inspect every slide.

## Application files

- package.json, package-lock.json, vite.config.js, index.html: root React/Vite setup with development, production build and preview commands.
- src/main.jsx, src/App.jsx, src/index.css: app entry point, homepage composition and minimal global styles.
- src/components/GKBHeader.jsx and GKBHeader.css: responsive supporting header, original logo and eye-test artwork, mobile menu and source-site navigation.
- public/assets/gkb-header/: original header logo, eye-test icon, Avenir Book font, and a separate source manifest.
- [src/components/GKBHero.jsx](src/components/GKBHero.jsx): eight-slide carousel, genuine HTML5 video, controls, autoplay, hover pause, pointer/touch swiping, keyboard navigation, and reduced-motion handling.
- [src/components/GKBHero.css](src/components/GKBHero.css): scoped reference dimensions, cover/contain rules, CTA font and styling, pagination, and breakpoints.
- [src/components/GKBHero.slides.js](src/components/GKBHero.slides.js): local desktop/mobile media and exact destination paths.
- [public/assets/gkb-hero/manifest.json](public/assets/gkb-hero/manifest.json): source URL mapping, hashes, dimensions, content types, single-frame image verification and video durations.
- [.gitignore](.gitignore): ignores local dependencies, npm cache, and generated preview build.
- tools/gkb-inspector/: separate package/lock files, reference capture scripts, original/CDN-response downloading, metadata inspection, preview, validation, and report generation. Browser tooling is separate from the app's runtime dependencies. The hero adds no carousel dependency.
- reference/gkb-hero/: screenshots and inspection evidence.
- validation/gkb-hero/: implementation screenshots, pixel differences, changing-video frames, results, and comparison gallery.
- HERO_IMPLEMENTATION_REPORT.md: this handoff.

## Media actually used by the hero

All files are local. There are four original MP4 files (two campaigns with desktop/mobile variants), twelve original PNG/JPEG files, twelve exact CDN-served WebP/AVIF responses, and one font file. No blocked downloads and no generated imagery. The CDN returns different content types from the source URL extensions; both the originals and browser-displayed responses are retained without re-encoding. Only the browser responses are used for the static slides to match the reference pixels.

| Slide | Media | Local desktop/tablet | Local mobile | Original public URLs |
| --- | --- | --- | --- | --- |
| 1. Ray-Ban Meta | HTML5 MP4 video | [slide-01-desktop.mp4](public/assets/gkb-hero/slide-01-desktop.mp4) | [slide-01-mobile.mp4](public/assets/gkb-hero/slide-01-mobile.mp4) | [Desktop source](https://media.gkboptical.com/media/components/tmp/attachment/RW_JEN_SUN_EN_US_SOCIAL_1920x1080px_24T_15s_1_1.mp4) / [Mobile source](https://media.gkboptical.com/media/components/tmp/attachment/RW_JEN_SUN_EN_US_SOCIAL_1080x1920px_24T_15s_1_1_.mp4) |
| 2. festive-sale | Static image | [slide-02-desktop-browser.webp](public/assets/gkb-hero/slide-02-desktop-browser.webp) | [slide-02-mobile-browser.avif](public/assets/gkb-hero/slide-02-mobile-browser.avif) | [Desktop source](https://media.gkboptical.com/media/components/tmp/attachment/Home_Page_2.png) / [Mobile source](https://media.gkboptical.com/media/components/tmp/attachment/Home_Page_3.png) |
| 3. Inspira | HTML5 MP4 video | [slide-03-desktop.mp4](public/assets/gkb-hero/slide-03-desktop.mp4) | [slide-03-mobile.mp4](public/assets/gkb-hero/slide-03-mobile.mp4) | [Desktop source](https://media.gkboptical.com/media/components/tmp/attachment/Home_Page_Banner_Vid_-_Desktop_1.mp4) / [Mobile source](https://media.gkboptical.com/media/components/tmp/attachment/Home_Page_Banner_Vid_-_Mobile_1.mp4) |
| 4. New Arrivals | Static image | [slide-04-desktop-browser.webp](public/assets/gkb-hero/slide-04-desktop-browser.webp) | [slide-04-mobile-browser.webp](public/assets/gkb-hero/slide-04-mobile-browser.webp) | [Desktop source](https://media.gkboptical.com/media/components/tmp/attachment/1920-X-850-New-Arrivals_Home_Page_Banner_2.jpg) / [Mobile source](https://media.gkboptical.com/media/components/tmp/attachment/393-X-807-New-Arrivals_mob_Home_Page_Banner_2.jpg) |
| 5. Contact lens | Static image | [slide-05-desktop-browser.webp](public/assets/gkb-hero/slide-05-desktop-browser.webp) | [slide-05-mobile-browser.webp](public/assets/gkb-hero/slide-05-mobile-browser.webp) | [Desktop source](https://media.gkboptical.com/media/components/tmp/attachment/Contact_Lens_web_Banner_-_Home_page_-_1920_px_x_850px_3.jpg) / [Mobile source](https://media.gkboptical.com/media/components/tmp/attachment/Contact_Lens_web_Banner_-_Home_page-Mobile_-_393_px_x_807px_3.jpg) |
| 6. Stores | Static image | [slide-06-desktop-browser.webp](public/assets/gkb-hero/slide-06-desktop-browser.webp) | [slide-06-mobile-browser.avif](public/assets/gkb-hero/slide-06-mobile-browser.avif) | [Desktop source](https://media.gkboptical.com/media/components/tmp/attachment/Banner_top_-_Desktop_1__1.png) / [Mobile source](https://media.gkboptical.com/media/components/tmp/attachment/Banner_top_-_Mobile_1.png) |
| 7. VAVA | Static image | [slide-07-desktop-browser.webp](public/assets/gkb-hero/slide-07-desktop-browser.webp) | [slide-07-mobile-browser.webp](public/assets/gkb-hero/slide-07-mobile-browser.webp) | [Desktop source](https://media.gkboptical.com/media/components/tmp/attachment/VAVA_desktop_1.png) / [Mobile source](https://media.gkboptical.com/media/components/tmp/attachment/VAVA_-_Web_Banner_393px_X_807px_2_1.jpg) |
| 8. Mclaren | Static image | [slide-08-desktop-browser.webp](public/assets/gkb-hero/slide-08-desktop-browser.webp) | [slide-08-mobile-browser.avif](public/assets/gkb-hero/slide-08-mobile-browser.avif) | [Desktop source](https://media.gkboptical.com/media/components/tmp/attachment/McLaren_Banner_-_Website_-_Desktop_without_SHOP_NOW_button_1920px_x_850px.jpg) / [Mobile source](https://media.gkboptical.com/media/components/tmp/attachment/McLaren_Banner_-_Website_-_Mobile_without_SHOP_NOW_button_393px_x_807px.jpg) |

Original files retained alongside the browser variants:

| Local original | Type | Resolution | Public source |
| --- | --- | --- | --- |
| [slide-01-desktop.mp4](public/assets/gkb-hero/slide-01-desktop.mp4) | video/mp4 | 1920 × 1080 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/RW_JEN_SUN_EN_US_SOCIAL_1920x1080px_24T_15s_1_1.mp4) |
| [slide-02-desktop.png](public/assets/gkb-hero/slide-02-desktop.png) | image/png | 1920 × 850 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/Home_Page_2.png) |
| [slide-03-desktop.mp4](public/assets/gkb-hero/slide-03-desktop.mp4) | video/mp4 | 1920 × 850 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/Home_Page_Banner_Vid_-_Desktop_1.mp4) |
| [slide-04-desktop.jpg](public/assets/gkb-hero/slide-04-desktop.jpg) | image/jpeg | 1920 × 850 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/1920-X-850-New-Arrivals_Home_Page_Banner_2.jpg) |
| [slide-05-desktop.jpg](public/assets/gkb-hero/slide-05-desktop.jpg) | image/jpeg | 3840 × 1700 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/Contact_Lens_web_Banner_-_Home_page_-_1920_px_x_850px_3.jpg) |
| [slide-06-desktop.png](public/assets/gkb-hero/slide-06-desktop.png) | image/png | 1920 × 850 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/Banner_top_-_Desktop_1__1.png) |
| [slide-07-desktop.png](public/assets/gkb-hero/slide-07-desktop.png) | image/png | 1920 × 850 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/VAVA_desktop_1.png) |
| [slide-08-desktop.jpg](public/assets/gkb-hero/slide-08-desktop.jpg) | image/jpeg | 3840 × 1700 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/McLaren_Banner_-_Website_-_Desktop_without_SHOP_NOW_button_1920px_x_850px.jpg) |
| [slide-01-mobile.mp4](public/assets/gkb-hero/slide-01-mobile.mp4) | video/mp4 | 1080 × 1920 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/RW_JEN_SUN_EN_US_SOCIAL_1080x1920px_24T_15s_1_1_.mp4) |
| [slide-02-mobile.png](public/assets/gkb-hero/slide-02-mobile.png) | image/png | 393 × 807 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/Home_Page_3.png) |
| [slide-03-mobile.mp4](public/assets/gkb-hero/slide-03-mobile.mp4) | video/mp4 | 392 × 806 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/Home_Page_Banner_Vid_-_Mobile_1.mp4) |
| [slide-04-mobile.jpg](public/assets/gkb-hero/slide-04-mobile.jpg) | image/jpeg | 1572 × 3228 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/393-X-807-New-Arrivals_mob_Home_Page_Banner_2.jpg) |
| [slide-05-mobile.jpg](public/assets/gkb-hero/slide-05-mobile.jpg) | image/jpeg | 1572 × 3228 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/Contact_Lens_web_Banner_-_Home_page-Mobile_-_393_px_x_807px_3.jpg) |
| [slide-06-mobile.png](public/assets/gkb-hero/slide-06-mobile.png) | image/png | 393 × 807 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/Banner_top_-_Mobile_1.png) |
| [slide-07-mobile.jpg](public/assets/gkb-hero/slide-07-mobile.jpg) | image/jpeg | 2000 × 4107 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/VAVA_-_Web_Banner_393px_X_807px_2_1.jpg) |
| [slide-08-mobile.jpg](public/assets/gkb-hero/slide-08-mobile.jpg) | image/jpeg | 786 × 1614 | [Original URL](https://media.gkboptical.com/media/components/tmp/attachment/McLaren_Banner_-_Website_-_Mobile_without_SHOP_NOW_button_393px_x_807px.jpg) |
| [avenir-regular.woff2](public/assets/gkb-hero/avenir-regular.woff2) | font/woff2 | Font | [Original URL](https://www.gkboptical.com/_next/static/media/Avenir_Regular-s.p.0ap_1jemjx0wf.woff2) |

All static image variants were decoded with ImageDecoder and confirmed to contain one frame; there are no animated GIF/WebP/AVIF banners. The reference supplies no video posters. Videos use their real decoded frames, including when paused for reduced motion.

## Matched layout and behaviour

- Desktop viewport 1440 × 900: hero begins at y=112 and measures 1440 × 788.
- Tablet viewport 768 × 1024: hero begins at y=56 and measures 768 × 912. The source still subtracts 112px for hero height at this width; that behaviour is retained.
- Mobile viewport 390 × 844: hero begins at y=56 and measures 390 × 788.
- Mobile-specific media below 768px. Desktop imagery uses object-fit: cover; mobile static banners use full-width natural image height inside the viewport-height slide. Videos cover the slide at every width.
- 5,000ms slide delay on desktop/tablet and 3,000ms on mobile are retained. The reference used 700ms linear motion; at the user's request for smoother changes, the app now uses 600ms eased transitions. The next delay starts after the transition. A first-slide buffer lets the last-to-first change travel one panel forward and reset invisibly, instead of sweeping backwards through every banner.
- Eight clickable pagination bars, including the active bar's exact black shadow. There are no reference navigation arrows. Pagination sits 48px from the bottom above 768px and 20px at/below 768px.
- CTAs sit 10% above the slide bottom. Source Avenir Regular is used at weight 500, 16px/24px desktop and 14px/20px mobile. Embedded banner copy is not repeated in HTML.
- Videos are muted, autoplaying, looping and playsInline, with play/pause and mute/unmute controls. Pointer hover pauses the carousel, not the video, as in the reference.

## Smoothness and loading improvements

Only the visible video plays. Distant videos have no source attached at startup, and upcoming video is prepared with metadata without playing it. Offscreen videos pause on slide changes and when the document is hidden. Upcoming images receive priority while distant banners load lazily. All original media files, quality, and resolution are retained.

Pointer dragging updates the track once per animation frame instead of rerendering the slide tree for every pointer event. Slide content is memoized, compositing is enabled while moving, and transitions use eased 600ms motion. Hover timer bookkeeping was repaired so clicking while paused does not cause an instant skip on resume. Forward looping, the transition after a loop, and slow short-drag snap-back have dedicated browser regression checks.

Local fresh-context measurements, sampled about 2.5 seconds after startup:

| View | First displayed video frame, before → after | Playing videos | Video bytes received, before → after |
| --- | --- | --- | --- |
| desktop | 642 → 498 ms | 2 → 1 | 45.7 → 40.6 MB |
| mobile | 447 → 327 ms | 2 → 1 | 42.9 → 40.9 MB |

These are local Chromium samples, not a guarantee for other devices or network speeds. The original first video is approximately 40 MB for each responsive variant; slower connections can still buffer because the user requested preserving original media quality. No video was re-encoded or replaced.

- [Before measurements](validation/gkb-hero/performance-before.json)
- [After measurements](validation/gkb-hero/performance-after.json)
- [Loading, loop, hover, and drag regression checks](validation/gkb-hero/carousel-performance-checks.json)

## Validation and screenshot locations

The source signup modal was dismissed and the unrelated third-party floating chat hidden for clean reference captures. Full-viewport implementation screenshots now show the integrated app's supporting header. Pixel comparisons crop to the hero; the new header is supporting context and is not claimed to reproduce the source's entire menu system.

- [Screenshot comparison gallery](validation/gkb-hero/index.html)
- [Machine-readable validation](validation/gkb-hero/results.json)
- [Production build browser checks](validation/gkb-hero/production-results.json)
- Production viewport screenshots: validation/gkb-hero/production-desktop.png, production-tablet.png, and production-mobile.png.
- [Supporting header asset URLs](public/assets/gkb-header/manifest.json)
- [Reference measurements and slide HTML](reference/gkb-hero/inspection.json)
- [Computed reference styles](reference/gkb-hero/details.json)

For each desktop/tablet/mobile prefix:

- reference/gkb-hero/PREFIX-initial.png and PREFIX-after-6s.png: original at first capture and six seconds later.
- reference/gkb-hero/PREFIX-slide-01.png through PREFIX-slide-08.png: all eight original slides, full viewport.
- validation/gkb-hero/PREFIX-initial.png and PREFIX-after-6s.png: equivalent local capture pair.
- validation/gkb-hero/PREFIX-slide-01.png through PREFIX-slide-08.png: all eight local slides, full viewport.
- Both folders also contain PREFIX-hero-01.png through PREFIX-hero-08.png: hero crops.
- validation/gkb-hero/PREFIX-diff-NN.png: amplified pixel differences for the six still slides.
- validation/gkb-hero/PREFIX-video-NN-frame-a.png and frame-b.png: visibly changing decoded frames for slides 01 and 03.

| View | Hero dimensions | Worst still-slide difference* | Playback verification |
| --- | --- | --- | --- |
| desktop | 1440 × 788 | 1.256% | Both videos passed |
| tablet | 768 × 912 | 0.095% | Both videos passed |
| mobile | 390 × 788 | 2.195% | Both videos passed |

*Percentage of pixels whose maximum RGB-channel difference exceeds 10/255. This threshold is an explicit comparison metric, not a claim of perfect identity. Natural video captures are not pixel-diffed because video clocks differ.

Production build passed. All three viewport validations passed: eight slides, local media loading, no horizontal overflow, pagination, autoplay at six seconds, hover pause, keyboard arrows, both real videos advancing in time and decoded frame count, changing video screenshots, play/pause, mute/unmute, mobile touch swipe, and reduced-motion behaviour. Recorded browser/console/HTTP errors: 0.

## Run and integrate

The root app renders GKBHeader followed by GKBHero. The component uses only local CTA paths. It does not create ecommerce routes. The application does not need the browser tooling dependencies to run or build.

Hero height offsets are configurable with --gkb-hero-desktop-offset and --gkb-hero-mobile-offset. Defaults intentionally match the reference (112px and 56px). Check the actual host header before integration.

To run the app from this workspace:

    npm install
    npm run dev

Open http://127.0.0.1:5173/ while the server runs. To rerun validation, also install tools/gkb-inspector dependencies. The scripts use the installed Chromium at the inspected Windows location; update executablePath when moving the tooling to another machine.

    npm run build
    npm run preview
    npm run validate:hero

## Remaining differences and limitations

1. The header is a supporting reproduction of the visible navigation, not the complete GKB ecommerce menu system. Search, account, cart and catalogue links use local paths; their destination pages are not implemented yet. No ecommerce backend is included.
2. Minor image rasterisation, CTA alignment and control rendering differences are visible in the saved diffs. Hero dimensions and original media are retained.
3. Videos use the identical original files, but natural screenshots capture different playback instants. No claim of frame-synchronised video pixel identity is made.
4. The carousel is a focused React implementation of the observed behaviour rather than the source's Swiper internals. Motion and loading were subsequently optimised at the user's request, so easing and the last-to-first transition deliberately differ from the original. Edge resistance and swipe thresholds are reproduced, but touch inertia and interrupted-transition details can differ. Keyboard focus and reduced-motion intentionally pause autoplay for accessibility.
5. Validation used Chromium on this Windows machine against the root app. Safari/iOS hardware playback and other browsers have not been tested. No backend, checkout or other homepage sections were created.
6. No source assets were blocked. GKB's media and font remain third-party assets; obtain appropriate permission before public production reuse.
