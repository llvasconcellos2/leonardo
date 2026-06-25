# webdesign.md — Frontend Rules

Project-specific frontend workflow for the LV portfolio. The design system itself lives in
[`design/DESIGN.md`](./DESIGN.md) (single source of truth); positioning/voice in
[`docs/Brand.md`](../docs/Brand.md). This file is just the *how-to-work* layer.

## Always Do First

- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no
  exceptions.
- **Read [`design/DESIGN.md`](./DESIGN.md)** before touching styles — it is the executable spec
  mirror of `app/globals.css`.

## Reference Images

- If a reference image is provided: match layout, spacing, typography, and color exactly. Do not
  improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below), within this
  project's locked design system.
- Screenshot your output, compare against the reference (or against the existing live site for
  consistency), fix mismatches, re-screenshot. Do **at least 2 comparison rounds**. Stop only
  when no visible differences remain or the user says so.

## Local Server

- **Always serve on localhost** — never screenshot a `file:///` URL.
- This project's dev server is **HTTPS with a self-signed cert** (`next dev -H 0.0.0.0
  --experimental-https`). The URL is **`https://localhost:3000`** — always `https://`, never
  `http://`. Because the cert is self-signed, browser automation **must** ignore cert errors
  (see below); `curl` must use `-k`.
- **ALWAYS check if the server is already running BEFORE calling `pnpm dev`.** Run
  `curl -sk https://localhost:3000/ -o /dev/null -w "%{http_code}"`. If you get an HTTP status
  (not empty / connection-refused), the server is up — do **not** start another instance.
- Only if the server is NOT running: start it in the background with **`pnpm dev`** (never
  `npx next dev`).

## Screenshot Workflow

> There is **no screenshot MCP configured in this project.** Use the committed Playwright
> helper — [`scripts/screenshot.js`](../scripts/screenshot.js) (Playwright is a devDependency).

- Run it via the npm script:

  - `pnpm screenshot` — captures `/en` (label `home`)
  - `pnpm screenshot /pt/work work` — `<path> <label>`
  - `pnpm screenshot /en/work/some-id detail`

  Run it from **PowerShell** (or via `pnpm`), not Git Bash — MSYS mangles a leading-`/` path
  argument into a Windows path (`/en` → `C:/Program Files/Git/en`).

- It launches chromium **headless** with **`ignoreHTTPSErrors: true`** (the self-signed cert is
  the #1 silent failure mode — without it, navigation fails), and captures **two viewports** per
  run: desktop **1440** and mobile **390**, full-page.
- Output lands in **`./screenshots-dev/screenshot-<N>-<label>-<viewport>.png`** — N
  auto-increments and existing files are never overwritten. This directory is gitignored.
- After capturing, **read the PNG back with the Read tool** — Claude can see and analyze the
  image directly.
- The browser closes when the script exits — **no manual cleanup step is needed.**
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but
  should be 24px".
- Check: spacing/padding, font size/weight/line-height, colors (exact OKLCH/hex), alignment,
  border-radius, shadows, image sizing.

## Design System Guardrails (this project)

The full spec is [`design/DESIGN.md`](./DESIGN.md). Locked rules — do not violate:

- **`.lv-*` CSS classes only — no Tailwind utilities in components.** All styling lives in
  `app/globals.css` plus one co-located `.css` file per component.
- **Dark-only.** No light mode. Never invert backgrounds.
- **Three-tier OKLCH color logic:** neutral grey = structure, navy = quiet brand, emerald = the
  single accent. **Derive every color from `app/globals.css` `:root` tokens — never invent
  brand colors**, never add a second accent.
- **All-sans type:** Exo (display) + Sora (body/prose) + JetBrains Mono (code/labels). **No
  serif.**
- **No emoji anywhere.** The `//` kicker and mono labels carry the "engineer" texture instead.
- **Placeholders:** real project imagery is stood in by `LowPolyField` (seeded SVG). Keep the
  navy-framed treatment — see DESIGN.md §10.

## Anti-Generic Craft

Within the locked system above:

- **Shadows:** layered, color-tinted, low opacity — use the shadow tokens, not raw `box-shadow`
  values.
- **Tracking & rhythm:** tight tracking on large display headings, generous line-height on body
  prose — use the type-scale tokens.
- **Animations:** animate **only `transform` and `opacity`** with spring-style easing — never
  `transition: all`.
- **Interactive states:** every clickable element must have **hover, focus-visible, and active**
  states.
- **Depth:** maintain the surface layering system (base → elevated → floating); nothing sits on
  the same z-plane.
- **Spacing:** use the spacing tokens — never random one-off values.
