/* global React */
// ── LV Portfolio · primitives ───────────────────────────────────────
// Small reusable atoms shared across the kit. Exported to window at end.
const { useState } = React;

// Category kicker — the // code-comment signature device (JetBrains Mono)
function Kicker({ children, as = 'div', className = '' }) {
  const Tag = as;
  return <Tag className={`lv-kicker ${className}`}>{children}</Tag>;
}

// Emerald tag pill — accent-bg fill, accent-on-dim text
function Pill({ children }) {
  return <span className="lv-pill">{children}</span>;
}

// Tech logo map — colored brand SVGs (Devicon via CDN; Next.js white via Simple Icons).
// Unknown techs fall back to a text-only chip.
const TECH_LOGOS = {
  'Next.js': 'https://cdn.simpleicons.org/nextdotjs/ffffff',
  '.NET': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
  'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'Android': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'SQL Server': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
  'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
  'Oracle': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg',
  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'Tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
};

// "Engineered with" — neutral mono tech chip, with a colored brand logo when known
function TechChip({ children }) {
  const logo = TECH_LOGOS[children];
  return (
    <span className={`lv-chip ${logo ? 'has-logo' : ''}`}>
      {logo && <img className="lv-chip-logo" src={logo} alt="" />}
      {children}
    </span>
  );
}

// Buttons — primary (solid emerald) / ghost (hairline) / link (emerald text)
function Button({ children, variant = 'primary', onClick, icon }) {
  return (
    <button className={`lv-btn lv-btn-${variant}`} onClick={onClick}>
      {children}
      {icon && <i data-lucide={icon} className="lv-btn-i"></i>}
    </button>
  );
}

// Low-poly faceted navy field — the brand's art-direction placeholder.
// Deterministic triangles from a seed so each project reads distinct.
function LowPolyField({ seed = 1, label, style }) {
  const rand = (n) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  const cols = 6, rows = 4, w = 100, h = 100;
  const pts = [];
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) {
      const jx = (r === 0 || r === rows || c === 0 || c === cols) ? 0 : (rand(r * 7 + c) - 0.5) * 14;
      const jy = (r === 0 || r === rows || c === 0 || c === cols) ? 0 : (rand(r * 13 + c * 3) - 0.5) * 14;
      pts.push([(c / cols) * w + jx, (r / rows) * h + jy]);
    }
  const idx = (r, c) => r * (cols + 1) + c;
  const tris = [];
  const shades = ['#061a3c', '#082451', '#0e2c5e', '#173a76', '#1f4585', '#2b4f8f', '#395584'];
  let k = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const a = pts[idx(r, c)], b = pts[idx(r, c + 1)], d = pts[idx(r + 1, c)], e = pts[idx(r + 1, c + 1)];
      tris.push({ p: `${a[0]},${a[1]} ${b[0]},${b[1]} ${d[0]},${d[1]}`, f: shades[Math.floor(rand(k++) * shades.length)] });
      tris.push({ p: `${b[0]},${b[1]} ${e[0]},${e[1]} ${d[0]},${d[1]}`, f: shades[Math.floor(rand(k++) * shades.length)] });
    }
  return (
    <div className="lv-lowpoly" style={style}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        {tris.map((t, i) => <polygon key={i} points={t.p} fill={t.f} />)}
      </svg>
      {label && <span className="lv-lowpoly-tag">{label}</span>}
      <span className="lv-lowpoly-ph">placeholder · screenshot pending</span>
    </div>
  );
}

Object.assign(window, { Kicker, Pill, TechChip, Button, LowPolyField, TECH_LOGOS });
