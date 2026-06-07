# Plan: Resume Page (`app/[lang]/resume/page.tsx`)

## Context

Leonardo has EN and PT PDF résumés in `public/resume/`. The "Résumé"/"Currículo" CTA in the nav currently links to `/#about` — a wasted opportunity. The goal is a proper web résumé at `/en/resume` and `/pt/resume` that:
- Renders the full content of both PDFs in the design system's visual language
- Exploits what paper can't do (tech logos, collapsible job details, clickable links, live chips)
- Has a prominent, always-visible PDF download button
- Gets linked from the nav CTA button

---

## Files to Create

### `app/components/ResumePage.tsx`
Server component (`lang: Lang` prop). Holds all resume content as inline bilingual data objects. No client state — uses native `<details>`/`<summary>` for expandable job entries (works without JS, consistent with `AboutSection`'s accordion pattern).

**Structure:**
1. **Resume header** — photo (same `lv-about-portrait` pattern), name, contact row (email · phone · LinkedIn · GitHub), and a prominent primary "Download PDF" `<a>` button + ghost "Get in touch" button.
2. **Experience** — vertical stack of `<details>` cards. Each card shows:
   - `<summary>`: role · company · date range · `stakes` badge for mission-critical roles
   - Body: bullet list + `TechChip` row for that role's stack
   - Top 4 roles open by default, older ones collapsed
3. **Skills** — four-category grid (Languages · Frontend/UI · Backend/Infra · Databases) using the `.lv-stack` / `.lv-stack-cell` logo grid pattern from `AboutSection`
4. **Education** — `.lv-edu` / `.lv-edu-row` pattern reused verbatim
5. **Human languages** — simple mono list (EN · PT · ES with level tags)
6. **MiniFooter** — reuse `MiniFooter` from `ContactFooter.tsx`

### `app/components/ResumePage.css`
New co-located CSS file. Reuses tokens from `:root` in `globals.css`. New classes needed:
- `.lv-resume` — page wrapper, `--container` width, `--section-y` vertical padding
- `.lv-resume-header` — flex row (photo left, copy right), `gap: clamp(2rem,4vw,3rem)`
- `.lv-resume-contact` — mono 13px row of links (email · phone · LinkedIn · GitHub), emerald on hover
- `.lv-resume-actions` — flex row for download + contact buttons, `margin-top: 20px`
- `.lv-resume-section` — section wrapper with `--border` top hairline + section kicker
- `.lv-exp-card` — `<details>` card; `--surface` bg, `1px --border`, `--radius-lg`; open border → `--accent-bright` (same as `.lv-acc`)
- `.lv-exp-summary` — `<summary>` row: role (Exo 500 16px) · company (`--text-secondary`) · dates (mono 12px `--text-muted`) · stakes badge
- `.lv-exp-body` — bullets + tech chip row, `padding: 0 20px 20px`
- `.lv-stakes-badge` — small emerald pill "mission-critical" (reuses `.lv-pill` / `.lv-chip` pattern)
- `.lv-lang-table` — human languages: 3-col row (language · level · flag)
- Responsive `@media (max-width: 860px)`: photo hidden or shrunk, single-column

### `app/[lang]/resume/page.tsx`
Thin async page component — receives `params`, extracts `lang`, renders `<ResumePage>` + `<MiniFooter>`. Exports `generateMetadata` with bilingual title/description.

---

## Files to Modify

### `app/components/Nav.tsx` (line 57–61)
Change href from `/${lang}#about` to `/${lang}/resume`:
```diff
- href={`/${lang}#about`}
+ href={`/${lang}/resume`}
```
Also update `activeId` logic (line 20–26) to detect `/resume` → no existing nav item highlights (correct behavior — résumé is its own destination, not a nav item).

---

## Content Data (inline in `ResumePage.tsx`)

### Experience entries (12 roles, bilingual)

| Role (EN) | Company | Period | Stakes | Tech chips |
|---|---|---|---|---|
| Senior Web Application Developer | Prefeitura Municipal de Itajaí | Apr 2025–Jan 2026 | yes | React, Next.js, Node.js, PostgreSQL |
| Senior Software Engineer | DevHouse | Jan 2024–Apr 2025 | no | TypeScript, React, Next.js, Node.js |
| Senior Full Stack Software Engineer | Email on Acid | Sep 2019–Sep 2023 | yes | React, Node.js, PHP, Redis, PostgreSQL, MongoDB |
| Full Stack Software Engineer | Bureau Veritas Group | Mar 2019–Sep 2019 | yes | React, PHP, PostgreSQL, AWS |
| Senior Software Engineer | DevHouse | Nov 2011–Mar 2019 | no | React, Node.js, PostgreSQL, PHP, C# |
| Tech Lead — Android/Java | Doctors Without Borders (MSF) | Sep 2015–Mar 2016 | yes | Android, Java, MySQL, Python |
| Java Software Engineer | Stock & Info | Apr 2015–Jul 2015 | no | Java, C# |
| Software Engineer | Bravi Software | Nov 2014–Feb 2015 | no | C#, .NET |
| Web Developer | Morphy Digital Group | Aug 2014–Nov 2014 | no | PHP |
| Java Software Engineer | TOTVS | Apr 2011–Nov 2011 | no | Java, JavaScript |
| Web Developer | DMG Digital Agency | Feb 2010–Apr 2011 | no | PHP, PostgreSQL, JavaScript |
| Web Developer (Self-Employed) | Freelancer | Jul 2005–Feb 2010 | no | PHP, PostgreSQL, JavaScript |

Stakes badge appears on Itajaí, Email on Acid, Bureau Veritas, and MSF — the four "mission-critical, failure has real consequences" roles per the Brand.md positioning.

### Skills categories (for the grid)

| Category | Techs with logos |
|---|---|
| Languages | TypeScript, JavaScript, Java, PHP, Python, C# |
| Frontend & UI | React, Next.js, Tailwind, Android |
| Backend & Infra | Node.js, .NET, AWS, Docker, Git |
| Databases | PostgreSQL, MySQL, SQL Server, MongoDB |

Use `TECH_LOGOS` from `Primitives.tsx` for logos. Items without a logo in `TECH_LOGOS` (Python, MongoDB, etc.) render as text-only chips — same fallback as `TechChip`.

### Education (bilingual)
1. Master's in Software Engineering — 2020, Incomplete — UTFPR
2. Postgraduate in Project Management — 2018–2019 — UNICESUMAR  
3. Bachelor's in Computer Science — 2011–2017 — UNICESUMAR

### Human languages
- English: Fluent (TOEFL B1) · Portuguese: Native · Spanish: Conversational

---

## Web-native advantages over the PDF

- Colored tech logos on every job entry (paper is greyscale)
- Stakes badge surfacing mission-critical roles at a glance
- Collapsible older roles — dense top, expandable depth
- Clickable email / LinkedIn / GitHub links
- Language switcher already in nav (live bilingual without two PDFs)
- PDF download still offered — best of both worlds

---

## Verification

1. `pnpm dev` — navigate to `/en/resume` and `/pt/resume`
2. Confirm Nav "Résumé"/"Currículo" CTA navigates to the resume page
3. Confirm PDF download link hits `/resume/Leonardo_LV_EN.pdf` (EN) or `/resume/Leonardo_LV_PT.pdf` (PT)
4. Confirm photo, tech logos, and stakes badges render
5. Confirm `<details>` expand/collapse works without JS
6. Resize to ≤860px — check layout collapses cleanly
7. `pnpm build` — no TypeScript errors
