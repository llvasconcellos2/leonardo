// Dev screenshot helper for the webdesign workflow.
//
// Drives a headless chromium (Playwright) against the local HTTPS dev server and
// saves desktop + mobile full-page PNGs into ./screenshots-dev/ (gitignored).
//
// Prereqs: dev server running (`pnpm dev`) on https://localhost:3000.
// The server uses a self-signed cert (--experimental-https), so we must
// ignoreHTTPSErrors — that is the #1 silent failure mode here.
//
// Usage:
//   node scripts/screenshot.js                 # /en, label "home"
//   node scripts/screenshot.js /pt/work work   # path + label
//   node scripts/screenshot.js /en/work/foo detail
//
// Output: ./screenshots-dev/screenshot-<N>-<label>-<viewport>.png
// (N auto-increments; existing files are never overwritten.)

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.SCREENSHOT_BASE || "https://localhost:3000";
const OUT_DIR = path.resolve(process.cwd(), "screenshots-dev");

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
];

function nextIndex() {
  if (!fs.existsSync(OUT_DIR)) return 1;
  const used = fs
    .readdirSync(OUT_DIR)
    .map((f) => /^screenshot-(\d+)-/.exec(f))
    .filter(Boolean)
    .map((m) => Number(m[1]));
  return (used.length ? Math.max(...used) : 0) + 1;
}

(async () => {
  const route = process.argv[2] || "/en";
  const label = (process.argv[3] || "home").replace(/[^a-z0-9-]/gi, "-");
  const url = route.startsWith("http") ? route : BASE + route;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const n = nextIndex();

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(url, { waitUntil: "networkidle" });
    const out = path.join(OUT_DIR, `screenshot-${n}-${label}-${vp.label}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log("saved", path.relative(process.cwd(), out));
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
