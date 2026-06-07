# Handoff: Résumé Page — Leonardo Vasconcellos Portfolio

## Overview

A **web résumé / CV page** for senior full-stack engineer **Leonardo Lima de
Vasconcellos**, built as a route inside his bilingual (EN / PT-BR) dark-only
portfolio. It's the "web version of the résumé" — it reproduces everything the
PDF says but does the things paper can't: **live contact links, a tech filter
over the career history, expand/collapse per role, an interactive five-eras
career arc, and a language-aware PDF download.** The two source PDFs (English
résumé + Portuguese CV) are downloadable from the page.

The brand line for context: *the engineer you want when the system actually
matters — and has grown tangled.* The résumé leads with stakes (Doctors Without
Borders Ebola response, Brazil's top-ranked smart city in Itajaí, BASF/Bayer
grain supply chains) across **five eras of the web** (Flash/Flex → PHP →
Java/Android → .NET → React/Next + AI-assisted).

---

## About these files

`source/` is a **design reference created in HTML** — a working React-18 +
in-browser-Babel prototype that demonstrates the intended look, layout, copy and
interactions. It is **the spec, not production code to ship verbatim.** Rebuild
the page in the target production stack — per the brand's persistent memory that's
**Next.js (App Router) + Tailwind, statically exported, with `next-intl` for the
EN/PT-BR routing.** Reuse the team's existing component patterns and icon library.

What **is** meant to be lifted directly:
- `source/colors_and_type.css` — the design tokens (OKLCH, dark-only). Port the
  values into your Tailwind config / CSS variables.
- The résumé block of `source/kit.css` (all `.lv-resume*` / `.lv-xp*` / `.lv-spoken*`
  rules) — the cosmetic spec for this page.
- `source/fonts/` — the real self-hosted brand fonts.
- `source/assets/*.pdf` — the real résumé/CV PDFs the download buttons serve.

---

## Fidelity

**High-fidelity.** Colors, type, spacing, radii, motion, copy, and the bilingual
content are all final and should be reproduced faithfully. This page has **no
placeholder imagery** — unlike the work/hero sections of the wider site, the
résumé uses no low-poly screenshot stand-ins. The only external images are the
tech-stack brand logos (Devicon / Simple Icons via CDN) in the "core stack" grid
and the per-role tech chips.

---

## Where the page lives in the app

The site is a single-page React app with a small `view = { route, id }` state.
The résumé is the `resume` route. In production it becomes a real route, e.g.
`/en/resume` and `/pt/curriculo`.

**Integration points (3 edits wired the page into the existing app — replicate
the equivalent in your router):**

1. **`app.jsx`** — the route is registered in the view switch:
   ```jsx
   case 'resume': content = <ResumeView lang={lang} go={go} />; break;
   ```
   and the active-nav id resolves `resume` so the nav CTA highlights:
   ```jsx
   : view.route === 'resume' ? 'resume' : '';
   ```
2. **`Nav.jsx`** — the top-right primary CTA ("Résumé" / "Currículo") routes here
   (previously it scrolled to the About section):
   ```jsx
   <button className={`lv-btn lv-btn-primary lv-nav-cta ${route === 'resume' ? 'is-active' : ''}`}
           onClick={() => go('resume')}>
     {lang === 'pt' ? 'Currículo' : 'Résumé'}
   </button>
   ```
3. **`Portfolio.html`** — `Resume.jsx` is loaded before `app.jsx` in the Babel
   script list.

`go('home')` (the in-page "Back to portfolio" link) and `go('resume')` are the
only navigation couplings; everything else is self-contained in `Resume.jsx`.

---

## Page anatomy (top → bottom)

All inside `.lv-resume` (max-width 72rem, centered). Order:

1. **Back link** — "← Back to portfolio" (arrow-link, `go('home')`).
2. **Header** (`.lv-resume-head`, flex row that wraps):
   - **Left:** kicker `// résumé · curriculum vitae` (mono); name **Leonardo Lima
     de Vasconcellos** (Exo 700, `clamp(2.1rem,4.6vw,3.2rem)`); role subtitle
     ("Senior Full-Stack Engineer") in `--accent-bright`; a **contact row** of
     live links — `mailto:` email, `tel:` phone, LinkedIn (new tab), and a
     non-link location, each with a Lucide icon (mail / phone / linkedin / map-pin).
   - **Right (`.lv-resume-dl`):** the **download cluster** — a **primary** button
     "Download PDF · {EN|PT}" that serves the *active language's* PDF, a **ghost**
     button linking the *other* language ("Versão em Português" / "English
     version"), and a mono note "Print-ready PDF · updated 2026". Both are `<a download>`.
3. **Summary** (`.lv-resume-summary`) — the About/SOBRE paragraph, Sora, ~70ch.
4. **Stat strip** (`.lv-stat-row`) — `~20 years` · `~70 projects` · `5 tech eras`
   · `12 roles` (reuses the site's `.lv-stat` component).
5. **Five-eras arc** — mono heading `// five eras of the web — still writing code`
   + the site's `.lv-timeline` (horizontal dotted line, 5 nodes; the last,
   `React · Next · AI`, is `.is-now` = emerald dot with halo).
6. **Experience** (`.lv-resume-xp-head` + `.lv-xp-list`):
   - **Filter bar** (`.lv-xp-filter`): label "Filter by tech" + an **All** chip
     and one chip per canonical tech (`React, Next.js, Node.js, TypeScript, PHP,
     Java, Android, .NET, Python, PostgreSQL`). Clicking sets the active filter
     (clicking the active one or **All** clears it). Active chip = `.is-on`
     (emerald-bg). A live count below: "Showing **N** of 12 roles".
   - **Timeline list:** 12 roles, each `.lv-xp` = a 2-col grid (`150px` rail +
     body). The **rail** holds the period (mono, e.g. "Apr 2025 — Jan 2026"), a
     duration ("9 mos"), and a **dot on a vertical connector line** (`::before`).
     Mission-critical roles get `.is-stakes` → emerald dot + halo. The **body** is
     a clickable header (role in Exo 600, with a `shield-alert` icon when stakes;
     company in Sora; a "details ▾ / hide ▴" toggle), the per-role **tech chips**
     (`TechChip`, colored logos), and — when expanded — a **check-bulleted** list.
     Filtered-out roles get `.is-dim` (opacity .28). Recent + marquee roles
     (Itajaí, DevHouse 24–25, Email on Acid, MSF) start expanded.
7. **Core stack** (`.lv-resume-core`) — mono heading `// core stack` + a 6-col
   logo grid (Devicon logos; techs without a logo fall back to an emerald initial
   tile).
8. **Lower two-column grid** (`.lv-resume-cols`):
   - **Left — Skills:** four labeled groups (`// languages`, `// frameworks &
     tools`, `// databases`, `// methodologies`), each a wrap of neutral mono
     `.lv-chip`s.
   - **Right —** **Languages** (`.lv-spoken`: name + level + an emerald
     proficiency bar — Portuguese 100 / English 88 / Spanish 55); **Education**
     (year-gutter list, reuses `.lv-edu`); **Links** (`.lv-linklist`: GitHub ×2 +
     portfolio, each a row with a leading icon and a trailing `arrow-up-right`).
9. **Closing download** (`.lv-resume-foot`) — a repeat of the primary
   language-aware download button above a hairline.

---

## Interactions & behavior

- **Language (`lang` prop, `'en' | 'pt'`):** every string in the page is bilingual
  (`RT` table + per-entry `{en, pt}` objects). Switching language re-renders all
  copy **and** repoints the download buttons / relabels them. In production wire
  this to the `next-intl` locale.
- **Download buttons:** plain `<a href={…} download>`. Map:
  | Active lang | Primary button serves | Ghost button serves |
  |---|---|---|
  | `en` | `assets/Leonardo-Vasconcellos-Resume-EN.pdf` | `…-CV-PT.pdf` |
  | `pt` | `assets/Leonardo-Vasconcellos-CV-PT.pdf` | `…-Resume-EN.pdf` |
  (English file = the EN résumé; Portuguese file = the PT CV.)
- **Tech filter:** local state `filter` (a tech string or `null`). A role matches
  when `role.tags.includes(filter)`. Non-matches are dimmed (not removed) so the
  career shape stays legible; the count reflects matches. `tags` is a curated
  canonical subset per role (distinct from the richer display `tech` chips).
- **Expand/collapse:** local `open` map keyed by role id; clicking a role header
  toggles its bullets. Defaults: `itajai, devhouse2, eoa, msf` open.
- **Motion:** dim transition `--dur-base` with `--ease-spring`; button hover/press
  per the design system (tactile push primary, emerald-fill ghost). Honor
  `prefers-reduced-motion`.
- **Icons:** the prototype uses **Lucide** via `<i data-lucide>` + a global
  `lucide.createIcons()` after render. In React/Next use `lucide-react` components
  instead. Tech logos come from the `TECH_LOGOS` map in `primitives.jsx` (Devicon
  `-original` colored SVGs; Next.js white via Simple Icons).

---

## Data model (`Resume.jsx`)

All content is inline and bilingual. Keep this shape when wiring to a CMS/MDX or
generating from the PDF:

- **`EXPERIENCE[]`** — `{ id, stakes?, role{en,pt}, co (string | {en,pt}),
  period{en,pt}, dur{en,pt}, tags[] (canonical, for the filter), tech[] (display
  chips), bullets{en[],pt[]} }`. 12 entries, most-recent first. Note several roles
  overlap in time (a long-running DevHouse tenure alongside contract roles) — the
  order is intentional; preserve it.
- **`XP_FILTERS[]`** — the 10 canonical filter techs.
- **`RES_ERAS[]`** — 5 `{ y, label{en,pt}, now? }` nodes.
- **`RES_SKILLS`** — `{ core[], groups[{ label{en,pt}, items[] }] }`.
- **`SPOKEN[]`** — `{ name{en,pt}, level{en,pt}, pct }`.
- **`EDUCATION[]`** — `{ deg{en,pt}, school, when{en,pt} }`.
- **`LINKS[]`**, **`RESUME_PDF{en,pt}`**, **`RT{en,pt}`** (UI string table).

> Naming note: the constants are `RES_ERAS` / `RES_SKILLS` (not `ERAS` / `SKILLS`)
> specifically because the wider site's About section already defines globals by
> those names and all Babel scripts share one global scope. In a module-scoped
> production build this constraint disappears — name them whatever fits.

---

## Design tokens (used on this page)

Authored in **OKLCH**, dark-only, in `source/colors_and_type.css`. The page only
uses tokens from the system — no new colors. Key ones:

| Token | Hex (fallback) | Role on this page |
|---|---|---|
| `--bg` | `#202327` | page ground |
| `--surface` | `#2c2f34` | chips, stat cards, proficiency track, stack cells |
| `--raised` | `#393d44` | inactive timeline dots |
| `--border` | `#4d535c` | hairlines, chip borders, the timeline connector |
| `--border-strong` | `#636974` | hover borders, dot rings |
| `--text-muted` | `#9199a5` | meta, durations, mono sub-labels |
| `--text-secondary` | `#b7beca` | body / bullets / contact links |
| `--text-primary` | `#e3e8f0` | name, role titles |
| `--accent` / `--accent-bright` / `--accent-hover` | `#2eba7a` / `#45bf82` / `#54cc8e` | the single accent — buttons, kickers, stat numbers, stakes dots, proficiency fill, active filter chip |
| `--accent-bg` / `--accent-on-dim` | `#153f29` / `#7dd3a3` | active filter chip fill + text, fallback logo tiles |
| `--on-accent` | `#001c0e` | text on the primary button |
| Link-hover blue | `oklch(0.78 0.10 262)` | the only non-emerald accent — link/arrow hover color-slide |

- **Type:** `--font-display` **Exo** (name, role titles, stat numbers — display
  only), `--font-sans` **Sora** (summary, bullets, company), `--font-mono`
  **JetBrains Mono** (kickers, periods, durations, chips, the `//` labels).
- **Radii:** `--radius-sm 6` / `--radius-md 10` / `--radius-lg 14` / `--radius-pill
  999`. Filter chips + proficiency bars are pill; cards/cells are md/lg.
- **Elevation:** communicated by stepping the neutral ramp (ground → surface →
  raised) + 1px hairlines; shadows (`--shadow-sm/md/lg`) are the secondary cue.
  No glows. **No emoji.**

The résumé-specific CSS lives at the end of `source/kit.css` under the comment
`/* ── résumé (the web version) ── */` — `.lv-resume*`, `.lv-xp*`, `.lv-spoken*`,
`.lv-linkrow*`, plus the résumé block inside the `@media (max-width: 860px)` query
(rail collapses to a left-aligned inline marker; columns stack; core grid → 4-up).

---

## Assets

| Asset | Path | Notes |
|---|---|---|
| English résumé PDF | `source/assets/Leonardo-Vasconcellos-Resume-EN.pdf` | served by the EN download button |
| Portuguese CV PDF | `source/assets/Leonardo-Vasconcellos-CV-PT.pdf` | served by the PT download button |
| Exo / Sora / JetBrains Mono (variable) | `source/fonts/*.ttf` | self-hosted brand fonts |
| Tech logos | CDN — Devicon `-original` + Simple Icons (Next.js) | `TECH_LOGOS` map in `primitives.jsx` |
| Icons | CDN — Lucide (substitution default) | swap for `lucide-react` in prod |

---

## Files (in `source/`)

| File | Role |
|---|---|
| `Resume.jsx` | **the page** — `ResumeView` + all bilingual résumé data |
| `primitives.jsx` | `Kicker`, `TechChip`, `Button`, `TECH_LOGOS` (shared atoms the page imports) |
| `kit.css` | cosmetic CSS — the `.lv-resume*` block is this page's spec |
| `colors_and_type.css` | design tokens (OKLCH + hex fallback) + base type |
| `app.jsx` | shows the route registration + `go()` navigation contract |
| `Nav.jsx` | shows the CTA wiring that opens the page |
| `Portfolio.html` | entry point + Babel script load order |
| `assets/`, `fonts/` | the PDFs + self-hosted fonts |

To preview the prototype: open `source/Portfolio.html` in a browser and click the
green **Résumé** button in the top-right nav (it pulls React/Babel/Lucide from CDNs).
