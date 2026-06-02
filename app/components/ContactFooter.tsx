"use client";

import { Mail, Download, CodeXml, Briefcase, Rss } from "lucide-react";
import { Kicker } from "./Primitives";
import { T } from "../data";
import type { Lang } from "../data";
import type { GoFn } from "./types";

export function ContactFooter({ lang, go }: { lang: Lang; go: GoFn }) {
  const t = T[lang];
  return (
    <footer className="lv-footer">
      <section className="lv-hire">
        <Kicker as="p">// hire me</Kicker>
        <h2 className="lv-hire-title">
          {lang === "pt"
            ? "Vamos construir algo que não pode falhar."
            : "Let’s build something that can’t fail."}
        </h2>
        <p className="lv-hire-lead">{t.hireLead}</p>
        <div className="lv-hire-actions">
          <button className="lv-btn lv-btn-primary">
            {t.contact} <Mail size={16} />
          </button>
          <button className="lv-btn lv-btn-ghost">
            {t.resume} <Download size={16} />
          </button>
        </div>
      </section>
      <div className="lv-footer-bar">
        <div className="lv-footer-mark">
          <span className="lv-footer-lv">LV</span>
          <span className="lv-footer-name">
            Leonardo Lima de Vasconcellos
          </span>
        </div>
        <div className="lv-footer-meta">
          <span>Joinville · Santa Catarina · Brasil</span>
          <span className="lv-footer-soc">
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="GitHub">
              <CodeXml size={17} />
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="LinkedIn"
            >
              <Briefcase size={17} />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="Feed">
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
