# Plan: Resume Page — Redesign to Match Design Handoff

## Context

A new design handoff arrived at `design/design_handoff_resume/` with a significantly
different layout from what was first built. The prior implementation used accordion
`<details>` cards. The new spec uses a **vertical timeline list** with a left rail,
a **tech filter bar** with live dimming, **proficiency bars** for languages, and a
proper two-column lower section (skills | languages + education + links). This plan
replaces the prior `ResumePage.tsx` / `ResumePage.css` entirely to match the handoff.

The user's note: "Claude design thinks this is a SPA — it's not, it's SSR."
The key implication: interactive parts (filter + expand/collapse) must be a
`"use client"` component; everything else stays a server component.

---

## Files to Modify / Create

### 1. `app/components/ResumePage.css` — **full rewrite**

Lift the résumé block from `design/design_handoff_resume/source/kit.css`
(lines 316–460: everything under `/* ── résumé (the web version) ── */`).
New class names (the prior `.lv-exp-*` classes are gone):

Key classes to port verbatim:
- `.lv-resume` — max-width 72rem, centered, padding
- `.lv-resume-head`, `.lv-resume-head-main`, `.lv-resume-kicker`, `.lv-resume-name`, `.lv-resume-role`
- `.lv-resume-contact`, `.lv-resume-loc` — mono, icon+text contact row
- `.lv-resume-dl`, `.lv-resume-pdfnote` — download cluster (column of two buttons + note)
- `.lv-resume-summary` — prose paragraph
- `.lv-resume-h`, `.lv-resume-h-mono`, `.lv-resume-h-gap`, `.lv-resume-coreh` — section headings
- `.lv-resume-stats`, `.lv-resume-eras` — override sizes for the reused stat/timeline components
- `.lv-resume-xp-head`, `.lv-xp-filter`, `.lv-xp-filter-lab`, `.lv-xp-chip` (with `.is-on`), `.lv-xp-count`
- `.lv-xp-list`, `.lv-xp` (with `.is-stakes`, `.is-dim`), `.lv-xp-rail` (+ `::before`), `.lv-xp-dot`
- `.lv-xp-period`, `.lv-xp-dur`, `.lv-xp-main`, `.lv-xp-head`, `.lv-xp-headtext`
- `.lv-xp-role` (display 600), `.lv-xp-co`, `.lv-xp-toggle`, `.lv-xp-tech`, `.lv-xp-bullets`
- `.lv-resume-core` — 6-col grid, max-width 760px; `.lv-resume-core-glyph` (fallback initial tile)
- `.lv-resume-cols` — 1.15fr / 1fr two-column grid; `.lv-resume-col`
- `.lv-skill-group`, `.lv-skill-chips`
- `.lv-spoken`, `.lv-spoken-row`, `.lv-spoken-top`, `.lv-spoken-name`, `.lv-spoken-lvl`
- `.lv-spoken-bar`, `.lv-spoken-fill` — gradient emerald fill
- `.lv-linklist`, `.lv-linkrow`, `.lv-linkrow-out`
- `.lv-resume-foot`
- `@media (max-width: 860px)` — single-col xp, rail shifts left, 4-col core, 1-col cols

**Classes available globally (already in other CSS files — do NOT redefine):**
`.lv-stat-row`, `.lv-stat`, `.lv-stat-n`, `.lv-stat-l` — AboutSection.css  
`.lv-timeline`, `.lv-timeline-line`, `.lv-era`, `.lv-era-dot`, `.lv-era-y`, `.lv-era-l` — AboutSection.css  
`.lv-stack`, `.lv-stack-cell` — AboutSection.css  
`.lv-edu`, `.lv-edu-row`, `.lv-edu-y`, `.lv-edu-t`, `.lv-edu-d` — AboutSection.css  
`.lv-about-sub` — AboutSection.css  
`.lv-chip` — Primitives.css  
`.lv-btn`, `.lv-btn-primary`, `.lv-btn-ghost` — Primitives.css  
`.lv-kicker` — Primitives.css  
`.lv-link-arrow` — some shared CSS (used for back link)

---

### 2. `app/components/ResumeExperience.tsx` — **new `"use client"` component**

Contains all interactive state for the experience section.

**Why client:** `filter` (active tech string | null) and `open` (Record<id, bool>)
are `useState` — they update on user interaction without a page reload.

**Props:** `{ lang: Lang }`

**Inline data:**
- `EXPERIENCE[]` — 12 roles (copied verbatim from `Resume.jsx`, converted to TS types)
- `XP_FILTERS` — the 10 canonical tech strings

**State:**
```ts
const [filter, setFilter] = useState<string | null>(null);
const [open, setOpen] = useState({ itajai: true, devhouse2: true, eoa: true, msf: true });
```

**Renders:**
1. `.lv-resume-xp-head` — `<h2>` heading + filter chips (`All` + 10 tech chips) + count line
2. `.lv-xp-list` — 12 `.lv-xp` entries; each is a grid with:
   - **Rail** (`.lv-xp-rail`): dot, period (mono), duration (mono)
   - **Body** (`.lv-xp-main`): clickable header (role Exo 600 + ShieldAlert for stakes + company Sora) + toggle label + `TechChip` row + conditional bullet list (Check icons)
   - `.is-dim` when not matching filter; `.is-stakes` for mission-critical roles

**Icon imports from lucide-react:** `ShieldAlert`, `ChevronDown`, `ChevronUp`, `Check`

---

### 3. `app/components/ResumePage.tsx` — **full rewrite** (server component)

**Structure (top → bottom):**

1. `<Link href={`/${lang}`} className="lv-link-arrow lv-back">` ← back to portfolio
2. `<header className="lv-resume-head">` — two-column: left copy + right download cluster
   - Left: `<Kicker>` + `<h1 className="lv-resume-name">Leonardo Lima de Vasconcellos</h1>` + role subtitle in accent-bright + contact row (Mail/Phone/MapPin from lucide-react; LinkedIn via `ExternalLink` or `Briefcase`)
   - Right (`.lv-resume-dl`): primary `<a download>` for active lang PDF + ghost `<a download>` for other lang + mono pdfNote
3. `<p className="lv-resume-summary">` — the about text (bilingual)
4. Stats row — reuse `.lv-stat-row` + `.lv-stat` pattern directly (no component import needed)
5. Eras timeline — reuse `.lv-timeline` + `.lv-era` + `.lv-timeline-line` pattern
6. `<ResumeExperience lang={lang} />` — client component slot
7. Core stack — `.lv-stack lv-resume-core` grid, each cell uses `TECH_LOGOS` from Primitives + fallback glyph div for missing logos
8. Two-col lower grid (`.lv-resume-cols`):
   - Left: Skills heading + 4 `.lv-skill-group` blocks (each: `.lv-about-sub` label + `.lv-skill-chips` of `.lv-chip` spans)
   - Right: Languages (`.lv-spoken` with proficiency bars) + Education (`.lv-edu` rows) + Links (`.lv-linklist`)
9. `.lv-resume-foot` — repeat primary download `<a>`

**Data inline in this file:**
- `RESUME_PDF = { en: '/resume/Leonardo_LV_EN.pdf', pt: '/resume/Leonardo_LV_PT.pdf' }`
- `RES_ERAS[]` — 5 era nodes
- `RES_SKILLS` — core[] + groups[]
- `SPOKEN[]` — 3 languages with `pct`
- `EDUCATION[]` — 3 degrees
- `LINKS[]` — 2 GitHub + 1 portfolio
- `RT` — bilingual UI strings (kicker, role, location, summary, stats, headings, etc.)

**Icon imports:** `ArrowLeft`, `Mail`, `Phone`, `MapPin`, `Download`, `FileDown`, `ArrowUpRight`, `CodeXml`, `Globe` from lucide-react. Use `CodeXml` for GitHub (CLAUDE.md: brand icons not in lucide-react).

**PDF filenames:** use the actual files in `public/resume/`:
- EN: `/resume/Leonardo_LV_EN.pdf`
- PT: `/resume/Leonardo_LV_PT.pdf`

---

### 4. `app/[lang]/resume/page.tsx` — no changes needed

Already correct: renders `<ResumePage lang={lang as Lang} />`.

---

### 5. `app/components/Nav.tsx` — no changes needed

Already updated to `/${lang}/resume` in prior session.

---

## SSR / CSR split rationale

| Part | Rendering | Reason |
|---|---|---|
| Header, summary, stats, eras | Server | Pure static HTML |
| Experience filter + expand | **Client** | `useState` for filter and open map |
| Core stack, skills, education, links | Server | Pure static HTML |
| Download buttons | Server | `<a download>` — no JS needed |

---

## Verification

1. `pnpm dev` → `/en/resume` and `/pt/resume` load at HTTP 200
2. Name "Leonardo Lima de Vasconcellos" displayed (not "LEONARDO")
3. Download PDF buttons: primary serves active language, ghost serves other language
4. Stat row shows: ~20 years · ~70 projects · 5 tech eras · 12 roles
5. Eras timeline renders with 5 nodes, last node is emerald
6. Filter chips work: clicking "React" dims non-React roles; "All" / clicking active chip clears
7. Count updates: "Showing N of 12 roles"
8. Expand/collapse toggles bullets on individual roles; itajai/devhouse2/eoa/msf start open
9. Stakes badge (ShieldAlert) appears on itajai, eoa, bv, msf, bravi
10. Language proficiency bars render (Portuguese 100%, English 88%, Spanish 55%)
11. Education section shows 3 degrees
12. Links section shows 2 GitHub + portfolio with external arrow
13. "Back to portfolio" → navigates to home
14. `pnpm build` → no TypeScript errors
