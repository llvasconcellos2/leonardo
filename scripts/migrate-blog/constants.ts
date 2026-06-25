import path from "node:path";

export const ROOT = path.resolve(__dirname, "..", "..");

export const ARCHIVE_ROOT = path.join(ROOT, "project_archive", "devhouse-wordpress");
export const SQL_DUMP_PATH = path.join(ARCHIVE_ROOT, "db", "devhouse.sql");
export const RIP_SITE_PATH = path.join(ARCHIVE_ROOT, "rip", "site");
export const RIP_UPLOADS_PATH = path.join(RIP_SITE_PATH, "wp-content", "uploads");
export const RIP_BLOG_INDEX_PATH = path.join(RIP_SITE_PATH, "blog", "index.html");

/**
 * The actual WordPress webroot (served by docker-compose), as a second
 * source tree for uploads. The HTTrack mirror (RIP_UPLOADS_PATH) only
 * contains files a browser would have actually fetched while crawling
 * rendered pages — it never fetches a featured image whose only reference
 * on the page is a bare <meta property="og:image"> URL, so several
 * featured images are missing there even though they're set in WordPress.
 * This tree has the real, full-resolution originals for those.
 */
export const WWW_UPLOADS_PATH = path.join(ARCHIVE_ROOT, "www", "wp-content", "uploads");

export const RIP_GRAVATAR_AVATAR_DIRS = [
  path.join(ARCHIVE_ROOT, "rip", "www.gravatar.com", "avatar"),
  path.join(ARCHIVE_ROOT, "rip", "s.gravatar.com", "avatar"),
];

export const PUBLIC_OLD_BLOG_PATH = path.join(ROOT, "public", "old-blog");
export const PUBLIC_UPLOADS_PATH = path.join(PUBLIC_OLD_BLOG_PATH, "uploads");
export const PUBLIC_AVATARS_PATH = path.join(PUBLIC_OLD_BLOG_PATH, "avatars");

export const OUTPUT_DATA_FILE = path.join(ROOT, "data", "blog.ts");

export const TABLE_PREFIX = "ab3f44oy3_";

/**
 * Directories under rip/site/ that are not individual post pages.
 * NOTE: "143" looked like a non-post numeric artifact at first glance, but
 * it's actually a real published post (WordPress fell back to the numeric
 * post ID as the slug because the title — "<img title vs alt | ..." — had
 * no sluggable text) — confirmed by reading rip/site/143/index.html. Do not
 * add it back here.
 */
export const EXCLUDED_SLUGS = new Set([
  "author",
  "blog",
  "category",
  "client-side-image-resize",
  "comments",
  "contato",
  "feed",
  "leonardo",
  "tag",
  "wp-content",
  "wp-includes",
  "wp-json",
]);

/** One canonical Markdown fence language per SyntaxHighlighter Evolved brush family. */
export const LANGUAGE_ALIASES: Record<string, string> = {
  bash: "bash",
  shell: "bash",
  "c-sharp": "c-sharp",
  csharp: "c-sharp",
  cpp: "cpp",
  c: "cpp",
  css: "css",
  delphi: "delphi",
  pas: "delphi",
  pascal: "delphi",
  diff: "diff",
  patch: "diff",
  groovy: "groovy",
  js: "js",
  jscript: "js",
  javascript: "js",
  java: "java",
  php: "php",
  plain: "plain",
  text: "plain",
  py: "python",
  python: "python",
  rails: "ruby",
  ror: "ruby",
  ruby: "ruby",
  sql: "sql",
  vb: "vb",
  vbnet: "vb",
  xml: "xml",
  xhtml: "xml",
  xslt: "xml",
  html: "xml",
};

/**
 * Hosts that refer to this same blog: the HTTrack-rewritten placeholder host
 * the mirror's own pages use, plus the real original production domain,
 * which still appears verbatim in some comment bodies (e.g. a commenter
 * pasted a full URL rather than relying on the rendered link HTTrack would
 * have rewritten) — confirmed via direct grep across the rip/site mirror.
 */
export const LOCAL_SITE_HOSTS = ["localhost:8080", "www.devhouse.com.br", "devhouse.com.br"];
