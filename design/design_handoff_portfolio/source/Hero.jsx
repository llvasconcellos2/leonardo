/* global React, LowPolyField, Button */
// ── LV Portfolio · hero (the scrollytelling END-STATE, the real header) ──
// brand.md §7: the pinned scroll resolves INTO this. We present the
// end-state statically (also the reduced-motion / SEO state).
const heroCopy = {
  en: {
    kicker: '// full-stack engineer · since 2005',
    tagline: 'From Doctors Without Borders to smart cities — two decades building the software people depend on.',
    subline: 'I take tangled, mission-critical systems and make them scale: clean, fast, built to last.',
    cta: 'View résumé', cta2: 'Selected work',
  },
  pt: {
    kicker: '// engenheiro full-stack · desde 2005',
    tagline: 'De Médicos Sem Fronteiras a cidades inteligentes — duas décadas construindo o software de que as pessoas dependem.',
    subline: 'Eu transformo sistemas complexos e essenciais em soluções escaláveis: limpas, rápidas e feitas para durar.',
    cta: 'Ver currículo', cta2: 'Trabalho selecionado',
  },
};

function Hero({ lang, go }) {
  const c = heroCopy[lang];
  return (
    <section className="lv-hero">
      <div className="lv-hero-field">
        <LowPolyField seed={42} style={{ position: 'absolute', inset: 0 }} />
        <div className="lv-hero-scrim"></div>
        <div className="lv-hero-ghost">LV</div>
      </div>
      <div className="lv-hero-inner">
        <p className="lv-kicker lv-hero-kicker">{c.kicker}</p>
        <h1 className="lv-hero-name">LEONARDO</h1>
        <p className="lv-hero-tagline">{c.tagline}</p>
        <p className="lv-hero-subline">{c.subline}</p>
        <div className="lv-hero-actions">
          <Button variant="primary" onClick={() => go('about')} icon="arrow-right">{c.cta}</Button>
          <Button variant="ghost" onClick={() => go('archive')}>{c.cta2}</Button>
        </div>
      </div>
      <div className="lv-hero-portrait-card">
        <img src="assets/leo_low_poly.svg" alt="Low-poly portrait of Leonardo" />
      </div>
      <div className="lv-hero-scrollhint"><i data-lucide="chevrons-down"></i></div>
    </section>
  );
}
Object.assign(window, { Hero });
