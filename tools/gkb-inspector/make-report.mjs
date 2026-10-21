import fs from 'node:fs/promises';
const m=JSON.parse(await fs.readFile('public/assets/gkb-hero/manifest.json','utf8'));
const r=JSON.parse(await fs.readFile('validation/gkb-hero/results.json','utf8'));
const before=JSON.parse(await fs.readFile('validation/gkb-hero/performance-before.json','utf8'));
const after=JSON.parse(await fs.readFile('validation/gkb-hero/performance-after.json','utf8'));
const performanceRows=Object.keys(after.views).map(name=>{
 const b=before.views[name],a=after.views[name];
 return `| ${name} | ${Math.round(b.startup.firstFrameMs)} → ${Math.round(a.startup.firstFrameMs)} ms | ${b.startup.videos.filter(v=>!v.paused).length} → ${a.startup.videos.filter(v=>!v.paused).length} | ${(b.videoBytes/1e6).toFixed(1)} → ${(a.videoBytes/1e6).toFixed(1)} MB |`;
}).join('\n');
const rows=m.slides.map(s=>{
 const d=m.downloads.find(a=>a.file===s.desktop),b=m.downloads.find(a=>a.file===s.mobile);
 return `| ${s.index}. ${s.name} | ${s.animated?'HTML5 MP4 video':'Static image'} | [${d.file.split('/').pop()}](public${d.file}) | [${b.file.split('/').pop()}](public${b.file}) | [Desktop source](${d.sourceURL}) / [Mobile source](${b.sourceURL}) |`;
}).join('\n');
const originalRows=m.downloads.filter(a=>!a.variant).map(a=>`| [${a.file.split('/').pop()}](public${a.file}) | ${a.contentType} | ${a.width ? `${a.width} × ${a.height}` : 'Font'} | [Original URL](${a.sourceURL}) |`).join('\n');
const comparisons=Object.entries(r.views).map(([name,v])=>{
 const scores=v.slides.filter(s=>s.comparison).map(s=>s.comparison.percentDifferentOver10);
 return `| ${name} | ${v.rect.width} × ${v.rect.height} | ${Math.max(...scores).toFixed(3)}% | ${v.videos.every(v=>v.changingFrames)?'Both videos passed':'Check results'} |`;
}).join('\n');
const report=`# GKB homepage hero implementation

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
${rows}

Original files retained alongside the browser variants:

| Local original | Type | Resolution | Public source |
| --- | --- | --- | --- |
${originalRows}

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
${performanceRows}

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
${comparisons}

*Percentage of pixels whose maximum RGB-channel difference exceeds 10/255. This threshold is an explicit comparison metric, not a claim of perfect identity. Natural video captures are not pixel-diffed because video clocks differ.

Production build passed. All three viewport validations passed: eight slides, local media loading, no horizontal overflow, pagination, autoplay at six seconds, hover pause, keyboard arrows, both real videos advancing in time and decoded frame count, changing video screenshots, play/pause, mute/unmute, mobile touch swipe, and reduced-motion behaviour. Recorded browser/console/HTTP errors: ${r.errors.length}.

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
`;
await fs.writeFile('HERO_IMPLEMENTATION_REPORT.md',report);
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GKB hero comparisons</title><style>body{font:16px system-ui;margin:24px;background:#f3f3f3;color:#111}label{margin-right:20px}select{font:inherit;padding:6px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}img{width:100%;height:auto;background:white}figure{margin:0}figcaption{padding:12px 0}p{max-width:1000px}@media(max-width:800px){.grid{grid-template-columns:1fr}}</style><h1>GKB hero comparisons</h1><p>Original media; hero crops only. Reference header and signup/chat overlays are outside scope. Video screenshots show naturally different playback instants. Use frame-a/frame-b files for changing-frame evidence.</p><label>Viewport <select id="view"><option>desktop</option><option>tablet</option><option>mobile</option></select></label><label>Slide <select id="slide">${m.slides.map(s=>`<option value="${String(s.index).padStart(2,'0')}">${s.index}: ${s.name}</option>`).join('')}</select></label><div class="grid"><figure><figcaption>Reference</figcaption><img id="reference"></figure><figure><figcaption>Local React component</figcaption><img id="local"></figure></div><p><a id="diff">Amplified pixel difference (still images only)</a> · <a href="results.json">Validation results</a> · <a href="../../HERO_IMPLEMENTATION_REPORT.md">Full report and source URLs</a></p><script>function update(){const v=document.getElementById('view').value,n=document.getElementById('slide').value;document.getElementById('reference').src='../../reference/gkb-hero/'+v+'-hero-'+n+'.png';document.getElementById('local').src=v+'-hero-'+n+'.png';const d=document.getElementById('diff');d.href=v+'-diff-'+n+'.png';d.style.display=['01','03'].includes(n)?'none':'inline'}document.getElementById('view').onchange=update;document.getElementById('slide').onchange=update;update()</script></html>`;
await fs.writeFile('validation/gkb-hero/index.html',html);
console.log('Wrote implementation report and comparison gallery.');
