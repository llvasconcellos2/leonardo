/**
 * Injects English translations into data/blog.ts.
 *
 * For each post we author a raw markdown file at scripts/translations/<id>.md:
 *
 *   <line 1: english title>
 *   <line 2: english excerpt (may be empty)>
 *   @@@
 *   <english content body, with [[CODE]] placeholders where each fenced
 *    code block goes, in order>
 *
 * The code blocks are NOT re-typed in the .md — the script extracts the fenced
 * code blocks from the original Portuguese content and splices them, verbatim,
 * into the [[CODE]] placeholders. This guarantees code is never altered and
 * avoids hand-escaping.
 *
 * Empty `"en": ""` fields within a post appear in this order:
 *   slug.en, title.en, excerpt.en, content.en
 *
 * The English slug is generated from the English title via slugify
 * ({ lower: true, strict: true }) — matching scripts/slugify.ts.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import slugify from "slugify";

const here = dirname(fileURLToPath(import.meta.url));
const blogPath = join(here, "..", "data", "blog.ts");
const trDir = join(here, "translations");

const source = readFileSync(blogPath, "utf8");
const eol = source.includes("\r\n") ? "\r\n" : "\n";
const lines = source.split(/\r?\n/);

// Find post-level id lines: `    "id": <n>,` (4-space indent).
const postStarts: { line: number; id: number }[] = [];
lines.forEach((l, i) => {
  const m = /^    "id": (\d+),$/.exec(l);
  if (m) postStarts.push({ line: i, id: Number(m[1]) });
});

const jsString = (s: string) => JSON.stringify(s);

// Unescape a double-quoted TS/JS string literal (including the surrounding
// quotes). Handles standard escapes; for any other `\x` it drops the backslash,
// matching JS semantics (the data uses lone `\_` which isn't valid JSON).
const unquote = (lit: string): string => {
  const body = lit.slice(1, -1);
  let out = "";
  for (let i = 0; i < body.length; i++) {
    if (body[i] !== "\\") {
      out += body[i];
      continue;
    }
    const next = body[++i];
    switch (next) {
      case "n": out += "\n"; break;
      case "t": out += "\t"; break;
      case "r": out += "\r"; break;
      case "b": out += "\b"; break;
      case "f": out += "\f"; break;
      case "v": out += "\v"; break;
      case "0": out += "\0"; break;
      default: out += next; // \\, \", \/, and any other \x -> x
    }
  }
  return out;
};

// Extract fenced code blocks (``` ... ```), in order.
const extractCode = (md: string): string[] => md.match(/```[\s\S]*?```/g) || [];

let replacedFields = 0;
const missing: number[] = [];

for (let p = 0; p < postStarts.length; p++) {
  const start = postStarts[p].line;
  const end = p + 1 < postStarts.length ? postStarts[p + 1].line : lines.length;
  const id = postStarts[p].id;

  const trPath = join(trDir, `${id}.md`);
  if (!existsSync(trPath)) {
    missing.push(id);
    continue;
  }

  // Locate the four en field lines and the pt content line within the post.
  const enLines: number[] = [];
  let ptContent = "";
  for (let i = start; i < end; i++) {
    if (/^    "content": \{$/.test(lines[i])) {
      const m = /^      "pt": (".*"),$/.exec(lines[i + 1]);
      // The literal is valid TS but may contain lone `\_` escapes that aren't
      // valid JSON, so unescape it manually rather than JSON.parse.
      if (m) ptContent = unquote(m[1]);
    }
    if (/^(\s*)"en": "",?$/.test(lines[i])) enLines.push(i);
  }
  if (enLines.length !== 4) {
    throw new Error(`Post ${id}: expected 4 empty en fields, found ${enLines.length}`);
  }

  // Parse the translation file.
  const raw = readFileSync(trPath, "utf8").replace(/\r\n/g, "\n");
  const sep = raw.indexOf("\n@@@\n");
  if (sep === -1) throw new Error(`Post ${id}: missing @@@ separator in ${id}.md`);
  const header = raw.slice(0, sep).split("\n");
  const enTitle = header[0] ?? "";
  const enExcerpt = header[1] ?? "";
  let enContent = raw.slice(sep + "\n@@@\n".length);
  // Trim a single trailing newline if present (editor artifact).
  enContent = enContent.replace(/\n$/, "");

  // Splice original code blocks into [[CODE]] placeholders.
  const codes = extractCode(ptContent);
  const placeholders = (enContent.match(/\[\[CODE\]\]/g) || []).length;
  if (placeholders !== codes.length) {
    throw new Error(
      `Post ${id}: ${placeholders} [[CODE]] placeholders but ${codes.length} code blocks in PT content`,
    );
  }
  let ci = 0;
  enContent = enContent.replace(/\[\[CODE\]\]/g, () => codes[ci++]);

  const enSlug = slugify(enTitle, { lower: true, strict: true });
  const values = [enSlug, enTitle, enExcerpt, enContent];

  enLines.forEach((lineNo, k) => {
    const indent = /^(\s*)/.exec(lines[lineNo])![1];
    lines[lineNo] = `${indent}"en": ${jsString(values[k])},`;
    replacedFields++;
  });
}

writeFileSync(blogPath, lines.join(eol), "utf8");

console.log(`Replaced ${replacedFields} en fields across ${postStarts.length} posts.`);
if (missing.length) {
  console.warn(`No translation file for ids: ${missing.join(", ")}`);
}
