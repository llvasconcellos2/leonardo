import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import slugify from "slugify";
import { EXCLUDED_SLUGS, RIP_BLOG_INDEX_PATH, RIP_SITE_PATH } from "./constants";
import { copyUploadImage, extractUploadPath, resolveAvatar } from "./images";
import { convertHtmlToMarkdown, scanResidualShortcodes } from "./markdown";
import type { DbData } from "./db";

export type Warn = (message: string) => void;

export interface ExtractedComment {
  id: number;
  author: string;
  authorUrl: string | null;
  authorEmail: string | null;
  avatar: string | null;
  isAuthor: boolean;
  isPingback: boolean;
  date: Date;
  content: string;
  replies: ExtractedComment[];
}

export interface ExtractedPost {
  id: number;
  slug: string;
  date: Date;
  modified: Date;
  featuredImage: string | null;
  category: string[];
  tags: string[];
  comments: ExtractedComment[];
  commentCount: number;
  title: string;
  excerpt: string;
  content: string;
}

/**
 * List rip/site/ post folders, exclude known non-post paths, require each
 * has its own index.html, and cross-check against the SQL published-slug
 * set in both directions — every mismatch is named via `warn` rather than
 * silently dropped or silently included.
 */
export function enumerateSlugs(db: DbData, warn: Warn): string[] {
  const entries = fs.readdirSync(RIP_SITE_PATH, { withFileTypes: true });
  const folderSlugs = new Set(
    entries
      .filter((e) => e.isDirectory() && !EXCLUDED_SLUGS.has(e.name))
      .map((e) => e.name)
      .filter((slug) => {
        const ok = fs.existsSync(path.join(RIP_SITE_PATH, slug, "index.html"));
        if (!ok) warn(`Slug folder "${slug}" has no index.html, skipping`);
        return ok;
      })
  );

  const sqlSlugs = new Set(db.postsBySlug.keys());

  const folderOnly = [...folderSlugs].filter((s) => !sqlSlugs.has(s));
  const sqlOnly = [...sqlSlugs].filter((s) => !folderSlugs.has(s));
  for (const s of folderOnly) {
    warn(`Slug "${s}" has a rip/site folder but SQL doesn't show it published — excluded`);
  }
  for (const s of sqlOnly) {
    warn(`Slug "${s}" is published in SQL but has no rip/site folder — excluded (HTTrack may have missed it)`);
  }

  const final = [...folderSlugs].filter((s) => sqlSlugs.has(s));
  warn(
    `Resolved ${final.length} published posts (folder-only mismatches: ${folderOnly.length}, SQL-only mismatches: ${sqlOnly.length})`
  );
  return final;
}

/**
 * WordPress falls back to the numeric post ID as the slug when a title has
 * no sluggable text (confirmed case: post "143", title "<img title vs alt |
 * ..."). Detect any folder name that's purely numeric and derive a real
 * slug from its title via the same `slugify` convention used elsewhere in
 * this codebase (semprecomvoce-next: `slugify(title, { lower: true, strict:
 * true })`). The original numeric folder name is kept for disk/SQL lookups
 * — only the returned map's value (the output slug) changes.
 */
export function buildSlugRenameMap(folderNames: string[], db: DbData, warn: Warn): Map<string, string> {
  const renameMap = new Map<string, string>();
  for (const folderName of folderNames) {
    if (!/^\d+$/.test(folderName)) continue;
    const sqlPost = db.postsBySlug.get(folderName);
    if (!sqlPost) continue;
    const newSlug = slugify(decodeHtmlEntities(sqlPost.title), { lower: true, strict: true });
    if (!newSlug) {
      warn(`Could not derive a slug from title for numeric-slug post "${folderName}" — keeping numeric slug`);
      continue;
    }
    renameMap.set(folderName, newSlug);
    warn(`Renamed numeric slug "${folderName}" -> "${newSlug}" (derived from title)`);
  }
  return renameMap;
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** SQL title/excerpt fields can contain literal HTML entities (e.g. a title that itself mentions "<img>" got escaped to "&lt;img&gt;" at storage time) — decode defensively via cheerio's own decoder. No-op on text with no entities. */
function decodeHtmlEntities(text: string): string {
  if (!text.includes("&")) return text;
  return cheerio.load(`<div>${text}</div>`)("div").text();
}

function parseLocalDate(raw: string): Date {
  // MySQL "YYYY-MM-DD HH:MM:SS", stored as local site time (no offset available).
  return new Date(raw.replace(" ", "T"));
}

function countComments(comments: ExtractedComment[]): number {
  let n = comments.length;
  for (const c of comments) n += countComments(c.replies);
  return n;
}

/** Rewrite every <img src> within a cheerio subtree to its copied public path, dropping images whose source can't be found at all. */
function rewriteInlineImages($: cheerio.CheerioAPI, $scope: cheerio.Cheerio<any>, slug: string, warn: Warn): void {
  $scope.find("img").each((_, el) => {
    const $img = $(el);
    const src = $img.attr("src");
    if (!src) return;
    const uploadPath = extractUploadPath(src);
    if (!uploadPath) return; // not an uploads-path image (theme asset, etc.) — leave untouched
    const publicPath = copyUploadImage(uploadPath, slug, warn);
    if (publicPath) {
      $img.attr("src", publicPath);
    } else {
      $img.remove();
    }
  });
}

/** Rewrite <a href> links that point directly at a wp-content/uploads media file (WordPress's "link to full size image" pattern) to the copied public path — these aren't post-to-post links, so the internal-post-link rule never touches them. */
function rewriteUploadLinks($: cheerio.CheerioAPI, $scope: cheerio.Cheerio<any>, slug: string, warn: Warn): void {
  $scope.find("a").each((_, el) => {
    const $a = $(el);
    const href = $a.attr("href");
    if (!href) return;
    const uploadPath = extractUploadPath(href);
    if (!uploadPath) return;
    const publicPath = copyUploadImage(uploadPath, slug, warn);
    if (publicPath) {
      $a.attr("href", publicPath);
    } else {
      $a.removeAttr("href");
    }
  });
}

function extractFeaturedImage($: cheerio.CheerioAPI, slug: string, warn: Warn): string | null {
  const ogImage = $('meta[property="og:image"]').attr("content");
  if (!ogImage) {
    warn(`No og:image for slug "${slug}"`);
    return null;
  }
  const uploadPath = extractUploadPath(ogImage);
  if (!uploadPath) {
    warn(`og:image for "${slug}" doesn't look like an uploads path: ${ogImage}`);
    return null;
  }
  return copyUploadImage(uploadPath, slug, warn);
}

interface CommentWalkContext {
  slug: string;
  db: DbData;
  knownSlugs: Set<string>;
  renameMap: Map<string, string>;
  warn: Warn;
}

async function walkCommentList(
  $: cheerio.CheerioAPI,
  $list: cheerio.Cheerio<any>,
  ctx: CommentWalkContext
): Promise<ExtractedComment[]> {
  const results: ExtractedComment[] = [];

  for (const li of $list.children("li").toArray()) {
    const $li = $(li);
    const idMatch = /^li-comment-(\d+)$/.exec($li.attr("id") ?? "");
    if (!idMatch) {
      ctx.warn(`Comment <li> with unexpected id on "${ctx.slug}": ${$li.attr("id") ?? "(none)"}`);
      continue;
    }
    const id = Number(idMatch[1]);
    const sql = ctx.db.commentsById.get(id);
    if (!sql) {
      ctx.warn(`Comment ${id} on "${ctx.slug}" excluded (not approved, or not found in SQL)`);
      continue;
    }

    const $dl = $li.children("dl").first();
    const $dt = $dl.children("dt.comment-auther");
    const $dd = $dl.children("dd.comment-content");
    const $cite = $dd.find(".comment-meta cite.fn").first();
    const $citeLink = $cite.find("a").first();

    const author = cleanText($cite.text()) || sql.author;
    const authorUrl = $citeLink.length ? $citeLink.attr("href") ?? null : sql.authorUrl;
    const isAuthor = $li.hasClass("bypostauthor");

    const htmlSaysPingback = $li.hasClass("pingback");
    const isPingback = sql.type === "pingback" || sql.type === "trackback";
    if (htmlSaysPingback !== isPingback) {
      ctx.warn(
        `Comment ${id} on "${ctx.slug}": HTML pingback class (${htmlSaysPingback}) disagrees with SQL comment_type "${sql.type}" — trusting SQL`
      );
    }

    const $avatarImg = $dt.find("img.avatar").first();
    const avatar = $avatarImg.length ? await resolveAvatar($avatarImg.attr("src") ?? "", ctx.warn) : null;

    const $body = $dd.find(".comment-body").first();
    rewriteInlineImages($, $body, ctx.slug, ctx.warn);
    rewriteUploadLinks($, $body, ctx.slug, ctx.warn);
    const content = convertHtmlToMarkdown($body.html() ?? "", {
      currentSlug: ctx.slug,
      knownSlugs: ctx.knownSlugs,
      renameMap: ctx.renameMap,
      warn: ctx.warn,
    });
    for (const snippet of scanResidualShortcodes(content)) {
      ctx.warn(`Residual bracket pattern in comment ${id} on "${ctx.slug}": ${snippet}`);
    }

    const $childrenList = $li.children("ul.children").first();
    const replies = $childrenList.length ? await walkCommentList($, $childrenList, ctx) : [];

    results.push({
      id,
      author,
      authorUrl,
      authorEmail: sql.authorEmail,
      avatar,
      isAuthor,
      isPingback,
      date: parseLocalDate(sql.date),
      content,
      replies,
    });
  }

  return results;
}

export async function extractAuthorAvatar(warn: Warn): Promise<string | null> {
  const html = fs.readFileSync(RIP_BLOG_INDEX_PATH, "utf8");
  const $ = cheerio.load(html);
  const src = $(".author-info img").first().attr("src");
  if (!src) {
    warn("Could not find author bio widget avatar on blog index page");
    return null;
  }
  return resolveAvatar(src, warn);
}

export async function extractPost(
  folderName: string,
  slug: string,
  db: DbData,
  knownSlugs: Set<string>,
  renameMap: Map<string, string>,
  warn: Warn
): Promise<ExtractedPost> {
  const sqlPost = db.postsBySlug.get(folderName);
  if (!sqlPost) {
    throw new Error(`extractPost called for unresolved slug "${folderName}"`);
  }

  const filePath = path.join(RIP_SITE_PATH, folderName, "index.html");
  const html = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(html);

  const featuredImage = extractFeaturedImage($, slug, warn);

  const $postText = $(".post-text").first();
  // .post-text wraps the body AND trailing share/tags/author-bio/related-posts
  // widgets (confirmed via real markup — they're nested inside, not siblings).
  $postText.find(".sharedaddy, .tags, .author-info, .related-posts").remove();
  rewriteInlineImages($, $postText, slug, warn);
  rewriteUploadLinks($, $postText, slug, warn);
  const bodyHtml = $postText.html() ?? "";
  const content = convertHtmlToMarkdown(bodyHtml, { currentSlug: slug, knownSlugs, renameMap, warn });
  for (const snippet of scanResidualShortcodes(content)) {
    warn(`Residual bracket pattern on "${slug}": ${snippet}`);
  }

  let excerpt = decodeHtmlEntities(sqlPost.excerpt.trim());
  if (!excerpt) {
    excerpt = cleanText($postText.find("p").first().text()).slice(0, 200);
  }

  const catsAndTags = db.categoriesAndTagsByPostId.get(sqlPost.id) ?? { categories: [], tags: [] };

  const $commentList = $("#comments .commentlist").first();
  const ctx: CommentWalkContext = { slug, db, knownSlugs, renameMap, warn };
  const comments = $commentList.length ? await walkCommentList($, $commentList, ctx) : [];

  return {
    id: sqlPost.id,
    slug,
    date: parseLocalDate(sqlPost.date),
    modified: parseLocalDate(sqlPost.modified),
    featuredImage,
    category: catsAndTags.categories,
    tags: catsAndTags.tags,
    comments,
    commentCount: countComments(comments),
    title: cleanText(decodeHtmlEntities(sqlPost.title)),
    excerpt,
    content,
  };
}
