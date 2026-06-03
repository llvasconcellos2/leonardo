# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server (always use this, not npx next dev)
pnpm build    # Production build + TypeScript check
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## What this is

A bilingual (EN/PT-BR) dark-only personal portfolio for Leonardo Lima de Vasconcellos, implemented as a Next.js App Router SPA. The design spec lives in `design_handoff_portfolio/README.md` — that file is the canonical reference for layout, copy, colors, and interactions. The HTML prototype in `design_handoff_portfolio/source/` is the visual spec.

**Positioning:** mission-critical systems where failure has real consequences. Core line: _"the engineer you want when the system actually matters — and has grown tangled."_

## Architecture

### Routing

The app is a client-side SPA. All routing is state-based in `app/page.tsx` — no Next.js file-system routes beyond `/`. The `go(route, id?)` function is the only navigation primitive, typed as `GoFn` in `app/components/types.ts`.

| State route | What renders                                                                                 |
| ----------- | -------------------------------------------------------------------------------------------- |
| `home`      | Hero + AboutSection (embedded) + WorkSection + WritingSection + Testimonials + ContactFooter |
| `project`   | `ProjectDetail` (tier-3 deep dive)                                                           |
| `archive`   | `ArchiveView` (tier-1 dense grid)                                                            |
| `writing`   | `WritingIndex`                                                                               |
| `post`      | `BlogPost`                                                                                   |

`go('about')` is special: it routes home then smooth-scrolls to `#about` (offset 64px for nav).

### Components (`app/components/`)

| File                 | Exports                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `types.ts`           | `GoFn` type                                                         |
| `Primitives.tsx`     | `Kicker`, `Pill`, `TechChip`, `Button`, `TECH_LOGOS`                |
| `LowPolyField.tsx`   | `LowPolyField` — deterministic faceted navy SVG from a numeric seed |
| `Nav.tsx`            | `Nav`                                                               |
| `Hero.tsx`           | `Hero`                                                              |
| `AboutSection.tsx`   | `AboutSection` — used embedded (homepage) and standalone            |
| `WorkSection.tsx`    | `WorkSection`, `WorkRow`                                            |
| `WritingSection.tsx` | `WritingSection`, `PostCard`                                        |
| `Testimonials.tsx`   | `Testimonials`, `TestimonialCard`                                   |
| `ContactFooter.tsx`  | `ContactFooter`, `MiniFooter`                                       |
| `Views.tsx`          | `ProjectDetail`, `ArchiveView`                                      |
| `BlogPost.tsx`       | `BlogPost`, `WritingIndex`                                          |

All components are `"use client"`.

### Content (`app/data.ts`)

Exports `PROJECTS`, `POSTS`, `T` (UI string table). Every bilingual field is `Record<Lang, string>` — always provide both `en` and `pt`. `Lang = "en" | "pt"`.

`PROJECTS` items carry a `seed` (integer) used to deterministically generate the low-poly SVG placeholder for that project. Keep seeds unique and stable — changing a seed changes the visual.

### Design system (`app/globals.css`)

All styles live in one file. **Do not add Tailwind utility classes to components** — the design uses `.lv-*` CSS classes exclusively. The file is structured as:

1. `@font-face` — Exo (display), Sora (body), JetBrains Mono (mono), self-hosted from `public/fonts/`
2. `:root` CSS custom properties — design tokens (colors, type scale, spacing, radii, shadows, motion)
3. `@supports not (color: oklch(...))` — hex fallbacks for pre-OKLCH browsers
4. Base element styles
5. Component classes (`.lv-nav`, `.lv-hero`, `.lv-section`, etc.)
6. Responsive breakpoint (`@media (max-width: 860px)`)

**Token philosophy (three-tier color logic):**

- Neutral grey (`--bg` → `--raised`) = structure and elevation
- Navy (`--brand-deep` → `--brand-bright`) = quiet brand, large calm surfaces
- Emerald (`--accent-bright`, `--accent`) = the single interactive accent — links, buttons, kickers, active states

### Assets

- `public/fonts/` — Exo, Sora, JetBrains Mono variable TTFs
- `public/assets/leo_low_poly.svg` — low-poly SVG illustration of Leonardo's photo
- `public/assets/leo_photo.jpg` — About section square portrait

Tech logos come from CDN: Devicon `-original` SVGs + Simple Icons for Next.js (white). The full map is `TECH_LOGOS` in `Primitives.tsx`. Unknown tech names fall back to a text-only chip.

Icons use `lucide-react`. Note: brand icons (`Github`, `Linkedin`) do not exist in this package — use `CodeXml`, `Briefcase`, `Rss` for the social links in the footer.

## Key implementation notes

**LowPolyField hydration:** SVG coordinates are rounded to 4 decimal places (`Math.round(n * 1e4) / 1e4`) to prevent SSR/client floating-point mismatches. Do not remove this rounding.

**Language toggle:** `lang` state lives in `page.tsx` and is passed down as a prop. Every bilingual string is accessed as `copy[lang]` — there is no i18n framework. EN is canonical; PT is finalized.

**Imagery placeholders:** Every `LowPolyField` is a stand-in for a real project screenshot. The `seed` prop controls which faceted pattern renders. When adding real screenshots, use `<Image>` inside the same navy-framed container (1px `--border` → `--border-strong` on hover, `--radius-lg`).

**No emoji anywhere** — the `//` kicker and mono labels carry the "engineer" texture per brand spec.
