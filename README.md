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

For Vercel, import the app at the repository root (`./`). The root `vercel.json` selects Vite, builds with `npm run build`, publishes `dist`, and rewrites application URLs to `index.html` so navigation and direct reloads do not return Vercel's 404 page. These URLs currently render the same homepage hero; separate destination pages are outside this project's scope.

The hero uses 600ms eased transitions with a forward loop. Only the visible video plays; upcoming media is prepared without playing hidden videos. The first slide uses the supplied eight-second campaign with six synchronized caption pairs and its original audio. It attempts sound autoplay, with muted playback and an unmute button when the browser requires a gesture. Original reference media is also retained locally.

## Asset sources

- [Hero assets and original URLs](public/assets/gkb-hero/manifest.json)
- [Header assets and original URLs](public/assets/gkb-header/manifest.json)

Generated screenshots, reference captures, project reports and notes, unused original media, local browser tests and inspection tools, build output, and dependencies are kept locally and excluded from Git. README and asset provenance manifests are retained in the repository.

Push changes to GitHub only when explicitly requested by the project owner.
