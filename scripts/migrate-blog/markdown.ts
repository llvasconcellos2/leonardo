import TurndownService from "turndown";
import { LANGUAGE_ALIASES, LOCAL_SITE_HOSTS } from "./constants";

export interface MarkdownContext {
  currentSlug: string;
  knownSlugs: Set<string>;
  /** Maps an old numeric WordPress folder name (e.g. "143") to its final, title-derived slug — so a link pointing at the old path still resolves to the renamed post. */
  renameMap: Map<string, string>;
  warn: (message: string) => void;
}

// Mutable per-call context read by the custom rules below. Safe because this
// script runs strictly synchronously/sequentially — never two conversions
// in flight at once.
let activeContext: MarkdownContext | null = null;

/**
 * cheerio/parse5 already decodes standard + numeric HTML entities via
 * `textContent`. This is a defensive pass for WordPress's "smart
 * punctuation" entities in case any survive un-decoded into a <pre> block's
 * raw text content.
 */
function decodeWpPunctuation(text: string): string {
  return text
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "…")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”");
}

function canonicalizeLanguage(brush: string): string {
  const key = brush.trim().toLowerCase();
  const canonical = LANGUAGE_ALIASES[key];
  if (canonical) return canonical;
  activeContext?.warn(
    `Unrecognized syntax-highlighter brush "${brush}" on "${activeContext.currentSlug}" — defaulting to "plain"`
  );
  return "plain";
}

/** Extract the post slug from an internal link, or null if it isn't one. */
function extractSlugFromHref(href: string): string | null {
  for (const host of LOCAL_SITE_HOSTS) {
    const prefix = `http://${host}/`;
    if (href.startsWith(prefix)) {
      const rest = href.slice(prefix.length);
      const slug = rest.split("/")[0]?.split("?")[0];
      return slug || null;
    }
  }
  const relativeMatch = /^\.\.\/([^/]+)\/(?:index\.html)?(?:[?#].*)?$/.exec(href);
  if (relativeMatch) return relativeMatch[1];
  return null;
}

function escapeLinkTitle(title: string): string {
  return title.replace(/"/g, '\\"');
}

export function createTurndownService(): TurndownService {
  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    fence: "```",
  });

  service.addRule("syntaxHighlighterCodeBlock", {
    filter: (node) =>
      node.nodeName === "PRE" && /brush:/i.test(node.getAttribute("class") ?? ""),
    replacement: (_content, node) => {
      const el = node as HTMLElement;
      const cls = el.getAttribute("class") ?? "";
      const brushMatch = /brush:\s*([a-zA-Z0-9#+-]+)/i.exec(cls);
      const lang = canonicalizeLanguage(brushMatch?.[1] ?? "plain");
      const code = decodeWpPunctuation(el.textContent ?? "").replace(/\n+$/, "");
      return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    },
  });

  service.addRule("internalPostLink", {
    filter: (node) => node.nodeName === "A" && !!(node as HTMLElement).getAttribute("href"),
    replacement: (content, node) => {
      const el = node as HTMLElement;
      const href = el.getAttribute("href") ?? "";
      const ctx = activeContext;
      const rawSlug = extractSlugFromHref(href);
      const slug = rawSlug && ctx ? ctx.renameMap.get(rawSlug) ?? rawSlug : rawSlug;

      if (slug && ctx?.knownSlugs.has(slug)) {
        return `[${content}](post:${slug})`;
      }
      if (slug && ctx) {
        ctx.warn(`Unresolvable internal link on "${ctx.currentSlug}": ${href}`);
        return content;
      }
      const title = el.getAttribute("title");
      const titlePart = title ? ` "${escapeLinkTitle(title)}"` : "";
      return `[${content}](${href}${titlePart})`;
    },
  });

  return service;
}

const sharedService = createTurndownService();

export function convertHtmlToMarkdown(html: string, context: MarkdownContext): string {
  activeContext = context;
  try {
    return sharedService.turndown(html).trim();
  } finally {
    activeContext = null;
  }
}

/**
 * After conversion, find any bracket pattern that is NOT already
 * backslash-escaped (turndown escapes literal `[`/`]` in plain text nodes by
 * default) and NOT real Markdown link/image syntax (immediately followed by
 * `(`), outside of fenced code blocks. Anything left is genuinely unexpected
 * and needs manual review.
 */
export function scanResidualShortcodes(markdown: string): string[] {
  const withoutFences = markdown.replace(/```[\s\S]*?```/g, "");
  const pattern = /(?<!\\)\[[^\]\n]*(?<!\\)\](?!\()/g;
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(withoutFences)) !== null) {
    matches.push(m[0]);
  }
  return matches;
}
