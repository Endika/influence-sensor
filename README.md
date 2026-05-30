# influence-sensor

Find out **how captured your social feed is** — which accounts actually own your attention,
not just who you follow. Drop your Instagram data export and get a health score, an
interactive graph, and the raw numbers behind it.

Everything runs in your browser. Your export is never uploaded or stored — a strict
Content-Security-Policy (`connect-src 'none'`) makes that enforceable, not just a promise.

## Use it

1. Request your data from Instagram in **JSON** format (Settings → Your activity →
   Download your information).
2. Open the app and drop the `.zip` you received.
3. Read your report. Nothing leaves your machine.

## Develop

```bash
npm install
npm run dev      # local dev server
npm test         # run the test suite
npm run build    # production build to dist/
```
