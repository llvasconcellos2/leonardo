/* global React, T, Kicker, Button */
// ── LV Portfolio · contact / hire-me close + footer ─────────────────
function ContactFooter({ lang, go }) {
  const t = T[lang];
  return (
    <footer className="lv-footer">
      <section className="lv-hire">
        <Kicker as="p">// hire me</Kicker>
        <h2 className="lv-hire-title">
          {lang === 'pt' ? 'Vamos construir algo que não pode falhar.' : "Let's build something that can't fail."}
        </h2>
        <p className="lv-hire-lead">{t.hireLead}</p>
        <div className="lv-hire-actions">
          <Button variant="primary" onClick={() => {}} icon="mail">{t.contact}</Button>
          <Button variant="ghost" onClick={() => {}} icon="download">{t.resume}</Button>
        </div>
      </section>
      <div className="lv-footer-bar">
        <div className="lv-footer-mark">
          <span className="lv-footer-lv">LV</span>
          <span className="lv-footer-name">Leonardo Lima de Vasconcellos</span>
        </div>
        <div className="lv-footer-meta">
          <span>Joinville · Santa Catarina · Brasil</span>
          <span className="lv-footer-soc">
            <a href="#" onClick={(e)=>e.preventDefault()} aria-label="GitHub"><i data-lucide="code-xml"></i></a>
            <a href="#" onClick={(e)=>e.preventDefault()} aria-label="LinkedIn"><i data-lucide="briefcase"></i></a>
            <a href="#" onClick={(e)=>e.preventDefault()} aria-label="Feed"><i data-lucide="rss"></i></a>
          </span>
        </div>
      </div>
    </footer>
  );
}
Object.assign(window, { ContactFooter });
