// Build webarchive/index.html — self-contained LV-styled directory landing page.
const fs = require("fs");
const path = require("path");

const LEO_TSX = "C:/Users/leona/Projects/leonardo/app/components/LeoLowPoly.tsx";
const BASE = "C:/Users/leona/Projects/webarchive";
const OUT = path.join(BASE, "index.html");

// --- 1. Extract + clean the low-poly SVG from the TSX component ---
const tsx = fs.readFileSync(LEO_TSX, "utf8");
const start = tsx.indexOf("<svg");
const end = tsx.indexOf("</svg>") + "</svg>".length;
let svg = tsx.slice(start, end);
// Drop JSX-only props on the root <svg>, keep xmlns/viewBox/preserveAspectRatio.
svg = svg
  .replace(/\s*className=\{className\}/g, "")
  .replace(/\s*style=\{style\}/g, "")
  .replace(/xmlSpace="preserve"/g, 'xml:space="preserve"')
  .replace(/width="600"\s*\n\s*height="725"/, 'width="600" height="725"');
// Tag the root for CSS + a11y.
svg = svg.replace("<svg", '<svg class="lv-portrait-svg" role="img" aria-label="Low-poly portrait of Leonardo Lima de Vasconcellos"');

// --- 2. Read the real folder listing from disk ---
const dirs = fs
  .readdirSync(BASE, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== ".git")
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b));

function indexFileFor(name) {
  const dir = path.join(BASE, name);
  if (fs.existsSync(path.join(dir, "index.html"))) return "index.html";
  if (fs.existsSync(path.join(dir, "index.htm"))) return "index.htm";
  const html = fs.readdirSync(dir).find((f) => /\.html?$/i.test(f));
  return html || "";
}

// Prettified display titles (raw slug stays the source of truth for links).
const OVERRIDES = {
  "nr-10": "NR-10",
  sbes: "SBES",
  jbc: "JBC",
  ldi: "LDI",
  cmente: "cMente",
  devhouse: "DevHouse",
  "devhouse-wordpress": "DevHouse (WordPress)",
  "devhouse-br.github.com": "DevHouse BR",
  aquitemjoinville: "Aqui Tem Joinville",
  neotropiclab: "Neotropic Lab",
  infinitepar: "InfinitePar",
  powermedia: "PowerMedia",
  "e-profissionalizando": "e-Profissionalizando",
  "ritmo-saude": "Ritmo Saúde",
  "ritmo-saude-ecommerce": "Ritmo Saúde — E-commerce",
  "monumento-ao-voluntario": "Monumento ao Voluntário",
  "nucleo-do-evento": "Núcleo do Evento",
  "oficina-dos-sonhos": "Oficina dos Sonhos",
  "simple-squid-proxy-user-admin": "Squid Proxy — User Admin",
  "managerconsulting-landing-page": "Manager Consulting — Landing Page",
  "www.leonardovasconcellos.tk": "Leonardo Vasconcellos (.tk)",
  gerhacao: "Gerhação",
  supercarwash: "Super Car Wash",
  websolutions: "WebSolutions",
  quantic: "Quantic",
  "quantic-solutions": "Quantic Solutions",
  vonmuller: "Von Müller",
};

function titleFor(name) {
  if (OVERRIDES[name]) return OVERRIDES[name];
  return name
    .split(/[-.]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const rows = dirs
  .map((name) => {
    const idx = indexFileFor(name);
    const href = idx ? `${name}/${idx}` : `${name}/`;
    return `        <a class="lv-row" href="${esc(href)}">
          <span class="lv-row-text">
            <span class="lv-row-title">${esc(titleFor(name))}</span>
            <span class="lv-row-slug">${esc(name)}/</span>
          </span>
          <span class="lv-row-arrow" aria-hidden="true">&rarr;</span>
        </a>`;
  })
  .join("\n");

const count = dirs.length;

// --- 3. Assemble the page ---
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Leonardo Lima de Vasconcellos — Web Archive</title>
    <meta
      name="description"
      content="Static snapshots of websites built by Leonardo Lima de Vasconcellos, preserved as standalone copies."
    />
    <link rel="icon" href="favicon.ico" sizes="any" />
    <link rel="icon" href="icon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="apple-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Exo:wght@500;700&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        /* Neutral ramp (structure) */
        --dark: #1a1c1f;
        --bg: #202327;
        --surface: #2c2f34;
        --raised: #393d44;
        --border: #4d535c;
        --border-strong: #636974;
        --text-muted: #9199a5;
        --text-secondary: #b7beca;
        --text-primary: #e3e8f0;
        /* Navy (quiet brand) */
        --brand-deep: #082451;
        --brand: #173a76;
        --brand-bright: #395584;
        /* Emerald (single accent) */
        --accent-bg: #153f29;
        --accent: #2eba7a;
        --accent-bright: #45bf82;
        --accent-hover: #54cc8e;
        --on-accent: #001c0e;
        --accent-on-dim: #7dd3a3;
        /* Semantic */
        --cyan-shift: #25b8d6;

        --font-display: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        --font-mono: ui-monospace, "Cascadia Code", "JetBrains Mono", "SFMono-Regular", Consolas, monospace;

        --text-xs: 0.78rem;
        --text-sm: 0.875rem;
        --text-base: 1rem;
        --text-lg: 1.25rem;
        --text-xl: 1.5rem;

        --leading-tight: 1.1;
        --leading-ui: 1.5;
        --tracking-tight: -0.02em;
        --tracking-wide: 0.06em;
        --tracking-mono: 0.03em;

        --space-2: 0.5rem;
        --space-3: 0.75rem;
        --space-4: 1rem;
        --space-5: 1.25rem;
        --space-6: 1.5rem;
        --space-8: 2rem;

        --radius-sm: 6px;
        --radius-md: 10px;
        --radius-lg: 14px;
        --radius-pill: 999px;

        --shadow-sm: 0 1px 2px rgba(8, 10, 14, 0.45);
        --shadow-md: 0 6px 16px -4px rgba(8, 10, 14, 0.55);
        --shadow-lg: 0 18px 40px -12px rgba(8, 10, 14, 0.65);

        --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
        --dur-fast: 180ms;
        --dur-base: 320ms;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
      }
      html {
        background: var(--bg);
      }
      body {
        min-height: 100vh;
        background:
          radial-gradient(120% 60% at 78% -8%, rgba(23, 58, 118, 0.28), transparent 60%),
          var(--bg);
        color: var(--text-secondary);
        font-family: var(--font-sans);
        font-size: var(--text-base);
        line-height: var(--leading-ui);
        -webkit-font-smoothing: antialiased;
      }
      ::selection {
        background: var(--accent);
        color: var(--on-accent);
      }
      a {
        color: var(--accent-bright);
        text-decoration: none;
      }
      :focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
        border-radius: var(--radius-sm);
      }

      .lv-wrap {
        max-width: 56rem;
        margin: 0 auto;
        padding: clamp(3.5rem, 9vw, 7rem) clamp(1.25rem, 4vw, 2.5rem)
          clamp(3rem, 7vw, 5rem);
      }

      /* Kicker — the // engineer texture */
      .lv-kicker {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        letter-spacing: var(--tracking-mono);
        color: var(--cyan-shift);
        text-transform: lowercase;
        margin: 0;
      }
      .lv-kicker::before {
        content: "// ";
        opacity: 0.7;
      }

      /* Header */
      .lv-header {
        display: flex;
        align-items: center;
        gap: clamp(1.5rem, 4vw, 3rem);
        margin-bottom: clamp(3rem, 7vw, 5rem);
      }
      .lv-header-copy {
        flex: 1 1 auto;
        min-width: 0;
      }
      .lv-h1 {
        font-family: "Exo", var(--font-display);
        font-weight: 700;
        font-size: clamp(2.1rem, 5.2vw, 3.4rem);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-tight);
        margin: var(--space-4) 0 var(--space-5);
        text-wrap: balance;
      }
      .lv-h1 .lv-name {
        color: var(--accent-bright);
        letter-spacing: var(--tracking-wide);
        display: block;
      }
      .lv-h1 .lv-h1-sub {
        color: var(--text-primary);
      }
      .lv-lede {
        font-size: var(--text-lg);
        color: var(--text-secondary);
        max-width: 46ch;
        margin: 0;
      }
      .lv-lede-link {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        margin-top: var(--space-5);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        letter-spacing: var(--tracking-mono);
        color: var(--accent-bright);
        transition: color var(--dur-fast) var(--ease-spring);
      }
      .lv-lede-link .lv-arrow {
        transition: transform var(--dur-base) var(--ease-spring);
      }
      .lv-lede-link:hover {
        color: var(--accent-hover);
      }
      .lv-lede-link:hover .lv-arrow {
        transform: translateX(4px);
      }

      /* Portrait card */
      .lv-portrait {
        flex: 0 0 auto;
        width: clamp(132px, 22vw, 188px);
        padding: 10px;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-strong);
        background: linear-gradient(160deg, var(--brand-deep), var(--surface));
        box-shadow: var(--shadow-lg);
      }
      .lv-portrait-svg {
        display: block;
        width: 100%;
        height: auto;
        border-radius: var(--radius-md);
      }

      /* List */
      .lv-list-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-4);
        padding-bottom: var(--space-4);
        border-bottom: 1px solid var(--border);
        margin-bottom: var(--space-6);
      }
      .lv-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin: 0;
      }
      .lv-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-4) var(--space-5);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        color: inherit;
        transition:
          transform var(--dur-fast) var(--ease-spring),
          border-color var(--dur-fast) var(--ease-spring),
          background-color var(--dur-fast) var(--ease-spring),
          box-shadow var(--dur-fast) var(--ease-spring);
      }
      .lv-row-text {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }
      .lv-row-title {
        font-family: var(--font-display);
        font-weight: 500;
        font-size: var(--text-lg);
        color: var(--text-primary);
        line-height: 1.2;
        transition: color var(--dur-fast) var(--ease-spring);
      }
      .lv-row-slug {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        letter-spacing: var(--tracking-mono);
        color: var(--text-muted);
        word-break: break-all;
      }
      .lv-row-arrow {
        flex: 0 0 auto;
        font-family: var(--font-mono);
        font-size: var(--text-lg);
        color: var(--accent-bright);
        transform: translateX(0);
        transition: transform var(--dur-base) var(--ease-spring);
      }
      .lv-row:hover {
        transform: translateY(-2px);
        border-color: var(--border-strong);
        background: var(--raised);
        box-shadow: var(--shadow-md);
      }
      .lv-row:hover .lv-row-title {
        color: var(--accent-bright);
      }
      .lv-row:hover .lv-row-arrow {
        transform: translateX(4px);
        color: var(--accent-hover);
      }
      .lv-row:active {
        transform: translateY(0);
      }
      .lv-row:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      /* Footer */
      .lv-footer {
        margin-top: clamp(3rem, 7vw, 5rem);
        padding-top: var(--space-6);
        border-top: 1px solid var(--border);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        letter-spacing: var(--tracking-mono);
        color: var(--text-muted);
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2) var(--space-6);
        justify-content: space-between;
      }
      .lv-footer a {
        color: var(--text-muted);
        transition: color var(--dur-fast) var(--ease-spring);
      }
      .lv-footer a:hover {
        color: var(--accent-bright);
      }

      @media (max-width: 640px) {
        .lv-header {
          flex-direction: column-reverse;
          align-items: flex-start;
          text-align: left;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          transition-duration: 0.001ms !important;
          animation-duration: 0.001ms !important;
        }
        .lv-row:hover {
          transform: none;
        }
      }
    </style>
  </head>
  <body>
    <main class="lv-wrap">
      <header class="lv-header">
        <div class="lv-header-copy">
          <p class="lv-kicker">web archive</p>
          <h1 class="lv-h1">
            <span class="lv-name">Leonardo Lima de Vasconcellos</span>
            <span class="lv-h1-sub">Web Archive</span>
          </h1>
          <p class="lv-lede">
            Static snapshots of sites I've built over the years, preserved here
            as standalone copies you can browse.
          </p>
          <a class="lv-lede-link" href="https://leonardo-vasconcellos.vercel.app/">
            visit my website
            <span class="lv-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div class="lv-portrait">
          ${svg.split("\n").join("\n          ")}
        </div>
      </header>

      <section aria-label="Archived sites">
        <div class="lv-list-head">
          <p class="lv-kicker">${count} archived sites</p>
        </div>
        <nav class="lv-list">
${rows}
        </nav>
      </section>

      <footer class="lv-footer">
        <span>archived work &mdash; leonardo lima de vasconcellos</span>
        <a href="https://leonardo-vasconcellos.vercel.app">portfolio &rarr;</a>
      </footer>
    </main>
  </body>
</html>
`;

fs.writeFileSync(OUT, html, "utf8");
console.log(`Wrote ${OUT}`);
console.log(`Folders: ${count}`);
console.log("Index-file exceptions:");
dirs.forEach((n) => {
  const idx = indexFileFor(n);
  if (idx !== "index.html") console.log(`  ${n} -> ${idx || "(none)"}`);
});
