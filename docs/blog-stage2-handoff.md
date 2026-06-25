# Blog Migration — Stage 2 Handoff (Wiring Data into Next.js/React)

Stage 1 (WordPress → `data/blog.ts`) is done and verified. This doc has what a fresh session needs to start Stage 2 — rendering the migrated posts — without re-reading Stage 1's history.

## What Stage 1 produced

- **`data/blog.ts`** — `export const BLOG_POSTS: BlogPost[]`, 44 migrated posts.
- **`public/old-blog/`** (~16MB) — `uploads/<YYYY>/<MM>/<file>` (post/comment images) and `avatars/<hash>.<ext>` (gravatar avatars). Already referenced by their final `/old-blog/...` public paths inside `data/blog.ts` — nothing left to copy.
- **`scripts/migrate-blog/`** — the extraction pipeline (`sql-parser`, `db`, `mojibake`, `markdown`, `images`, `html-extractor`, `serialize`, `index`). Re-run anytime via `pnpm migrate:blog` (idempotent — fully regenerates `data/blog.ts` + `public/old-blog/` from `project_archive/devhouse-wordpress/`).
- **`scripts/slugify.ts`** — ad-hoc CLI, `pnpm slugify "Some Title"`, for any future one-off slug needs.

## Schema (`data/blog.ts`)

```typescript
export interface BlogAuthor {
  name: string;
  email: string;
  avatar: string;   // public path
  about: string;
}

export interface BlogComment {
  id: number;
  author: string;
  authorUrl: string | null;
  authorEmail: string | null;
  avatar: string | null;       // null for pingbacks
  isAuthor: boolean;
  isPingback: boolean;
  date: Date;
  content: string;             // Markdown
  replies: BlogComment[];      // nested tree
}

export interface BlogPost {
  id: number;
  slug: Record<Lang, string>;       // pt populated, en: ""
  date: Date;
  modified: Date;
  featuredImage: string | null;      // 12/44 posts have none
  category: string[];
  tags: string[];
  featured: boolean;                  // always false — manual curation, not yet set
  author: BlogAuthor;
  comments: BlogComment[];             // top-level only; nesting is in .replies
  commentCount: number;                 // pre-computed flattened total
  title: Record<Lang, string>;          // pt populated, en: ""
  excerpt: Record<Lang, string>;        // pt populated, en: ""
  content: Record<Lang, string>;        // pt = Markdown, en: ""
}
```

## Gotchas to know before writing any rendering code

- **Every bilingual field has `en: ""`** — these 44 posts are PT-only until manually translated. Decide how the `/en/blog/...` route should behave for a post with no English content yet (placeholder text? fall back to PT? hide the post from the English index?).
- **`content` is Markdown, not HTML** — needs a Markdown renderer. Nothing is installed yet (no `react-markdown`/`remark`/`rehype`/`shiki`/`prismjs`/`highlight.js` in `package.json` as of Stage 1).
- **Fenced code blocks use canonical language tags**: `bash`, `c-sharp`, `cpp`, `css`, `delphi`, `diff`, `groovy`, `js`, `java`, `php`, `plain`, `python`, `ruby`, `sql`, `vb`, `xml`.
- **Internal post-to-post links use a custom `post:` scheme**: `[text](post:some-slug)`. This is deliberate — valid Markdown link syntax (renders fine as a plain link anywhere), but the href is an opaque slug reference, not a real URL. Stage 2 must intercept hrefs starting with `post:` in the Markdown renderer and resolve them via `BLOG_POSTS.find(p => p.slug.pt === slug)` → real `<Link href={`/${lang}/blog/${slug}`}>`. Left un-intercepted, it just renders as a dead link — not a crash, but not useful either.
- **`comments` is a nested tree, not a flat list** — walk `.replies` recursively to render threads. `commentCount` is already pre-flattened, no need to recompute it.
- **`isPingback: true`** comments are WordPress's automatic "this post was linked to by another post" notifications, not real reader engagement — no avatar, `author` is the linking page's title. Decide whether to show, hide, or visually distinguish them.
- **`featuredImage` is nullable** (12/44 posts) — the source image was missing from the archived site mirror, not a bug. Needs a placeholder/fallback in the UI (the project already has `LowPolyField` used elsewhere for this purpose — see `app/components/LowPolyField.tsx`).
- **`date`/`modified`/comment `date` are real `Date` objects**, already parsed — not strings.
- **Comment `content` is also Markdown** (links, line breaks, inline images, code blocks preserved) — same renderer as post content should handle it.

## Current app architecture (read before changing anything)

- Existing `/blog` routes: `app/[lang]/blog/page.tsx` (index) and `app/[lang]/blog/[id]/page.tsx` (detail) — currently powered by **`data/data.ts`'s `POSTS`**, which is a *separate, unrelated* dataset: 3 hand-written bilingual essays with no `content` field at all (the body is hardcoded directly inside `app/components/BlogPost.tsx`). Do not confuse `data/data.ts`'s `Post`/`POSTS` with `data/blog.ts`'s `BlogPost`/`BLOG_POSTS` — they are intentionally separate and were never merged in Stage 1.
- `app/components/BlogPost.tsx` and `app/components/WritingSection.tsx` render that hand-written content today with no Markdown library — raw JSX, plus a hand-rolled `.cm`/`.kw` CSS-class code-block look (no real syntax highlighter).
- **Open design question, not yet decided** — discuss with the user before writing code: should the 44 migrated posts be merged into the same `/blog` routes/components as the 3 hand-written essays (one unified blog), or kept as a separate section/route (e.g. an "archive")? This affects routing, `generateStaticParams`, and whether `BlogPost.tsx`/`WritingSection.tsx` get extended or a parallel set of components is built.
- Project conventions (`CLAUDE.md`): server components by default, `"use client"` only for browser APIs/state; no Tailwind utility classes — this codebase uses `.lv-*` CSS classes exclusively (`app/globals.css` + per-component `.css` files); `lang: Lang` flows as an explicit prop, no context/global state.

## Recommended starting point for rendering (discussed, not implemented — open to revisiting)

- **Renderer**: `react-markdown` for `content.pt`/`content.en` — works in server components, no client JS needed for static content.
- **Code blocks**: Shiki (e.g. a custom `code` renderer, or `rehype-pretty-code`) rather than `react-syntax-highlighter`/`prism-react-renderer`. Shiki highlights at render time on the server and outputs plain HTML — fits this project's server-component-first architecture; Prism-based libraries typically need `"use client"` and ship JS to the browser.
- **Theme for Shiki**: `synthwave-84`

## Known, expected data gaps (not bugs)

- 12/44 posts have no `featuredImage` (source file missing from the archived mirror).
- Two posts show a 1-comment discrepancy vs raw SQL counts — confirmed benign: the comment is approved in the database but was never present in the static HTML mirror (a timing gap between when the site was scraped and when the DB was dumped), so there's no source markup to render it from.
- One residual "unexpected bracket" warning during migration was manually confirmed to be inert text inside a Markdown link's title attribute — not a rendering hazard.
