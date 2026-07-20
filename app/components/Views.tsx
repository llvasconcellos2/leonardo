import "./Views.css";
import "./WorkSection.css";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Images } from "lucide-react";
import { Kicker } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { Gallery } from "./Gallery";
import { renderInline } from "@/app/lib/inline-md";
import { WORKS } from "@/data/work";
import type { Work } from "@/data/work";
import { T } from "@/data/data";
import type { Lang } from "@/data/data";

/** UI copy for the generic work detail — has no home in the work catalog. */
const copy = {
  openLive: { en: "Open live", pt: "Abrir ao vivo" },
  screenshots: { en: "Screenshots", pt: "Capturas de tela" },
  overview: { en: "Overview", pt: "Visão geral" },
  highlights: { en: "Highlights", pt: "Destaques" },
} as const;

/** Deterministic seed from a slug — fallback art for works with no screenshot. */
function seedFromSlug(slug: string): number {
  let n = 0;
  for (let i = 0; i < slug.length; i++) n = (n * 31 + slug.charCodeAt(i)) >>> 0;
  return n % 997;
}

/** Featured screenshot first, then the rest. */
function orderedShots(w: Work, lang: Lang) {
  const featured = w.screenshots.filter((s) => s.featured);
  const rest = w.screenshots.filter((s) => !s.featured);
  return [...featured, ...rest].map((s, i) => ({
    src: s.src,
    alt: `${w.name[lang]} — screenshot ${i + 1}`,
  }));
}

export function WorkDetail({ lang, id }: { lang: Lang; id: string | null }) {
  const w = WORKS.find((x) => x.slug === id) ?? WORKS[0];
  const t = T[lang];
  const shots = orderedShots(w, lang);
  const hero = shots[0];

  return (
    <article className="lv-detail enable-smooth">
      <Link href={`/${lang}/work`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {t.back}
      </Link>

      <Kicker as="p">{w.kicker[lang]}</Kicker>
      <h1 className="lv-detail-title">{w.name[lang]}</h1>
      <p className="lv-detail-lead">{renderInline(w.intro[lang], "lead")}</p>

      <div className="lv-detail-tech">
        <span className="lv-row-tech-lab">{t.engineeredWith}</span>
        {w.tech.map((tech) => (
          <span
            key={tech.name}
            className={`lv-chip ${tech.icon ? "has-logo" : ""}`}
          >
            {tech.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="lv-chip-logo"
                src={tech.icon}
                alt=""
                width={14}
                height={14}
              />
            )}
            {tech.name}
            {tech.version && (
              <span className="lv-detail-tech-ver">{tech.version}</span>
            )}
          </span>
        ))}
        <span className="lv-detail-year">{w.year}</span>
      </div>

      {w.liveUrl && (
        <a
          href={w.liveUrl}
          className="lv-btn lv-btn-primary lv-detail-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.openLive[lang]} <ArrowUpRight size={17} />
        </a>
      )}

      {hero && (
        <div className="lv-detail-shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.src} alt={hero.alt} loading="lazy" />
        </div>
      )}

      {shots.length > 0 && (
        <section className="lv-detail-block">
          <h2 className="lv-detail-h2">
            <Images size={17} /> {copy.screenshots[lang]}
          </h2>
          <Gallery
            images={shots}
            label={`screenshots · ${w.slug}`}
          />
        </section>
      )}

      <section className="lv-detail-block">
        <h2 className="lv-detail-h2">{copy.overview[lang]}</h2>
        {w.body[lang].map((para, i) => (
          <p key={i} className="lv-detail-para">
            {renderInline(para, `body-${i}`)}
          </p>
        ))}
      </section>

      {w.features.length > 0 && (
        <section className="lv-detail-block">
          <h2 className="lv-detail-h2">{copy.highlights[lang]}</h2>
          <div className="lv-detail-highlights">
            {w.features.map((f, i) => (
              <div className="lv-detail-highlight" key={i}>
                <h3 className="lv-detail-highlight-h">{f.heading[lang]}</h3>
                <p className="lv-detail-highlight-b">
                  {renderInline(f.body[lang], `feat-${i}`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export function ArchiveView({ lang }: { lang: Lang }) {
  const t = T[lang];
  const works = [...WORKS].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) || Number(b.year) - Number(a.year),
  );
  return (
    <section className="lv-archive">
      <Link href={`/${lang}`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {t.back}
      </Link>
      <Kicker as="p">// archive</Kicker>
      <h1 className="lv-archive-title">{t.archive}</h1>
      <p className="lv-archive-lead">{t.archiveLead}</p>
      <div className="lv-archive-grid">
        {works.map((w) => {
          const shot = w.screenshots.find((s) => s.featured) ?? w.screenshots[0];
          return (
            <Link
              key={w.slug}
              href={`/${lang}/work/${w.slug}`}
              className="lv-tile"
            >
              {shot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="lv-tile-shot"
                  src={shot.src}
                  alt={`${w.name[lang]} screenshot`}
                  loading="lazy"
                />
              ) : (
                <LowPolyField
                  seed={seedFromSlug(w.slug)}
                  style={{ height: 120, position: "relative" }}
                />
              )}
              <div className="lv-tile-body">
                <span className="lv-tile-title">{w.name[lang]}</span>
                <span className="lv-tile-year">
                  {w.year}
                  {w.tech[0] ? ` · ${w.tech[0].name}` : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
