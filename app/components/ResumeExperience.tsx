"use client";
import { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp, Check } from "lucide-react";
import { TechChip } from "./Primitives";
import type { Lang } from "../data";

const XP_FILTERS = [
  "React", "Next.js", "Node.js", "TypeScript", "PHP",
  "Java", "Android", ".NET", "Python", "PostgreSQL",
];

const RT = {
  en: {
    xpH: "Experience", filterLab: "Filter by tech", all: "All",
    showing: "Showing", of: "of", roles: "roles", details: "details", hide: "hide",
  },
  pt: {
    xpH: "Experiência", filterLab: "Filtrar por tech", all: "Todas",
    showing: "Mostrando", of: "de", roles: "cargos", details: "detalhes", hide: "ocultar",
  },
};

interface XpEntry {
  id: string;
  stakes?: boolean;
  role: Record<Lang, string>;
  co: string | Record<Lang, string>;
  period: Record<Lang, string>;
  dur: Record<Lang, string>;
  tags: string[];
  tech: string[];
  bullets: Record<Lang, string[]>;
}

function pick(v: string | Record<string, string>, lang: string): string {
  if (v && typeof v === "object") return (v as Record<string, string>)[lang];
  return v as string;
}

const EXPERIENCE: XpEntry[] = [
  {
    id: "itajai", stakes: true,
    role: { en: "Senior Web Application Developer", pt: "Desenvolvedor Sênior de Aplicações Web" },
    co: "Prefeitura Municipal de Itajaí",
    period: { en: "Apr 2025 — Jan 2026", pt: "Abr 2025 — Jan 2026" },
    dur: { en: "9 mos", pt: "9 meses" },
    tags: ["React", "Next.js", "Node.js", "PostgreSQL"],
    tech: ["React", "Next.js", "Node.js", "PostgreSQL"],
    bullets: {
      en: [
        "Key role in the digital transformation of Brazil's top-ranked smart city, building full-stack citizen services.",
        "Seamless front-ends in React and Next.js over a high-concurrency Node.js backend and a highly-available PostgreSQL data layer.",
        "AI-assisted development with Cursor and Claude Code.",
      ],
      pt: [
        "Papel-chave na transformação digital da cidade mais bem classificada como Cidade Inteligente do Brasil, com aplicações full-stack para o cidadão.",
        "Front-ends fluidos em React e Next.js sobre um backend Node.js de alta concorrência e uma camada de dados PostgreSQL de alta disponibilidade.",
        "Desenvolvimento assistido por IA com Cursor e Claude Code.",
      ],
    },
  },
  {
    id: "devhouse2",
    role: { en: "Senior Software Engineer", pt: "Engenheiro de Software Sênior" },
    co: "DevHouse",
    period: { en: "Jan 2024 — Apr 2025", pt: "Jan 2024 — Abr 2025" },
    dur: { en: "1 yr 3 mos", pt: "1 ano 3 meses" },
    tags: ["React", "Next.js", "Node.js", "TypeScript"],
    tech: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind"],
    bullets: {
      en: [
        "AI-assisted builds of modern client sites with TypeScript, React, Next.js, Zustand, Zod, ShadCN and TailwindCSS.",
        "RESTful APIs with Node.js, Express and Drizzle ORM.",
      ],
      pt: [
        "Construção assistida por IA de sites modernos com TypeScript, React, Next.js, Zustand, Zod, ShadCN e TailwindCSS.",
        "APIs RESTful com Node.js, Express e Drizzle ORM.",
      ],
    },
  },
  {
    id: "eoa", stakes: true,
    role: { en: "Senior Full-Stack Software Engineer", pt: "Engenheiro de Software Full-Stack Sênior" },
    co: "Email on Acid",
    period: { en: "Sep 2019 — Sep 2023", pt: "Set 2019 — Set 2023" },
    dur: { en: "4 yrs", pt: "4 anos" },
    tags: ["React", "Node.js", "PHP", "PostgreSQL"],
    tech: ["React", "Node.js", "PHP", "PostgreSQL", "MongoDB"],
    bullets: {
      en: [
        "Architected and scaled a full-stack SaaS cloud app across React, Node.js (Express) and PHP (CodeIgniter) for high-concurrency environments.",
        "Spearheaded a critical legacy refactor — big gains in scalability and readability while slashing technical debt.",
        "Optimized data with Redis caching and a hybrid PostgreSQL + MongoDB architecture; cut API latency and page-load times.",
      ],
      pt: [
        "Arquitetei e escalei um SaaS full-stack em nuvem com React, Node.js (Express) e PHP (CodeIgniter) para ambientes de alta concorrência.",
        "Liderei um refatoramento crítico de legado — ganhos de escalabilidade e legibilidade, reduzindo drasticamente a dívida técnica.",
        "Otimizei dados com cache Redis e arquitetura híbrida PostgreSQL + MongoDB; reduzi latência de API e tempos de carregamento.",
      ],
    },
  },
  {
    id: "bv", stakes: true,
    role: { en: "Full-Stack Software Engineer", pt: "Engenheiro de Software Full-Stack" },
    co: "Bureau Veritas Group",
    period: { en: "Mar 2019 — Sep 2019", pt: "Mar 2019 — Set 2019" },
    dur: { en: "6 mos", pt: "6 meses" },
    tags: ["React", "PHP", "PostgreSQL"],
    tech: ["React", "PHP", "PostgreSQL", "AWS"],
    bullets: {
      en: [
        "Built full-stack features for SurvAgri©, a mission-critical grain-shipment platform used worldwide — React + a distributed Laravel (PHP) REST API on PostgreSQL.",
        "Led the refactor of KerpWeb, an ERP and agricultural-audit system used by BASF and Bayer, modernizing the transgenic-seed audit workflow.",
        "Ran CI/CD pipelines on Bitbucket, deploying on AWS.",
      ],
      pt: [
        "Desenvolvi funcionalidades full-stack do SurvAgri©, plataforma crítica de embarque de grãos usada mundialmente — React + API REST Laravel (PHP) distribuída em PostgreSQL.",
        "Liderei o refatoramento do KerpWeb, ERP e auditoria agrícola usado por BASF e Bayer, modernizando o fluxo de auditoria de sementes transgênicas.",
        "Gerenciei pipelines CI/CD no Bitbucket, com deploy na AWS.",
      ],
    },
  },
  {
    id: "devhouse1",
    role: { en: "Senior Software Engineer", pt: "Engenheiro de Software Sênior" },
    co: "DevHouse",
    period: { en: "Nov 2011 — Mar 2019", pt: "Nov 2011 — Mar 2019" },
    dur: { en: "7 yrs 4 mos", pt: "7 anos 4 meses" },
    tags: ["React", "Node.js", "PHP", ".NET", "PostgreSQL"],
    tech: ["React", "Node.js", "PHP", "C#", "PostgreSQL"],
    bullets: {
      en: [
        "Web applications with React, Node.js and PostgreSQL.",
        "Sites and e-commerce on WordPress, Joomla and Magento (plugins, themes, extensions); PHP and ASP.NET (C#) apps.",
        "Taught Adobe Flex courses.",
      ],
      pt: [
        "Aplicações web com React, Node.js e PostgreSQL.",
        "Sites e e-commerce em WordPress, Joomla e Magento (plugins, temas, extensões); aplicações em PHP e ASP.NET (C#).",
        "Ministrei cursos de Adobe Flex.",
      ],
    },
  },
  {
    id: "msf", stakes: true,
    role: { en: "Tech Lead · Java/Android Engineer", pt: "Líder Técnico · Engenheiro Java/Android" },
    co: "Doctors Without Borders (MSF)",
    period: { en: "Sep 2015 — Mar 2016", pt: "Set 2015 — Mar 2016" },
    dur: { en: "6 mos", pt: "6 meses" },
    tags: ["Java", "Android", "Python"],
    tech: ["Android", "Java", "Python", "MySQL"],
    bullets: {
      en: [
        "Android/Java developer on Project Buendia — an Android app + Linux OpenMRS server helping clinicians fight Ebola and malnutrition.",
        "Joined as a volunteer; selected from 1,000+ candidates, then elected technical lead — code reviews, technical guidance, features and fixes.",
        "Project Buendia is an open-source medical-record system created by MSF, Google Crisis Response and volunteers for the 2014 West-Africa Ebola epidemic.",
      ],
      pt: [
        "Desenvolvedor Android/Java no Projeto Buendia — app Android + servidor Linux OpenMRS para auxiliar clínicos no combate ao Ebola e à desnutrição.",
        "Entrei como voluntário; selecionado entre mais de 1.000 candidatos e eleito líder técnico — revisões de código, orientação técnica, features e correções.",
        "O Projeto Buendia é um prontuário eletrônico open-source criado por MSF, Google Crisis Response e voluntários para a epidemia de Ebola na África Ocidental em 2014.",
      ],
    },
  },
  {
    id: "stock",
    role: { en: "Java Software Engineer", pt: "Engenheiro de Software Java" },
    co: "Stock & Info",
    period: { en: "Apr 2015 — Jul 2015", pt: "Abr 2015 — Jul 2015" },
    dur: { en: "3 mos", pt: "3 meses" },
    tags: ["Java", ".NET"],
    tech: ["Java", "C#", "JavaScript"],
    bullets: {
      en: [
        "Java RESTful web services with JBoss RESTEasy; front-end in HTML5/CSS3, Bootstrap and jQuery.",
        "Built .NET (C#) helper and version-control apps for a FileMaker database.",
      ],
      pt: [
        "Web services RESTful em Java com JBoss RESTEasy; front-end em HTML5/CSS3, Bootstrap e jQuery.",
        "Aplicações auxiliares e de controle de versão em .NET (C#) para banco FileMaker.",
      ],
    },
  },
  {
    id: "bravi", stakes: true,
    role: { en: "Software Engineer", pt: "Engenheiro de Software" },
    co: "Bravi Software",
    period: { en: "Nov 2014 — Feb 2015", pt: "Nov 2014 — Fev 2015" },
    dur: { en: "3 mos", pt: "3 meses" },
    tags: [".NET"],
    tech: ["C#", ".NET"],
    bullets: {
      en: [
        "C# and .NET WPF developer for the world's largest educational software.",
        "Outsourced engineer to Tribaltech, United Kingdom.",
      ],
      pt: [
        "Desenvolvedor C# e .NET WPF para o maior software educacional do mundo.",
        "Engenheiro terceirizado para a Tribaltech, Reino Unido.",
      ],
    },
  },
  {
    id: "morphy",
    role: { en: "Web Developer", pt: "Desenvolvedor Web" },
    co: "Morphy Digital Group",
    period: { en: "Aug 2014 — Nov 2014", pt: "Ago 2014 — Nov 2014" },
    dur: { en: "4 mos", pt: "4 meses" },
    tags: ["PHP"],
    tech: ["PHP", "JavaScript"],
    bullets: {
      en: [
        "Full-stack web with PHP ZendFramework, Bootstrap, jQuery and HTML5.",
        "RESTful services for mobile applications.",
      ],
      pt: [
        "Web full-stack com PHP ZendFramework, Bootstrap, jQuery e HTML5.",
        "Serviços RESTful para aplicações móveis.",
      ],
    },
  },
  {
    id: "totvs",
    role: { en: "Java Software Engineer", pt: "Engenheiro de Software Java" },
    co: "TOTVS",
    period: { en: "Apr 2011 — Nov 2011", pt: "Abr 2011 — Nov 2011" },
    dur: { en: "7 mos", pt: "7 meses" },
    tags: ["Java"],
    tech: ["Java", "JavaScript"],
    bullets: {
      en: [
        "Maintained an EDM (Electronic Document Management) system built with Flex and Java EE.",
        "Migrated the front-end from Adobe Flex to web standards (HTML5/CSS/JS) using jQuery and YUI; RESTful API with JBoss RESTEasy.",
      ],
      pt: [
        "Manutenção de um sistema EDM (Gestão Eletrônica de Documentos) em Flex e Java EE.",
        "Migração do front-end de Adobe Flex para padrões web (HTML5/CSS/JS) com jQuery e YUI; API RESTful com JBoss RESTEasy.",
      ],
    },
  },
  {
    id: "dmg",
    role: { en: "Web Developer", pt: "Desenvolvedor Web" },
    co: "DMG Digital Agency",
    period: { en: "Feb 2010 — Apr 2011", pt: "Fev 2010 — Abr 2011" },
    dur: { en: "1 yr 2 mos", pt: "1 ano 2 meses" },
    tags: ["PHP", "PostgreSQL"],
    tech: ["PHP", "JavaScript", "PostgreSQL"],
    bullets: {
      en: [
        "Magento e-commerce customizations, plugins and themes.",
        "OO PHP5 casino-management software — ZendFramework REST backend, Sencha ExtJS RIA front-end, PostgreSQL with Doctrine ORM.",
      ],
      pt: [
        "Customizações, plugins e temas para e-commerce Magento.",
        "Software de gestão de cassino em PHP5 OO — backend REST ZendFramework, front-end RIA Sencha ExtJS, PostgreSQL com Doctrine ORM.",
      ],
    },
  },
  {
    id: "self",
    role: { en: "Web Developer · Freelance", pt: "Desenvolvedor Web · Autônomo" },
    co: { en: "Self-Employed", pt: "Autônomo" },
    period: { en: "Jul 2005 — Feb 2010", pt: "Jul 2005 — Fev 2010" },
    dur: { en: "4 yrs 7 mos", pt: "4 anos 7 meses" },
    tags: ["PHP", "PostgreSQL"],
    tech: ["PHP", "JavaScript", "PostgreSQL", "MySQL"],
    bullets: {
      en: [
        "On-demand applications with ExtJS, PHP ZendFramework, Doctrine ORM, PostgreSQL and MySQL; sites and e-commerce on WordPress, Joomla and Magento.",
        "Served small and mid-size businesses across the Joinville region.",
        "Built a city social-welfare management system, an e-learning platform, a Squid-proxy admin panel, a full CMS, a bulk email-marketing platform with bounce handling and click stats, and a content-protecting web browser.",
      ],
      pt: [
        "Aplicações sob demanda com ExtJS, PHP ZendFramework, Doctrine ORM, PostgreSQL e MySQL; sites e e-commerce em WordPress, Joomla e Magento.",
        "Atendi pequenas e médias empresas da região de Joinville.",
        "Construí um sistema de gestão da Assistência Social, uma plataforma EAD, um painel admin de proxy Squid, um CMS completo, uma plataforma de e-mail marketing em massa com tratamento de bounces e estatísticas de cliques, e um navegador que protegia conteúdo restrito.",
      ],
    },
  },
];

export function ResumeExperience({ lang }: { lang: Lang }) {
  const t = RT[lang];
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({
    itajai: true, devhouse2: true, eoa: true, msf: true,
  });

  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const matches = (x: XpEntry) => !filter || x.tags.includes(filter);
  const shown = EXPERIENCE.filter(matches).length;

  return (
    <>
      <div className="lv-resume-xp-head">
        <h2 className="lv-resume-h">{t.xpH}</h2>
        <div className="lv-xp-filter">
          <span className="lv-xp-filter-lab">{t.filterLab}</span>
          <button
            type="button"
            className={`lv-xp-chip${!filter ? " is-on" : ""}`}
            onClick={() => setFilter(null)}
          >
            {t.all}
          </button>
          {XP_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`lv-xp-chip${filter === f ? " is-on" : ""}`}
              onClick={() => setFilter(filter === f ? null : f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="lv-xp-count">
          {t.showing} <strong>{shown}</strong> {t.of} {EXPERIENCE.length} {t.roles}
        </span>
      </div>

      <div className="lv-xp-list">
        {EXPERIENCE.map((x) => {
          const dim = !matches(x);
          const isOpen = !!open[x.id];
          return (
            <article
              key={x.id}
              className={`lv-xp${x.stakes ? " is-stakes" : ""}${dim ? " is-dim" : ""}`}
            >
              <div className="lv-xp-rail">
                <div className="lv-xp-dot" />
                <span className="lv-xp-period">{x.period[lang]}</span>
                <span className="lv-xp-dur">{x.dur[lang]}</span>
              </div>
              <div className="lv-xp-main">
                <button
                  type="button"
                  className="lv-xp-head"
                  onClick={() => toggle(x.id)}
                  aria-expanded={isOpen}
                >
                  <span className="lv-xp-headtext">
                    <span className="lv-xp-role">
                      {x.stakes && (
                        <span className="lv-stakes">
                          <ShieldAlert size={17} />
                        </span>
                      )}
                      {pick(x.role, lang)}
                    </span>
                    <span className="lv-xp-co">{pick(x.co, lang)}</span>
                  </span>
                  <span className="lv-xp-toggle">
                    {isOpen ? t.hide : t.details}
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </button>
                <div className="lv-xp-tech">
                  {x.tech.map((tch) => (
                    <TechChip key={tch}>{tch}</TechChip>
                  ))}
                </div>
                {isOpen && (
                  <ul className="lv-xp-bullets">
                    {x.bullets[lang].map((b, i) => (
                      <li key={i}>
                        <Check size={15} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
