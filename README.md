# Test_optical

A React/Vite eyewear homepage branded candiclie, with a responsive header and eight locally hosted hero slides. The desktop campaign fills the browser width, including screens wider than 1920px. No product sections or footer are included.

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

The production output is in `dist/`. All header and hero navigation stays on this app's own origin. Account, checkout, search, and catalogue destination pages are not implemented yet. The original public media URLs are retained only as research/provenance records; runtime media loads from local files.

The hero uses 600ms eased transitions with a forward loop. Only the visible video plays; upcoming media is prepared without playing hidden videos. The first slide uses the supplied eight-second campaign with six synchronized caption pairs and its original audio. It attempts sound autoplay, with muted playback and an unmute button when the browser requires a gesture. Original reference media is also retained locally.

## Source and validation

- [Implementation report](HERO_IMPLEMENTATION_REPORT.md)
- [First campaign update](FIRST_HERO_CAMPAIGN_REPORT.md)
- [Hero assets and original URLs](public/assets/gkb-hero/manifest.json)
- [Header assets and original URLs](public/assets/gkb-header/manifest.json)
- [Screenshot gallery](validation/gkb-hero/index.html)

To rerun browser checks, install the separate inspection dependencies and start the app first:

```powershell
npm ci --prefix tools/gkb-inspector
npm run dev
# In a second terminal:
npm run validate:hero
```

The browser scripts currently use the Chromium executable installed on this Windows machine. Adjust their executable path when running on another machine. Reference screenshots are dated 21 October 2026; the live source can change.

Generated screenshots, reference captures, local research notes, build output, and dependencies are excluded from Git. Report links to screenshots become available after the corresponding local validation scripts run.
