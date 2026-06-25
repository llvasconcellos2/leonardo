# DESIGN.md — LV Visual Design System

Single source of truth for the **visual system** of Leonardo Vasconcellos' portfolio.
For positioning, voice, and hero copy (EN/PT-BR), see [`docs/Brand.md`](../docs/Brand.md).

> **Live code wins.** The values below mirror [`app/globals.css`](../app/globals.css) and the
> co-located component CSS as of this writing. When they disagree, the CSS is correct — fix this
> doc, not the other way around. Tokens are transcribed here so design decisions can be made
> against principles; the running stylesheet is the executable spec.

> `design/design_handoff_portfolio/` is **historical reference only**. It was the original SPA
> prototype; the live SSR Next.js app has diverged. Do not treat it as the spec.

---

## 1. How to use this document

This is the guide that constrains design work. Each section states the **rule** (the durable
"why") and the **as-built values** (with file pointers). When adding or changing UI:

1. Reuse an existing token or `.lv-*` class before inventing one.
2. If you must extend, derive from the existing system (see the extension rules per section).
3. Never reach for a value that isn't traceable to a reason here.

The site is **dark-only**, bilingual (`en`/`pt`), built with `.lv-*` CSS classes — **not Tailwind
utilities**. All styling lives in `app/globals.css` plus one co-located `.css` file per component.

---

## 2. Foundations — locked decisions

These are settled. Do not revisit casually.

- **Dark-only.** No light mode. Backgrounds are deep neutral; never invert.
- **Three-tier color logic.** Neutral grey = structure, navy = quiet brand, emerald = the single
  accent. Each layer has exactly one job so they never compete. (§3)
- **All-sans type system.** Exo (display) + Sora (body/prose) + JetBrains Mono (code/labels).
  No serif. (§4)
- **`.lv-*` classes, no Tailwind utilities in components.** The design uses hand-authored CSS
  classes exclusively.
- **OKLCH-first** with a `@supports not (color: oklch)` hex fallback block for pre-OKLCH browsers.
- **No emoji anywhere.** The `//` kicker and mono labels carry the "engineer" texture instead.

---

## 3. Color system

**Metaphor: a deep blue stage with one green spotlight.** Three hue families, each demoted or
promoted by role so they never fight:

| Tier | Hue | Job |
| --- | --- | --- |
| **Neutral grey** | 258 | Structure & elevation — page ground, cards, borders, all text |
| **Navy** | 260 | Quiet brand — large calm surfaces, brand bands, the hero field (never a 2nd accent) |
| **Emerald** | 158 | The single interactive accent — links, buttons, kickers, active states |

Navy reads *intentional* precisely because it sits quiet and large on neutral; emerald reads
*loud* because it's the only bright, small thing. Hierarchy (not hue kinship) keeps them apart.

### Tokens (OKLCH — source: `app/globals.css` `:root`)

**Neutral ramp (hue 258)** — surfaces go lighter to elevate, darker to recess:

| Token | OKLCH | Hex fallback | Role |
| --- | --- | --- | --- |
| `--dark` | `oklch(19.99% 0.004 264.47)` | — | deepest ground (`#work`, `#testimonials` bands) |
| `--bg` | `oklch(0.255 0.008 258)` | `#202327` | page ground |
| `--surface` | `oklch(0.305 0.010 258)` | `#2c2f34` | cards / chips |
| `--raised` | `oklch(0.360 0.012 258)` | `#393d44` | elevated surfaces, scrollbar thumb |
| `--border` | `oklch(0.440 0.016 258)` | `#4d535c` | 1px hairline dividers |
| `--border-strong` | `oklch(0.520 0.018 258)` | `#636974` | hover borders |
| `--text-muted` | `oklch(0.680 0.020 258)` | `#9199a5` | captions / metadata |
| `--text-secondary` | `oklch(0.800 0.018 258)` | `#b7beca` | body / UI text (default `body` color) |
| `--text-primary` | `oklch(0.930 0.012 258)` | `#e3e8f0` | headings / emphasis |

**Navy (hue 260) — quiet brand:**

| Token | OKLCH | Hex | Role |
| --- | --- | --- | --- |
| `--brand-deep` | `oklch(0.270 0.090 260)` | `#082451` | brand bands / hero field |
| `--brand` | `oklch(0.360 0.110 260)` | `#173a76` | brand surfaces |
| `--brand-bright` | `oklch(0.450 0.085 260)` | `#395584` | brand hover / chart fills |

**Emerald (hue 158) — the single accent:**

| Token | OKLCH | Hex | Role |
| --- | --- | --- | --- |
| `--accent-bg` | `oklch(0.330 0.060 158)` | `#153f29` | tag / pill fills |
| `--accent` | `oklch(0.700 0.150 158)` | `#2eba7a` | buttons, selection, focus outline |
| `--accent-bright` | `oklch(0.720 0.140 158)` | `#45bf82` | links, kickers, underlines |
| `--accent-hover` | `oklch(0.760 0.140 158)` | `#54cc8e` | accent hover |
| `--on-accent` | `oklch(0.200 0.070 158)` | `#001c0e` | text on accent (sits just outside sRGB; richer on P3) |
| `--accent-on-dim` | `oklch(0.800 0.110 158)` | `#7dd3a3` | text on `--accent-bg` |

**Semantic shift:**

| Token | OKLCH | Role |
| --- | --- | --- |
| `--cyan-shift` | `oklch(0.78 0.14 220)` | kickers (`.lv-kicker`), hero kicker |

**The one deliberate exception:** arrow/link hover uses a **blue slide**, not emerald —
`oklch(0.78 0.10 262)` slides into `--accent-bright` via background-clip (see `.lv-link-arrow`,
`.lv-btn-link` in §9). Intentional; keep it.

### Extension rule

Derive any new color **in OKLCH from an existing ramp** — hue-locked, even lightness steps. Do
**not** introduce an off-system color or a fourth hue without a clearly defined, unique job. When
you add an OKLCH token, add its hex equivalent to the `@supports not (color: oklch)` block.

---

## 4. Typography

**All-sans, two families plus mono.** Each font has a strict role — the blog is the engine
(prior site: 1M+ views from people *reading*), so body text does real work and must stay readable.

| Family | Token | Used for | Keep out of |
| --- | --- | --- | --- |
| **Exo** | `--font-display` | hero monogram & name, all headings (h1–h4), card titles, buttons | long body / paragraphs (personality becomes a tax) |
| **Sora** | `--font-sans` | body, UI, **and blog prose** | — (the workhorse) |
| **JetBrains Mono** | `--font-mono` | code blocks, tech chips, metadata, `// kicker` labels | headings |

Self-hosted variable TTFs from `public/fonts/` via `@font-face` (`Exo` 100–900, `Sora` 100–800,
`JetBrains Mono` 100–800; all `font-display: swap`).

### Type scale (`:root`)

| Token | Value |
| --- | --- |
| `--text-xs` | `0.78rem` |
| `--text-sm` | `0.875rem` |
| `--text-base` | `1rem` |
| `--text-prose` | `1.1875rem` (~19px — blog body, intentionally larger than UI body) |
| `--text-lg` | `1.25rem` |
| `--text-xl` | `1.5rem` |
| `--text-2xl` | `clamp(1.75rem, 3vw, 2.25rem)` |
| `--text-3xl` | `clamp(2.25rem, 5vw, 3.25rem)` |
| `--text-display` | `clamp(2.75rem, 8vw, 5rem)` |
| `--text-monogram` | `clamp(7rem, 22vw, 16rem)` |

### Line-height / tracking / measure

| Token | Value | Use |
| --- | --- | --- |
| `--leading-tight` | `1.1` | display / headings |
| `--leading-snug` | `1.35` | h4 |
| `--leading-ui` | `1.5` | UI / body default |
| `--leading-prose` | `1.7` | blog prose |
| `--tracking-tight` | `-0.02em` | headings |
| `--tracking-wide` | `0.12em` | letterspaced name |
| `--tracking-mono` | `0.03em` | mono labels |
| `--measure-prose` | `68ch` | **protected** — prose past this is where readers quit |
| `--measure-ui` | `60ch` | UI text |

### Weights & heading roles

- **h1 / `.h1`** — Exo 700, `--text-display`, tight, `--text-primary`.
- **h2 / `.h2`** — Exo 500, `--text-3xl`, tight.
- **h3 / `.h3`** — Exo 500, `--text-2xl`, tight.
- **h4 / `.h4`** — Exo 500, `--text-xl`, snug.
- **`.display-name`** — Exo 700, `--text-display`, `--tracking-wide`, **`--accent-bright`** (the
  emerald letterspaced name).
- **`.kicker`** — Mono, `--text-xs`, `--tracking-mono`, `--accent-bright`, lowercase.
- **`.prose`** — Sora, `--text-prose`, `--leading-prose`, `--text-primary`, capped at
  `--measure-prose`.

---

## 5. Spacing & layout

**4px base scale** (`--space-1: 0.25rem` … `--space-32: 8rem`): 1/2/3/4/5/6/8/10/12/16/20/24/32.

**Rhythm.** Sections breathe so each reads as a distinct scene on a scroll-driven page:

- `--section-y: clamp(4rem, 10vw, 8rem)` — section vertical rhythm.
- `--gutter: clamp(1rem, 4vw, 2rem)` — horizontal gutter.

**Two containers** (a layout mirror of the work tiers):

- `--container: 72rem` — gallery / UI sections.
- `--container-prose: 42rem` — blog reading.

**Radii:** `--radius-sm: 6px` · `--radius-md: 10px` · `--radius-lg: 14px` · `--radius-pill: 999px`.

**Borders:** 1px hairline in `--border`. Avoid 0.5px on dark — it can vanish.

---

## 6. Elevation & shadows

Depth comes from the neutral ramp (lighter = elevated, darker = recessed) reinforced by shadow:

| Token | Value |
| --- | --- |
| `--shadow-sm` | `0 1px 2px rgba(8, 10, 14, 0.45)` |
| `--shadow-md` | `0 6px 16px -4px rgba(8, 10, 14, 0.55)` |
| `--shadow-lg` | `0 18px 40px -12px rgba(8, 10, 14, 0.65)` |

---

## 7. Motion

**Rule: animate `transform` and `opacity` only** (GPU/compositor). Honour
`prefers-reduced-motion` — globals.css resets all animation/transition to `0.001ms` and disables
smooth scroll under that query. `interpolate-size: allow-keywords` is enabled globally for
intrinsic-size keyword animations.

| Token | Value |
| --- | --- |
| `--ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-fast` | `180ms` |
| `--dur-base` | `320ms` |
| `--dur-slow` | `600ms` |

**Reveal pattern.** Section/element entrances use an IntersectionObserver `Reveal` /
`RevealGroup` that fires once on enter (`up`/`down`/`left`/`right`, with delay/distance/blur).

**Scroll-driven hero (direction).** The hero is scroll-scrubbed via CSS
`animation-timeline: scroll()/view()` — zero JS, compositor-driven. **Build the static end state
first** (the real, usable header), then layer animation as progressive enhancement behind
`@supports (animation-timeline: scroll())` with `animation-fill-mode: both` so unsupported
browsers and reduced-motion users land on that end state. No scroll-jacking.

---

## 8. App shell & section conventions

| Class | Role |
| --- | --- |
| `.lv-app` | full-height flex column, `--bg` ground |
| `.lv-scroll` | the scroll container — `flex: 1; overflow-y: auto; scroll-behavior: smooth`; custom 10px scrollbar, `--raised` pill thumb |
| `.lv-section` | centered section wrapper, `padding: clamp(4rem,9vw,7rem) clamp(20px,4vw,40px)` |
| `.lv-section-head` | section heading block, `margin-bottom: clamp(2.5rem,5vw,4rem)` |
| `.lv-section-title` | Exo 500, `clamp(2rem,4vw,3rem)`, `--text-primary` |
| `.lv-section-see` | "see all" link slot |
| `.lv-back` | back-link spacing |

`#work` and `#testimonials` sit on the deepest `--dark` band. The **"About" nav link is an
in-page anchor** (`/${lang}#about`) — the browser + `.lv-scroll`'s smooth scroll handle it; no
programmatic scrolling.

---

## 9. Components

Shared primitives live in [`app/components/Primitives.css`](../app/components/Primitives.css).
Per-component CSS files (below) hold the rest — read them for anything not specified here.

### Primitives (`Primitives.css`)

- **`.lv-kicker`** — Mono 13px, `--tracking-mono`, **`--cyan-shift`**. The `// label` texture.
- **`.lv-pill`** — Mono 12px tag with a `#` `::before` prefix; `--accent-bg` fill,
  `--accent-on-dim` text, `--radius-sm`, emerald 38%-mix border.
- **`.lv-chip`** — Mono 12px tech chip; `--surface` fill, `--border`, `--radius-md`.
  `.lv-chip.has-logo` adds a 14×14 `.lv-chip-logo`.
- **`.lv-btn`** — Exo 600 15px base, `--radius-md`, spring transitions. Variants:
  - `.lv-btn-primary` — emerald gradient (`--accent-hover` → `--accent`), `--on-accent` text,
    inset highlight + stacked shadow; on hover the **text shifts toward `--cyan-shift` (blue)**
    and lifts 1px.
  - `.lv-btn-ghost` — transparent, `--border`; hover → `--surface` + emerald border/text.
  - `.lv-btn-link` — text-only; **blue→emerald background-clip slide** on hover.
- **`.lv-link-arrow`** — Mono 13px arrow link; same blue (`oklch(0.78 0.10 262)`)→emerald
  background-clip slide, gap widens on hover. (This is the deliberate blue exception from §3.)

### Hero (`Hero.css`)

Layered, `min-height: 92vh`, `overflow: hidden`. Stack:

1. **`.lv-hero-field`** — full-bleed low-poly navy field (back).
2. **`.lv-hero-scrim`** — radial scrim fading the field into `--bg`.
3. **`.lv-hero-ghost`** — giant Exo monogram, `clamp(7rem,22vw,16rem)`, ~6% `--text-primary` (mid).
4. **`.lv-hero-leolowpoly` / `.lv-hero-portrait-card`** — low-poly portrait; card is
   `clamp(230px,26vw,360px)` square, `--radius-lg`, `--border-strong`, `--shadow-lg`.
5. **`.lv-hero-inner`** — copy stack: kicker (`--cyan-shift`) → name (Exo 700, `--tracking-wide`
   ≈0.12em, **`--accent-bright`**) → tagline (Exo 500) → subline → `.lv-hero-actions`.
6. **`.lv-hero-scrollhint`** — bobbing chevron (`lv-bob` keyframe).

Collapses at **`max-width: 860px`** (portrait card hidden, column layout).

### Component CSS files

`AboutSection.css` · `BlogPost.css` · `ContactFooter.css` · `Hero.css` · `LowPolyField.css` ·
`Nav.css` · `Parallax.css` · `Primitives.css` · `ResumePage.css` · `Testimonials.css` ·
`Views.css` · `WorkSection.css` · `WritingSection.css` — all under `app/components/`.

---

## 10. Imagery & assets

- **Placeholders.** Every project visual is a deterministic `LowPolyField` (faceted navy SVG from
  a numeric `seed`). Keep seeds **unique and stable** — changing a seed changes the visual. Pure
  math, server component, coords rounded to 4 decimals.
- **Navy frame.** When real screenshots replace placeholders, keep the navy-framed container: 1px
  `--border` → `--border-strong` on hover, `--radius-lg`. Frames are **neutral** — let each
  screenshot supply its own color; no per-project frame colors.
- **Portrait assets.** `public/assets/leo_low_poly.svg` (hero), `public/assets/leo_photo.jpg`
  (About).
- **Fonts.** Self-hosted variable TTFs in `public/fonts/` (Exo, Sora, JetBrains Mono).
- **Tech logos.** Devicon `-original` SVGs + Simple Icons (Next.js, white) via CDN; full map is
  `TECH_LOGOS` in `Primitives.tsx`. Unknown names fall back to a text-only chip.
- **Icons.** `lucide-react`. Brand icons `Github`/`Linkedin` **don't exist** in the package — use
  `CodeXml`, `Briefcase`, `Rss` for the footer social links.
- **No emoji anywhere.**

---

## 11. References

| Source | What it owns |
| --- | --- |
| [`app/globals.css`](../app/globals.css) | **Token source of truth** — all `:root` variables, base elements, shell, sections |
| `app/components/*.css` | Per-component styling (see §9) |
| [`docs/Brand.md`](../docs/Brand.md) | Positioning, voice/tone, hero copy (EN/PT), monogram |
| `design/design_handoff_portfolio/` | **Historical** SPA prototype — reference only, not the spec |
