"use client";
import "./WorkSection.css";

import Link from "next/link";
import { ArrowRight, ShieldAlert, Check } from "lucide-react";
import { Kicker, TechChip } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { PROJECTS, T } from "../data";
import { useLanguage } from "./LanguageProvider";

function WorkRow({
  p,
  flip,
}: {
  p: (typeof PROJECTS)[number];
  flip: boolean;
}) {
  const { lang } = useLanguage();
  const t = T[lang];
  return (
    <article className={`lv-row ${flip ? "is-flip" : ""}`}>
      <Link
        href={`/work/${p.id}`}
        className="lv-row-media"
        aria-label={`View ${p.title[lang]}`}
      >
        <LowPolyField
          seed={p.seed}
          label={p.year}
          style={{ position: "absolute", inset: 0 }}
        />
      </Link>
      <div className="lv-row-body">
        <Kicker as="p">{p.kicker[lang]}</Kicker>
        <h3 className="lv-row-title">
          {p.stakes && (
            <span className="lv-stakes" title="mission-critical">
              <ShieldAlert size={20} />
            </span>
          )}
          {p.title[lang]}
        </h3>
        <p className="lv-row-desc">{p.desc[lang]}</p>
        <ul className="lv-row-bullets">
          {p.bullets[lang].map((b, i) => (
            <li key={i}>
              <Check size={16} />
              {b}
            </li>
          ))}
        </ul>
        <div className="lv-row-tech">
          <span className="lv-row-tech-lab">{t.engineeredWith}</span>
          {p.tech.map((x) => (
            <TechChip key={x}>{x}</TechChip>
          ))}
        </div>
        <Link href={`/work/${p.id}`} className="lv-link-arrow">
          {t.viewDetails} <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

export function WorkSection() {
  const { lang } = useLanguage();
  const t = T[lang];
  return (
    <section className="lv-section" id="work">
      <div className="lv-section-head">
        <Kicker as="p">// selected work</Kicker>
        <h2 className="lv-section-title">{t.selectedWork}</h2>
        <Link href="/work" className="lv-link-arrow lv-section-see">
          {t.seeAll} <ArrowRight size={15} />
        </Link>
      </div>
      <div className="lv-rows">
        {PROJECTS.map((p, i) => (
          <WorkRow key={p.id} p={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
