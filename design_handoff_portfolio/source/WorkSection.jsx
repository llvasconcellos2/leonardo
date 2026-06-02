/* global React, PROJECTS, T, Kicker, Pill, TechChip, LowPolyField */
// ── LV Portfolio · selected work (tier-2 curated rows) ──────────────
function WorkRow({ p, lang, go, flip }) {
  const t = T[lang];
  return (
    <article className={`lv-row ${flip ? 'is-flip' : ''}`}>
      <button className="lv-row-media" onClick={() => go('project', p.id)}>
        <LowPolyField seed={p.seed} label={p.year} style={{ position: 'absolute', inset: 0 }} />
      </button>
      <div className="lv-row-body">
        <Kicker as="p">{p.kicker[lang]}</Kicker>
        <h3 className="lv-row-title">
          {p.stakes && <span className="lv-stakes" title="mission-critical"><i data-lucide="shield-alert"></i></span>}
          {p.title[lang]}
        </h3>
        <p className="lv-row-desc">{p.desc[lang]}</p>
        <ul className="lv-row-bullets">
          {p.bullets[lang].map((b, i) => (
            <li key={i}><i data-lucide="check"></i>{b}</li>
          ))}
        </ul>
        <div className="lv-row-tech">
          <span className="lv-row-tech-lab">{t.engineeredWith}</span>
          {p.tech.map((x) => <TechChip key={x}>{x}</TechChip>)}
        </div>
        <button className="lv-link-arrow" onClick={() => go('project', p.id)}>
          {t.viewDetails} <i data-lucide="arrow-up-right"></i>
        </button>
      </div>
    </article>
  );
}

function WorkSection({ lang, go }) {
  const t = T[lang];
  return (
    <section className="lv-section" id="work">
      <div className="lv-section-head">
        <Kicker as="p">// selected work</Kicker>
        <h2 className="lv-section-title">{t.selectedWork}</h2>
        <button className="lv-link-arrow lv-section-see" onClick={() => go('archive')}>
          {t.seeAll} <i data-lucide="arrow-right"></i>
        </button>
      </div>
      <div className="lv-rows">
        {PROJECTS.map((p, i) => <WorkRow key={p.id} p={p} lang={lang} go={go} flip={i % 2 === 1} />)}
      </div>
    </section>
  );
}
Object.assign(window, { WorkSection, WorkRow });
