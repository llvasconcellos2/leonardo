"use client";

import { Quote } from "lucide-react";
import { Kicker } from "./Primitives";
import type { Lang } from "../data";

const TESTIMONIALS = [
  {
    quote:
      "Leonardo is a great professional, always eager to get to work and face challenges. He is very skilled both on frontend and backend development, as well as development processes and architecture. He is always open for work discussions, giving awesome ideas for the job in question. As a person, he is very passionate on what he does and he gives a pleasant, light and funny conversation every time we talk. I highly recommend Leonardo's work.",
    name: "Thiago LP",
    role: "Senior Software Engineer",
    rel: {
      en: "Worked with Leonardo on the same team",
      pt: "Trabalhou com Leonardo no mesmo time",
    },
    date: "Apr 2020",
    initials: "TL",
    source: "LinkedIn",
  },
];

const TT = {
  en: {
    kicker: "// in their words",
    title: "Testimonials",
    lead: "A few words from people I’ve built with.",
    via: "via",
  },
  pt: {
    kicker: "// nas palavras deles",
    title: "Depoimentos",
    lead: "Algumas palavras de quem construiu comigo.",
    via: "via",
  },
};

function TestimonialCard({
  t,
  lang,
  featured,
}: {
  t: (typeof TESTIMONIALS)[number];
  lang: Lang;
  featured: boolean;
}) {
  const tt = TT[lang];
  return (
    <figure className={`lv-quote ${featured ? "is-featured" : ""}`}>
      <Quote className="lv-quote-mark" />
      <blockquote className="lv-quote-text">{t.quote}</blockquote>
      <figcaption className="lv-quote-foot">
        <span className="lv-quote-av">{t.initials}</span>
        <span className="lv-quote-who">
          <span className="lv-quote-name">{t.name}</span>
          <span className="lv-quote-role">
            {t.role} · {t.rel[lang]}
          </span>
        </span>
        <span className="lv-quote-meta">
          <span className="lv-in">in</span>
          {tt.via} {t.source} · {t.date}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ lang }: { lang: Lang }) {
  const tt = TT[lang];
  const featured = TESTIMONIALS.length === 1;
  return (
    <section className="lv-section lv-testi" id="testimonials">
      <div className="lv-section-head">
        <Kicker as="p">{tt.kicker}</Kicker>
        <h2 className="lv-section-title">{tt.title}</h2>
        <p className="lv-writing-lead">{tt.lead}</p>
      </div>
      <div className={`lv-quotes ${featured ? "is-single" : ""}`}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={i} t={t} lang={lang} featured={featured} />
        ))}
      </div>
    </section>
  );
}
