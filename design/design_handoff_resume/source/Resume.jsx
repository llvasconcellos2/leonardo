/* global React, Kicker, TechChip, lucide */
// ── LV Portfolio · Résumé (the web version — does what paper can't) ──
// Bilingual. Live contact links, filterable career history, expandable
// entries, an interactive "five eras" arc, and a language-aware PDF download.
const { useState: useResumeState } = React;

const RESUME_PDF = {
  en: 'assets/Leonardo-Vasconcellos-Resume-EN.pdf',
  pt: 'assets/Leonardo-Vasconcellos-CV-PT.pdf',
};

// canonical, filterable tech tags (the breadth-across-eras story)
const XP_FILTERS = ['React', 'Next.js', 'Node.js', 'TypeScript', 'PHP', 'Java', 'Android', '.NET', 'Python', 'PostgreSQL'];

const EXPERIENCE = [
  {
    id: 'itajai', stakes: true,
    role: { en: 'Senior Web Application Developer', pt: 'Desenvolvedor Sênior de Aplicações Web' },
    co: 'Prefeitura Municipal de Itajaí',
    period: { en: 'Apr 2025 — Jan 2026', pt: 'Abr 2025 — Jan 2026' },
    dur: { en: '9 mos', pt: '9 meses' },
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    tech: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    bullets: {
      en: [
        "Key role in the digital transformation of Brazil's top-ranked smart city, building full-stack citizen services.",
        'Seamless front-ends in React and Next.js over a high-concurrency Node.js backend and a highly-available PostgreSQL data layer.',
        'AI-assisted development with Cursor and Claude Code.',
      ],
      pt: [
        'Papel-chave na transformação digital da cidade mais bem classificada como Cidade Inteligente do Brasil, com aplicações full-stack para o cidadão.',
        'Front-ends fluidos em React e Next.js sobre um backend Node.js de alta concorrência e uma camada de dados PostgreSQL de alta disponibilidade.',
        'Desenvolvimento assistido por IA com Cursor e Claude Code.',
      ],
    },
  },
  {
    id: 'devhouse2',
    role: { en: 'Senior Software Engineer', pt: 'Engenheiro de Software Sênior' },
    co: 'DevHouse',
    period: { en: 'Jan 2024 — Apr 2025', pt: 'Jan 2024 — Abr 2025' },
    dur: { en: '1 yr 3 mos', pt: '1 ano 3 meses' },
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript'],
    tech: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind'],
    bullets: {
      en: [
        'AI-assisted builds of modern client sites with TypeScript, React, Next.js, Zustand, Zod, ShadCN and TailwindCSS.',
        'RESTful APIs with Node.js, Express and Drizzle ORM.',
      ],
      pt: [
        'Construção assistida por IA de sites modernos com TypeScript, React, Next.js, Zustand, Zod, ShadCN e TailwindCSS.',
        'APIs RESTful com Node.js, Express e Drizzle ORM.',
      ],
    },
  },
  {
    id: 'eoa', stakes: true,
    role: { en: 'Senior Full-Stack Software Engineer', pt: 'Engenheiro de Software Full-Stack Sênior' },
    co: 'Email on Acid',
    period: { en: 'Sep 2019 — Sep 2023', pt: 'Set 2019 — Set 2023' },
    dur: { en: '4 yrs', pt: '4 anos' },
    tags: ['React', 'Node.js', 'PHP', 'PostgreSQL'],
    tech: ['React', 'Node.js', 'PHP', 'PostgreSQL', 'MongoDB'],
    bullets: {
      en: [
        'Architected and scaled a full-stack SaaS cloud app across React, Node.js (Express) and PHP (CodeIgniter) for high-concurrency environments.',
        'Spearheaded a critical legacy refactor — big gains in scalability and readability while slashing technical debt.',
        'Optimized data with Redis caching and a hybrid PostgreSQL + MongoDB architecture; cut API latency and page-load times.',
      ],
      pt: [
        'Arquitetei e escalei um SaaS full-stack em nuvem com React, Node.js (Express) e PHP (CodeIgniter) para ambientes de alta concorrência.',
        'Liderei um refatoramento crítico de legado — ganhos de escalabilidade e legibilidade, reduzindo drasticamente a dívida técnica.',
        'Otimizei dados com cache Redis e arquitetura híbrida PostgreSQL + MongoDB; reduzi latência de API e tempos de carregamento.',
      ],
    },
  },
  {
    id: 'bv', stakes: true,
    role: { en: 'Full-Stack Software Engineer', pt: 'Engenheiro de Software Full-Stack' },
    co: 'Bureau Veritas Group',
    period: { en: 'Mar 2019 — Sep 2019', pt: 'Mar 2019 — Set 2019' },
    dur: { en: '6 mos', pt: '6 meses' },
    tags: ['React', 'PHP', 'PostgreSQL'],
    tech: ['React', 'PHP', 'PostgreSQL', 'AWS'],
    bullets: {
      en: [
        'Built full-stack features for SurvAgri©, a mission-critical grain-shipment platform used worldwide — React + a distributed Laravel (PHP) REST API on PostgreSQL.',
        'Led the refactor of KerpWeb, an ERP and agricultural-audit system used by BASF and Bayer, modernizing the transgenic-seed audit workflow.',
        'Ran CI/CD pipelines on Bitbucket, deploying on AWS.',
      ],
      pt: [
        'Desenvolvi funcionalidades full-stack do SurvAgri©, plataforma crítica de embarque de grãos usada mundialmente — React + API REST Laravel (PHP) distribuída em PostgreSQL.',
        'Liderei o refatoramento do KerpWeb, ERP e auditoria agrícola usado por BASF e Bayer, modernizando o fluxo de auditoria de sementes transgênicas.',
        'Gerenciei pipelines CI/CD no Bitbucket, com deploy na AWS.',
      ],
    },
  },
  {
    id: 'devhouse1',
    role: { en: 'Senior Software Engineer', pt: 'Engenheiro de Software Sênior' },
    co: 'DevHouse',
    period: { en: 'Nov 2011 — Mar 2019', pt: 'Nov 2011 — Mar 2019' },
    dur: { en: '7 yrs 4 mos', pt: '7 anos 4 meses' },
    tags: ['React', 'Node.js', 'PHP', '.NET', 'PostgreSQL'],
    tech: ['React', 'Node.js', 'PHP', 'C#', 'PostgreSQL'],
    bullets: {
      en: [
        'Web applications with React, Node.js and PostgreSQL.',
        'Sites and e-commerce on WordPress, Joomla and Magento (plugins, themes, extensions); PHP and ASP.NET (C#) apps.',
        'Taught Adobe Flex courses.',
      ],
      pt: [
        'Aplicações web com React, Node.js e PostgreSQL.',
        'Sites e e-commerce em WordPress, Joomla e Magento (plugins, temas, extensões); aplicações em PHP e ASP.NET (C#).',
        'Ministrei cursos de Adobe Flex.',
      ],
    },
  },
  {
    id: 'msf', stakes: true,
    role: { en: 'Tech Lead · Java/Android Engineer', pt: 'Líder Técnico · Engenheiro Java/Android' },
    co: 'Doctors Without Borders (MSF)',
    period: { en: 'Sep 2015 — Mar 2016', pt: 'Set 2015 — Mar 2016' },
    dur: { en: '6 mos', pt: '6 meses' },
    tags: ['Java', 'Android', 'Python'],
    tech: ['Android', 'Java', 'Python', 'MySQL'],
    bullets: {
      en: [
        'Android/Java developer on Project Buendia — an Android app + Linux OpenMRS server helping clinicians fight Ebola and malnutrition.',
        'Joined as a volunteer; selected from 1,000+ candidates, then elected technical lead — code reviews, technical guidance, features and fixes.',
        'Project Buendia is an open-source medical-record system created by MSF, Google Crisis Response and volunteers for the 2014 West-Africa Ebola epidemic.',
      ],
      pt: [
        'Desenvolvedor Android/Java no Projeto Buendia — app Android + servidor Linux OpenMRS para auxiliar clínicos no combate ao Ebola e à desnutrição.',
        'Entrei como voluntário; selecionado entre mais de 1.000 candidatos e eleito líder técnico — revisões de código, orientação técnica, features e correções.',
        'O Projeto Buendia é um prontuário eletrônico open-source criado por MSF, Google Crisis Response e voluntários para a epidemia de Ebola na África Ocidental em 2014.',
      ],
    },
  },
  {
    id: 'stock',
    role: { en: 'Java Software Engineer', pt: 'Engenheiro de Software Java' },
    co: 'Stock & Info',
    period: { en: 'Apr 2015 — Jul 2015', pt: 'Abr 2015 — Jul 2015' },
    dur: { en: '3 mos', pt: '3 meses' },
    tags: ['Java', '.NET'],
    tech: ['Java', 'C#', 'JavaScript'],
    bullets: {
      en: [
        'Java RESTful web services with JBoss RESTEasy; front-end in HTML5/CSS3, Bootstrap and jQuery.',
        'Built .NET (C#) helper and version-control apps for a FileMaker database.',
      ],
      pt: [
        'Web services RESTful em Java com JBoss RESTEasy; front-end em HTML5/CSS3, Bootstrap e jQuery.',
        'Aplicações auxiliares e de controle de versão em .NET (C#) para banco FileMaker.',
      ],
    },
  },
  {
    id: 'bravi', stakes: true,
    role: { en: 'Software Engineer', pt: 'Engenheiro de Software' },
    co: 'Bravi Software',
    period: { en: 'Nov 2014 — Feb 2015', pt: 'Nov 2014 — Fev 2015' },
    dur: { en: '3 mos', pt: '3 meses' },
    tags: ['.NET'],
    tech: ['C#', '.NET'],
    bullets: {
      en: [
        "C# and .NET WPF developer for the world's largest educational software.",
        'Outsourced engineer to Tribaltech, United Kingdom.',
      ],
      pt: [
        'Desenvolvedor C# e .NET WPF para o maior software educacional do mundo.',
        'Engenheiro terceirizado para a Tribaltech, Reino Unido.',
      ],
    },
  },
  {
    id: 'morphy',
    role: { en: 'Web Developer', pt: 'Desenvolvedor Web' },
    co: 'Morphy Digital Group',
    period: { en: 'Aug 2014 — Nov 2014', pt: 'Ago 2014 — Nov 2014' },
    dur: { en: '4 mos', pt: '4 meses' },
    tags: ['PHP'],
    tech: ['PHP', 'JavaScript'],
    bullets: {
      en: [
        'Full-stack web with PHP ZendFramework, Bootstrap, jQuery and HTML5.',
        'RESTful services for mobile applications.',
      ],
      pt: [
        'Web full-stack com PHP ZendFramework, Bootstrap, jQuery e HTML5.',
        'Serviços RESTful para aplicações móveis.',
      ],
    },
  },
  {
    id: 'totvs',
    role: { en: 'Java Software Engineer', pt: 'Engenheiro de Software Java' },
    co: 'TOTVS',
    period: { en: 'Apr 2011 — Nov 2011', pt: 'Abr 2011 — Nov 2011' },
    dur: { en: '7 mos', pt: '7 meses' },
    tags: ['Java'],
    tech: ['Java', 'JavaScript'],
    bullets: {
      en: [
        'Maintained an EDM (Electronic Document Management) system built with Flex and Java EE.',
        'Migrated the front-end from Adobe Flex to web standards (HTML5/CSS/JS) using jQuery and YUI; RESTful API with JBoss RESTEasy.',
      ],
      pt: [
        'Manutenção de um sistema EDM (Gestão Eletrônica de Documentos) em Flex e Java EE.',
        'Migração do front-end de Adobe Flex para padrões web (HTML5/CSS/JS) com jQuery e YUI; API RESTful com JBoss RESTEasy.',
      ],
    },
  },
  {
    id: 'dmg',
    role: { en: 'Web Developer', pt: 'Desenvolvedor Web' },
    co: 'DMG Digital Agency',
    period: { en: 'Feb 2010 — Apr 2011', pt: 'Fev 2010 — Abr 2011' },
    dur: { en: '1 yr 2 mos', pt: '1 ano 2 meses' },
    tags: ['PHP', 'PostgreSQL'],
    tech: ['PHP', 'JavaScript', 'PostgreSQL'],
    bullets: {
      en: [
        'Magento e-commerce customizations, plugins and themes.',
        'OO PHP5 casino-management software — ZendFramework REST backend, Sencha ExtJS RIA front-end, PostgreSQL with Doctrine ORM.',
      ],
      pt: [
        'Customizações, plugins e temas para e-commerce Magento.',
        'Software de gestão de cassino em PHP5 OO — backend REST ZendFramework, front-end RIA Sencha ExtJS, PostgreSQL com Doctrine ORM.',
      ],
    },
  },
  {
    id: 'self',
    role: { en: 'Web Developer · Freelance', pt: 'Desenvolvedor Web · Autônomo' },
    co: { en: 'Self-Employed', pt: 'Autônomo' },
    period: { en: 'Jul 2005 — Feb 2010', pt: 'Jul 2005 — Fev 2010' },
    dur: { en: '4 yrs 7 mos', pt: '4 anos 7 meses' },
    tags: ['PHP', 'PostgreSQL'],
    tech: ['PHP', 'JavaScript', 'PostgreSQL', 'MySQL'],
    bullets: {
      en: [
        'On-demand applications with ExtJS, PHP ZendFramework, Doctrine ORM, PostgreSQL and MySQL; sites and e-commerce on WordPress, Joomla and Magento.',
        'Served small and mid-size businesses across the Joinville region.',
        'Built a city social-welfare management system, an e-learning platform, a Squid-proxy admin panel, a full CMS, a bulk email-marketing platform with bounce handling and click stats, and a content-protecting web browser.',
      ],
      pt: [
        'Aplicações sob demanda com ExtJS, PHP ZendFramework, Doctrine ORM, PostgreSQL e MySQL; sites e e-commerce em WordPress, Joomla e Magento.',
        'Atendi pequenas e médias empresas da região de Joinville.',
        'Construí um sistema de gestão da Assistência Social, uma plataforma EAD, um painel admin de proxy Squid, um CMS completo, uma plataforma de e-mail marketing em massa com tratamento de bounces e estatísticas, e um navegador que protegia conteúdo restrito.',
      ],
    },
  },
];

const RES_ERAS = [
  { y: '2005', label: { en: 'Flash · Flex', pt: 'Flash · Flex' } },
  { y: '2008', label: { en: 'PHP · Zend', pt: 'PHP · Zend' } },
  { y: '2011', label: { en: 'Java · Android', pt: 'Java · Android' } },
  { y: '2014', label: { en: '.NET · C#', pt: '.NET · C#' } },
  { y: '2019', label: { en: 'React · Next · AI', pt: 'React · Next · IA' }, now: true },
];

const RES_SKILLS = {
  core: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Java', 'PHP', 'C#', 'PostgreSQL', 'Python', 'Android', 'MySQL', 'Tailwind'],
  groups: [
    {
      label: { en: 'languages', pt: 'linguagens' },
      items: ['TypeScript', 'JavaScript', 'Java', 'PHP', 'Python', 'C#', 'HTML', 'CSS'],
    },
    {
      label: { en: 'frameworks & tools', pt: 'frameworks & ferramentas' },
      items: ['React', 'Next.js', 'Node.js', 'Nest.js', 'Zustand', 'React Query', 'TailwindCSS', 'ShadCN', 'Zod', 'Drizzle ORM', 'Better Auth', 'Jest', 'Java Spring', 'JBoss RESTEasy', 'Laravel', 'ZendFramework', 'Bootstrap', 'jQuery', 'WordPress', 'Magento', 'Git'],
    },
    {
      label: { en: 'databases', pt: 'bancos de dados' },
      items: ['PostgreSQL', 'MySQL', 'MSSQL', 'MongoDB', 'Redis', 'Oracle'],
    },
    {
      label: { en: 'methodologies', pt: 'metodologias' },
      items: ['Agile', 'Scrum', 'XP', 'Clean Code'],
    },
  ],
};

const SPOKEN = [
  { name: { en: 'Portuguese', pt: 'Português' }, level: { en: 'Native', pt: 'Nativo' }, pct: 100 },
  { name: { en: 'English', pt: 'Inglês' }, level: { en: 'Fluent · TOEFL B1', pt: 'Fluente · TOEFL B1' }, pct: 88 },
  { name: { en: 'Spanish', pt: 'Espanhol' }, level: { en: 'Conversational', pt: 'Conversação · Intermediário' }, pct: 55 },
];

const EDUCATION = [
  {
    deg: { en: "Master's, Software Engineering", pt: 'Mestrado em Engenharia de Software' },
    school: 'UTFPR', when: { en: '2020 · incomplete', pt: '2020 · incompleto' },
  },
  {
    deg: { en: 'Postgraduate, Project Management', pt: 'Pós-graduação em Gerência de Projetos' },
    school: 'UNICESUMAR', when: { en: '2018 — 2019', pt: '2018 — 2019' },
  },
  {
    deg: { en: "Bachelor's, Computer Science", pt: 'Bacharelado em Ciência da Computação' },
    school: 'UDESC', when: { en: '2011 — 2017', pt: '2011 — 2017' },
  },
];

const RT = {
  en: {
    kicker: '// résumé · curriculum vitae',
    role: 'Senior Full-Stack Engineer',
    location: 'Joinville · Santa Catarina · Brazil',
    summary: "I'm a senior full-stack engineer who's been shipping for the web since 2005 — around 70 projects across five eras of the technology. I was elected technical lead on an Ebola-response records system with Doctors Without Borders, helped scale high-concurrency SaaS at Email on Acid, and contributed to Brazil's top-ranked smart city in Itajaí. My specialty is the systems where failure has real consequences: I take them — mission-critical, often tangled — and make them scale, clean and fast and built to last. I'm still hands-on every day, now AI-assisted, and I work in both English and Portuguese. Off the clock I play bass, drums, and guitar — same discipline and timing, different instrument.",
    downloadThis: 'Download PDF', other: 'Versão em Português', pdfNote: 'Print-ready PDF · updated 2026',
    stats: [['~20', 'years shipping'], ['~70', 'projects'], ['5', 'tech eras'], ['12', 'roles']],
    erasH: '// five eras of the web — still writing code', xpH: 'Experience',
    filterLab: 'Filter by tech', all: 'All', showing: 'Showing', of: 'of', roles: 'roles', details: 'details', hide: 'hide',
    skillsH: 'Skills', coreH: '// core stack', eduH: 'Education', langH: 'Languages', linksH: 'Links', backHome: 'Back to portfolio',
  },
  pt: {
    kicker: '// currículo · curriculum vitae',
    role: 'Engenheiro de Software Full-Stack Sênior',
    location: 'Joinville · Santa Catarina · Brasil',
    summary: 'Sou engenheiro de software full-stack sênior e desenvolvo para a web desde 2005 — cerca de 70 projetos ao longo de cinco eras da tecnologia. Fui eleito líder técnico de um sistema de prontuários para o combate ao Ebola com os Médicos Sem Fronteiras, ajudei a escalar SaaS de alta concorrência na Email on Acid e contribuí para a cidade inteligente mais bem classificada do Brasil, em Itajaí. Eu me especializo em sistemas em que a falha tem consequências reais: pego os mais críticos e complexos e os transformo em soluções escaláveis — limpas, rápidas e feitas para durar. Continuo com a mão no código todos os dias, agora com auxílio de IA, e trabalho em português e inglês. Fora do expediente, toco baixo, bateria e guitarra — mesma disciplina e timing, outro instrumento.',
    downloadThis: 'Baixar PDF', other: 'English version', pdfNote: 'PDF pronto para impressão · atualizado em 2026',
    stats: [['~20', 'anos de carreira'], ['~70', 'projetos'], ['5', 'eras de tecnologia'], ['12', 'cargos']],
    erasH: '// cinco eras da web — ainda escrevendo código', xpH: 'Experiência',
    filterLab: 'Filtrar por tech', all: 'Todas', showing: 'Mostrando', of: 'de', roles: 'cargos', details: 'detalhes', hide: 'ocultar',
    skillsH: 'Habilidades', coreH: '// stack principal', eduH: 'Formação', langH: 'Idiomas', linksH: 'Links', backHome: 'Voltar ao portfólio',
  },
};

const LINKS = [
  { icon: 'github', label: 'github.com/llvasconcellos', href: 'https://github.com/llvasconcellos' },
  { icon: 'github', label: 'github.com/llvasconcellos2', href: 'https://github.com/llvasconcellos2' },
  { icon: 'globe', label: 'leonardo-vasconcellos.vercel.app', href: 'https://leonardo-vasconcellos.vercel.app' },
];

function pick(v, lang) { return v && typeof v === 'object' && !Array.isArray(v) ? v[lang] : v; }

function ResumeView({ lang, go }) {
  const t = RT[lang];
  const [filter, setFilter] = useResumeState(null);
  // recent + marquee roles expanded by default
  const [open, setOpen] = useResumeState({ itajai: true, devhouse2: true, eoa: true, msf: true });
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  const matches = (x) => !filter || x.tags.includes(filter);
  const shown = EXPERIENCE.filter(matches).length;

  return (
    <div className="lv-resume">
      <button className="lv-link-arrow lv-back" onClick={() => go('home')}>
        <i data-lucide="arrow-left"></i>{t.backHome}
      </button>

      {/* ── header ── */}
      <header className="lv-resume-head">
        <div className="lv-resume-head-main">
          <Kicker className="lv-resume-kicker">{t.kicker}</Kicker>
          <h1 className="lv-resume-name">Leonardo Lima de Vasconcellos</h1>
          <p className="lv-resume-role">{t.role}</p>
          <div className="lv-resume-contact">
            <a href="mailto:leonardolimadevasconcellos@gmail.com"><i data-lucide="mail"></i>leonardolimadevasconcellos@gmail.com</a>
            <a href="tel:+5541992151301"><i data-lucide="phone"></i>+55 41 99215-1301</a>
            <a href="https://linkedin.com/in/llvasconcellos" target="_blank" rel="noopener"><i data-lucide="linkedin"></i>in/llvasconcellos</a>
            <span className="lv-resume-loc"><i data-lucide="map-pin"></i>{t.location}</span>
          </div>
        </div>
        <div className="lv-resume-dl">
          <a className="lv-btn lv-btn-primary" href={RESUME_PDF[lang]} download>
            {t.downloadThis} · {lang.toUpperCase()}<i data-lucide="download"></i>
          </a>
          <a className="lv-btn lv-btn-ghost" href={RESUME_PDF[lang === 'en' ? 'pt' : 'en']} download>
            {t.other}<i data-lucide="file-down"></i>
          </a>
          <span className="lv-resume-pdfnote">{t.pdfNote}</span>
        </div>
      </header>

      {/* ── summary ── */}
      <p className="lv-resume-summary">{t.summary}</p>

      {/* ── stats ── */}
      <div className="lv-stat-row lv-resume-stats">
        {t.stats.map(([n, l], i) => (
          <div className="lv-stat" key={i}><span className="lv-stat-n">{n}</span><span className="lv-stat-l">{l}</span></div>
        ))}
      </div>

      {/* ── eras arc ── */}
      <p className="lv-resume-h lv-resume-h-mono">{t.erasH}</p>
      <div className="lv-timeline lv-resume-eras">
        <div className="lv-timeline-line"></div>
        {RES_ERAS.map((e, i) => (
          <div className={`lv-era ${e.now ? 'is-now' : ''}`} key={i}>
            <div className="lv-era-dot"></div>
            <div className="lv-era-y">{e.y}</div>
            <div className="lv-era-l">{e.label[lang]}</div>
          </div>
        ))}
      </div>

      {/* ── experience ── */}
      <div className="lv-resume-xp-head">
        <h2 className="lv-resume-h">{t.xpH}</h2>
        <div className="lv-xp-filter">
          <span className="lv-xp-filter-lab">{t.filterLab}</span>
          <button className={`lv-xp-chip ${!filter ? 'is-on' : ''}`} onClick={() => setFilter(null)}>{t.all}</button>
          {XP_FILTERS.map((f) => (
            <button key={f} className={`lv-xp-chip ${filter === f ? 'is-on' : ''}`} onClick={() => setFilter(filter === f ? null : f)}>{f}</button>
          ))}
        </div>
        <span className="lv-xp-count">{t.showing} <strong>{shown}</strong> {t.of} {EXPERIENCE.length} {t.roles}</span>
      </div>

      <div className="lv-xp-list">
        {EXPERIENCE.map((x) => {
          const dim = !matches(x);
          const isOpen = open[x.id];
          return (
            <article className={`lv-xp ${x.stakes ? 'is-stakes' : ''} ${dim ? 'is-dim' : ''}`} key={x.id}>
              <div className="lv-xp-rail">
                <div className="lv-xp-dot"></div>
                <span className="lv-xp-period">{x.period[lang]}</span>
                <span className="lv-xp-dur">{x.dur[lang]}</span>
              </div>
              <div className="lv-xp-main">
                <button className="lv-xp-head" onClick={() => toggle(x.id)} aria-expanded={isOpen}>
                  <span className="lv-xp-headtext">
                    <span className="lv-xp-role">
                      {x.stakes && <span className="lv-stakes"><i data-lucide="shield-alert"></i></span>}
                      {pick(x.role, lang)}
                    </span>
                    <span className="lv-xp-co">{pick(x.co, lang)}</span>
                  </span>
                  <span className="lv-xp-toggle">
                    {isOpen ? t.hide : t.details}<i data-lucide={isOpen ? 'chevron-up' : 'chevron-down'}></i>
                  </span>
                </button>
                <div className="lv-xp-tech">
                  {x.tech.map((tch) => <TechChip key={tch}>{tch}</TechChip>)}
                </div>
                {isOpen && (
                  <ul className="lv-xp-bullets">
                    {x.bullets[lang].map((b, i) => (
                      <li key={i}><i data-lucide="check"></i><span>{b}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* ── core stack ── */}
      <p className="lv-resume-h lv-resume-h-mono lv-resume-coreh">{t.coreH}</p>
      <div className="lv-stack lv-resume-core">
        {RES_SKILLS.core.map((s) => {
          const logo = TECH_LOGOS[s];
          return (
            <div className="lv-stack-cell" key={s}>
              {logo ? <img src={logo} alt="" /> : <span className="lv-resume-core-glyph">{s[0]}</span>}
              <span>{s}</span>
            </div>
          );
        })}
      </div>

      {/* ── lower grid: skills / education / languages / links ── */}
      <div className="lv-resume-cols">
        <div className="lv-resume-col">
          <h2 className="lv-resume-h">{t.skillsH}</h2>
          {RES_SKILLS.groups.map((g, i) => (
            <div className="lv-skill-group" key={i}>
              <p className="lv-about-sub">{`// ${g.label[lang]}`}</p>
              <div className="lv-skill-chips">
                {g.items.map((s) => <span className="lv-chip" key={s}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>

        <div className="lv-resume-col">
          <h2 className="lv-resume-h">{t.langH}</h2>
          <div className="lv-spoken">
            {SPOKEN.map((s, i) => (
              <div className="lv-spoken-row" key={i}>
                <div className="lv-spoken-top">
                  <span className="lv-spoken-name">{s.name[lang]}</span>
                  <span className="lv-spoken-lvl">{s.level[lang]}</span>
                </div>
                <div className="lv-spoken-bar"><span className="lv-spoken-fill" style={{ width: s.pct + '%' }}></span></div>
              </div>
            ))}
          </div>

          <h2 className="lv-resume-h lv-resume-h-gap">{t.eduH}</h2>
          <div className="lv-edu">
            {EDUCATION.map((e, i) => (
              <div className="lv-edu-row" key={i}>
                <span className="lv-edu-y">{pick(e.when, lang).split(' ')[0].replace('·', '')}</span>
                <div>
                  <div className="lv-edu-t">{e.deg[lang]}</div>
                  <div className="lv-edu-d">{e.school} · {e.when[lang]}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="lv-resume-h lv-resume-h-gap">{t.linksH}</h2>
          <div className="lv-linklist">
            {LINKS.map((l, i) => (
              <a className="lv-linkrow" href={l.href} target="_blank" rel="noopener" key={i}>
                <i data-lucide={l.icon}></i><span>{l.label}</span><i data-lucide="arrow-up-right" className="lv-linkrow-out"></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── closing download ── */}
      <div className="lv-resume-foot">
        <a className="lv-btn lv-btn-primary" href={RESUME_PDF[lang]} download>
          {t.downloadThis} · {lang.toUpperCase()}<i data-lucide="download"></i>
        </a>
      </div>
    </div>
  );
}

Object.assign(window, { ResumeView });
