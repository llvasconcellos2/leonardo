# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server on port 3000
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

Next.js 15 App Router project with React 19, TypeScript, and Tailwind CSS 4.

- `app/` — App Router pages and layouts. `layout.tsx` is the root layout (Geist fonts, global styles). `globals.css` holds Tailwind imports and CSS custom properties for light/dark theming.
- `public/` — Static SVG assets.
- Path alias `@/*` resolves to the project root.

## Key Config

- `tsconfig.json` — strict mode, ES2017 target, `@/*` alias.
- `eslint.config.mjs` — flat config format, extends `next/core-web-vitals` and `next/typescript`.
- `postcss.config.mjs` — Tailwind CSS via PostCSS plugin (Tailwind v4 style).
- `pnpm-workspace.yaml` — workspace build support for `sharp` and `unrs-resolver`.
