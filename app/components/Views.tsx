"use client";

import { ArrowLeft, ArrowRight, Archive, Check } from "lucide-react";
import { Kicker, TechChip } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { PROJECTS, T } from "../data";
import type { Lang } from "../data";
import type { GoFn } from "./types";

export function ProjectDetail({
  id,
  lang,
  go,
}: {
  id: string | null;
  lang: Lang;
  go: GoFn;
}) {
  const p = PROJECTS.find((x) => x.id === id) || PROJECTS[0];
  const t = T[lang];
  return (
    <article className="lv-detail">
      <button className="lv-link-arrow lv-back" onClick={() => go("archive")}>
        <ArrowLeft size={15} /> {t.back}
      </button>
      <Kicker as="p">{p.kicker[lang]}</Kicker>
      <h1 className="lv-detail-title">{p.title[lang]}</h1>
      <p className="lv-detail-lead">{p.desc[lang]}</p>
      <div className="lv-detail-tech">
        <span className="lv-row-tech-lab">{t.engineeredWith}</span>
        {p.tech.map((x) => (
          <TechChip key={x}>{x}</TechChip>
        ))}
        <span className="lv-detail-year">{p.year}</span>
      </div>
      <div className="lv-detail-hero">
        <LowPolyField seed={p.seed} style={{ position: "absolute", inset: 0 }} />
      </div>
      <div className="lv-detail-grid">
        <div className="lv-detail-prose prose">
          <p>{p.desc[lang]}</p>
          <ul className="lv-row-bullets">
            {p.bullets[lang].map((b, i) => (
              <li key={i}>
                <Check size={16} />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <aside className="lv-snapshot">
          <div className="lv-snapshot-bar">
            <Archive size={15} /> {t.liveSnapshot}
          </div>
          <LowPolyField
            seed={p.seed + 3}
            style={{ height: 180, position: "relative" }}
          />
          <p className="lv-snapshot-note">
            // archived snapshot · crawled &amp; self-hosted
          </p>
        </aside>
      </div>
    </article>
  );
}

export function ArchiveView({ lang, go }: { lang: Lang; go: GoFn }) {
  const t = T[lang];
  const tiles = Array.from({ length: 24 }, (_, i) => ({
    ...PROJECTS[i % PROJECTS.length],
    seed: PROJECTS[i % PROJECTS.length].seed + i,
  }));
  return (
    <section className="lv-archive">
      <button className="lv-link-arrow lv-back" onClick={() => go("home")}>
        <ArrowLeft size={15} /> {t.back}
      </button>
      <Kicker as="p">// archive</Kicker>
      <h1 className="lv-archive-title">{t.archive}</h1>
      <p className="lv-archive-lead">{t.archiveLead}</p>
      <div className="lv-archive-grid">
        {tiles.map((p, i) => (
          <button
            key={i}
            className="lv-tile"
            onClick={() => go("project", PROJECTS[i % PROJECTS.length].id)}
          >
            <LowPolyField
              seed={p.seed}
              style={{ height: 120, position: "relative" }}
            />
            <div className="lv-tile-body">
              <span className="lv-tile-title">{p.title[lang]}</span>
              <span className="lv-tile-year">
                {p.year} · {p.tech[0]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
