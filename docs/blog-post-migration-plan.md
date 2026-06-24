# WordPress Blog Migration — Stage 1 (Data Extraction Only)

## Context

The old WordPress blog (`project_archive/devhouse-wordpress`, a git submodule) holds 44 published posts with rich content — code blocks, images, and deeply nested comment threads (one post alone has 152, some comments themselves contain links, line breaks, images, and code blocks). The new Next.js portfolio's `/blog` route currently only has 3 hand-written bilingual essays in `data/data.ts`. The goal of this stage is purely to **extract and normalize** the legacy WordPress content into a new, independent TypeScript data file, `data/blog.ts`, plus copy every referenced image and comment avatar into `public/old-blog/`. Wiring this data into actual rendering (`BlogPost.tsx`, `WritingSection.tsx`, the `/blog` routes) is explicitly a **future stage** — not touched here, and neither is `data/data.ts`.

Decisions already made with the user:
- **Content source = the HTTrack-rendered HTML mirror** (`project_archive/devhouse-wordpress/rip/site/<slug>/index.html`), not raw SQL `post_content`. WordPress/Divi already expanded all shortcodes into final HTML by scrape time, and code blocks are already `<pre class="brush: x">`. This avoids reimplementing the Divi page-builder/theme shortcode renderer, and naturally excludes drafts.
- **SQL dump used only for canonical metadata** (`project_archive/devhouse-wordpress/db/devhouse_backup_20260623_052913.sql`): exact dates, categories/tags, comment threading/approval/type, author bio, author email.
- **Schema follows the project's bilingual `Record<Lang,string>` convention** for post-level title/excerpt/content only — `pt` populated, `en` left as `""` for the user to translate later. Comments stay monolingual `pt` strings.
- **New devDependencies OK**: `cheerio`, `turndown`, `tsx`. Migration-only, not shipped in the app bundle.
- **Avatars**: most mirrored locally under `rip/www.gravatar.com/avatar/` (confirmed — `rip/s.gravatar.com/` has no actual image files). Missing ones fetched live from gravatar.com as fallback.
- **Pingbacks** (WordPress's automatic "this post was linked to by another post" notifications — auto-inserted `wp_comments` rows with `comment_type='pingback'`, author = the linking post's title, no human/email/avatar) are **kept** as `BlogComment` nodes flagged `isPingback: true`, preserving the full historical record; Stage 2 can choose to hide/style them later without re-parsing source data.
- **Always fetch original (unresized) images**, never WordPress's auto-generated size variants (`-WIDTHxHEIGHT` filename suffix) or timthumb-resized output.
- **Internal links to other old-blog posts** are rewritten to the standard-Markdown-valid custom scheme `[text](post:slug)` rather than a non-standard shortcode — stays parseable by any generic Markdown renderer (renders as a normal link), with Stage 2 simply intercepting `post:` hrefs to resolve a real `<Link>` by slug.

## Verified ground truth (corrects/refines the original brief)

- **Comment HTML structure**: `<li class="comment ... depth-N" id="li-comment-ID"><dl id="comment-ID"><dt class="comment-auther"><img class="avatar" src="...gravatar.../avatar/HASH...">...</dt><dd class="comment-content"><div class="comment-meta"><span><cite class="fn">[<a href="...">]Name[</a>]</cite>DATE</span></div><div class="comment-body">...</div></dd></dl><ul class="children">...nested replies, recursive...</ul></li>`.
- **Pingbacks** appear as sibling `<li class="pingback">` nodes with no avatar `<img>` at all. Classify `isPingback` by cross-referencing `wp_comments.comment_type` from SQL (keyed by the numeric ID in `id="li-comment-N"`), not by parsing CSS classes.
- **Gravatar avatar files are hash-prefixed with a trailing disambiguation suffix**, not exact `<hash>.ext` — confirmed example: `54944f6c590792c57d577b8a37c7b0854e13.jpeg` for hash `54944f6c590792c57d577b8a37c7b085`. Must match by `filename.startsWith(hash)`; confirmed only `rip/www.gravatar.com/avatar/` has real files.
- **WordPress generates multiple resized copies of every uploaded image** with a `-WIDTHxHEIGHT` filename suffix (e.g. `IMG_0121-600x450.jpg`) alongside the original (`IMG_0121.jpg`). Both `og:image`/timthumb-driven featured images and inline `.post-text` images must be normalized by stripping any trailing `-\d+x\d+` suffix before the extension to resolve the original file, verified to exist on disk in `rip/site/wp-content/uploads/...` before falling back to the sized version (with a warning) only if the true original is genuinely missing.
- **SQL dump**: UTF-8 with BOM, CRLF line endings. Each table is one `INSERT INTO ... VALUES (...),(...);` statement, **except `posts` which is chunked into multiple INSERT statements** — the parser must concatenate all matches per table.
- **Image URLs** in `og:image`/`timthumb` point to `http://localhost:8080/wp-content/uploads/...` (HTTrack-rewritten host, real path preserved) — resolve by keeping everything from `/wp-content/uploads/` onward.
- **Only `<slug>/index.html` should ever be read** — post folders also contain stray `indexXXXX.html` artifacts that must never be globbed.
- **~44 published post folders** exist directly under `rip/site/`. Known non-post entries to exclude: `143`, `author`, `blog`, `category`, `client-side-image-resize`, `comments`, `contato`, `feed`, `leonardo`, `tag`, `wp-content`, `wp-includes`, `wp-json`. The exact final count is derived and asserted by the script, never hardcoded.
- **Author bio** lives in `wp_usermeta` (table `ab3f44oy3_usermeta`), `meta_key = 'description'`, joined on `user_id` — needed for the new `BlogAuthor.about` field.

## Script structure

```
scripts/migrate-blog/
  index.ts          orchestrator — run order, final summary/warning report
  sql-parser.ts      dump loader, hand-rolled tuple extractor, typed lookup maps (incl. usermeta)
  html-extractor.ts   cheerio per-post parsing: title/excerpt/featured image/body/comments
  markdown.ts          shared turndown instance + rules: code blocks, internal post: links, bracket-escaping
  images.ts            image/avatar path resolution (original-only), gravatar hash matching, live-fetch fallback
  serialize.ts          custom TS literal serializer (handles Date objects, not plain JSON.stringify)
  constants.ts           excluded slugs, brush-language alias map, source/dest paths
```

Add devDependencies: `cheerio`, `turndown`, `@types/turndown`, `tsx`. Add to `package.json`:
```json
"migrate:blog": "tsx scripts/migrate-blog/index.ts"
```
Run via `pnpm migrate:blog`. Idempotent — safe to re-run.

## Schema (`data/blog.ts`)

```typescript
import type { Lang } from "./data";

export interface BlogAuthor {
  name: string;
  email: string;
  avatar: string;   // public path, e.g. "/old-blog/avatars/<hash>.jpg"
  about: string;     // from wp_usermeta meta_key='description'
}

export interface BlogComment {
  id: number;                  // wp_comments.comment_ID
  author: string;
  authorUrl: string | null;     // from <cite class="fn"><a href="...">, else comment_author_url
  authorEmail: string | null;
  avatar: string | null;        // null for pingbacks
  isAuthor: boolean;             // bypostauthor
  isPingback: boolean;           // cross-checked via SQL comment_type
  date: Date;                    // parsed Date, not a string
  content: string;               // Markdown — preserves links, line breaks, images, pre/code blocks
  replies: BlogComment[];
}

export interface BlogPost {
  id: number;                    // wp_posts.ID
  slug: string;
  date: Date;                     // parsed Date
  modified: Date;                  // parsed Date
  featuredImage: string | null;     // public path; null if no og:image; always the original-resolution file
  category: string[];
  tags: string[];
  featured: boolean;                 // default false, manual curation later
  author: BlogAuthor;
  comments: BlogComment[];            // top-level only; nesting lives in .replies
  commentCount: number;                // total flattened count actually included
  title: Record<Lang, string>;          // pt populated, en: ""
  excerpt: Record<Lang, string>;        // pt populated, en: ""
  content: Record<Lang, string>;        // pt = migrated Markdown, en: ""
}

export const BLOG_POSTS: BlogPost[] = [ /* generated, sorted by date descending */ ];
```

Field order intentionally puts the three bilingual text blocks (`title`/`excerpt`/`content`) last, after structural/metadata fields, per feedback.

**Comment content is Markdown, not plain text** — reusing the same turndown pipeline as post bodies (including the code-block rule), since real comments in the source data include links, paragraph breaks, inline images, and `<pre>`/code blocks that must be preserved, not flattened.

**`date`/`modified`/comment `date` are real `Date` objects**, not ISO strings — the serializer (see below) emits `new Date("...")` expressions in the generated `data/blog.ts` source rather than quoted strings.

## Bracket safety (no markdown-syntax collisions)

Two places literal `[`/`]` characters can appear in source text in ways that must never be misread as Markdown link/image syntax later: (1) pingback excerpts, which contain literal `[...]` ellipsis markers around the linked text, and (2) any stray/unexpected shortcode-like text that survives into extracted content.

Mechanism: the shared turndown instance escapes literal `[` and `]` characters in plain-text nodes (turndown's default text-escaping already covers markdown-significant characters; this is extended/verified to explicitly include square brackets) so they always serialize as `\[`/`\]` unless they are genuinely part of a link/image construct turndown itself is emitting (e.g. the `post:` internal-link rule below, or a real `<a>`/`<img>` from the source HTML). The same escaping helper is applied to non-turndown text fields (title, excerpt fallback) defensively, even though shortcodes aren't expected there. The end-of-run residual-shortcode scanner (still present as a safety net) is updated to skip already-escaped `\[...\]` sequences, so it only flags genuinely unescaped, unexpected bracket patterns for manual review — escaped prose brackets are not false-positives.

## Internal post-to-post link rewriting (added to Stage 1 scope)

Before HTML→Markdown conversion, every `<a href="...">` inside post bodies and comment bodies is checked against two patterns: an absolute `http://localhost:8080/<slug>/` form, or an HTTrack-relative `../<slug>/index.html`/`../<slug>/` form. The `<slug>` is extracted and checked against the final processed published-slug set:

- **Match found** → rewritten via a custom turndown rule into `[link text](post:slug)` — standard Markdown link syntax, just with a `post:` URL scheme instead of a real URL. Any generic Markdown renderer displays this as a normal link; Stage 2 intercepts `post:`-scheme hrefs and resolves them to a real `<Link href={`/${lang}/blog/${slug}`}>` by slug.
- **No match** (link points to a category/tag/author/page/other non-migrated old-site path, or a truly external domain accidentally sharing the localhost host) → the link is stripped, keeping only its text content (no href), and a warning is logged (`Unresolvable internal link on "${slug}": ${href}`) — since linking to a destination that doesn't exist in the new site would just be a dead link either way.

## Extraction pipeline

1. **SQL parsing** (`sql-parser.ts`): strip BOM, find all `INSERT INTO` statements per table (handles `posts`' multi-chunk dump), hand-rolled quote/paren-depth tuple scanner (never a naive comma split, since `post_content`/`comment_content` contain unescaped-looking commas/parens). Build lookup maps: `postsBySlug` (`post_status='publish' AND post_type='post'`), `commentsByPostId` (`comment_approved='1'`, pingbacks included+flagged), `attachmentPathById` (`_wp_attached_file`), `categoriesAndTagsByPostId`, and a new `usermetaByUserId` (`meta_key='description'`) for author bios.

2. **Slug enumeration & cross-check**: list `rip/site/` directories, exclude the known non-post set, require each candidate has its own `index.html`. Cross-check against the SQL published-slug set in both directions, log every mismatch by name, use only the intersection. Print a summary line with the resolved count.

3. **Per-post HTML extraction** (`html-extractor.ts`, cheerio): title/excerpt from SQL (with excerpt fallback from the first `<p>` if blank); featured image from `<meta property="og:image">`, normalized to the original (unsized) file; body from `.post-text` with `.sharedaddy` stripped; comments from `#comments .commentlist`, walked recursively via `> ul.children > li`.

4. **Markdown conversion** (`markdown.ts`, shared turndown instance used for both post bodies and comment bodies): custom rule for `<pre class="brush: X">` → fenced code block with entity decoding + brush-alias canonicalization (`bash`, `c-sharp`, `cpp`, `css`, `delphi`, `diff`, `groovy`, `js`, `java`, `php`, `plain`, `python`, `ruby`, `sql`, `vb`, `xml`; unrecognized → `plain` + warning); custom rule for internal post-to-post links (above); bracket-escaping for plain text nodes (above). End-of-run residual-shortcode scan (excluding escaped brackets and fenced code) collects anything still unexpected into a consolidated warning report for manual review.

5. **Image copying** (`images.ts`): normalize every image reference (featured + inline, in both posts and comments if any) to its original-resolution filename by stripping `-\d+x\d+` size suffixes, verify existence, fall back to the sized variant + warning only if the true original is missing entirely. Preserve the WordPress `YYYY/MM/filename` structure under `public/old-blog/uploads/...`. Skip copies that already exist (idempotent). Degrade gracefully (`null` / stripped inline image) if nothing is found on disk.

6. **Avatar resolution** (`images.ts`): extract the 32-hex-char gravatar hash from any `*.gravatar.com/avatar/<hash>` URL; prefix-match against `rip/www.gravatar.com/avatar/` (and `rip/s.gravatar.com/avatar/` for completeness); copy to `public/old-blog/avatars/<hash>.<ext>` if found, else fetch live from `https://www.gravatar.com/avatar/<hash>?s=96&d=retro&r=g`, reading the response `Content-Type` for the correct extension. Cache hash→path per run (835 comments, heavy reuse expected). On failure, warn and set `avatar: null`. Light throttle on live fetches as a courtesy.

7. **Comment tree construction**: cross-reference each `<li>`'s numeric ID against the filtered SQL `commentsByPostId` map to determine `isPingback`/`authorEmail`/exact `date`; skip (with a warning) any `<li>` with no matching approved SQL row (spam/pending), along with its subtree. `commentCount` = actual included-node count post-filter.

8. **Serialization** (`serialize.ts`, `index.ts`): sort posts by `date` descending. Use a **custom recursive TS-literal serializer** (not plain `JSON.stringify`, which can't represent `Date` objects as constructor calls) that emits valid TypeScript object/array literal syntax, special-casing `Date` instances as `new Date("<iso>")`. Explicitly default any field that could otherwise serialize as `undefined`. Write `data/blog.ts`. Print a final summary: post/comment/image/avatar counts, local-vs-live-fetched avatar breakdown, internal-link resolution counts (rewritten vs stripped), and the consolidated residual-shortcode report.

## Validation

- **Hard assertion**: `BLOG_POSTS.length` must equal the cross-checked intersection count from step 2.
- **Per-post diagnostic table**: rendered `commentCount` vs raw SQL comment count per post.
- **Targeted spot-checks**: a post with multiple code blocks (verify fence count + decoded entities), a post with nested replies + a pingback sibling (verify tree shape and `isPingback`), whichever post the diagnostic table reveals has the most comments, and at least one comment containing a link/image/code block (verify it survived as real Markdown, not flattened text).
- **Image spot-check**: confirm a featured image resolves to the *original* filename (not a `-WIDTHxHEIGHT` variant) and exists on disk under `public/old-blog/uploads/...`.
- **Internal-link spot-check**: find a known cross-post link in the source HTML and confirm it became `[text](post:target-slug)` in the output, and confirm at least one stripped (unresolvable) link case is logged.
- **Manual review**: user reviews the consolidated residual-shortcode warning report.
- **Type check**: `tsc --noEmit` against the freshly generated `data/blog.ts`.

## Open risks (flagged, not solved here)

- Comments with `comment_approved` values other than `'1'` are excluded entirely.
- Duplicate `post_name` slugs across post IDs would silently overwrite in the slug map unless the script explicitly detects and warns on this during map-building.
- Some posts may genuinely have no `og:image` — Stage 2 will need a placeholder strategy for `featuredImage: null`.
- Comments containing inline images: same original-resolution-image and `public/old-blog/uploads/...` copying logic applies as for post bodies — if any comment image source is missing from the HTTrack mirror, it degrades the same way (stripped + warned), never a broken path.
