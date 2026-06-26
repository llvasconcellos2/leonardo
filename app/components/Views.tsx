import "./Views.css";
import "./WorkSection.css";

import Link from "next/link";
import { ArrowLeft, Archive, Check } from "lucide-react";
import { Kicker, TechChip } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { PROJECTS, T } from "@/data/data";
import type { Lang } from "@/data/data";

export function ProjectDetail({ lang, id }: { lang: Lang; id: string | null }) {
  const p = PROJECTS.find((x) => x.id === id) || PROJECTS[0];
  const t = T[lang];
  return (
    <article className="lv-detail">
      <Link href={`/${lang}/work`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {t.back}
      </Link>
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
        <LowPolyField
          seed={p.seed}
          style={{ position: "absolute", inset: 0 }}
        />
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

export function ArchiveView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const tiles = Array.from({ length: 24 }, (_, i) => ({
    ...PROJECTS[i % PROJECTS.length],
    seed: PROJECTS[i % PROJECTS.length].seed + i,
  }));
  return (
    <section className="lv-archive">
      <Link href={`/${lang}`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {t.back}
      </Link>
      <Kicker as="p">// archive</Kicker>
      <h1 className="lv-archive-title">{t.archive}</h1>
      <p className="lv-archive-lead">{t.archiveLead}</p>
      <div className="lv-archive-grid">
        {tiles.map((p, i) => (
          <Link
            key={i}
            href={`/${lang}/work/${PROJECTS[i % PROJECTS.length].id}`}
            className="lv-tile"
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
          </Link>
        ))}
      </div>
    </section>
  );
}
