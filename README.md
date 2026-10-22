# CandiClie

A React/Vite eyewear site branded candiclie, with a responsive header, eight locally hosted hero slides, featured selections of three larger product cards, collections for him/her/kids, a Ray-Ban editorial banner, five top categories, House of Brands, Community / Seen on the Streets, a full cart page, and a responsive footer. The desktop campaign fills the browser width, including screens wider than 1920px.

## Run

Requires Node.js 22.12 or newer.

```powershell
npm install
npm run dev
```

Open the Local URL printed by Vite, normally http://127.0.0.1:5173/.

```powershell
npm run build
npm run preview
```

The production output is in `dist/`. All header and hero navigation stays on this app's own origin. Header search opens a responsive panel that filters the six featured frames by brand, model, colour and type, with recent searches. Product previews and search results support adding to the cart and saving frames. The bag icon opens `/cart`, with a spacious empty state, Continue shopping and Check my orders actions. Filled carts include quantity controls (up to ten per frame), removal and indicative subtotals. Cart selections, saved frames and search history persist in browser-local storage; unavailable storage falls back to the current visit. Profile opens a centered CandiClie sign-in modal with sign-in/create-account modes and email/mobile validation. Check my orders opens the same modal with order-specific guidance. Authentication, OTP delivery, order history and checkout are not connected; the form states that no code has been sent and does not send or store contact details. Runtime media loads from local files; source URLs and download metadata are retained in local reference records.

For Vercel, import the app at the repository root (`./`). The root `vercel.json` selects Vite, builds with `npm run build`, publishes `dist`, and rewrites application URLs to `index.html` so navigation and direct reloads do not return Vercel's 404 page. `/cart` renders the cart; other destination paths currently render the homepage.

The hero uses 600ms eased transitions with a forward loop. Only the visible video plays; upcoming media is prepared without playing hidden videos. The first slide uses the supplied 20-second `hero_video_no_text_1920x720.mp4`, with its video stream preserved without reencoding at 1920×720 / 20fps. The previous campaign soundtrack repeats to cover the full clip, with a short ending fade. Fifteen larger caption pairs switch at measured scene crossfade midpoints, synchronized with presented video frames. White desktop captions sit over a consistent dark gradient; portrait screens use dark captions below the picture on a solid light background. Play/pause and mute/unmute controls are available, with muted autoplay when browser policy requires it. Other videos retain their existing sound controls. Original reference media is retained locally.

The six still-image slides following the first campaign use newly selected Unsplash eyewear photographs with local desktop/mobile WebP variants. Large captions sit on solid cream or dark green panels, beside the photograph on desktop and below it on portrait screens. Buttons scroll to existing homepage sections. Distant photos remain deferred; only the current and upcoming media are prepared. Taps between pagination markers remain neutral, including when a touch browser retargets the compatibility click to a nearby button. Previous promotional banners and downloaded originals are retained locally and excluded from Git. Google Images showed a traffic check during discovery, so selection continued through the available web image search.

Featured selections have keyboard-accessible tabs and on-page product previews. Audience and category cards open collection previews without leaving the homepage. Product prices are reference observations from 22 October 2026; previews do not implement inventory or checkout.

All eight main navbar labels open detail menus: desktop disclosure panels and mobile accordions. Every submenu option opens a relevant on-page preview with a link to an existing homepage section. Menus support keyboard activation, ArrowDown, Escape, outside-click dismissal, and focus restoration. Contact lens, accessory, offer and gift card details explain the current browsing availability without adding checkout or other pages. Brand names are shared between the directory and navigation; menus add no new image files or dependencies.

House of Brands uses an eight-card horizontal rail with editable sample names, including Aurel, Northline, and CandiClie Studio. The three Community cards reuse Lenskart's current reference photographs temporarily. These display names are creative placeholders, not claims of brand partnerships. Brand and style previews stay on the homepage.

Community matches the reference's smaller centered portraits and 450ms hover expansion within fixed card space. Heading fonts are served locally, captions are compact and uppercase, and touch layouts use a horizontal rail. Keyboard focus supports the same expansion, with animations disabled for reduced motion.

The footer combines dark styling and grouped navigation inspired by premium eyewear retailers, with in-page shopping/style/privacy help and a keyboard-accessible back-to-top control. Its links target existing sections. It adds no image downloads, third-party scripts, or new dependencies.

Typography uses 14–16px for supporting copy and actions, 18–19px for product models and prices, and stronger weights for headings and important links. Small decorative indices and collection labels remain subordinate. Responsive checks cover seven widths from 320px to 2560px; browser scripts and results remain local.

Collection and editorial imagery is locally hosted as responsive WebP variants, loaded lazily with reserved layout space. A device requests only the applicable variants; community photos are not enlarged beyond the source resolution. A preloaded 40 KB first-frame poster keeps the hero visible while its video loads. Hero videos and autoplay pause when the hero leaves the viewport; distant hero images load only when active or next. No new JavaScript dependencies or third-party runtime requests are added.

## Deployment files

The repository contains application source, used images/fonts/videos in `public`, the root package files, build/deployment configuration, and this README. Lifestyle photos include Unsplash imagery; editorial reference photos are temporary. Original source URLs, inventories, hashes, and download metadata remain locally under `reference`.

Generated screenshots, source records, project notes, unused media, browser tests and inspection tools, build output, and dependencies are kept locally and excluded from Git and deployment.

Push changes to GitHub only when explicitly requested by the project owner.
