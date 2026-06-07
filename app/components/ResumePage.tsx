import "./ResumePage.css";
import { Kicker, TechChip, TECH_LOGOS } from "./Primitives";
import { MiniFooter } from "./ContactFooter";
import { Download, Mail, Phone, MapPin, ChevronDown, ShieldAlert } from "lucide-react";
import type { Lang } from "../data";

// ── Experience ────────────────────────────────────────────

interface ExperienceEntry {
  id: string;
  role: Record<Lang, string>;
  company: Record<Lang, string>;
  period: Record<Lang, string>;
  stakes: boolean;
  defaultOpen: boolean;
  tech: string[];
  bullets: Record<Lang, string[]>;
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "itajai",
    role: {
      en: "Senior Web Application Developer",
      pt: "Desenvolvedor Sênior de Aplicações Web",
    },
    company: { en: "Prefeitura Municipal de Itajaí", pt: "Prefeitura Municipal de Itajaí" },
    period: { en: "Apr 2025 – Jan 2026", pt: "Abr 2025 – Jan 2026" },
    stakes: true,
    defaultOpen: true,
    tech: ["React", "Next.js", "Node.js", "PostgreSQL"],
    bullets: {
      en: [
        "Played a key role in the digital transformation of Brazil's top-ranked Smart City, developing full-stack applications.",
        "Created seamless citizen experiences with React and Next.js, backed by a high-concurrency Node.js backend and highly available PostgreSQL data layer.",
        "AI-assisted development workflow using Cursor and Claude Code.",
      ],
      pt: [
        "Tive papel fundamental na transformação digital da cidade inteligente mais bem classificada do Brasil, desenvolvendo aplicações full-stack.",
        "Criei experiências fluidas para os cidadãos com React e Next.js, sustentadas por backend Node.js de alta concorrência e PostgreSQL altamente disponível.",
        "Fluxo de desenvolvimento assistido por IA com Cursor e Claude Code.",
      ],
    },
  },
  {
    id: "devhouse-2024",
    role: { en: "Senior Software Engineer", pt: "Engenheiro de Software Sênior" },
    company: { en: "DevHouse", pt: "DevHouse" },
    period: { en: "Jan 2024 – Apr 2025", pt: "Jan 2024 – Abr 2025" },
    stakes: false,
    defaultOpen: true,
    tech: ["TypeScript", "React", "Next.js", "Node.js"],
    bullets: {
      en: [
        "AI-assisted development of modern client websites using TypeScript, React, Next.js, Zustand, Zod, ShadCN, and TailwindCSS.",
        "Built RESTful APIs with Node.js, Express, and Drizzle ORM.",
      ],
      pt: [
        "Desenvolvimento assistido por IA de sites modernos para clientes usando TypeScript, React, Next.js, Zustand, Zod, ShadCN e TailwindCSS.",
        "APIs RESTful com Node.js, Express e Drizzle ORM.",
      ],
    },
  },
  {
    id: "emailonacid",
    role: {
      en: "Senior Full Stack Software Engineer",
      pt: "Engenheiro de Software Full Stack Sênior",
    },
    company: { en: "Email on Acid", pt: "Email on Acid" },
    period: { en: "Sep 2019 – Sep 2023", pt: "Set 2019 – Set 2023" },
    stakes: true,
    defaultOpen: true,
    tech: ["React", "Node.js", "PHP", "PostgreSQL", "MongoDB", "Redis"],
    bullets: {
      en: [
        "Architected and scaled a full-stack SaaS cloud application — React, Node.js (Express), and PHP (CodeIgniter) — supporting high-concurrency environments.",
        "Spearheaded a critical legacy system refactor: modernized the codebase for significant scalability and readability gains while slashing technical debt.",
        "Implemented advanced caching with Redis and managed hybrid data architectures across PostgreSQL and MongoDB.",
        "Delivered measurable performance improvements including reduced API latency and page load times.",
      ],
      pt: [
        "Arquitetei e escalei uma aplicação SaaS full-stack em nuvem — React, Node.js (Express) e PHP (CodeIgniter) — suportando ambientes de alta concorrência.",
        "Liderei um refatoramento crítico de sistema legado: modernizei a base de código para ganhos significativos em escalabilidade e legibilidade, reduzindo drasticamente a dívida técnica.",
        "Implementei cache avançado com Redis e gerenciei arquiteturas de dados híbridas com PostgreSQL e MongoDB.",
        "Entreguei melhorias mensuráveis de desempenho, incluindo redução de latência de API e tempos de carregamento.",
      ],
    },
  },
  {
    id: "bureau-veritas",
    role: { en: "Full Stack Software Engineer", pt: "Engenheiro de Software Full Stack" },
    company: { en: "Bureau Veritas Group", pt: "Bureau Veritas Group" },
    period: { en: "Mar 2019 – Sep 2019", pt: "Mar 2019 – Set 2019" },
    stakes: true,
    defaultOpen: true,
    tech: ["React", "PHP", "PostgreSQL", "AWS"],
    bullets: {
      en: [
        "Developed full-stack features for SurvAgri©, a mission-critical grain shipment management platform used worldwide — React front-end, distributed Laravel (PHP) RESTful API, and PostgreSQL.",
        "Spearheaded the refactoring of KerpWeb, an ERP and agricultural auditing system used by global giants BASF and Bayer, applying Clean Code and ZendFramework optimizations.",
        "Streamlined CI/CD pipelines via Bitbucket and deployed architectures on Amazon AWS Cloud.",
      ],
      pt: [
        "Desenvolvi funcionalidades full-stack para o SurvAgri©, plataforma de missão crítica para gerenciamento de embarque de grãos usada mundialmente — front-end React, API RESTful Laravel (PHP) distribuída e PostgreSQL.",
        "Liderei o refatoramento do KerpWeb, sistema ERP e de auditoria agrícola usado pela BASF e Bayer, aplicando Clean Code e otimizações com ZendFramework.",
        "Otimizei pipelines de CI/CD via Bitbucket e implantei arquiteturas na Amazon AWS Cloud.",
      ],
    },
  },
  {
    id: "devhouse-2011",
    role: { en: "Senior Software Engineer", pt: "Engenheiro de Software Sênior" },
    company: { en: "DevHouse", pt: "DevHouse" },
    period: { en: "Nov 2011 – Mar 2019", pt: "Nov 2011 – Mar 2019" },
    stakes: false,
    defaultOpen: false,
    tech: ["React", "Node.js", "PostgreSQL", "PHP", "C#"],
    bullets: {
      en: [
        "Development of web applications using React, Node.js, and PostgreSQL.",
        "Development, implementation, and customization of websites and e-commerce using WordPress, Joomla, and Magento.",
        "Analysis, development, and support for small-to-mid-size web applications using PHP and ASP.NET (C#).",
        "Teaching Adobe Flex courses.",
      ],
      pt: [
        "Desenvolvimento de aplicações web com React, Node.js e PostgreSQL.",
        "Desenvolvimento, implantação e customização de sites e e-commerces com WordPress, Joomla e Magento.",
        "Análise, desenvolvimento e suporte para aplicações web de pequeno e médio porte com PHP e ASP.NET (C#).",
        "Ministração de cursos de Adobe Flex.",
      ],
    },
  },
  {
    id: "msf",
    role: {
      en: "Tech Lead · Java & Android Engineer",
      pt: "Líder Técnico · Engenheiro Java & Android",
    },
    company: { en: "Doctors Without Borders (MSF)", pt: "Médicos Sem Fronteiras (MSF)" },
    period: { en: "Sep 2015 – Mar 2016", pt: "Set 2015 – Mar 2016" },
    stakes: true,
    defaultOpen: false,
    tech: ["Android", "Java", "MySQL", "Python"],
    bullets: {
      en: [
        "Android/Java developer on Project Buendia — an open-source medical records system for Ebola and malnutrition relief missions, created by MSF and Google Crisis Response.",
        "Started as a volunteer writing unit tests. After two weeks, selected from 1,000+ candidates to join as a full-time Android developer.",
        "Elected technical lead — led code reviews, resolved architectural blockers, and drove new features and bug fixes.",
        "Stack: Android, Java, JUnit, XForms, Spring, OpenMRS, Hibernate, Python, MySQL, Linux.",
      ],
      pt: [
        "Desenvolvedor Android/Java no Projeto Buendia — sistema de prontuário eletrônico open-source para missões de combate ao Ebola e desnutrição, criado pelo MSF e Google Crisis Response.",
        "Iniciei como voluntário desenvolvendo testes unitários. Após duas semanas, selecionado entre mais de 1.000 candidatos como desenvolvedor Android em tempo integral.",
        "Eleito líder técnico — conduzi revisões de código, resolvi bloqueios arquiteturais e liderei novas funcionalidades e correções.",
        "Stack: Android, Java, JUnit, XForms, Spring, OpenMRS, Hibernate, Python, MySQL, Linux.",
      ],
    },
  },
  {
    id: "stock-info",
    role: { en: "Java Software Engineer", pt: "Engenheiro de Software Java" },
    company: { en: "Stock & Info", pt: "Stock & Info" },
    period: { en: "Apr 2015 – Jul 2015", pt: "Abr 2015 – Jul 2015" },
    stakes: false,
    defaultOpen: false,
    tech: ["Java", "C#"],
    bullets: {
      en: [
        "Java RESTful web service development using JBoss Resteasy.",
        "Front-end development with HTML5, CSS3, Bootstrap, and jQuery.",
        "Helper and version control applications for FileMaker using .NET C#.",
      ],
      pt: [
        "Desenvolvimento de Web Services RESTful em Java com JBoss Resteasy.",
        "Desenvolvimento frontend com HTML5, CSS3, Bootstrap e jQuery.",
        "Aplicações auxiliares e de controle de versão para FileMaker em .NET C#.",
      ],
    },
  },
  {
    id: "bravi",
    role: { en: "Software Engineer", pt: "Engenheiro de Software" },
    company: { en: "Bravi Software", pt: "Bravi Software" },
    period: { en: "Nov 2014 – Feb 2015", pt: "Nov 2014 – Fev 2015" },
    stakes: false,
    defaultOpen: false,
    tech: ["C#", ".NET"],
    bullets: {
      en: [
        "Microsoft C# and .NET WPF developer for the world's largest educational software.",
        "Outsourced engineer to Tribaltech, United Kingdom.",
      ],
      pt: [
        "Desenvolvedor Microsoft C# e .NET WPF para o maior software educacional do mundo.",
        "Engenheiro terceirizado para a Tribaltech, Reino Unido.",
      ],
    },
  },
  {
    id: "morphy",
    role: { en: "Web Developer", pt: "Desenvolvedor Web" },
    company: { en: "Morphy Digital Group", pt: "Morphy Digital Group" },
    period: { en: "Aug 2014 – Nov 2014", pt: "Ago 2014 – Nov 2014" },
    stakes: false,
    defaultOpen: false,
    tech: ["PHP"],
    bullets: {
      en: [
        "Full-stack web development using PHP ZendFramework, Bootstrap, jQuery, and HTML5.",
        "RESTful services for mobile applications.",
      ],
      pt: [
        "Desenvolvimento web full-stack com PHP ZendFramework, Bootstrap, jQuery e HTML5.",
        "Serviços RESTful para aplicações móveis.",
      ],
    },
  },
  {
    id: "totvs",
    role: { en: "Java Software Engineer", pt: "Engenheiro de Software Java" },
    company: { en: "TOTVS", pt: "TOTVS" },
    period: { en: "Apr 2011 – Nov 2011", pt: "Abr 2011 – Nov 2011" },
    stakes: false,
    defaultOpen: false,
    tech: ["Java", "JavaScript"],
    bullets: {
      en: [
        "Bug fixes and support on an EDM (Electronic Document Management) system built with Flex and Java EE.",
        "Front-end migration from Adobe Flex to web standards (HTML5/CSS/JS) using jQuery and YUI.",
        "RESTful API development using JBoss Resteasy (JAX-RS).",
      ],
      pt: [
        "Correção de bugs e suporte em sistema EDM (Gerenciamento Eletrônico de Documentos) com Flex e Java EE.",
        "Migração de frontend de Adobe Flex para padrões web (HTML5/CSS/JS) com jQuery e YUI.",
        "Desenvolvimento de API RESTful com JBoss Resteasy (JAX-RS).",
      ],
    },
  },
  {
    id: "dmg",
    role: { en: "Web Developer", pt: "Desenvolvedor Web" },
    company: { en: "DMG Digital Agency", pt: "DMG Digital Agency" },
    period: { en: "Feb 2010 – Apr 2011", pt: "Fev 2010 – Abr 2011" },
    stakes: false,
    defaultOpen: false,
    tech: ["PHP", "PostgreSQL", "JavaScript"],
    bullets: {
      en: [
        "Magento e-commerce customizations, plugins, and theme development.",
        "Object-oriented PHP5 development of a casino management system using ZendFramework, backed by PostgreSQL and Doctrine ORM.",
        "Sencha ExtJS front-end for a rich internet application (RIA).",
      ],
      pt: [
        "Customizações, plugins e temas para e-commerce Magento.",
        "Desenvolvimento PHP5 orientado a objetos de sistema de gerenciamento de cassino com ZendFramework, backend PostgreSQL e Doctrine ORM.",
        "Frontend Sencha ExtJS para aplicação rica para internet (RIA).",
      ],
    },
  },
  {
    id: "freelance",
    role: { en: "Web Developer", pt: "Desenvolvedor Web" },
    company: { en: "Self-Employed", pt: "Autônomo" },
    period: { en: "Jul 2005 – Feb 2010", pt: "Jul 2005 – Fev 2010" },
    stakes: false,
    defaultOpen: false,
    tech: ["PHP", "PostgreSQL", "JavaScript"],
    bullets: {
      en: [
        "On-demand application development using PHP ZendFramework, Doctrine ORM, PostgreSQL, MySQL, and ExtJS.",
        "Development and customization of websites and e-commerce using WordPress, Joomla, and Magento.",
        "Served various local businesses in Joinville: Izi Sistemas, Datasul, LDI Eletrônica Industrial, VonMuller Fotografia, and others.",
        "Notable builds: Social Well-Being management system for City Hall (DataSul partnership), EAD platform, email marketing system with bounce handling and analytics.",
      ],
      pt: [
        "Desenvolvimento de aplicações sob demanda com PHP ZendFramework, Doctrine ORM, PostgreSQL, MySQL e ExtJS.",
        "Desenvolvimento e customização de sites e e-commerces com WordPress, Joomla e Magento.",
        "Atendi diversas empresas de Joinville: Izi Sistemas, Datasul, LDI Eletrônica Industrial, VonMuller Fotografia, entre outras.",
        "Projetos notáveis: sistema de gestão de Assistência Social para a Prefeitura (parceria DataSul), plataforma EAD, sistema de e-mail marketing com tratamento de bounces e analytics.",
      ],
    },
  },
];

// ── Skills ────────────────────────────────────────────────

const SKILL_CATS = [
  {
    label: { en: "// languages", pt: "// linguagens" },
    items: ["TypeScript", "JavaScript", "Java", "PHP", "Python", "C#"],
  },
  {
    label: { en: "// frontend & ui", pt: "// frontend & ui" },
    items: ["React", "Next.js", "Tailwind", "Android"],
  },
  {
    label: { en: "// backend & infra", pt: "// backend & infra" },
    items: ["Node.js", ".NET", "AWS", "Docker", "Git"],
  },
  {
    label: { en: "// databases", pt: "// bancos de dados" },
    items: ["PostgreSQL", "MySQL", "SQL Server", "MongoDB"],
  },
];

// ── Education ─────────────────────────────────────────────

const EDUCATION = [
  {
    id: "masters",
    degree: {
      en: "Master's in Software Engineering",
      pt: "Mestrado em Engenharia de Software",
    },
    period: { en: "Jan 2020 — Incomplete", pt: "Jan 2020 — Incompleto" },
    institution: "Universidade Tecnológica Federal do Paraná (UTFPR)",
  },
  {
    id: "postgrad",
    degree: {
      en: "Postgraduate in Project Management",
      pt: "Pós-Graduação em Gerenciamento de Projetos",
    },
    period: { en: "Jan 2018 — Dec 2019", pt: "Jan 2018 — Dez 2019" },
    institution: "Universidade Cesumar (UNICESUMAR)",
  },
  {
    id: "bachelors",
    degree: {
      en: "Bachelor's in Computer Science",
      pt: "Bacharelado em Ciência da Computação",
    },
    period: { en: "Jan 2011 — Dec 2017", pt: "Jan 2011 — Dez 2017" },
    institution: "Universidade Cesumar (UDESC)",
  },
];

// ── Human languages ───────────────────────────────────────

const HUMAN_LANGS = [
  {
    name: { en: "English", pt: "Inglês" },
    level: { en: "Fluent · TOEFL B1", pt: "Fluente · TOEFL B1" },
  },
  {
    name: { en: "Portuguese", pt: "Português" },
    level: { en: "Native", pt: "Nativo" },
  },
  {
    name: { en: "Spanish", pt: "Espanhol" },
    level: { en: "Conversational", pt: "Conversação" },
  },
];

// ── Component ─────────────────────────────────────────────

export function ResumePage({ lang }: { lang: Lang }) {
  const pdfFile = lang === "pt" ? "Leonardo_LV_PT.pdf" : "Leonardo_LV_EN.pdf";

  return (
    <article className="lv-resume">

      {/* ── Header ── */}
      <header className="lv-resume-header">
        <div className="lv-resume-copy">
          <Kicker as="p">{lang === "pt" ? "// currículo" : "// résumé"}</Kicker>
          <h1 className="lv-resume-name">LEONARDO</h1>
          <p className="lv-resume-fullname">Lima de Vasconcellos</p>
          <p className="lv-resume-tagline">
            {lang === "pt"
              ? "O engenheiro que você quer quando o sistema realmente importa — e cresceu emaranhado."
              : "The engineer you want when the system actually matters — and has grown tangled."}
          </p>
          <div className="lv-resume-contact">
            <a href="mailto:leonardolimadevasconcellos@gmail.com">
              <Mail size={12} />
              leonardolimadevasconcellos@gmail.com
            </a>
            <span>
              <Phone size={12} />
              +55 41 99215-1301
            </span>
            <a
              href="https://linkedin.com/in/llvasconcellos"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/llvasconcellos
            </a>
            <span>
              <MapPin size={12} />
              {lang === "pt" ? "Joinville, SC, Brasil" : "Joinville, SC, Brazil"}
            </span>
          </div>
          <div className="lv-resume-actions">
            <a
              href={`/resume/${pdfFile}`}
              download
              className="lv-btn lv-btn-primary"
            >
              {lang === "pt" ? "Baixar PDF" : "Download PDF"} <Download size={15} />
            </a>
            <a
              href="mailto:leonardolimadevasconcellos@gmail.com"
              className="lv-btn lv-btn-ghost"
            >
              {lang === "pt" ? "Fale comigo" : "Get in touch"} <Mail size={15} />
            </a>
          </div>
        </div>
        <div className="lv-resume-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/leo_photo.jpg" alt="Photo of Leonardo" />
        </div>
      </header>

      {/* ── Experience ── */}
      <section className="lv-resume-section">
        <div className="lv-resume-section-head">
          <Kicker as="p">
            {lang === "pt" ? "// experiência profissional" : "// professional experience"}
          </Kicker>
          <h2 className="lv-resume-section-title">
            {lang === "pt" ? "Experiência" : "Experience"}
          </h2>
        </div>
        <div className="lv-exp-list">
          {EXPERIENCE.map((exp) => (
            <details key={exp.id} className="lv-exp-card" open={exp.defaultOpen}>
              <summary className="lv-exp-summary">
                <span className="lv-exp-role">
                  {exp.role[lang]}
                  {exp.stakes && (
                    <span className="lv-stakes-badge">
                      <ShieldAlert size={10} />
                      {lang === "pt" ? "missão crítica" : "mission-critical"}
                    </span>
                  )}
                </span>
                <span className="lv-exp-meta">
                  <span className="lv-exp-meta-company">{exp.company[lang]}</span>
                  <span className="lv-exp-meta-sep">·</span>
                  <span>{exp.period[lang]}</span>
                </span>
                <span className="lv-exp-chevron" aria-hidden="true">
                  <ChevronDown size={16} />
                </span>
              </summary>
              <div className="lv-exp-body">
                <ul className="lv-exp-bullets">
                  {exp.bullets[lang].map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
                {exp.tech.length > 0 && (
                  <div className="lv-exp-tech">
                    <span className="lv-exp-tech-lab">
                      {lang === "pt" ? "Tecnologias:" : "Built with:"}
                    </span>
                    {exp.tech.map((t) => (
                      <TechChip key={t}>{t}</TechChip>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="lv-resume-section">
        <div className="lv-resume-section-head">
          <Kicker as="p">{lang === "pt" ? "// habilidades" : "// skills"}</Kicker>
          <h2 className="lv-resume-section-title">
            {lang === "pt" ? "Habilidades" : "Skills"}
          </h2>
        </div>
        <div className="lv-resume-skills-grid">
          {SKILL_CATS.map((cat) => (
            <div key={cat.label.en} className="lv-resume-skill-cat">
              <div className="lv-resume-sub">{cat.label[lang]}</div>
              <div className="lv-resume-stack">
                {cat.items.map((name) => {
                  const logo = TECH_LOGOS[name];
                  return (
                    <div key={name} className="lv-resume-stack-cell" title={name}>
                      {logo && (
                        <span
                          className="lv-stack-logo"
                          style={{ backgroundImage: `url(${logo})` }}
                        />
                      )}
                      <span>{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Education + Languages ── */}
      <div className="lv-resume-bottom">
        <div>
          <div className="lv-resume-sub">
            {lang === "pt" ? "// educação" : "// education"}
          </div>
          {EDUCATION.map((edu) => (
            <div key={edu.id} className="lv-resume-edu-entry">
              <p className="lv-resume-edu-degree">{edu.degree[lang]}</p>
              <p className="lv-resume-edu-period">{edu.period[lang]}</p>
              <p className="lv-resume-edu-inst">{edu.institution}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="lv-resume-sub">
            {lang === "pt" ? "// idiomas" : "// languages"}
          </div>
          <div className="lv-resume-human-langs">
            {HUMAN_LANGS.map((l) => (
              <div key={l.name.en} className="lv-resume-hlang">
                <span className="lv-resume-hlang-name">{l.name[lang]}</span>
                <span className="lv-resume-hlang-level">{l.level[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MiniFooter />
    </article>
  );
}
