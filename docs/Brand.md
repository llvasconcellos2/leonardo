# Brand & Design System — Leonardo's Portfolio

> Persistent memory for this project. Read this first in any new session.
> It records not just *what* the decisions are, but *why* — so the build
> stays coherent across sessions. Tokens live in `globals.css`.

**Stack:** Next.js · Tailwind CSS · static export (no backend/db) · OKLCH color · bilingual (PT-BR + EN).
**Posture:** dark-only (no light mode).

---

## 1. Identity & positioning

- **Primary mode:** personal brand / home base. This sets the voice and is the container.
- **Secondary mode:** "here's how to work with me" — resume + clear contact path, present and easy to find, but not the headline. Open to good freelance and the right full-time role.
- **The engine:** the blog. A prior site passed 1,000,000+ views. Writing is the rare differentiator and the marketing that runs while asleep — treat it as the *engine of the site*, not a tab in the corner. Projects are the proof; writing is what brings people back.
- **Name:** Leonardo Lima de Vasconcellos. Based in Joinville, Santa Catarina, Brazil. Bilingual (PT-BR native, EN fluent).
- **Scale:** ~20 years' experience (since 2005), ~70 shipped projects (mostly discontinued; source on GitHub with screenshots + crawled static snapshots), across web, mobile (Android), some desktop. Still hands-on; AI-assisted dev (Cursor, Claude Code).

**Hierarchy:** You → Writing → Work → Hire me.

### Positioning (LOCKED — blend of "stakes-forward" + "modernizer")
The differentiator is NOT "full-stack, many frameworks" (every senior claims that). It's:
**mission-critical systems where failure has real consequences** — Brazil's top-ranked smart city (Itajaí), global grain supply chains for BASF/Bayer (Bureau Veritas), the world's largest educational software, and an **Ebola-response medical-records system with Doctors Without Borders** (selected from 1,000+, elected technical lead) — shipped across **five eras of the web** (Flash/Flex → PHP → Java/Android → .NET → React/Next + AI-assisted), still writing code.
**Core line:** *the engineer you want when the system actually matters — and has grown tangled.*

### Hero copy
**EN**
- kicker: `// full-stack engineer · since 2005`
- name: LEONARDO
- tagline: From Doctors Without Borders to smart cities — two decades building the software people depend on.
- subline: I take tangled, mission-critical systems and make them scale: clean, fast, built to last.

**PT-BR**
- kicker: `// engenheiro full-stack · desde 2005`
- name: LEONARDO
- tagline: De Médicos Sem Fronteiras a cidades inteligentes — duas décadas construindo o software de que as pessoas dependem.
- subline: Eu transformo sistemas complexos e essenciais em soluções escaláveis: limpas, rápidas e feitas para durar.

*(EN copy is the canonical draft; PT-BR finalized by Leonardo.)*

### About (canonical — same text on landing About, PDF resume, and LinkedIn)
**EN:** I'm a senior full-stack engineer who's been shipping for the web since 2005 — around 70 projects across five eras of the technology. I was elected technical lead on an Ebola-response records system with Doctors Without Borders, helped scale high-concurrency SaaS at Email on Acid, and contributed to Brazil's top-ranked smart city in Itajaí. My specialty is the systems where failure has real consequences: I take them — mission-critical, often tangled — and make them scale, clean and fast and built to last. I'm still hands-on every day, now AI-assisted, and I work in both English and Portuguese. Off the clock I play bass, drums, and guitar — same discipline and timing, different instrument. If you're building something that genuinely has to work, I'd like to hear about it.

**PT-BR:** Sou engenheiro de software full-stack sênior e desenvolvo para a web desde 2005 — cerca de 70 projetos ao longo de cinco eras da tecnologia. Fui eleito líder técnico de um sistema de prontuários para o combate ao Ebola com os Médicos Sem Fronteiras, ajudei a escalar SaaS de alta concorrência na Email on Acid e contribuí para a cidade inteligente mais bem classificada do Brasil, em Itajaí. Eu me especializo em sistemas em que a falha tem consequências reais: pego os mais críticos e complexos e os transformo em soluções escaláveis — limpas, rápidas e feitas para durar. Continuo com a mão no código todos os dias, agora com auxílio de IA, e trabalho em português e inglês. Fora do expediente, toco baixo, bateria e guitarra — mesma disciplina e timing, outro instrumento. Se você está construindo algo que realmente precisa funcionar, vou adorar saber mais.

*(On the PDF, the closing invitation may be trimmed if space requires; keep it on landing + LinkedIn.)*

- **Voice:** professional but human, with a lighthearted/playful side (musician — bass/drums/guitar, heavy-metal background). Build the site as *him*; keep hire-me paths obvious for LinkedIn arrivals.
- **Monogram: LV** (Leonardo Vasconcellos) — LOCKED. Iconic two-letter mark; already his established shorthand (`llvasconcellos`). Set in Exo for the hero.

---

## 2. Color system

Authored in **OKLCH**, interpolated in **OKLAB** (gradients/transitions). Portrait-extracted
hex were *seeds*; final ramps are stepped in OKLCH (hue-locked, even lightness steps).

### The three-tier color logic (the core idea)
Each layer has exactly one job, so they never compete:

1. **Neutral grey = structure.** Elevation is communicated *only* by stepping lighter through the neutral ramp (ground → surface → raised). Hue-locked to 258 so the greys belong to the blue family rather than sitting near it by accident. Dark grey, **not black** — a grey base lets surfaces go both lighter (elevation) and darker (recess); black only allows lighter.
2. **Navy = brand.** From the low-poly portrait. Demoted to *quiet* structural color: brand bands, large calm surfaces. Reads as deliberate *because* it sits on neutral. NOT a second accent.
3. **Emerald = the single accent.** The only bright color; carries all action/attention (links, buttons, kickers, active states). Chosen for maximum pop. It is a *third hue* with no kinship to the navy — that is accepted and managed by hierarchy: navy is quiet/large, emerald is bright/small, so they read as "a deep blue stage with one green spotlight," not two accents fighting.

This is essentially the dpalomeras model (dark grey + emerald) personalized with portrait-derived navy adding depth.

### Tokens (see `globals.css` for OKLCH source)
| Token | Hex | Role |
|---|---|---|
| `--bg` | #202327 | page ground |
| `--surface` | #2c2f34 | cards |
| `--raised` | #393d44 | elevated |
| `--border` | #4d535c | dividers (1px hairline) |
| `--border-strong` | #636974 | hover borders |
| `--text-muted` | #9199a5 | captions/metadata |
| `--text-secondary` | #b7beca | body/UI text |
| `--text-primary` | #e3e8f0 | headings |
| `--brand-deep` | #082451 | brand bands / hero field |
| `--brand` | #173a76 | brand surfaces |
| `--brand-bright` | #395584 | brand hover / chart fills |
| `--accent-bg` | #153f29 | tag/pill fills |
| `--accent` | #2eba7a | buttons |
| `--accent-bright` | #45bf82 | links, kickers, underlines |
| `--accent-hover` | #54cc8e | accent hover |
| `--on-accent` | #001c0e | text on accent (richer on P3) |
| `--accent-on-dim` | #7dd3a3 | text on `--accent-bg` |

### Notes
- **Project visuals get a NEUTRAL (navy) frame** — let each project's own screenshot supply the color. Don't add per-project frame colors; the work brings the variety.
- **Gamut:** `--on-accent` sits just outside sRGB and is fitted on standard displays; renders richer on P3/wide-gamut. Watch the light+saturated edge when extending ramps.
- **Retired during exploration:** emerald-as-default was reconsidered and re-chosen; the warm peach/skin tones (portrait skin) are illustration-only and banned from UI; mauve-tinted neutrals were superseded by the 258 blue-grey neutrals.
- **Dark-only — LOCKED.** No light mode. Don't build a light variant.

---

## 3. Typography

**All-sans system, two families + a mono for code.** No serif (Newsreader was dropped).
Driven by the fact that the blog is the engine — body text does real work — so Sora
(the body font) was chosen partly for staying readable at length.

- **`--font-display` — Exo.** Display + headlines: hero monogram, letterspaced name, all headings (h1–h4), card titles. Angular, geometric, techno character — the personality of the brand. (Display only; not for long body — see below.)
- **`--font-sans` — Sora.** Body, UI, *and* blog prose. Geometric but even-toned and readable at paragraph length, which matters now that there's no serif carrying the blog.
- **`--font-mono` — JetBrains Mono.** Code blocks, tech tags, metadata, and the category kicker (`.kicker`, the `// label` code-comment style that replaces the dropped serif italic).

Exo, Sora, and JetBrains Mono are on Google Fonts → load via `next/font/google`.

- **Scale:** ratio ~1.25, fluid via `clamp()` at the top end (see `--text-*`). Blog body is `--text-prose` (~19px), larger than UI body on purpose.
- **Line-height:** tight (1.1) for display/headings, 1.7 for prose.
- **Measure:** `--measure-prose: 68ch`. Protect this — the million views came from people *reading*; an over-wide prose line is where readers quit.
- **Weights:** 400 body · 500 medium · 700 display only.
- **Watch:** Exo has personality that's an asset in display but a tax in long body — keep it out of paragraphs; that's Sora's job.

---

## 4. Spacing & layout

- **Base unit 4px** (Tailwind-native). Raw scale `--space-1..32`.
- **`--section-y: clamp(4rem,10vw,8rem)`** — generous vertical rhythm so sections read as distinct *scenes* on a scroll-driven site.
- **Two containers** (the typographic mirror of the work tiers): `--container` 72rem for gallery/UI; `--container-prose` 42rem for blog reading.
- **Radii:** sm 6 / md 10 / lg 14 / pill. **Borders:** 1px hairline in `--border` (0.5px can vanish on dark).

---

## 5. Motion

- **Existing system (keep):** custom `Reveal` + `RevealGroup` (IntersectionObserver, fires once on enter). Props: `delay, duration, distance, threshold, blur/blurAmount, direction ('up'|'down'|'left'|'right'), once`. Easing `cubic-bezier(0.22,1,0.36,1)` (`--ease-spring`). SSR guard for IntersectionObserver. `prefers-reduced-motion` pattern already in place.
- **NEW capability for the hero — DECIDED: CSS scroll-driven animations (no Framer Motion).** The hero is **scroll-scrubbed** (continuous scroll-progress), a different mechanism from IntersectionObserver. Use `animation-timeline: scroll()/view()`; coordinate the layers off one scroller via named timelines / `timeline-scope`. Pinned via a tall wrapper + sticky inner panel. Rationale: zero JS, compositor-driven (fastest), no dependency, fits the vanilla `Reveal` ethos, clean for static export.
  - **Fallback:** wrap animations in `@supports (animation-timeline: scroll())` + use `animation-fill-mode: both` so unsupported browsers (Firefox, ~as of 2026 still behind a flag) land on the static **end state** — which is the same usable header needed for reduced-motion + SEO. Build the end state first, animate as progressive enhancement.
- **Also use CSS scroll-driven for simple scroll effects** (reading-progress bar, sticky-header shadow, light parallax) where zero-JS perf shines and a Firefox static fallback is harmless.
- Animate `transform`/`opacity` only (GPU-friendly). Honour `prefers-reduced-motion` (see `globals.css`).

---

## 6. Information architecture (homepage)

Curated *overview* — each section is a teaser that links OUT to a fuller page (do NOT inline all content; that's the carousel-of-70 mistake).

Rough flow: **Hero → (about / proof) → Selected Work → Writing → Contact / hire-me.**
- Borrowed palette from dpalomeras; did NOT inherit its single-page-contains-everything structure (wrong at 70 projects / serious blog).

---

## 7. Hero spec (scrollytelling)

A pinned, scroll-scrubbed layered reveal that resolves a cinematic splash INTO the functional header (no wasted viewport). Reference: raghav-velan — kept the mechanism, dropped the GTA6 background.

- **Layer 1 (back):** low-poly faceted field in navy; **darkens to near-black** across scroll. This is the "artist look" — the low-poly aesthetic *is* the art direction (ties to the portrait → palette), so no literal scene needed.
- **Layer 2 (mid):** monogram **LV** (Exo) — starts large/central, **rises + shrinks + dims** to a ghost.
- **Layer 3 (front):** the **low-poly portrait** (use the SVG export) — **fades out**.
- **End state (the real header):** name "LEONARDO" (emerald `--accent-bright`, letterspaced) + kicker + tagline + subline + résumé button, on dark. Copy in §1 (EN + PT). Localized per `[locale]`.
- **Reduced motion / SEO:** must present the end state immediately as real text (both locales). Keep the pinned scroll short (no scroll-jacking).
- Bonus option: portrait is SVG (vector facets) → facets could assemble as a flourish.

---

## 8. Work section spec (three tiers)

Confirmed by three references (early advice + dpalomeras "see all" + rajsh). Backbone — trust it.

1. **Tier 1 — Archive page:** all ~70 projects, dense grid/list, minimal per item.
2. **Tier 2 — Homepage hero rows:** 6–8 curated, each a rich full-width row →
   *mini-gallery of screenshots · title · italic category kicker · description · feature bullets · labelled tech tags ("Engineered with") · "view details / live snapshot" link.* Alternating visual side optional. Each row is a `RevealGroup`.
3. **Tier 3 — Per-hero detail page:** the deep dive — full screenshots, write-up, tech rationale, and the **embedded crawled live snapshot** of the real thing.

**Unfair advantages to exploit:** the self-hosted crawled snapshots (label them clearly as *archived snapshots*; watch absolute asset paths / mixed-content; consider per-project subdomain or rewritten `<base>`). The act of crawling + self-hosting is itself a craft signal worth a sentence.

---

## 10. Internationalization (i18n)

Bilingual **PT-BR + EN**, with auto-detection. Leonardo is committed to maintaining both — all content (blog, project write-ups, UI copy) ships in both languages.

- **Constraint:** Next.js built-in `i18n` routing does NOT work with `output: export` ("Specified i18n cannot be used with output: export").
- **Approach (chosen):** `[locale]` dynamic segment + `generateStaticParams()` returning both locales → real static HTML per language (`/pt/...`, `/en/...`). Use **next-intl** with `setRequestLocale` to keep pages statically rendered. Emit `hreflang` alternate tags for SEO.
- **Auto-detect = client-side** (no server on a static host): on a hit to `/`, read `navigator.languages`, redirect to `/pt` or `/en`, persist in `localStorage`; provide a manual language switcher to override. (If later hosted on an edge platform, the redirect can move to the edge.)
- Simpler fallback option if needed: `next-export-i18n` (client-only, query/localStorage) — but loses per-language static HTML / SEO, so not preferred.

---

## 11. Assets

- `Leo_low_poly.png` + **SVG export** — the low-poly self-portrait. Source of the palette seeds AND the hero front layer. Use the SVG (transparent background; its native blue backdrop is NOT a brand color and is dropped).
- ~70 project screenshots + crawled static snapshots (GitHub: `github.com/llvasconcellos`, `github.com/llvasconcellos2`).

---

## 12. Decision log — all locked

- [x] Monogram — **LV** (§1)
- [x] Voice / tone — final as described (§1)
- [x] Positioning + hero copy (EN + PT) (§1)
- [x] Dark-only, no light mode (§2)
- [x] Color system — neutral/navy/emerald, OKLCH (§2)
- [x] Typography — Exo (display) + Sora (body) + JetBrains Mono (code) (§3)
- [x] Spacing & layout (§4)
- [x] Motion — CSS scroll-driven hero, no Framer Motion; keep IntersectionObserver `Reveal` (§5)
- [x] Information architecture (§6)
- [x] Hero spec (§7)
- [x] Work section — three tiers (§8)
- [x] Bilingual — `[locale]` + next-intl + client detect (§10)

**Design system complete.** Next build step: the hero (hardest screen) as the system stress-test.

---

*Method note: references informed decisions, they were never copied wholesale. Every value
above traces to a reason. When extending the system, derive new values in OKLCH from the
existing ramps rather than introducing off-system colors or a fourth font without a clear job.*