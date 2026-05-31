# influence-sensor

Find out **how captured your social feed is** — which accounts actually own your attention,
not just who you follow. Drop your Instagram data export and get a health score, an
interactive graph, and the raw numbers behind it.

Everything runs in your browser. Your export is never uploaded or stored — a strict
Content-Security-Policy (`connect-src 'none'`) makes that enforceable, not just a promise.

<!-- ![screenshot](docs/screenshot.png) — add after first run -->

## Use it

1. In Instagram, go to **Settings → Accounts Center → Your information and permissions →
   Download your information**, choose **"Some of your information"**, and tick:
   **Likes · Comments · Saved · Story interactions · Followers and following**.
2. Set **Format: JSON** (not HTML) and **Date range: All time**. (Liked *posts* can't be analysed
   — Instagram no longer exports the post author — so **Story interactions** is what gives the
   richest result.)
3. Open the app and drop — or pick — the `.zip` you received. Read your report. Nothing leaves
   your machine.

## How the health score works

The verdict is a **0–100 score** (banded **Captured** / **Moderate** / **Healthy**), combining two
opposing signals from how your interactions spread across accounts:

- **Diversity** — normalized entropy of your attention, in `[0, 1]`. Higher = more evenly spread.
- **Concentration** — the share of your attention held by your top 10 accounts. Higher = riskier.

```
health = round(100 * (0.5 * diversity + 0.5 * (1 - top10Share)))
band   = health >= 66 ? "Healthy" : health >= 33 ? "Moderate" : "Captured"
```

It is a **transparent heuristic, not a scientific measurement** — the app always shows the
components and the raw ranked data next to it, so the number is never a black box. It measures
*attention spent* (likes, comments, saves), because that — not your follow list — is what reflects
who actually influences you.

## Privacy

- **No backend, no upload, no storage.** Your export is parsed in memory and discarded when you
  close the tab — nothing is written to `localStorage`, `IndexedDB`, or cookies.
- **`connect-src 'none'`** in the page's Content-Security-Policy means the browser *blocks* any
  network request the app could try to make. It is open source and statically hosted, so you can
  verify all of this yourself.

## Develop

```bash
npm install
npm run dev      # local dev server
npm test         # run the test suite
npm run build    # production build to dist/
```

## Tech

Vanilla TypeScript + Vite, JSZip (in-browser unzip), d3-force (the ego graph). No backend, no
UI framework. A normalized schema decouples per-platform adapters from the metrics engine, so new
networks can be added behind the same analysis.
