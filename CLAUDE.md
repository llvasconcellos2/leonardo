# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server (always use this, not npx next dev)
pnpm build    # Production build + TypeScript check
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Brand.md

Informations at `docs/Brand.md`

## What this is

A bilingual (EN/PT-BR) dark-only personal portfolio for Leonardo Lima de Vasconcellos, implemented as a Next.js App Router site hosted on Vercel.

**Positioning:** mission-critical systems where failure has real consequences. Core line: _"the engineer you want when the system actually matters — and has grown tangled."_

The design handoff in `/design/design_handoff_portfolio/` was the original visual spec. The implementation has since diverged from it — treat `/design/design_handoff_portfolio/` as historical reference only. The live code is the source of truth.

## Architecture

### Routing

File-system routing under `app/[lang]/`. Middleware at the repo root (`middleware.ts`) redirects bare `/` and non-prefixed paths to the preferred locale (from `Accept-Language`, defaulting to `en`).

| Route                   | What renders                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `/en` · `/pt`           | Hero + AboutSection (embedded) + WorkSection + WritingSection + Testimonials + ContactFooter |
| `/en/work` · `/pt/work` | `ArchiveView` (tier-1 dense grid)                                                            |
| `/[lang]/work/[id]`     | `ProjectDetail` (tier-3 deep dive)                                                           |
| `/[lang]/writing`       | `WritingIndex`                                                                               |
| `/[lang]/writing/[id]`  | `BlogPost`                                                                                   |

The "About" nav link is `href="/${lang}#about"` — it scrolls to `<section id="about">` on the homepage. No programmatic scroll handling; the browser and `.lv-scroll`'s `scroll-behavior: smooth` handle it.

### Language

`lang` is a URL segment (`en` | `pt`). The `[lang]/layout.tsx` receives it as `params.lang` and passes it as a prop to `Nav`. Every page receives it via `params` and threads it down to all components. No context, no client state. The language toggle in Nav is a `<Link>` that swaps the locale prefix in the current pathname.

### Components (`app/components/`)

| File                   | Type   | Exports                                                             |
| ---------------------- | ------ | ------------------------------------------------------------------- |
| `Primitives.tsx`       | server | `Kicker`, `Pill`, `TechChip`, `Button`, `TECH_LOGOS`                |
| `LowPolyField.tsx`     | server | `LowPolyField` — deterministic faceted navy SVG from a numeric seed |
| `Hero.tsx`             | server | `Hero` — receives `lang` prop                                       |
| `WorkSection.tsx`      | server | `WorkSection`, `WorkRow` — receives `lang` prop                     |
| `WritingSection.tsx`   | server | `WritingSection`, `PostCard` — receives `lang` prop                 |
| `Testimonials.tsx`     | server | `Testimonials`, `TestimonialCard` — receives `lang` prop            |
| `ContactFooter.tsx`    | server | `ContactFooter`, `MiniFooter` — receives `lang` prop                |
| `Views.tsx`            | server | `ProjectDetail`, `ArchiveView` — receives `lang` prop               |
| `BlogPost.tsx`         | server | `BlogPost`, `WritingIndex` — receives `lang` prop                   |
| `Nav.tsx`              | client | `Nav` — `usePathname()` for active state; receives `lang` prop      |
| `AboutSection.tsx`     | client | `AboutSection` — accordion `useState`; receives `lang` prop         |
| `Parallax.tsx`         | client | `Parallax` — `window.innerWidth` + `ResizeObserver`                 |
| `BluePrint.tsx`        | client | `Blueprint` — animation effects                                     |
| `BG-Pattern.tsx`       | server | `BGPattern`                                                         |
| `LeoLowPoly.tsx`       | server | `LeoLowPoly`                                                        |

The only `"use client"` components are those that require browser APIs or React state. Everything else is a server component receiving `lang: Lang` as a prop.

### Content (`app/data.ts`)

Exports `PROJECTS`, `POSTS`, `T` (UI string table). Every bilingual field is `Record<Lang, string>` — always provide both `en` and `pt`. `Lang = "en" | "pt"`.

`PROJECTS` items carry a `seed` (integer) used to deterministically generate the low-poly SVG placeholder. Keep seeds unique and stable — changing a seed changes the visual.

Dynamic routes call `generateStaticParams` to enumerate slugs. The `[lang]` layout also exports `generateStaticParams` returning `[{ lang: 'en' }, { lang: 'pt' }]`.

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

**Vercel hosting:** no `output: "export"`. Vercel handles SSR and image optimisation natively.

**Locale routing:** `proxy.ts` at the repo root (Next.js 16's replacement for `middleware.ts`) intercepts all non-asset requests. If the path has no `/en/` or `/pt/` prefix it redirects to the preferred locale (from `Accept-Language` header, fallback `en`).

**LowPolyField:** Pure deterministic math — no hooks, no browser APIs. Server component. SVG coordinates are rounded to 4 decimal places (`Math.round(n * 1e4) / 1e4`) for consistency.

**Language prop:** `lang: Lang` flows from the URL param through the `[lang]` layout and page components down to every content component as an explicit prop. There is no context or global state for language.

**Navigation:** Use `<Link href={`/${lang}/...`}>` from `next/link` for all internal links. Nav active state is derived from `usePathname()` — no prop needed. The language toggle computes `pathname.replace(/^\/(en|pt)/, '/${otherLang}')`.

**Imagery placeholders:** Every `LowPolyField` stands in for a real project screenshot. The `seed` prop controls the faceted pattern. When adding real screenshots, keep the navy-framed container (1px `--border` → `--border-strong` on hover, `--radius-lg`).

**No emoji anywhere** — the `//` kicker and mono labels carry the "engineer" texture.
