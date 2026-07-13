import "./Markdown.css";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { createHighlighter, type Highlighter } from "shiki";
import type { Root, Element, ElementContent } from "hast";

import { BLOG_POSTS } from "@/data/blog";
import { postSlug } from "@/app/lib/blog";
import type { Lang } from "@/data/data";

// The migration emits canonical fence tags; map the ones Shiki names differently.
const LANG_ALIAS: Record<string, string> = {
  "c-sharp": "csharp",
  delphi: "pascal",
  plain: "text",
};

const SHIKI_LANGS = [
  "bash",
  "csharp",
  "cpp",
  "pascal",
  "css",
  "diff",
  "groovy",
  "js",
  "java",
  "php",
  "python",
  "ruby",
  "sql",
  "vb",
  "xml",
];

// One highlighter for the whole build — created lazily, reused across every post
// and comment so we don't reload the theme/grammars on each render.
let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["synthwave-84"],
      langs: SHIKI_LANGS,
    });
  }
  return highlighterPromise;
}

function walkElements(nodes: ElementContent[], fn: (el: Element) => void) {
  for (const node of nodes) {
    if (node.type === "element") {
      fn(node);
      walkElements(node.children, fn);
    }
  }
}

// hast plugin: normalise `language-c-sharp` → `language-csharp` before Shiki runs.
function rehypeNormalizeCodeLang() {
  return (tree: Root) => {
    walkElements(tree.children as ElementContent[], (el) => {
      if (el.tagName === "code" && Array.isArray(el.properties.className)) {
        el.properties.className = (el.properties.className as string[]).map(
          (cls) =>
            cls.startsWith("language-")
              ? `language-${LANG_ALIAS[cls.slice(9)] ?? cls.slice(9)}`
              : cls,
        );
      }
    });
  };
}

// --- Related-post "see also" card normalisation -----------------------------
//
// The WordPress → Markdown migration mangled a handful of author-embedded
// "see also" cards: the thumbnail is wrapped in a link whose text contains a
// blank line (`[![img]( )\n\n](post:slug)`), which is invalid Markdown — the
// brackets, the `post:` target and the `*` bullet all leak as literal text,
// and the date/comment-count line renders glued together. There are 3 such
// posts (PT + EN). The SQL archive isn't in the repo so the migration can't be
// re-run; we repair the pattern here, on the raw source, into a single clean
// anchor card. (If scripts/migrate-blog/markdown.ts is ever fixed + re-run,
// have it emit this same structure so the two converge.)
const RELATED_CARD_RE =
  /^[*-] {3}\[!\[((?:\\.|[^\]\\])*)\]\(([^\s)]+)(?:\s+"(?:(?:\\.|[^"\\])*)")?\)\s*\]\(post:([^)]+)\)\s*###\s+\[((?:\\.|[^\]\\])*)\]\(post:[^)]+\)\s*([^[\n]*)\[((?:\\.|[^\]\\])*)\]\(post:[^)]+\)\s*([^\n]+)/gm;

function unescapeMd(raw: string): string {
  return raw.replace(/\\(.)/g, "$1");
}

function htmlEscape(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Rewrite each mangled "see also" widget into a clean HTML anchor card. The
// `post:<slug>` href is left intact so the existing rehypePostLinks plugin
// resolves it to a real locale URL after rehypeRaw parses this into an <a>.
function normalizeRelatedCards(source: string, lang: Lang): string {
  const kicker = lang === "pt" ? "leia também" : "read also";
  return source.replace(
    RELATED_CARD_RE,
    (_m, alt, img, slug, title, date, count, excerpt) => {
      const t = (x: string) => htmlEscape(unescapeMd(String(x ?? "")).trim());
      // The migration ran the count into the word ("71Comment"); re-insert the
      // missing space between the number and the label.
      const countText = t(count).replace(/(\d)(?=\p{L})/u, "$1 ");
      return (
        `<a class="lv-related-card" href="post:${t(slug)}">\n` +
        `<span class="lv-related-card__media"><img src="${t(img)}" alt="${t(alt)}" loading="lazy" /></span>\n` +
        `<span class="lv-related-card__text">` +
        `<span class="lv-related-card__kicker">// ${kicker}</span>` +
        `<span class="lv-related-card__title">${t(title)}</span>` +
        `<span class="lv-related-card__meta">${t(date)}<span class="lv-related-card__dot"> · </span>${countText}</span>` +
        `<span class="lv-related-card__excerpt">${t(excerpt)}</span>` +
        `</span>\n` +
        `</a>`
      );
    },
  );
}

// hast plugin: resolve internal `post:<slug>` links to real locale-prefixed URLs.
function rehypePostLinks(lang: Lang) {
  return (tree: Root) => {
    walkElements(tree.children as ElementContent[], (el) => {
      if (
        el.tagName === "a" &&
        typeof el.properties.href === "string" &&
        el.properties.href.startsWith("post:")
      ) {
        const slug = el.properties.href.slice(5);
        const target = BLOG_POSTS.find((p) => p.slug.pt === slug);
        el.properties.href = target
          ? `/${lang}/blog/${postSlug(target, lang)}`
          : "#";
      }
    });
  };
}

export async function renderMarkdown(
  source: string,
  lang: Lang,
): Promise<string> {
  const highlighter = await getHighlighter();
  const normalized = normalizeRelatedCards(source, lang);
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeNormalizeCodeLang)
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: "synthwave-84",
      defaultLanguage: "text",
      fallbackLanguage: "text",
    })
    .use(rehypePostLinks, lang)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(normalized);
  return String(file);
}

/** Renders a Markdown string as the project's prose block. Server component. */
export async function Markdown({
  source,
  lang,
  className = "lv-md",
}: {
  source: string;
  lang: Lang;
  className?: string;
}) {
  const html = await renderMarkdown(source, lang);
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
