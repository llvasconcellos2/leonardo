import "./ResumePage.css";
import "./AboutSection.css";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Download,
  FileDown,
  Briefcase,
  ArrowUpRight,
  CodeXml,
  Globe,
} from "lucide-react";
import { Kicker, TECH_LOGOS } from "./Primitives";
import { ResumeExperience } from "./ResumeExperience";
import type { Lang } from "@/data/data";

const RESUME_PDF: Record<Lang, string> = {
  en: "/resume/Leonardo_LV_EN.pdf",
  pt: "/resume/Leonardo_LV_PT.pdf",
};

const RES_ERAS = [
  { y: "2005", label: { en: "Flash · Flex", pt: "Flash · Flex" } },
  { y: "2008", label: { en: "PHP · Zend", pt: "PHP · Zend" } },
  { y: "2011", label: { en: "Java · Android", pt: "Java · Android" } },
  { y: "2014", label: { en: ".NET · C#", pt: ".NET · C#" } },
  {
    y: "2019",
    label: { en: "React · Next · AI", pt: "React · Next · IA" },
    now: true,
  },
];

const RES_SKILLS = {
  core: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Java",
    "PHP",
    "C#",
    "PostgreSQL",
    "Python",
    "Android",
    "MySQL",
    "Tailwind",
  ],
  groups: [
    {
      label: { en: "languages", pt: "linguagens" },
      items: [
        "TypeScript",
        "JavaScript",
        "Java",
        "PHP",
        "Python",
        "C#",
        "HTML",
        "CSS",
      ],
    },
    {
      label: { en: "frameworks & tools", pt: "frameworks & ferramentas" },
      items: [
        "React",
        "Next.js",
        "Node.js",
        "Nest.js",
        "Zustand",
        "React Query",
        "TailwindCSS",
        "ShadCN",
        "Zod",
        "Drizzle ORM",
        "Better Auth",
        "Jest",
        "Java Spring",
        "JBoss RESTEasy",
        "Laravel",
        "ZendFramework",
        "Bootstrap",
        "jQuery",
        "WordPress",
        "Magento",
        "Git",
      ],
    },
    {
      label: { en: "databases", pt: "bancos de dados" },
      items: ["PostgreSQL", "MySQL", "MSSQL", "MongoDB", "Redis", "Oracle"],
    },
    {
      label: { en: "methodologies", pt: "metodologias" },
      items: ["Agile", "Scrum", "XP", "Clean Code"],
    },
  ],
};

const SPOKEN = [
  {
    name: { en: "Portuguese", pt: "Português" },
    level: { en: "Native", pt: "Nativo" },
    pct: 100,
  },
  {
    name: { en: "English", pt: "Inglês" },
    level: { en: "Fluent · TOEFL B1", pt: "Fluente · TOEFL B1" },
    pct: 88,
  },
  {
    name: { en: "Spanish", pt: "Espanhol" },
    level: { en: "Conversational", pt: "Conversação · Intermediário" },
    pct: 55,
  },
];

const EDUCATION = [
  {
    deg: {
      en: "Master's, Software Engineering",
      pt: "Mestrado em Engenharia de Software",
    },
    school: "UTFPR",
    when: { en: "2020 · incomplete", pt: "2020 · incompleto" },
  },
  {
    deg: {
      en: "Postgraduate, Project Management",
      pt: "Pós-graduação em Gerência de Projetos",
    },
    school: "UNICESUMAR",
    when: { en: "2018 — 2019", pt: "2018 — 2019" },
  },
  {
    deg: {
      en: "Bachelor's, Computer Science",
      pt: "Bacharelado em Ciência da Computação",
    },
    school: "UDESC",
    when: { en: "2011 — 2017", pt: "2011 — 2017" },
  },
];

const LINKS = [
  {
    icon: "github",
    label: "github.com/llvasconcellos",
    href: "https://github.com/llvasconcellos",
  },
  {
    icon: "github",
    label: "github.com/llvasconcellos2",
    href: "https://github.com/llvasconcellos2",
  },
  {
    icon: "globe",
    label: "leonardo-vasconcellos.vercel.app",
    href: "https://leonardo-vasconcellos.vercel.app",
  },
];

const RT = {
  en: {
    kicker: "// résumé · curriculum vitae",
    role: "Senior Full-Stack Engineer",
    location: "Joinville · Santa Catarina · Brazil",
    summary:
      "I'm a senior full-stack engineer who's been shipping for the web since 2005 — around 70 projects across five eras of the technology. I was elected technical lead on an Ebola-response records system with Doctors Without Borders, helped scale high-concurrency SaaS at Email on Acid, and contributed to Brazil's top-ranked smart city in Itajaí. My specialty is the systems where failure has real consequences: I take them — mission-critical, often tangled — and make them scale, clean and fast and built to last. I'm still hands-on every day, now AI-assisted, and I work in both English and Portuguese. Off the clock I play bass, drums, and guitar — same discipline and timing, different instrument.",
    downloadThis: "Download PDF",
    other: "Versão em Português",
    pdfNote: "Print-ready PDF · updated 2026",
    stats: [
      ["~20", "years shipping"],
      ["~70", "projects"],
      ["5", "tech eras"],
      ["12", "roles"],
    ],
    erasH: "// five eras of the web — still writing code",
    skillsH: "Skills",
    coreH: "// core stack",
    eduH: "Education",
    langH: "Languages",
    linksH: "Links",
    backHome: "Back to portfolio",
  },
  pt: {
    kicker: "// currículo · curriculum vitae",
    role: "Engenheiro de Software Full-Stack Sênior",
    location: "Joinville · Santa Catarina · Brasil",
    summary:
      "Sou engenheiro de software full-stack sênior e desenvolvo para a web desde 2005 — cerca de 70 projetos ao longo de cinco eras da tecnologia. Fui eleito líder técnico de um sistema de prontuários para o combate ao Ebola com os Médicos Sem Fronteiras, ajudei a escalar SaaS de alta concorrência na Email on Acid e contribuí para a cidade inteligente mais bem classificada do Brasil, em Itajaí. Eu me especializo em sistemas em que a falha tem consequências reais: pego os mais críticos e complexos e os transformo em soluções escaláveis — limpas, rápidas e feitas para durar. Continuo com a mão no código todos os dias, agora com auxílio de IA, e trabalho em português e inglês. Fora do expediente, toco baixo, bateria e guitarra — mesma disciplina e timing, outro instrumento.",
    downloadThis: "Baixar PDF",
    other: "English version",
    pdfNote: "PDF pronto para impressão · atualizado em 2026",
    stats: [
      ["~20", "anos de carreira"],
      ["~70", "projetos"],
      ["5", "eras de tecnologia"],
      ["12", "cargos"],
    ],
    erasH: "// cinco eras da web — ainda escrevendo código",
    skillsH: "Habilidades",
    coreH: "// stack principal",
    eduH: "Formação",
    langH: "Idiomas",
    linksH: "Links",
    backHome: "Voltar ao portfólio",
  },
};

export function ResumePage({ lang }: { lang: Lang }) {
  const t = RT[lang];
  const otherLang: Lang = lang === "en" ? "pt" : "en";

  return (
    <div className="lv-resume">
      <Link href={`/${lang}`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {t.backHome}
      </Link>

      {/* ── header ── */}
      <header className="lv-resume-head">
        <div className="lv-resume-head-main">
          <Kicker className="lv-resume-kicker">{t.kicker}</Kicker>
          <h1 className="lv-resume-name">Leonardo Lima de Vasconcellos</h1>
          <p className="lv-resume-role">{t.role}</p>
          <div className="lv-resume-contact">
            <a href="mailto:leonardolimadevasconcellos@gmail.com">
              <Mail size={15} />
              leonardolimadevasconcellos@gmail.com
            </a>
            <a href="tel:+5541992151301">
              <Phone size={15} />
              +55 41 99215-1301
            </a>
            <a
              href="https://linkedin.com/in/llvasconcellos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Briefcase size={15} />
              in/llvasconcellos
            </a>
            <span className="lv-resume-loc">
              <MapPin size={15} />
              {t.location}
            </span>
          </div>
        </div>
        <div className="lv-resume-dl">
          <a className="lv-btn lv-btn-primary" href={RESUME_PDF[lang]} download>
            {t.downloadThis} · {lang.toUpperCase()} <Download size={15} />
          </a>
          <a
            className="lv-btn lv-btn-ghost"
            href={RESUME_PDF[otherLang]}
            download
          >
            {t.other} <FileDown size={15} />
          </a>
          <span className="lv-resume-pdfnote">{t.pdfNote}</span>
        </div>
      </header>

      {/* ── summary ── */}
      <div className="lv-resume-summary-row">
        <div
          style={{ float: "right", margin: "1rem" }}
          className="lv-resume-portrait"
        >
          <img alt="Photo of Leonardo" src="/assets/leo_photo.jpg" />
        </div>
        <p className="lv-resume-summary">{t.summary}</p>
      </div>

      {/* ── stats ── */}
      <div className="lv-stat-row lv-resume-stats">
        {t.stats.map(([n, l], i) => (
          <div className="lv-stat" key={i}>
            <span className="lv-stat-n">{n}</span>
            <span className="lv-stat-l">{l}</span>
          </div>
        ))}
      </div>

      {/* ── eras arc ── */}
      <p className="lv-resume-h lv-resume-h-mono">{t.erasH}</p>
      <div className="lv-timeline lv-resume-eras">
        <div className="lv-timeline-line" />
        {RES_ERAS.map((e, i) => (
          <div key={i} className={`lv-era${e.now ? " is-now" : ""}`}>
            <div className="lv-era-dot" />
            <div className="lv-era-y">{e.y}</div>
            <div className="lv-era-l">{e.label[lang]}</div>
          </div>
        ))}
      </div>

      {/* ── experience (client component for filter + expand state) ── */}
      <ResumeExperience lang={lang} />

      {/* ── core stack ── */}
      <p className="lv-resume-h lv-resume-h-mono lv-resume-coreh">{t.coreH}</p>
      <div className="lv-stack lv-resume-core">
        {RES_SKILLS.core.map((name) => {
          const logo = TECH_LOGOS[name];
          return (
            <div key={name} className="lv-stack-cell" title={name}>
              {logo ? (
                <span
                  className="lv-stack-logo"
                  style={{ backgroundImage: `url(${logo})` }}
                />
              ) : (
                <span className="lv-resume-core-glyph">{name[0]}</span>
              )}
              <span>{name}</span>
            </div>
          );
        })}
      </div>

      {/* ── lower grid: skills | languages + education + links ── */}
      <div className="lv-resume-cols">
        <div className="lv-resume-col">
          <h2 className="lv-resume-h">{t.skillsH}</h2>
          {RES_SKILLS.groups.map((g, i) => (
            <div key={i} className="lv-skill-group">
              <p className="lv-about-sub">{`// ${g.label[lang]}`}</p>
              <div className="lv-skill-chips">
                {g.items.map((s) => (
                  <span key={s} className="lv-chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lv-resume-col">
          <h2 className="lv-resume-h">{t.langH}</h2>
          <div className="lv-spoken">
            {SPOKEN.map((s, i) => (
              <div key={i} className="lv-spoken-row">
                <div className="lv-spoken-top">
                  <span className="lv-spoken-name">{s.name[lang]}</span>
                  <span className="lv-spoken-lvl">{s.level[lang]}</span>
                </div>
                <div className="lv-spoken-bar">
                  <span
                    className="lv-spoken-fill"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h2 className="lv-resume-h lv-resume-h-gap">{t.eduH}</h2>
          <div className="lv-edu">
            {EDUCATION.map((e, i) => (
              <div key={i} className="lv-edu-row">
                <span className="lv-edu-y">{e.when[lang].split(" ")[0]}</span>
                <div>
                  <div className="lv-edu-t">{e.deg[lang]}</div>
                  <div className="lv-edu-d">
                    {e.school} · {e.when[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="lv-resume-h lv-resume-h-gap">{t.linksH}</h2>
          <div className="lv-linklist">
            {LINKS.map((l, i) => (
              <a
                key={i}
                className="lv-linkrow"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.icon === "github" ? (
                  <CodeXml size={16} />
                ) : (
                  <Globe size={16} />
                )}
                <span>{l.label}</span>
                <ArrowUpRight className="lv-linkrow-out" size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── closing download ── */}
      <div className="lv-resume-foot">
        <a className="lv-btn lv-btn-primary" href={RESUME_PDF[lang]} download>
          {t.downloadThis} · {lang.toUpperCase()} <Download size={15} />
        </a>
      </div>
    </div>
  );
}
