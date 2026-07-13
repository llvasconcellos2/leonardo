# Plan — Generate `data/work.ts` from the project archive

## Context

The portfolio's real project catalog lives as 45 self-contained repos under `project_archive/*/`, each with an
identically-structured `README.md` (the author formatted them uniformly with exactly this import in mind). The site
currently ships only a hand-written 4-item placeholder dataset (`PROJECTS` in `data/data.ts`). We need a single
bilingual (EN/PT-BR) data file — `data/work.ts` — describing **all** archived projects, plus their screenshots and
tech icons copied into `public/`, so the `/work` archive and project-detail pages can later be wired to real data.

**Scope (confirmed):** data + assets only. Do **not** modify `Views.tsx` / the `/work` routes in this task.

## What to extract from each README

Parse **only** the 45 top-level `project_archive/*/README.md` files. Ignore the many nested
`project_archive/**/www|src/**/README.md` (WordPress plugins, themes, vendored packages) — they are not projects.

Per project, pull:

| Field         | Source in README                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `slug`        | folder name (also the URL id)                                                                         |
| `name`        | the `<h1 align="center">`                                                                             |
| `tagline`     | first `<p align="center">` under the h1                                                               |
| `kicker`      | the `// … · …` `<p align="center">` line                                                              |
| `liveUrl`     | the `View it live »` anchor href                                                                      |
| `year`        | digits from `[year-shield]: …/Released-<YYYY>` (only the year is needed from shields)                 |
| `intro`       | text between `<!-- PROJECT INTRO … -->` and `<!-- END INTRO -->`                                      |
| `body`        | About-the-Project paragraphs **after** the intro and **before** the feature bullets (0..n paragraphs) |
| `features`    | the bold-lead bullets (`**Heading** — body`), under `### Key Features` when present                   |
| `tech`        | rows of the **Languages** + **Frameworks & Libraries** tables, merged into one list                   |
| `screenshots` | the `## Screenshots` grid `<img src>` list, in display order                                          |
| `featured`    | the `[product-screenshot]` file (the shot directly under `## About The Project`)                      |

### Known variants to handle (verified)

- **`semprecomvoce-next`**: has **no `### Key Features` heading** — its feature bullets sit directly under the intro
  paragraph. Parser must treat "the bold-dash bullet list following the intro/body" as features regardless of heading.
- **`semprecomvoce-next`**: its `product-screenshot` (`Captura de tela … 100757.png`) is **not** in the grid. So the
  featured shot is not guaranteed to be a grid member — if absent, prepend it as its own `featured` entry.
- Some `tech` rows have **no icon** (`—`, e.g. VirtueMart) and/or no version — icon/version are optional.
- Icon URLs are mostly `cdn.jsdelivr.net/gh/devicons/devicon/icons/<name>/<name>-original.svg`; a few use
  `devicons.io/...` (e.g. Joomla). Filenames in README screenshot links are URL-encoded (`%20`, `%C3%A7`); the real
  on-disk files under `project_archive/<slug>/screenshots/` have literal spaces/accents.

## The data model — `data/work.ts`

Reuse the existing `Lang` type from `data/data.ts` (`import type { Lang } from "./data";`). Every text field is
`Record<Lang, string>` and gets a real PT-BR translation (titles/kickers that are already Portuguese stay as-is with an
English-facing equivalent where natural).

```ts
import type { Lang } from "./data";

export interface WorkTech {
  name: string;
  version?: string; // omit when README shows "—"
  icon?: string; // "/devicons/php-original.svg"; omit when no icon
}

export interface WorkScreenshot {
  src: string; // "/projects/<slug>/screenshots/<sanitized>.png"
  featured?: boolean; // true only for the About-the-Project product shot
}

export interface WorkFeature {
  heading: Record<Lang, string>;
  body: Record<Lang, string>;
}

export interface Work {
  slug: string;
  year: string;
  pinned: boolean; // default false for every entry
  liveUrl?: string;
  logo?: string; // "/projects/<slug>/<slug>-logo.<ext>"; omit if the project has no logo
  name: Record<Lang, string>;
  tagline: Record<Lang, string>;
  kicker: Record<Lang, string>;
  intro: Record<Lang, string>;
  body: Record<Lang, string[]>; // About paragraphs (bilingual arrays)
  features: WorkFeature[];
  tech: WorkTech[];
  screenshots: WorkScreenshot[]; // grid order; the featured one flagged
}

export const WORKS: Work[] = [
  /* 45 entries */
];
```

## Assets

Per-project assets live under **`public/projects/<slug>/`** (folder structure confirmed with the user):

- **Screenshots** → copy each `project_archive/<slug>/screenshots/<file>` into
  `public/projects/<slug>/screenshots/<sanitized>.<ext>`. Sanitize: NFD-strip diacritics, lowercase, replace any run of
  non-`[a-z0-9.]` with `-`, collapse/trim dashes (e.g. `Empresas   Localização.png` → `empresas-localizacao.png`).
  Screenshot order = README grid order; mark the `product-screenshot` file `featured: true` (prepend it if not in grid).
- **Logo** → each README's header logo `<img src=…>` (the `<img>` inside the top `<div align="center">` logo anchor)
  points at a repo-relative file (e.g. `assets/logo/logo.png`, `rip/images/logo.png`, `public/juca.svg`,
  `www/logo.png`). Copy it to `public/projects/<slug>/<slug>-logo.<ext>` (keep the original extension) and set
  `logo`. The source path varies per project and is often URL-encoded (`%20`); resolve against the project folder.
  **Logo is optional** — some projects genuinely have no logo image; if none is found, leave `logo` unset.
  **At the end of the task, report the full list of projects that ended up with no logo.**
- **Devicons** → stay in **`public/devicons/`**. Collect every unique icon URL across all READMEs, download once each
  into `public/devicons/` keeping the leaf filename (`php-original.svg`, `nextjs-original.svg`, …). `tech[].icon`
  points at the local path.

### Icon edge cases (verified across all 45 READMEs)

- **VirtueMart** (`alfa-eletro`) has no icon (`—` in the README) → **skip it entirely**; do not add it to any `tech`.
- **Joomla** rows in 11 projects (`alfa-eletro`, `e-profissionalizando`, `gerhacao`, `maquel`, `mobtex`, `nr-10`,
  `nucleo-do-evento`, `oficina-dos-sonhos`, `oriente`, `resgate`, `supercarwash`) point at the dead host
  `https://devicons.io/devicons/icons/joomla.svg`. Substitute the working
  `cdn.jsdelivr.net/gh/devicons/devicon/icons/joomla/joomla-original.svg` when downloading → local `joomla-original.svg`.
- Any other `cdn.jsdelivr.net` URL that 404s at download time → leave that tech's `icon` unset and report it.

## Implementation approach

1. **Mechanical pass — throwaway Node script** (in the scratchpad, not committed): iterate the 45 slugs, parse each
   README per the table above, copy+rename screenshots, collect+download the unique devicon set, and emit an
   intermediate `works.en.json` holding the English fields + resolved asset paths + tech + screenshot/featured flags.
   This keeps parsing/asset work deterministic and error-free; translation is layered on top by hand.
2. **Authoring pass — `data/work.ts`**: from the intermediate JSON, hand-write the typed `WORKS` array, adding the
   PT-BR translation for every text field (`name`, `tagline`, `kicker`, `intro`, each `body` paragraph, each feature
   `heading`/`body`) and restructuring features into `{heading, body}`. Given 45 rich entries this is large output —
   build the array incrementally (append in batches), keeping the file compiling after each batch.

### Critical files

- **Create** `data/work.ts` — the dataset + `Work`/`WorkTech`/`WorkScreenshot`/`WorkFeature` types.
- **Create** `public/projects/<slug>/screenshots/…` — copied/renamed screenshots (per project).
- **Create** `public/projects/<slug>/<slug>-logo.<ext>` — copied/renamed logo (where the project has one).
- **Create** `public/devicons/*.svg` — downloaded icons (deduped).
- **Reuse** `Lang` from `data/data.ts`. Leave `data/data.ts` and all components untouched.

## Verification

- `pnpm build` — runs the production build + `tsc`; confirms `data/work.ts` type-checks (all `Record<Lang,…>` fields
  present for both `en` and `pt`, all interfaces satisfied).
- Sanity script/spot-check: `import { WORKS } from "./data/work"` → assert `WORKS.length === 45`, every entry has
  `pinned` set, exactly one (or zero) `featured` screenshot per entry, and every `screenshot.src` / `tech.icon` /
  `logo` path resolves to a file that actually exists under `public/`.
- Spot-check 2–3 projects (incl. the `semprecomvoce-next` variant) against their README to confirm the intro/body/
  feature split and the featured-screenshot handling are correct.
