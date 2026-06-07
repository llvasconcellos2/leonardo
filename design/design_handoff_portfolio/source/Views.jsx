/* global React, PROJECTS, T, Kicker, Pill, TechChip, LowPolyField, Button */
// ── LV Portfolio · per-project detail (tier-3) + archive (tier-1) ───
function ProjectDetail({ id, lang, go }) {
  const p = PROJECTS.find((x) => x.id === id) || PROJECTS[0];
  const t = T[lang];
  return (
    <article className="lv-detail">
      <button className="lv-link-arrow lv-back" onClick={() => go('work')}>
        <i data-lucide="arrow-left"></i> {t.back}
      </button>
      <Kicker as="p">{p.kicker[lang]}</Kicker>
      <h1 className="lv-detail-title">{p.title[lang]}</h1>
      <p className="lv-detail-lead">{p.desc[lang]}</p>
      <div className="lv-detail-tech">
        <span className="lv-row-tech-lab">{t.engineeredWith}</span>
        {p.tech.map((x) => <TechChip key={x}>{x}</TechChip>)}
        <span className="lv-detail-year">{p.year}</span>
      </div>
      <div className="lv-detail-hero">
        <LowPolyField seed={p.seed} style={{ position: 'absolute', inset: 0 }} />
      </div>
      <div className="lv-detail-grid">
        <div className="lv-detail-prose prose">
          <p>{p.desc[lang]}</p>
          <ul className="lv-row-bullets">
            {p.bullets[lang].map((b, i) => <li key={i}><i data-lucide="check"></i>{b}</li>)}
          </ul>
        </div>
        <aside className="lv-snapshot">
          <div className="lv-snapshot-bar"><i data-lucide="archive"></i> {t.liveSnapshot}</div>
          <LowPolyField seed={p.seed + 3} style={{ height: 180, position: 'relative' }} />
          <p className="lv-snapshot-note">// archived snapshot · crawled &amp; self-hosted</p>
        </aside>
      </div>
    </article>
  );
}

function ArchiveView({ lang, go }) {
  const t = T[lang];
  // ~70 placeholder tiles; first few carry the real project copy.
  const tiles = Array.from({ length: 24 }, (_, i) => PROJECTS[i % PROJECTS.length]);
  return (
    <section className="lv-archive">
      <button className="lv-link-arrow lv-back" onClick={() => go('home')}>
        <i data-lucide="arrow-left"></i> {t.back}
      </button>
      <Kicker as="p">// archive</Kicker>
      <h1 className="lv-archive-title">{t.archive}</h1>
      <p className="lv-archive-lead">{t.archiveLead}</p>
      <div className="lv-archive-grid">
        {tiles.map((p, i) => (
          <button key={i} className="lv-tile" onClick={() => go('project', p.id)}>
            <LowPolyField seed={p.seed + i} style={{ height: 120, position: 'relative' }} />
            <div className="lv-tile-body">
              <span className="lv-tile-title">{p.title[lang]}</span>
              <span className="lv-tile-year">{p.year} · {p.tech[0]}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
Object.assign(window, { ProjectDetail, ArchiveView });
