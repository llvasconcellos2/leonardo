import "./AboutSection.css";
import { Kicker, TECH_LOGOS } from "./Primitives";
import type { Lang } from "@/data/data";

const ABOUT = {
  en: {
    kicker: "// about · how to work with me",
    hi: "Hi, I'm Leonardo",
    tagline:
      "Turning tangled, mission-critical systems into software people depend on.",
    intro:
      "I am a seasoned full-stack engineer with more than 15 years of experience building software solutions for the web – some 70 projects spread out over five distinct generations of the technology. I have served as a technical lead on an Ebola relief records management system for Doctors Without Borders, scaled a high-concurrency SaaS product at Email on Acid, and assisted in making Itajaí Brazil's top-rated smart city. My area of expertise lies in building mission-critical solutions with inherent risks involved; I tackle those (often complicated) systems and bring them from unreliable to scalable, neat, fast and robust. I am still active on the ground every day, now with the help of AI and speak English and Portuguese. In my spare time, I play bass, drums and guitar – the discipline and timing remains the same, the instrument changes.",
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
      "Engenheiro full-stack sênior com mais de 15 anos de experiência no desenvolvimento de soluções de software robustas para a web, acumulando cerca de 70 projetos ao longo de cinco gerações tecnológicas distintas. Com uma trajetória marcada por projetos de alto impacto, atuei como líder técnico no sistema de gestão de prontuários da organização Médicos Sem Fronteiras para o combate ao Ebola, liderei a escala de um produto SaaS de alta concorrência na Email on Acid e colaborei estrategicamente para posicionar Itajaí como a cidade inteligente melhor avaliada do Brasil. Minha especialidade é arquitetar soluções de missão crítica e alta complexidade, mitigando riscos para transformar sistemas instáveis em plataformas escaláveis, limpas, rápidas e seguras. Sigo atuando diretamente na linha de frente do desenvolvimento diário, agora potencializado pelo uso de IA. Fluente em inglês e português. No âmbito pessoal, dedico-me à música tocando baixo, bateria e guitarra — uma prática onde a disciplina e a precisão técnica permanecem as mesmas, mudando apenas o instrumento.",
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
    y: "2017",
    en: [
      "Bachelor's Degree in Computer Science",
      "Finished at UNICESUMAR the course started at UDESC.",
    ],
    pt: [
      "Tecnólogo em Análise e Desenvolvimento de Sistemas",
      "Terminei na UNICESUMAR o curso que começei na UDESC.",
    ],
  },
  {
    y: "2019",
    en: [
      "Postgraduate in Project Management",
      "UNICESUMAR - Universidade Centro Superior Maringá.",
    ],
    pt: [
      "Pós-graduação em Gestão de Projetos",
      "UNICESUMAR - Universidade Centro Superior Maringá.",
    ],
  },
  {
    y: "2022",
    en: [
      "Master's Degree in Software Engineering - Incomplete",
      "Universidade Tecnológica Federal do Paraná — UTFPR.",
    ],
    pt: [
      "Mestrado em Engenharia de Software - Incompleto",
      "Universidade Tecnológica Federal do Paraná — UTFPR.",
    ],
  },
  {
    y: "2014",
    en: [
      "TOEFL - Test of English as a Foreign Language",
      "Score: 617 of 677 - C1 Level.",
    ],
    pt: [
      "TOEFL - Test of English as a Foreign Language",
      "Score: 617 of 677 - Nível C1.",
    ],
  },
  {
    y: "2000",
    en: [
      "Microsoft Certified Professional - MCP",
      "Microsoft - Windows NT.",
    ],
    pt: [
      "Microsoft Certified Professional - MCP",
      "Microsoft - Windows NT.",
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
  { y: "2002", l: "ASP / PHP" },
  { y: "2009", l: "Flash / Flex" },
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
                // open={i === 0}
                open = {true}
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
