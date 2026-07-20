import "./WorkSection.css";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Kicker } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { WORKS } from "@/data/work";
import type { Work } from "@/data/work";
import { T } from "@/data/data";
import type { Lang } from "@/data/data";

/** Deterministic seed from a slug — fallback art for works with no screenshot. */
function seedFromSlug(slug: string): number {
  let n = 0;
  for (let i = 0; i < slug.length; i++) n = (n * 31 + slug.charCodeAt(i)) >>> 0;
  return n % 997;
}

function WorkRow({ w, lang, flip }: { w: Work; lang: Lang; flip: boolean }) {
  const t = T[lang];
  const shot = w.screenshots.find((s) => s.featured) ?? w.screenshots[0];
  const bullets = w.features.slice(0, 3).map((f) => f.heading[lang]);
  return (
    <article className={`lv-row ${flip ? "is-flip" : ""}`}>
      <Link
        href={`/${lang}/work/${w.slug}`}
        className="lv-row-media"
        aria-label={`View ${w.name[lang]}`}
      >
        {shot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="lv-row-shot"
            src={shot.src}
            alt={`${w.name[lang]} screenshot`}
            loading="lazy"
          />
        ) : (
          <LowPolyField
            seed={seedFromSlug(w.slug)}
            label={w.year}
            style={{ position: "absolute", inset: 0 }}
          />
        )}
      </Link>
      <div className="lv-row-body">
        <Kicker as="p">{w.kicker[lang]}</Kicker>
        <h3 className="lv-row-title">{w.name[lang]}</h3>
        <p className="lv-row-desc">{w.tagline[lang]}</p>
        <ul className="lv-row-bullets">
          {bullets.map((b, i) => (
            <li key={i}>
              <Check size={16} />
              {b}
            </li>
          ))}
        </ul>
        <div className="lv-row-tech">
          <span className="lv-row-tech-lab">{t.engineeredWith}</span>
          {w.tech.slice(0, 5).map((tech) => (
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
            </span>
          ))}
        </div>
        <Link href={`/${lang}/work/${w.slug}`} className="lv-link-arrow">
          {t.viewDetails} <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

export function WorkSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const works = WORKS.filter((w) => w.frontPage);
  return (
    <section className="lv-section" id="work">
      <div className="lv-section-head">
        <Kicker as="p">// selected work</Kicker>
        <h2 className="lv-section-title">{t.selectedWork}</h2>
        <Link href={`/${lang}/work`} className="lv-link-arrow lv-section-see">
          {t.seeAll} <ArrowRight size={15} />
        </Link>
      </div>
      <div className="lv-rows">
        {works.map((w, i) => (
          <WorkRow key={w.slug} w={w} lang={lang} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
