# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server (always use this, not npx next dev)
pnpm build    # Production build + TypeScript check (emits static out/ directory)
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## What this is

A bilingual (EN/PT-BR) dark-only personal portfolio for Leonardo Lima de Vasconcellos, implemented as a Next.js App Router static site (`output: "export"`).

**Positioning:** mission-critical systems where failure has real consequences. Core line: _"the engineer you want when the system actually matters — and has grown tangled."_

The design handoff in `design_handoff_portfolio/` was the original visual spec. The implementation has since diverged from it — treat `design_handoff_portfolio/` as historical reference only. The live code is the source of truth.

## Architecture

### Routing

File-system routing with `output: "export"` — `pnpm build` emits fully pre-rendered HTML under `out/`. Navigation uses `<Link>` from `next/link` throughout.

| Route           | What renders                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------- |
| `/`             | Hero + AboutSection (embedded) + WorkSection + WritingSection + Testimonials + ContactFooter |
| `/work`         | `ArchiveView` (tier-1 dense grid)                                                            |
| `/work/[id]`    | `ProjectDetail` (tier-3 deep dive)                                                           |
| `/writing`      | `WritingIndex`                                                                               |
| `/writing/[id]` | `BlogPost`                                                                                   |

The "About" nav link is `href="/#about"` — it scrolls to the embedded `<section id="about">` on the homepage. No programmatic scroll handling needed; the browser and `.lv-scroll`'s `scroll-behavior: smooth` handle it.

### Language

`lang` state lives in `LanguageProvider` (client context at `app/components/LanguageProvider.tsx`), wrapping the entire app in `app/layout.tsx`. Components read language with `useLanguage()` — there is no i18n framework. EN is canonical; PT is finalized.

### Components (`app/components/`)

| File                   | Type   | Exports                                                             |
| ---------------------- | ------ | ------------------------------------------------------------------- |
| `LanguageProvider.tsx` | client | `LanguageProvider`, `useLanguage`                                   |
| `Primitives.tsx`       | server | `Kicker`, `Pill`, `TechChip`, `Button`, `TECH_LOGOS`                |
| `LowPolyField.tsx`     | server | `LowPolyField` — deterministic faceted navy SVG from a numeric seed |
| `Nav.tsx`              | client | `Nav` — uses `usePathname()` + `useLanguage()`                      |
| `Hero.tsx`             | client | `Hero`                                                              |
| `AboutSection.tsx`     | client | `AboutSection` — always embedded on homepage; accordion `useState`  |
| `WorkSection.tsx`      | client | `WorkSection`, `WorkRow`                                            |
| `WritingSection.tsx`   | client | `WritingSection`, `PostCard`                                        |
| `Testimonials.tsx`     | client | `Testimonials`, `TestimonialCard`                                   |
| `ContactFooter.tsx`    | client | `ContactFooter`, `MiniFooter`                                       |
| `Views.tsx`            | client | `ProjectDetail`, `ArchiveView`                                      |
| `BlogPost.tsx`         | client | `BlogPost`, `WritingIndex`                                          |

`LowPolyField` and `Primitives` are server components (no hooks, no browser APIs). All content components are `"use client"` because they call `useLanguage()`.

### Content (`app/data.ts`)

Exports `PROJECTS`, `POSTS`, `T` (UI string table). Every bilingual field is `Record<Lang, string>` — always provide both `en` and `pt`. `Lang = "en" | "pt"`.

`PROJECTS` items carry a `seed` (integer) used to deterministically generate the low-poly SVG placeholder. Keep seeds unique and stable — changing a seed changes the visual.

Dynamic routes call `generateStaticParams` to enumerate all slugs at build time:

- `app/work/[id]/page.tsx` — `PROJECTS.map(p => ({ id: p.id }))`
- `app/writing/[id]/page.tsx` — `POSTS.map(p => ({ id: p.id }))`

### Design system (`app/globals.css`)

All styles live in one file plus per-component CSS files co-located with each component (e.g. `Nav.css`, `Hero.css`). **Do not add Tailwind utility classes to components** — the design uses `.lv-*` CSS classes exclusively.

`globals.css` structure:

1. `@font-face` — Exo (display), Sora (body), JetBrains Mono (mono), self-hosted from `public/fonts/`
2. `:root` — design tokens (colors, type scale, spacing, radii, shadows, motion)
3. `@supports not (color: oklch(...))` — hex fallbacks for pre-OKLCH browsers
4. Base element styles
5. App shell (`.lv-app`, `.lv-scroll`)
6. Shared section utilities (`.lv-section`, `.lv-section-head`, etc.)
7. Responsive breakpoint (`@media (max-width: 860px)`)

**Three-tier color logic:**

- Neutral grey (`--bg` → `--raised`) = structure and elevation
- Navy (`--brand-deep` → `--brand-bright`) = quiet brand, large calm surfaces
- Emerald (`--accent-bright`, `--accent`) = the single interactive accent — links, buttons, kickers, active states

The one deliberate exception: arrow/link hover uses a blue slide (`oklch(0.78 0.10 262)`), not emerald.

**App shell:** `.lv-app` is a full-height flex column. `.lv-scroll` (`flex: 1; overflow-y: auto; scroll-behavior: smooth`) is the scroll container for all page content. Custom scrollbar: 10px wide, `--raised` thumb, pill radius.

### Assets

- `public/fonts/` — Exo, Sora, JetBrains Mono variable TTFs
- `public/assets/leo_low_poly.svg` — low-poly SVG portrait (hero)
- `public/assets/leo_photo.jpg` — photo portrait (About section)

Tech logos come from CDN: Devicon `-original` SVGs + Simple Icons for Next.js (white). The full map is `TECH_LOGOS` in `Primitives.tsx`. Unknown tech names fall back to a text-only chip.

Icons use `lucide-react`. Note: brand icons (`Github`, `Linkedin`) do not exist in this package — use `CodeXml`, `Briefcase`, `Rss` for the social links in the footer.

## Key implementation notes

**Static export:** `next.config.ts` sets `output: "export"` and `images: { unoptimized: true }`. `pnpm build` emits `out/`. Host `out/` on any static CDN.

**LowPolyField:** Pure deterministic math — no hooks, no browser APIs. Server component. SVG coordinates are rounded to 4 decimal places (`Math.round(n * 1e4) / 1e4`) for consistency.

**Language toggle:** `lang` state in `LanguageProvider` context, read via `useLanguage()`. No i18n framework. Every bilingual string is `copy[lang]`.

**Navigation:** Use `<Link href="...">` from `next/link` for all internal links. Nav active state from `usePathname()` — no prop needed. The "About" link (`href="/#about"`) relies on native anchor scroll; no JS scroll handling.

**Imagery placeholders:** Every `LowPolyField` stands in for a real project screenshot. The `seed` prop controls the faceted pattern. When adding real screenshots, keep the navy-framed container (1px `--border` → `--border-strong` on hover, `--radius-lg`).

**No emoji anywhere** — the `//` kicker and mono labels carry the "engineer" texture.
