// Builds the project catalog (data/work.ts) from the archived project READMEs.
//
// Pass 1 (always): parse every project_archive/<slug>/README.md, copy+rename its
//   screenshots and logo into public/projects/<slug>/, download/copy tech icons into
//   public/devicons/, and write the English scaffold to scripts/works.en.json.
// Pass 2 (when scripts/works.pt.json exists): merge the English scaffold with the
//   hand-authored PT-BR translations and emit the typed, bilingual data/work.ts.
//
// The READMEs are the source of truth for structure/English; scripts/works.pt.json is
// the source of truth for the Portuguese. data/work.ts is generated from both — do not
// edit it by hand; edit the README or works.pt.json and re-run.  Run: pnpm build:works
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const ARCHIVE = path.join(ROOT, "project_archive");
const PUBLIC = path.join(ROOT, "public");
const EN_JSON = path.join(HERE, "works.en.json");
const PT_JSON = path.join(HERE, "works.pt.json");
const OUT_TS = path.join(ROOT, "data", "work.ts");

// README typos: name referenced in the README -> actual on-disk name (per slug, by basename).
const FILE_ALIASES = {
  lamode: {
    "MINI SAIA GODÊ - VESTÁRIO.png": "MINI SAIA GODÊ - VESTUÁRIO.png",
    "VESTÁRIO.png": "VESTUÁRIO.png",
  },
};

const HEADER_LABELS = new Set([
  "Language", "Languages", "Framework", "Frameworks", "Technology", "Tool",
  "Framework / Library", "Framework / Tool", "Framework/Library", "Library",
]);

const report = { noLogo: [], noScreenshots: [], missingScreenshotFiles: [], featuredNotInGrid: [], iconFailures: [], oddTechTables: [] };

function sanitize(filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, path.extname(filename));
  const clean = base
    .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return (clean || "image") + ext;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

// --- icon resolution (dedup by leaf filename) ---
const iconCache = new Map(); // originalUrl -> localLeaf|null
const downloaded = new Set();
const DEVICONS_DIR = path.join(PUBLIC, "devicons");

function resolveIconUrl(url) {
  // devicons.io is a dead host; only Joomla is referenced there, and Devicon itself has
  // no Joomla icon — fall back to Simple Icons.
  if (url.includes("devicons.io")) return "https://cdn.jsdelivr.net/npm/simple-icons/icons/joomla.svg";
  return url;
}

// An icon ref is either a CDN URL or a project-local path (a custom SVG/PNG the author shipped).
async function resolveIcon(iconRef, dir) {
  if (!iconRef) return undefined;
  if (/^https?:\/\//i.test(iconRef)) {
    const leaf = await fetchIcon(iconRef);
    return leaf ? `/devicons/${leaf}` : undefined;
  }
  const src = path.join(dir, decodeURIComponent(iconRef));
  if (!fs.existsSync(src)) { report.iconFailures.push({ url: iconRef, error: "local file missing" }); return undefined; }
  const leaf = sanitize(path.basename(iconRef));
  copyFileSafe(src, path.join(DEVICONS_DIR, leaf));
  return `/devicons/${leaf}`;
}

async function fetchIcon(originalUrl) {
  if (iconCache.has(originalUrl)) return iconCache.get(originalUrl);
  const url = resolveIconUrl(originalUrl);
  const leaf = url.split("/").pop().split("?")[0];
  const dest = path.join(DEVICONS_DIR, leaf);
  if (downloaded.has(leaf) || fs.existsSync(dest)) {
    iconCache.set(originalUrl, leaf);
    return leaf;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(DEVICONS_DIR, { recursive: true });
    fs.writeFileSync(dest, buf);
    downloaded.add(leaf);
    iconCache.set(originalUrl, leaf);
    return leaf;
  } catch (e) {
    report.iconFailures.push({ url, error: String(e) });
    iconCache.set(originalUrl, null);
    return null;
  }
}

function parseHeader(md) {
  const headerEnd = md.search(/<!--\s*TABLE OF CONTENTS|<!--\s*SHIELDS|## About/i);
  const header = headerEnd > 0 ? md.slice(0, headerEnd) : md.slice(0, 1500);

  // Some READMEs use a first <h1> that is just an emoji (a logo stand-in) followed by a
  // second <h1> with the real name. Pick the first heading that contains an actual letter.
  const h1s = [...md.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const name = h1s.find((h) => /[A-Za-zÀ-ÿ]/.test(h)) ?? h1s[0] ?? null;
  // A heading with no letters/digits is an emoji used as the logo (some projects have no image).
  const emojiLogo = h1s.find((h) => h && !/[A-Za-zÀ-ÿ0-9]/.test(h)) ?? null;

  const ps = [...header.matchAll(/<p[^>]*align="center"[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1]));
  let tagline = null, kicker = null;
  for (const p of ps) {
    if (p.startsWith("//") && !kicker) kicker = p;
    else if (!tagline && !p.startsWith("//") && !/view it live/i.test(p)) tagline = p;
  }

  const liveM = md.match(/href="([^"]+)"[^>]*>\s*<strong>\s*View it live/i);
  const liveUrl = liveM ? liveM[1] : null;

  // logo: first local (non-http) <img> in the header region
  let logoSrc = null;
  for (const m of header.matchAll(/<img[^>]+src="([^"]+)"/gi)) {
    const src = m[1];
    if (!/^https?:\/\//i.test(src)) { logoSrc = src; break; }
  }
  return { name, tagline, kicker, liveUrl, logoSrc, emojiLogo };
}

function parseIntroBodyFeatures(md) {
  const introM = md.match(/<!--\s*PROJECT INTRO[^>]*-->\s*([\s\S]*?)\s*<!--\s*END INTRO\s*-->/i);
  const intro = introM ? introM[1].trim() : null;

  const afterIntro = introM ? md.slice(introM.index + introM[0].length) : md;
  // The "About The Project" prose (+ its ### Key Features h3) ends at the next h2 section
  // (## Screenshots, or ## Features / ## Free vs Paid for long READMEs like easy-clinic).
  const scStart = afterIntro.search(/\n##\s/);
  const aboutRest = scStart > 0 ? afterIntro.slice(0, scStart) : afterIntro;

  const lines = aboutRest.split(/\r?\n/);
  // A "### Key Features" heading, when present, is the boundary: bold bullets AFTER it are
  // features; bold bullets BEFORE it are narrative and fold into the body. When absent
  // (e.g. semprecomvoce-next), every bold bullet after the intro is a feature.
  const kfIdx = lines.findIndex((l) => /^###\s+(Key Features|Features)\b/i.test(l.trim()));
  // heading = the bold lead; body = the rest of the bullet (may itself contain an em-dash).
  const bulletRe = /^-\s+\*\*(.+?)\*\*\s*[—–:-]?\s*(.*)$/;
  const features = [];
  const bodyParas = [];
  let cur = [];
  const flush = () => { const p = cur.join(" ").trim(); if (p) bodyParas.push(p); cur = []; };
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (/^###\s+/.test(line)) { flush(); return; }
    if (/^<p[^>]*align="right"/i.test(line) || /^<!--/.test(line)) return;
    const bm = line.match(bulletRe);
    if (bm) {
      flush();
      const heading = bm[1].trim(), body = bm[2].trim();
      if (kfIdx === -1 || i > kfIdx) features.push({ heading, body });
      else bodyParas.push(heading + (body ? " — " + body : "")); // narrative bullet -> body
      return;
    }
    if (line === "") { flush(); return; }
    cur.push(line);
  });
  flush();
  // Drop orphaned list-intro labels (e.g. "**Key features:**", "**Service areas covered:**")
  // left behind once their bullet list was lifted out into `features`.
  const isListLabel = (p) => {
    const t = stripTags(p).replace(/[*_`]/g, "").trim();
    return /:\s*$/.test(t) && t.split(/\s+/).length <= 6; // a short colon-terminated label
  };
  return { intro, bodyParas: bodyParas.filter((p) => !isListLabel(p)), features };
}

function parseScreenshots(md) {
  const scM = md.match(/##\s*Screenshots([\s\S]*?)(?:\n##\s|<!--\s*BUILT WITH|$)/i);
  const grid = [];
  if (scM) {
    for (const m of scM[1].matchAll(/<img[^>]+src="([^"]+)"/gi)) {
      if (/^https?:\/\//i.test(m[1])) continue;
      grid.push(decodeURIComponent(m[1])); // full relative path (folder may be screenshots/screenshoots/…)
    }
  }
  const prodM = md.match(/^\[product-screenshot\]:\s*(.+?)\s*$/im);
  const featured = prodM ? decodeURIComponent(prodM[1].trim().replace(/^<|>$/g, "")) : null;
  return { grid, featured };
}

function parseTech(md) {
  const bwM = md.match(/##\s*Built With([\s\S]*?)(?:\n#{1,6}\s|<p[^>]*align="right"|<!--\s*(?:GETTING STARTED|ROADMAP|LEARN|OTHER|CONTRIBUTORS|CONTACT)|$)/i);
  const tech = [];
  if (!bwM) return tech;
  let headerCol3 = "Version";
  for (const raw of bwM[1].split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").map((c) => c.trim());
    const iconCell = cells[1] ?? "";
    const nameCell = cells[2] ?? "";
    const verCell = cells[3] ?? "";
    if (/^:?-+:?$/.test(iconCell) || /^:?-+:?$/.test(nameCell)) continue; // separator
    if (!nameCell) continue;
    if (HEADER_LABELS.has(nameCell)) { headerCol3 = verCell || "Version"; continue; }
    if (nameCell === "Version" || nameCell === "Role") continue;
    if (/^virtuemart$/i.test(nameCell)) continue; // per request: skip entirely (no icon)
    const iconM = iconCell.match(/src="([^"]+)"/i);
    const icon = iconM ? iconM[1] : null;
    let version = undefined;
    if (headerCol3 === "Version" && verCell && verCell !== "—" && verCell !== "-") version = verCell;
    tech.push({ name: nameCell, version, iconUrl: icon });
    if (headerCol3 !== "Version") report.oddTechTables.push({ header3: headerCol3, name: nameCell });
  }
  return tech;
}

function copyFileSafe(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// Resolve a README-referenced file against the project dir, tolerating markdown <..> wrappers
// and NFC/NFD unicode + case differences between the ref and the on-disk filename (Windows).
function resolveArchiveFile(dir, rel, slug) {
  rel = rel.replace(/^<|>$/g, "");
  const alias = slug && FILE_ALIASES[slug]?.[path.basename(rel)];
  if (alias) rel = path.join(path.dirname(rel), alias);
  const direct = path.join(dir, rel);
  if (fs.existsSync(direct)) return direct;
  const folder = path.join(dir, path.dirname(rel));
  if (!fs.existsSync(folder)) return null;
  const want = path.basename(rel).normalize("NFC");
  const files = fs.readdirSync(folder);
  for (const f of files) if (f.normalize("NFC") === want) return path.join(folder, f);
  for (const f of files) if (f.normalize("NFC").toLowerCase() === want.toLowerCase()) return path.join(folder, f);
  return null;
}

async function parseAll() {
  const slugs = fs.readdirSync(ARCHIVE, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(ARCHIVE, d.name, "README.md")))
    .map((d) => d.name);

  const works = [];
  for (const slug of slugs) {
    const dir = path.join(ARCHIVE, slug);
    const md = fs.readFileSync(path.join(dir, "README.md"), "utf8");
    const yearM = md.match(/year-shield\]:\s*\S*Released-(\d{4})/i);
    const header = parseHeader(md);
    const { intro, bodyParas, features } = parseIntroBodyFeatures(md);
    const { grid, featured } = parseScreenshots(md);
    const rawTech = parseTech(md);

    // --- copy screenshots (relative paths resolved against the project dir; folder name varies) ---
    const outSsDir = path.join(PUBLIC, "projects", slug, "screenshots");
    const screenshots = [];
    const seen = new Set();
    const gridOrdered = [...grid];
    if (featured && !grid.includes(featured)) { gridOrdered.unshift(featured); report.featuredNotInGrid.push({ slug, featured }); }
    for (const rel of gridOrdered) {
      if (seen.has(rel)) continue;
      seen.add(rel);
      const src = resolveArchiveFile(dir, rel, slug);
      if (!src) { report.missingScreenshotFiles.push({ slug, rel }); continue; }
      const outName = sanitize(path.basename(rel));
      copyFileSafe(src, path.join(outSsDir, outName));
      const shot = { src: `/projects/${slug}/screenshots/${outName}` };
      if (rel === featured) shot.featured = true;
      screenshots.push(shot);
    }
    if (screenshots.length === 0) report.noScreenshots.push(slug);

    // --- copy logo (image file, or fall back to the emoji-as-logo used by some projects) ---
    let logo = undefined;
    let isLogoEmoji = false;
    if (header.logoSrc) {
      const src = resolveArchiveFile(dir, decodeURIComponent(header.logoSrc));
      if (src) {
        const ext = path.extname(src).toLowerCase() || ".png";
        const outName = `${slug}-logo${ext}`;
        copyFileSafe(src, path.join(PUBLIC, "projects", slug, outName));
        logo = `/projects/${slug}/${outName}`;
      }
    }
    if (!logo && header.emojiLogo) { logo = header.emojiLogo; isLogoEmoji = true; }
    if (!logo) report.noLogo.push(slug);

    // --- resolve icons (CDN download or local copy) ---
    const tech = [];
    for (const t of rawTech) {
      const item = { name: t.name };
      if (t.version) item.version = t.version;
      const icon = await resolveIcon(t.iconUrl, dir);
      if (icon) item.icon = icon;
      tech.push(item);
    }

    const work = { slug, year: yearM ? yearM[1] : null, pinned: false };
    if (header.liveUrl) work.liveUrl = header.liveUrl;
    if (logo) work.logo = logo;
    if (isLogoEmoji) work.isLogoEmoji = true;
    Object.assign(work, { name: header.name, tagline: header.tagline, kicker: header.kicker, intro, body: bodyParas, features, tech, screenshots });
    works.push(work);
  }

  works.sort((a, b) => (b.year || "").localeCompare(a.year || ""));
  return works;
}

// --- Pass 2: merge EN scaffold + PT translations into typed data/work.ts ---
const TS_HEADER = `// AUTO-GENERATED by scripts/build-works.mjs — do not edit by hand.
// Source of truth: project_archive/<slug>/README.md (structure + English) and
// scripts/works.pt.json (Portuguese). Regenerate with: pnpm build:works
import type { Lang } from "./data";

export interface WorkTech {
  name: string;
  version?: string;
  icon?: string; // e.g. "/devicons/php-original.svg"
}

export interface WorkScreenshot {
  src: string; // e.g. "/projects/<slug>/screenshots/<file>.png"
  featured?: boolean; // the shot shown under "About The Project"
}

export interface WorkFeature {
  heading: Record<Lang, string>;
  body: Record<Lang, string>;
}

export interface Work {
  slug: string;
  year: string;
  pinned: boolean;
  liveUrl?: string;
  logo?: string; // image path "/projects/<slug>/<slug>-logo.<ext>", or an emoji when isLogoEmoji
  isLogoEmoji?: boolean; // when true, logo is an emoji to render as text, not an <img> src
  name: Record<Lang, string>;
  tagline: Record<Lang, string>;
  kicker: Record<Lang, string>;
  intro: Record<Lang, string>;
  body: Record<Lang, string[]>;
  features: WorkFeature[];
  tech: WorkTech[];
  screenshots: WorkScreenshot[];
}

export const WORKS: Work[] = `;

function bi(en, pt) { return { en, pt }; }

function emit(works, pt) {
  const errors = [];
  const out = works.map((w) => {
    const t = pt[w.slug];
    if (!t) { errors.push(`${w.slug}: no PT translation`); return null; }
    const need = ["name", "tagline", "kicker", "intro"];
    for (const k of need) if (!t[k]) errors.push(`${w.slug}: PT missing "${k}"`);
    if (!Array.isArray(t.body) || t.body.length !== w.body.length) errors.push(`${w.slug}: PT body length ${t.body?.length} != ${w.body.length}`);
    if (!Array.isArray(t.features) || t.features.length !== w.features.length) errors.push(`${w.slug}: PT features length ${t.features?.length} != ${w.features.length}`);
    const rec = {
      slug: w.slug, year: w.year, pinned: w.pinned,
    };
    if (w.liveUrl) rec.liveUrl = w.liveUrl;
    if (w.logo) rec.logo = w.logo;
    if (w.isLogoEmoji) rec.isLogoEmoji = true;
    rec.name = bi(w.name, t.name);
    rec.tagline = bi(w.tagline, t.tagline);
    rec.kicker = bi(w.kicker, t.kicker);
    rec.intro = bi(w.intro, t.intro);
    rec.body = { en: w.body, pt: t.body || [] };
    rec.features = w.features.map((f, i) => ({
      heading: bi(f.heading, t.features?.[i]?.heading ?? ""),
      body: bi(f.body, t.features?.[i]?.body ?? ""),
    }));
    rec.tech = w.tech;
    rec.screenshots = w.screenshots;
    return rec;
  });
  if (errors.length) {
    console.error("\n!! PT merge errors — data/work.ts NOT written:\n" + errors.join("\n"));
    return false;
  }
  fs.writeFileSync(OUT_TS, TS_HEADER + JSON.stringify(out, null, 2) + ";\n", "utf8");
  console.log(`\n✔ Wrote ${OUT_TS} (${out.length} projects, bilingual).`);
  return true;
}

async function main() {
  const works = await parseAll();
  fs.writeFileSync(EN_JSON, JSON.stringify(works, null, 2));
  console.log(`Parsed ${works.length} projects -> ${EN_JSON}`);
  console.log(`No logo (${report.noLogo.length}): ${report.noLogo.join(", ")}`);
  if (report.missingScreenshotFiles.length) console.log("Missing screenshots: " + JSON.stringify(report.missingScreenshotFiles));
  if (report.iconFailures.length) console.log("Icon failures: " + JSON.stringify(report.iconFailures));

  if (fs.existsSync(PT_JSON)) {
    const pt = JSON.parse(fs.readFileSync(PT_JSON, "utf8"));
    emit(works, pt);
  } else {
    console.log(`\n(no ${path.basename(PT_JSON)} yet — skipping data/work.ts; author it, then re-run)`);
  }
}

main();
