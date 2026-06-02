"use client";

import { ArrowRight, ShieldAlert, Check } from "lucide-react";
import { Kicker, TechChip } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { PROJECTS, T } from "../data";
import type { Lang } from "../data";
import type { GoFn } from "./types";

function WorkRow({
  p,
  lang,
  go,
  flip,
}: {
  p: (typeof PROJECTS)[number];
  lang: Lang;
  go: GoFn;
  flip: boolean;
}) {
  const t = T[lang];
  return (
    <article className={`lv-row ${flip ? "is-flip" : ""}`}>
      <button
        className="lv-row-media"
        onClick={() => go("project", p.id)}
        aria-label={`View ${p.title[lang]}`}
      >
        <LowPolyField seed={p.seed} label={p.year} style={{ position: "absolute", inset: 0 }} />
      </button>
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
        <button
          className="lv-link-arrow"
          onClick={() => go("project", p.id)}
        >
          {t.viewDetails} <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

export function WorkSection({ lang, go }: { lang: Lang; go: GoFn }) {
  const t = T[lang];
  return (
    <section className="lv-section" id="work">
      <div className="lv-section-head">
        <Kicker as="p">// selected work</Kicker>
        <h2 className="lv-section-title">{t.selectedWork}</h2>
        <button
          className="lv-link-arrow lv-section-see"
          onClick={() => go("archive")}
        >
          {t.seeAll} <ArrowRight size={15} />
        </button>
      </div>
      <div className="lv-rows">
        {PROJECTS.map((p, i) => (
          <WorkRow key={p.id} p={p} lang={lang} go={go} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
