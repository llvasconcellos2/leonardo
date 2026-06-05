import "./Testimonials.css";
import "./WritingSection.css";

import Image from "next/image";
import { Quote } from "lucide-react";
import { Kicker } from "./Primitives";
import type { Lang } from "../data";

const TESTIMONIALS = [
  {
    quote: {
      en: "Leonardo is a great professional, always eager to get to work and face challenges. He is very skilled both on frontend and backend development, as well as development processes and architecture. He is always open for work discussions, giving awesome ideas for the job in question. As a person, he is very passionate on what he does and he gives a pleasant, light and funny conversation every time we talk. I highly recommend Leonardo's work.",
      pt: "Leonardo é um grande profissional, sempre disposto a trabalhar e enfrentar desafios. Ele é muito habilidoso tanto no desenvolvimento frontend quanto backend, assim como em processos de desenvolvimento e arquitetura. Ele está sempre aberto a discussões sobre o trabalho, trazendo ótimas ideias para o assunto em questão. Como pessoa, ele é muito apaixonado pelo que faz e proporciona uma conversa agradável, leve e divertida sempre que conversamos. Eu recomendo muito o trabalho do Leonardo.",
    },
    name: "Thiago LP",
    role: "Senior Software Engineer",
    rel: {
      en: "Worked with Leonardo on the same team",
      pt: "Trabalhou com Leonardo no mesmo time",
    },
    date: "Apr 2020",
    avatar: "/thiago.jpeg",
    source: "LinkedIn",
  },
];

const TT = {
  en: {
    kicker: "// in their words",
    title: "Testimonials",
    lead: "A few words from people I've built with.",
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
      <blockquote className="lv-quote-text">{t.quote[lang]}</blockquote>
      <figcaption className="lv-quote-foot">
        <span className="lv-quote-av">
          {t.avatar ? (
            <Image
              src={t.avatar}
              alt={t.name}
              width={40}
              height={40}
              className="lv-quote-av-img"
            />
          ) : null}
        </span>
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
