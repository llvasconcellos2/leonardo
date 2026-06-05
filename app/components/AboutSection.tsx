"use client";
import "./AboutSection.css";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Kicker, TECH_LOGOS } from "./Primitives";
import type { Lang } from "../data";

const ABOUT = {
  en: {
    kicker: "// about · how to work with me",
    hi: "Hi, I'm Leonardo",
    tagline:
      "Turning tangled, mission-critical systems into software people depend on.",
    intro:
      "Since 2005 I've shipped ~70 projects across five eras of the web — from an Ebola-response records system with Doctors Without Borders to Brazil's top-ranked smart city. I take the systems where failure has real consequences, and make them scale: clean, fast, built to last. Still hands-on, now AI-assisted.",
    whatido: "// what I do",
    edu: "// education & certifications",
    stack: "// tech stack",
    timeline: "// five eras, still writing code",
    hireTitle: "Want to know more?",
    hireLead:
      "Download my CV — full engineering history, stack, and projects in detail.",
    cv: "Download CV",
    contact: "Get in touch",
  },
  pt: {
    kicker: "// sobre · como trabalhar comigo",
    hi: "Oi, eu sou o Leonardo",
    tagline:
      "Transformando sistemas complexos e essenciais no software de que as pessoas dependem.",
    intro:
      "Desde 2005 entreguei ~70 projetos em cinco eras da web — de um sistema de prontuários para a resposta ao Ebola com os Médicos Sem Fronteiras à cidade inteligente nº 1 do Brasil. Eu pego os sistemas onde falhar tem consequências reais e os faço escalar: limpos, rápidos, feitos para durar. Ainda mão na massa, agora com IA.",
    whatido: "// o que eu faço",
    edu: "// formação & certificações",
    stack: "// stack",
    timeline: "// cinco eras, ainda escrevendo código",
    hireTitle: "Quer saber mais?",
    hireLead:
      "Baixe meu CV — histórico completo de engenharia, stack e projetos em detalhe.",
    cv: "Baixar CV",
    contact: "Fale comigo",
  },
};

const SKILLS = [
  {
    en: [
      "Full-stack engineering",
      "Front to back, web and Android — React/Next, .NET, Java. The full path from database to pixel.",
    ],
    pt: [
      "Engenharia full-stack",
      "Do front ao back, web e Android — React/Next, .NET, Java. Do banco ao pixel.",
    ],
  },
  {
    en: [
      "Mission-critical systems",
      "Records, supply chains, public services — systems where downtime costs more than money.",
    ],
    pt: [
      "Sistemas críticos",
      "Prontuários, cadeias de suprimentos, serviços públicos — onde indisponibilidade custa mais que dinheiro.",
    ],
  },
  {
    en: [
      "Untangling legacy",
      "Taking software that has grown tangled over years and making it scale again — without a rewrite.",
    ],
    pt: [
      "Desemaranhar legado",
      "Pegar software que cresceu emaranhado por anos e fazê-lo escalar de novo — sem reescrever tudo.",
    ],
  },
];

const EDU = [
  {
    y: "2005",
    en: [
      "Started shipping software",
      "First production code — Flash / Flex era.",
    ],
    pt: [
      "Comecei a entregar software",
      "Primeiro código em produção — era Flash / Flex.",
    ],
  },
  {
    y: "2014",
    en: [
      "Technical lead, Doctors Without Borders",
      "Selected from 1,000+ for the Ebola-response records system.",
    ],
    pt: [
      "Líder técnico, Médicos Sem Fronteiras",
      "Selecionado entre 1.000+ para o sistema de prontuários do Ebola.",
    ],
  },
];

const STACK = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  ".NET",
  "C#",
  "Java",
  "Android",
  "PHP",
  "PostgreSQL",
  "SQL Server",
  "Azure",
  "Git",
  "Docker",
  "Tailwind",
];

const ERAS = [
  { y: "2005", l: "Flash / Flex" },
  { y: "2009", l: "PHP" },
  { y: "2012", l: "Java / Android" },
  { y: "2016", l: ".NET" },
  { y: "2021", l: "React / Next · AI" },
];

const STATS = {
  en: [
    ["~20", "years experience"],
    ["~70", "shipped projects"],
    ["5", "eras of the web"],
    ["1M+", "views, prior site"],
  ],
  pt: [
    ["~20", "anos de experiência"],
    ["~70", "projetos entregues"],
    ["5", "eras da web"],
    ["1M+", "views, site anterior"],
  ],
};

function Accordion({
  title,
  body,
  open,
  onClick,
}: {
  title: string;
  body: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`lv-acc ${open ? "is-open" : ""}`}>
      <button className="lv-acc-head" onClick={onClick}>
        <span>{title}</span>
        {open ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      <div className="lv-acc-body">
        <p>{body}</p>
      </div>
    </div>
  );
}

export function AboutSection({ lang }: { lang: Lang }) {
  const t = ABOUT[lang];
  const [open, setOpen] = useState(0);

  return (
    <section className="lv-section lv-about is-embedded" id="about">
      <Kicker as="p">{t.kicker}</Kicker>
      <div className="lv-about-head">
        <div className="lv-about-head-text">
          <h1 className="lv-about-hi">
            {t.hi.split("Leonardo")[0]}
            <span className="lv-em">Leonardo</span>
          </h1>
          <p className="lv-about-tag">{t.tagline}</p>
        </div>
        <div className="lv-about-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/leo_photo.jpg" alt="Photo of Leonardo" />
        </div>
      </div>

      <div className="lv-about-cols">
        <div className="lv-about-left">
          <p className="prose lv-about-intro">{t.intro}</p>

          <div className="lv-about-sub">{t.whatido}</div>
          <div className="lv-acc-group">
            {SKILLS.map((s, i) => (
              <Accordion
                key={i}
                title={s[lang][0]}
                body={s[lang][1]}
                open={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>

          <div className="lv-about-sub">{t.edu}</div>
          <div className="lv-edu">
            {EDU.map((e, i) => (
              <div key={i} className="lv-edu-row">
                <span className="lv-edu-y">{e.y}</span>
                <div>
                  <div className="lv-edu-t">{e[lang][0]}</div>
                  <div className="lv-edu-d">{e[lang][1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lv-about-right">
          <div className="lv-about-sub">{t.stack}</div>
          <div className="lv-stack">
            {STACK.map((name) => {
              const logo = TECH_LOGOS[name];
              return (
                <div key={name} className="lv-stack-cell" title={name}>
                  {logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt={name}
                      width={26}
                      height={26}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0";
                      }}
                    />
                  )}
                  <span>{name}</span>
                </div>
              );
            })}
          </div>

          <div className="lv-stat-row">
            {STATS[lang].map(([n, l]) => (
              <div key={l} className="lv-stat">
                <span className="lv-stat-n">{n}</span>
                <span className="lv-stat-l">{l}</span>
              </div>
            ))}
          </div>

          <div className="lv-about-sub">{t.timeline}</div>
          <div className="lv-timeline">
            <div className="lv-timeline-line" />
            {ERAS.map((e, i) => (
              <div
                key={e.y}
                className={`lv-era ${i === ERAS.length - 1 ? "is-now" : ""}`}
              >
                <span className="lv-era-dot" />
                <span className="lv-era-y">{e.y}</span>
                <span className="lv-era-l">{e.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
