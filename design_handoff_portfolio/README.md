# Handoff: Leonardo Vasconcellos — Personal Portfolio Site

## Overview

A bilingual (PT‑BR + EN), dark‑only personal portfolio for **Leonardo Lima de
Vasconcellos**, a senior full‑stack engineer (~20 years, ~70 shipped projects).
The site's job, in priority order, is: **You** (personal brand) → **Writing**
(the blog, treated as the engine/marketing) → **Work** (~70 projects as proof) →
**Hire me** (résumé + contact, present but never the headline).

Positioning is *mission‑critical systems where failure has real consequences* —
an Ebola‑response records system with Doctors Without Borders, Brazil's top‑ranked
smart city (Itajaí), global grain supply chains (BASF/Bayer via Bureau Veritas),
the world's largest educational software — shipped across five eras of the web.

**Core line:** *the engineer you want when the system actually matters — and has
grown tangled.*

---

## About the Design Files

The files in `source/` are a **design reference created in HTML** — a working,
click‑through prototype that demonstrates the intended **look, layout, copy, and
interactions**. They are **not production code to ship directly.**

The prototype is built with React 18 + in‑browser Babel and a hand‑authored CSS
kit, purely so it runs as a single static page for review. **The task is to
recreate this design in the target production stack.** The real site is intended
to be **Next.js + Tailwind, statically exported, with `next-intl` for bilingual
routing** (per the brand memory) — so prefer that unless the team has a reason to
choose otherwise. Reuse the codebase's existing component patterns and libraries;
treat the HTML/JSX here as the spec, not as files to copy verbatim.

The design tokens (`source/colors_and_type.css`) and the cosmetic CSS
(`source/kit.css`) ARE meant to be lifted directly — port the token values into
your Tailwind config / CSS variables. The self‑hosted fonts in `source/fonts/`
are the real brand fonts and should be carried over.

---

## Fidelity

**High‑fidelity (hifi).** Final colors, typography, spacing, radii, shadows,
motion, and copy are all specified and should be reproduced pixel‑accurately.
The one deliberate gap: **imagery is placeholder.** All project screenshots and
the hero portrait field are rendered as procedural **low‑poly navy SVG fields**
(`LowPolyField` in `primitives.jsx`) standing in for ~70 real project
screenshots and a low‑poly self‑portrait that were not yet available. Replace
these placeholders with real assets when implementing; keep the navy‑framed
treatment described under **Imagery**.

---

## Tech / Stack notes

- **Recommended production stack:** Next.js (App Router) · Tailwind CSS · static
  export · `next-intl` (or equivalent) for the EN/PT‑BR routing.
- **Icons:** the prototype uses **Lucide** (`lucide.dev`). This is a substitution
  default, not a locked brand set — keep Lucide or swap for the team's icon
  library; icons stay monochrome (`--text-secondary` / `--text-muted`), emerald
  only when active/interactive.
- **Tech‑stack logos:** colored brand marks come from **Devicon**
  (`cdn.jsdelivr.net/gh/devicons/devicon`, the `-original` colored SVGs). Next.js
  has no brand color so it's rendered white via **Simple Icons**
  (`cdn.simpleicons.org/nextdotjs/ffffff`). The full map is `TECH_LOGOS` in
  `source/primitives.jsx`. Unknown techs fall back to a neutral text‑only chip.
- **Fonts (self‑hosted, in `source/fonts/`):** **Exo** (display/headlines),
  **Sora** (body, UI, and blog prose), **JetBrains Mono** (code, tech tags,
  metadata, the `//` kicker). All variable TTFs. No CDN dependency.

---

## Information Architecture / Routing

The prototype is a single‑page app with a client `view` state
(`{ route, id }`). In production these map to real routes (all bilingual, e.g.
`/en/...` and `/pt/...`):

| Prototype route | Suggested URL | View |
|---|---|---|
| `home` | `/` | Homepage (hero + about + work + writing + testimonials + hire) |
| `archive` | `/work` | Project archive (tier‑1 dense grid of ~70) |
| `project` (id) | `/work/[id]` | Per‑project detail (tier‑3 deep dive) |
| `writing` | `/blog` | Writing index |
| `post` (id) | `/blog/[id]` | Blog reading view |
| `about` | `/about` (also embedded on home) | About / how‑to‑work‑with‑me + résumé CTA |

Navigation between views scrolls the scroll container to top; the **About** nav
item on the homepage smooth‑scrolls to the embedded `#about` section (offset by
the 64px sticky nav) rather than routing away.

---

## Global Layout

- **App shell:** full‑height flex column. A sticky `<Nav>` (`z-index: 20`) sits
  above a single scroll container (`.lv-scroll`, `overflow-y: auto`,
  `scroll-behavior: smooth`). Custom scrollbar: 10px, `--raised` thumb with a 3px
  `--bg` border, pill radius.
- **Containers:** two widths — **72rem** (`--container`) for gallery/UI sections,
  **42–46rem** (`--container-prose`) for blog reading (the typographic mirror of
  the work tiers). Sections center with `margin: 0 auto` and horizontal padding
  `clamp(20px, 4vw, 40px)`.
- **Section rhythm:** vertical padding `clamp(4rem, 9vw, 7rem)` so each section
  reads as a distinct *scene*. Section heads have `margin-bottom: clamp(2.5rem,
  5vw, 4rem)`.
- **Dividers:** sections are separated by 1px `--border` hairline top borders
  (`.lv-writing`, `.lv-hire`, `.lv-testi`), not gaps.

---

## Screens / Views

### 1. Top Nav (`Nav.jsx`)
- **Layout:** sticky bar, `padding: 14px clamp(20px,4vw,40px)`, translucent
  background `color-mix(in oklab, var(--bg) 82%, transparent)` + `backdrop-filter:
  blur(12px)`, 1px `--border` bottom hairline. Flex row, `gap: 24px`.
- **Left — monogram:** text button `LV`, Exo 700, 22px, `letter-spacing: .04em`,
  color `--accent-bright`. Click → home.
- **Center — links:** Work / Writing / About (PT: Trabalho / Escrita / Sobre).
  Sora 14px, `--text-secondary`; hover → `--text-primary`; active →
  `--accent-bright`. Padding `7px 12px`, radius 8px.
- **Right (`margin-left:auto`):** a **language toggle** — two mono buttons EN/PT
  in a hairline‑bordered, 8px‑radius, overflow‑hidden group; active one gets
  `--surface` fill + `--accent-bright` text, 11px JetBrains Mono. Then a **primary
  CTA button** "Résumé" / "Currículo" (compact: `padding: 8px 16px`, 13px).
- **Responsive:** at ≤860px the center links are hidden (`display:none`).

### 2. Hero (`Hero.jsx`) — the scrollytelling end‑state
This is the static end‑state of a scroll‑driven hero (present it statically; it's
also the reduced‑motion / SEO state).
- **Layout:** `position: relative`, `min-height: 92vh`, flex row, center‑aligned,
  `gap: clamp(2rem,5vw,5rem)`, padding `0 clamp(20px,6vw,80px)`, `overflow:hidden`.
- **Background field:** absolutely‑positioned `LowPolyField seed={42}` (faceted
  navy SVG) + a radial **scrim** that fades the field into `--bg` toward the
  bottom‑right + a giant ghost "LV" wordmark (Exo 700, `clamp(7rem,22vw,16rem)`,
  `--text-primary` at 6% alpha, top‑right, non‑interactive).
- **Inner copy (`max-width: 44rem`):**
  - kicker `// full-stack engineer · since 2005` (mono, 14px, `--accent-bright`),
    `margin-bottom: 18px`.
  - name `LEONARDO` — Exo 700, `clamp(2.75rem,8vw,5.5rem)`, `letter-spacing:
    .12em`, color `--accent-bright`, `line-height: 1.05`.
  - tagline — Exo 500, `clamp(1.25rem,2.6vw,2rem)`, `--text-primary`,
    `max-width: 30ch`. *"From Doctors Without Borders to smart cities — two decades
    building the software people depend on."*
  - subline — `clamp(1rem,1.4vw,1.2rem)`, `--text-secondary`, `max-width: 52ch`.
    *"I take tangled, mission-critical systems and make them scale: clean, fast,
    built to last."*
  - actions — primary "View résumé" (with `arrow-right` icon) + ghost
    "Selected work".
- **Portrait card (right, `margin-left:auto`):** `clamp(230px,26vw,360px)` square,
  `--radius-lg`, radial navy gradient bg `radial-gradient(120% 120% at 50% 18%,
  var(--brand) 0%, var(--brand-deep) 70%)`, 1px `--border-strong`, `--shadow-lg`;
  holds the low‑poly portrait SVG (`assets/leo_low_poly.svg`) anchored to the
  bottom. **Hidden at ≤860px.**
- **Scroll hint:** centered chevrons‑down (Lucide), `--text-muted`, gentle 2.4s
  vertical bob (`@keyframes lv-bob`, ±7px).

### 3. About (`AboutSection.jsx`) — embedded on home AND its own view
Two‑column "how to work with me" block. When `embedded` on the homepage the back
link and bottom CTA are hidden; as a standalone view they show.
- **Head:** kicker `// about · how to work with me`; flex row with an `<h1>` "Hi,
  I'm **Leonardo**" (Exo 600, `clamp(2rem,4.5vw,3rem)`; "Leonardo" in
  `--accent-bright`) + tagline, and a **square portrait** (`clamp(120px,16vw,
  190px)`, `--radius-lg`, navy radial bg, holds `assets/leo_photo.jpg`,
  `object-position: center 38%`).
- **Two columns** (`grid-template-columns: 1fr 1fr`, `gap: clamp(2rem,5vw,4rem)`):
  - **Left:** intro paragraph (`.prose`, 16px); a `// what I do` sub‑label
    (mono 12px `--text-muted`, 1px bottom hairline); then a **3‑item accordion**
    (Full‑stack engineering / Mission‑critical systems / Untangling legacy) —
    only one open at a time, default index 0; open card border →
    `--accent-bright`; body animates `max-height` 0→140px over `--dur-base`;
    plus/minus Lucide toggle. Then `// education & certifications` with a year‑gutter
    list (year in mono `--accent-bright`, 42px column).
  - **Right:** `// tech stack` — a 4‑col grid of cells (each: 26px Devicon logo +
    mono 10.5px label, `--surface` card, hover lifts border + `translateY(-2px)`);
    a 4‑up **stat row** (`~20` years / `~70` projects / `5` eras / `1M+` views —
    big number Exo 700 28px `--accent-bright`, label 11.5px `--text-muted`); and a
    `// five eras, still writing code` **timeline** (horizontal dotted line, 5
    nodes, last node `is-now` = emerald dot with `--accent-bg` halo).
- **Bottom CTA (standalone only):** centered "Want to know more?" + "Download CV"
  primary (download icon) + "Get in touch" ghost (mail icon), above a 1px top
  hairline.

### 4. Selected Work (`WorkSection.jsx`) — tier‑2 curated rows
- **Head:** kicker `// selected work`, title "Selected work" (Exo 500,
  `clamp(2rem,4vw,3rem)`), and an arrow‑link "See all ~70 projects" → archive.
- **Rows:** vertical stack, `gap: clamp(3rem,6vw,5rem)`. Each row is a 2‑col grid
  `1.05fr 1fr`, center‑aligned; **odd rows flip** (media moves to `order: 2`).
  - **Media:** clickable, `aspect-ratio: 16/10`, `--radius-lg` (14px), 1px
    `--border` → `--border-strong` on hover, navy bg, holds `LowPolyField` seeded
    per project with the **year** as a corner tag.
  - **Body:** kicker (project's `//` label) · title (Exo 500,
    `clamp(1.4rem,2.6vw,2rem)`, with an emerald `shield-alert` icon prefix when
    `stakes: true`) · description (`--text-secondary`, 16px, `max-width: 46ch`) ·
    a check‑bulleted list (emerald `check` icons) · an **"Engineered with"** tech‑chip
    row (mono label + `TechChip`s with colored logos) · an arrow‑link "View
    details →".
- **Responsive:** single column at ≤860px (flip disabled).

### 5. Writing (`WritingSection.jsx`) — the engine
- 1px `--border` top hairline. Head: kicker `// the engine`, title "Writing",
  lead paragraph (`--text-secondary`, 17px, `max-width: 52ch`).
- **Post cards:** 3‑col grid (`gap: 20px`; single column ≤860px). Each card:
  `--surface` fill, 1px `--border`, `--radius-lg`, `padding: 24px`, flex column.
  Hover → border `--border-strong` + `translateY(-3px)`. Holds: kicker · title
  (Exo 500, 20px) · excerpt (`--text-secondary`, 14.5px, flex‑grows) · a meta row
  (mono 11.5px `--text-muted`: date · read‑time · a "Read →" arrow‑link pushed
  right).
- Below the grid: an arrow‑link "All writing →" → writing index.

### 6. Testimonials (`Testimonials.jsx`)
- 1px `--border` top hairline. Head: kicker `// in their words`, title
  "Testimonials", lead. Cards in a 2‑col grid; **with a single testimonial it
  becomes one centered featured card** (`is-single`, `max-width: 50rem`).
- **Card:** `--surface`, 1px `--border`, `--radius` 16px, generous padding; a
  faint Lucide `quote` mark top‑right; the quote (Sora, `clamp(15px,1.6vw,18px)`,
  `line-height: 1.65`, `--text-primary`, `max-width: 60ch`); a footer (1px top
  hairline) with a circular **initials avatar** (44px, navy bg, Exo 600), name
  (Exo 600 16px) + role · relationship (`--text-muted`), and a "via LinkedIn ·
  date" meta with a small blue `in` badge (`#0a66c2`). One real recommendation is
  included; add more objects to the `TESTIMONIALS` array.

### 7. Hire / Footer (`ContactFooter.jsx`)
- **Hire band:** 1px top hairline; kicker `// hire me`; big title *"Let's build
  something that can't fail."* (Exo 500, `clamp(2rem,4.5vw,3.2rem)`,
  `max-width: 18ch`); lead; primary "Get in touch" (mail icon) + ghost "Download
  résumé" (download icon).
- **Footer bar:** 1px top hairline, space‑between row — left: `LV` monogram (Exo
  700, emerald) + full name; right: location "Joinville · Santa Catarina · Brasil"
  (mono) + three social icon links (GitHub / LinkedIn / RSS, `--text-muted` →
  `--accent-bright` on hover).
- Inner pages (non‑home) render a slim `MiniFooter` instead (monogram + name +
  location).

### 8. Project Detail (`Views.jsx` → `ProjectDetail`) — tier‑3
- Back arrow‑link "← Back" → work. Kicker · title (Exo 600,
  `clamp(2rem,4.5vw,3.2rem)`) · lead (`max-width: 56ch`) · "Engineered with" tech
  chips + year (mono). A wide hero band (`aspect-ratio: 16/7`, `--radius-lg`,
  low‑poly field). Then a 2‑col grid (`1.6fr 1fr`): prose + check‑bullets on the
  left; a **"Live snapshot"** aside on the right — a card with a mono title bar
  (archive icon), a low‑poly preview, and the note `// archived snapshot · crawled
  & self-hosted`. (Labeling archived work honestly as *archived/live snapshot* is
  intentional brand copy.)

### 9. Archive (`Views.jsx` → `ArchiveView`) — tier‑1
- Back link · kicker `// archive` · title "Project archive" · lead `~20 years ·
  ~70 shipped projects · five eras of the web` (mono). A **4‑col tile grid**
  (`gap: 16px`; 2‑col ≤860px). Each tile: `--surface` card, 1px border → strong on
  hover, a 120px low‑poly thumbnail + a body with a 2‑line‑clamped title (Exo
  14px) and a `year · primaryTech` line (mono `--text-muted`). The prototype
  renders 24 placeholder tiles cycling the 4 real projects; production should list
  the full ~70.

### 10. Blog Reading View (`BlogPost.jsx` → `BlogPost`)
- Constrained to `max-width: 46rem` (the protected prose measure). Back link ·
  kicker · title (Exo 600, `clamp(2rem,4vw,2.8rem)`) · meta row (mono: date ·
  read‑time · `PT-BR · EN`, 1px bottom hairline). Body in `.prose` (Sora,
  `--text-prose` 1.1875rem, `line-height: 1.7`, `max-width: 68ch`): a larger lede
  paragraph (21px `--text-primary`), body paragraphs, and a **code block**
  (`--surface` card, mono 14px; comment `.cm` muted, keyword `.kw` emerald, string
  `.tr` `--accent-on-dim`).
- **Writing Index** (`WritingIndex`): kicker `// the engine`, title "Writing",
  lead, then the post cards in a single‑column list (`max-width: 46rem`).

---

## Interactions & Behavior

- **Navigation:** `go(route, id)` sets the view and resets scroll to top
  (`behavior: 'auto'`). The **About** action is special: from anywhere it routes
  home, then after 60ms smooth‑scrolls to `#about` minus a 64px nav offset.
- **Active nav highlight:** Work is active for `work|project|archive`; Writing for
  `writing|post`; About for `about`.
- **Language toggle:** flips all copy between EN and PT‑BR objects (every component
  carries both). EN is the canonical draft.
- **Accordion (About):** single‑open; clicking the open one closes it (sets index
  to ‑1). Body height animates 0 ↔ 140px.
- **Hover/active states (see Design Tokens → States):**
  - **Primary button** = tactile push button: top‑lit emerald gradient over a
    darker bottom edge with letterpress label; hover brightens + lifts 1px (shadow
    grows), active presses down 2px (shadow collapses to inset).
  - **Ghost button** fills to `--surface` and tints border + label emerald on
    hover; active nudges 1px.
  - **Text/arrow links** sweep a **bright brand blue** `oklch(0.78 0.10 262)`
    across the glyphs left→right (clipped‑gradient "color slide", 0.5s); arrow
    links also nudge their arrow (`gap` 6px→9px).
  - **Cards / media / tiles:** border `--border` → `--border-strong`, some add a
    small `translateY` lift. No heavy shadows, no colored left‑borders, no color
    inversions.
- **Lucide init:** the prototype calls `lucide.createIcons()` after render
  (`<i data-lucide="...">`). In React/Next use the `lucide-react` components
  instead.
- **Motion:** restrained, GPU‑only (`transform`/`opacity`). Reveal‑on‑scroll
  (IntersectionObserver, fires once) with easing `--ease-spring`
  `cubic-bezier(0.22, 1, 0.36, 1)`. The hero in production is CSS scroll‑driven
  (`animation-timeline: scroll()/view()`, zero JS) with a static `@supports`
  fallback. Durations 180 / 320 / 600ms. **Always honor `prefers-reduced-motion`**
  — the global stylesheet already collapses all animation/transition durations to
  ~0 and disables smooth scroll under that query.

---

## State Management

The prototype holds two pieces of state in `App`:
- `lang` — `'en' | 'pt'` (the active language).
- `view` — `{ route, id }` (the active page + optional entity id).

In production, replace both with the framework's real primitives:
- **Language** → i18n routing (`next-intl` locale segment) + a switcher; auto‑detect
  on first visit, manual override persisted.
- **View/route** → real file‑system routes (see IA table). Project and post ids
  become route params resolved against a content source (the `PROJECTS` / `POSTS`
  arrays in `data.jsx` are stand‑in content; wire them to MDX/CMS).
- No data fetching beyond loading content; everything is static‑exportable.

---

## Design Tokens

All tokens are authored in **OKLCH** (dark‑only) in `source/colors_and_type.css`,
with an sRGB hex fallback for pre‑OKLCH browsers. Port these into your Tailwind
config / CSS custom properties verbatim.

### Color — three‑tier logic
Each layer has exactly one job so they never compete:
1. **Neutral grey = structure & elevation** (hue‑locked 258, dark grey not black).
2. **Navy = quiet brand** (large calm surfaces / hero field — NOT a second accent).
3. **Emerald = the single accent** (all action/attention: links, buttons, kickers,
   active states). "A deep blue stage with one green spotlight."

| Token | OKLCH | Hex (fallback) | Role |
|---|---|---|---|
| `--bg` | `oklch(0.255 0.008 258)` | `#202327` | page ground |
| `--surface` | `oklch(0.305 0.010 258)` | `#2c2f34` | cards |
| `--raised` | `oklch(0.360 0.012 258)` | `#393d44` | elevated surfaces |
| `--border` | `oklch(0.440 0.016 258)` | `#4d535c` | 1px hairline dividers |
| `--border-strong` | `oklch(0.520 0.018 258)` | `#636974` | hover/emphasis borders |
| `--text-muted` | `oklch(0.680 0.020 258)` | `#9199a5` | captions, metadata |
| `--text-secondary` | `oklch(0.800 0.018 258)` | `#b7beca` | body / UI text |
| `--text-primary` | `oklch(0.930 0.012 258)` | `#e3e8f0` | headings |
| `--brand-deep` | `oklch(0.270 0.090 260)` | `#082451` | brand bands, hero field |
| `--brand` | `oklch(0.360 0.110 260)` | `#173a76` | brand surfaces |
| `--brand-bright` | `oklch(0.450 0.085 260)` | `#395584` | brand hover / chart fills |
| `--accent-bg` | `oklch(0.330 0.060 158)` | `#153f29` | tag / pill fills |
| `--accent` | `oklch(0.700 0.150 158)` | `#2eba7a` | buttons, solid accent |
| `--accent-bright` | `oklch(0.720 0.140 158)` | `#45bf82` | links, kickers, underlines |
| `--accent-hover` | `oklch(0.760 0.140 158)` | `#54cc8e` | accent hover |
| `--on-accent` | `oklch(0.200 0.070 158)` | `#001c0e` | text on accent |
| `--accent-on-dim` | `oklch(0.800 0.110 158)` | `#7dd3a3` | text on `--accent-bg` |
| **Link‑hover blue** | `oklch(0.78 0.10 262)` | ~`#7aa7 f0` | the *only* non‑emerald interactive accent — used solely for the link/arrow hover color‑slide (a deliberate, narrow exception to "emerald is the only accent") |

### Typography
- **Families:** `--font-display` Exo · `--font-sans` Sora · `--font-mono`
  JetBrains Mono.
- **Weights:** 400 body · 500 medium · 700 display only.
- **Headings** (Exo): line‑height tight `1.1`, tracking `-0.02em`. **Prose** (Sora):
  line‑height `1.7`. Protect the **68ch** prose measure.
- **Casing:** sentence case for body/most headings; hero **name all‑caps**
  letterspaced; kickers are **lowercase `// code‑comment` labels** in mono with a
  middle‑dot `·` separator; tech tags keep real casing (`Next.js`, `.NET`).

| Token | Value |
|---|---|
| `--text-xs` | `0.78rem` |
| `--text-sm` | `0.875rem` |
| `--text-base` | `1rem` |
| `--text-prose` | `1.1875rem` |
| `--text-lg` | `1.25rem` |
| `--text-xl` | `1.5rem` |
| `--text-2xl` | `clamp(1.75rem, 3vw, 2.25rem)` |
| `--text-3xl` | `clamp(2.25rem, 5vw, 3.25rem)` |
| `--text-display` | `clamp(2.75rem, 8vw, 5rem)` |
| `--text-monogram` | `clamp(7rem, 22vw, 16rem)` |
| `--leading-tight / snug / ui / prose` | `1.1 / 1.35 / 1.5 / 1.7` |
| `--tracking-tight / wide / mono` | `-0.02em / 0.12em / 0.03em` |
| `--measure-prose / ui` | `68ch / 60ch` |

### Spacing (4px base)
`--space-1..32` = `0.25 / 0.5 / 0.75 / 1 / 1.25 / 1.5 / 2 / 2.5 / 3 / 4 / 5 / 6 /
8 rem` (tokens: 1,2,3,4,5,6,8,10,12,16,20,24,32).
Rhythm/layout: `--section-y: clamp(4rem,10vw,8rem)` · `--gutter:
clamp(1rem,4vw,2rem)` · `--container: 72rem` · `--container-prose: 42rem`.

### Radii
`--radius-sm 6px` · `--radius-md 10px` · `--radius-lg 14px` · `--radius-pill 999px`.
Cards typically use `--radius-lg`.

### Elevation / Shadows
Elevation is communicated **primarily by stepping lighter through the neutral
ramp** (ground → surface → raised). Shadows are the secondary cue — soft, low,
near‑black so they read on dark without glowing. Pair a shadow with a one‑step
surface lift; never use a shadow to fake a color step you skipped. No glossy/neon
glows.
- `--shadow-sm: 0 1px 2px rgba(8,10,14,.45)`
- `--shadow-md: 0 6px 16px -4px rgba(8,10,14,.55)`
- `--shadow-lg: 0 18px 40px -12px rgba(8,10,14,.65)`

### Borders
1px **hairline** in `--border` (avoid 0.5px — it can vanish on dark). Borders + a
one‑step elevation lift do the work shadows do elsewhere.

### Motion
- `--ease-spring: cubic-bezier(0.22, 1, 0.36, 1)`
- `--dur-fast 180ms` · `--dur-base 320ms` · `--dur-slow 600ms`

### Component state recipes (from `kit.css`)
- **Primary button:** `background: linear-gradient(180deg, var(--accent-hover),
  var(--accent))`, `color: var(--on-accent)`, carved label `text-shadow`, border
  `color-mix(in oklab, var(--accent) 70%, #000)`, box‑shadow `inset 0 1px 0
  rgba(255,255,255,.22), 0 2px 0 color-mix(... 55%, #000), var(--shadow-md)`.
  Hover: `filter: brightness(1.06)` + `translateY(-1px)` + grown shadow. Active:
  `translateY(2px)` + inset shadow.
- **Ghost button:** transparent, `--text-primary`, 1px `--border`. Hover: fill
  `--surface`, border + text → `--accent-bright`, `--shadow-sm`.
- **Link color‑slide:** a 200%‑wide `linear-gradient(90deg, oklch(0.78 0.10 262) 0
  50%, var(--accent-bright) 50% 100%)` clipped to the text, `background-position`
  animates 100%→0 over 0.5s on hover.

---

## Assets

| Asset | Path | Notes |
|---|---|---|
| Low‑poly portrait | `source/assets/leo_low_poly.svg` | hero portrait card. Real brand asset. |
| Photo portrait | `source/assets/leo_photo.jpg` | About section square portrait. |
| Exo (variable) | `source/fonts/Exo-VariableFont_wght.ttf` | display/headlines |
| Sora (variable) | `source/fonts/Sora-VariableFont_wght.ttf` | body/UI/prose |
| JetBrains Mono (variable) | `source/fonts/JetBrainsMono-VariableFont_wght.ttf` | code/tags/kickers |
| Tech logos | CDN — Devicon `-original` SVGs + Simple Icons (Next.js) | map = `TECH_LOGOS` in `primitives.jsx` |
| Icons | CDN — Lucide | substitution default; confirm/replace |

**Placeholder imagery to replace:** every `LowPolyField` (procedural navy SVG) is
a stand‑in for ~70 real project screenshots / crawled "live snapshots". When
adding real screenshots, keep the **navy‑framed** treatment (1px `--border` →
`--border-strong` on hover, `--radius-lg`) and let each screenshot supply its own
color — don't add per‑project frame colors. The warm peach/skin tones from the
portrait are **illustration‑only and banned from UI**.

---

## Content / Copy

`source/data.jsx` and the per‑component copy objects hold the canonical bilingual
strings (EN canonical, PT‑BR finalized by Leonardo). This includes the 4 sample
projects (MSF / Itajaí / Bureau Veritas / EdTech), 3 sample blog posts, the About
copy, the hire/contact copy, and one real LinkedIn testimonial. Treat project and
post content as stand‑in until the full ~70 projects + real posts are wired to a
content source. **No emoji anywhere** — the `//` kicker and mono labels carry the
"engineer" texture.

---

## Files (in `source/`)

| File | Contains |
|---|---|
| `Portfolio.html` | entry point; script/style load order |
| `app.jsx` | `App` shell, routing/`go`, `MiniFooter` |
| `primitives.jsx` | `Kicker`, `Pill`, `TechChip`, `Button`, `LowPolyField`, `TECH_LOGOS` |
| `data.jsx` | `PROJECTS`, `POSTS`, `T` (UI string table) |
| `Nav.jsx` | top nav + language toggle |
| `Hero.jsx` | hero end‑state + `heroCopy` |
| `AboutSection.jsx` | `AboutView`, `Accordion`, skills/edu/stack/eras/stats data |
| `WorkSection.jsx` | `WorkSection`, `WorkRow` (tier‑2 rows) |
| `WritingSection.jsx` | `WritingSection`, `PostCard` |
| `Testimonials.jsx` | `Testimonials`, `TestimonialCard`, `TESTIMONIALS` |
| `ContactFooter.jsx` | hire band + footer |
| `Views.jsx` | `ProjectDetail` (tier‑3), `ArchiveView` (tier‑1) |
| `BlogPost.jsx` | `BlogPost` reading view, `WritingIndex` |
| `colors_and_type.css` | **design tokens** (OKLCH + hex fallback) + semantic type |
| `kit.css` | all cosmetic component CSS (the `.lv-*` classes) |
| `assets/`, `fonts/` | real brand assets + self‑hosted variable fonts |

To preview the prototype as‑is, open `source/Portfolio.html` in a browser (it
pulls React/Babel/Lucide from CDNs).
