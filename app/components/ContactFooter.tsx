import "./ContactFooter.css";

import { Mail, Download, CodeXml, Briefcase, Rss } from "lucide-react";
import { Kicker } from "./Primitives";
import { T } from "../../data/data";
import type { Lang } from "../../data/data";

export function ContactFooter({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <footer className="lv-footer">
      <section className="lv-hire">
        <Kicker as="p">// hire me</Kicker>
        <h2 className="lv-hire-title">
          {lang === "pt"
            ? "Vamos construir algo que não pode falhar."
            : "Let's build something that can't fail."}
        </h2>
        <p className="lv-hire-lead">{t.hireLead}</p>
        <div className="lv-hire-actions">
          <a
            href="mailto:leonardolimadevasconcellos@gmail.com"
            className="lv-btn lv-btn-primary"
          >
            {t.contact} <Mail size={16} />
          </a>
          <a href="/cv.pdf" className="lv-btn lv-btn-ghost">
            {t.resume} <Download size={16} />
          </a>
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
            <a
              href="https://github.com/leonardolimadevasconcellos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <CodeXml size={17} />
            </a>
            <a
              href="https://www.linkedin.com/in/leonardolimadevasconcellos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Briefcase size={17} />
            </a>
            <a href="/rss.xml" aria-label="Feed">
              <Rss size={17} />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function MiniFooter() {
  return (
    <div className="lv-footer-bar lv-footer-bar-mini">
      <div className="lv-footer-mark">
        <span className="lv-footer-lv">LV</span>
        <span className="lv-footer-name">Leonardo Lima de Vasconcellos</span>
      </div>
      <span className="lv-footer-meta">Joinville · SC · Brasil</span>
    </div>
  );
}
