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

import { BLOG_POSTS } from "../../data/blog";
import { postSlug } from "../lib/blog";
import type { Lang } from "../../data/data";

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

export async function renderMarkdown(source: string, lang: Lang): Promise<string> {
  const highlighter = await getHighlighter();
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
    .process(source);
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
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
