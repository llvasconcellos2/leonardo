import "./AboutSection.css";
import { Kicker, TECH_LOGOS } from "./Primitives";
import type { Lang } from "../data";

const ABOUT = {
  en: {
    kicker: "// about · how to work with me",
    hi: "Hi, I'm Leonardo",
    tagline:
      "Turning tangled, mission-critical systems into software people depend on.",
    intro:
      "I'm a senior full-stack engineer who's been shipping for the web since 2005 — around 70 projects across five eras of the technology. I was elected technical lead on an Ebola-response records system with Doctors Without Borders, helped scale high-concurrency SaaS at Email on Acid, and contributed to Brazil's top-ranked smart city in Itajaí. My specialty is the systems where failure has real consequences: I take them — mission-critical, often tangled — and make them scale, clean and fast and built to last. I'm still hands-on every day, now AI-assisted, and I work in both English and Portuguese. Off the clock I play bass, drums, and guitar — same discipline and timing, different instrument. If you're building something that genuinely has to work, I'd like to hear about it.",
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
      "Sou engenheiro de software full-stack sênior e desenvolvo para a web desde 2005 — cerca de 70 projetos ao longo de cinco eras da tecnologia. Fui eleito líder técnico de um sistema de prontuários para o combate ao Ebola com os Médicos Sem Fronteiras, ajudei a escalar SaaS de alta concorrência na Email on Acid e contribuí para a cidade inteligente mais bem classificada do Brasil, em Itajaí. Eu me especializo em sistemas em que a falha tem consequências reais: pego os mais críticos e complexos e os transformo em soluções escaláveis — limpas, rápidas e feitas para durar. Continuo com a mão no código todos os dias, agora com auxílio de IA, e trabalho em português e inglês. Fora do expediente, toco baixo, bateria e guitarra — mesma disciplina e timing, outro instrumento. Se você está construindo algo que realmente precisa funcionar, vou adorar saber mais.",
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
  "AWS",
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
}: {
  title: string;
  body: string;
  open: boolean;
}) {
  return (
    <details className="lv-acc" open={open}>
      <summary className="lv-acc-head">{title}</summary>
      <div className="lv-acc-body">
        <p>{body}</p>
      </div>
    </details>
  );
}

export function AboutSection({ lang }: { lang: Lang }) {
  const t = ABOUT[lang];

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
                open={i === 0}
                key={i}
                title={s[lang][0]}
                body={s[lang][1]}
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
                    <span
                      className="lv-stack-logo"
                      style={{ backgroundImage: `url(${logo})` }}
                    />
                  )}

                  {/*
                  TODO: switch to inline svg and optimize these logos. For now, hide broken ones.
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
                  )} */}
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
