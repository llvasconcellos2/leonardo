/* global React */
// ── LV Portfolio · sample content (bilingual) ───────────────────────
// Stand-in copy in the brand voice. Real project screenshots pending.
const PROJECTS = [
  {
    id: 'msf', seed: 7, year: '2014', stakes: true,
    kicker: { en: '// medical records · doctors without borders', pt: '// prontuários · médicos sem fronteiras' },
    title: { en: 'Ebola-response records system', pt: 'Sistema de prontuários — resposta ao Ebola' },
    desc: {
      en: 'Selected from 1,000+ and elected technical lead. An offline-first medical-records system for Ebola treatment centres where downtime costs lives.',
      pt: 'Selecionado entre mais de 1.000 e eleito líder técnico. Sistema de prontuários offline-first para centros de tratamento de Ebola, onde indisponibilidade custa vidas.',
    },
    bullets: {
      en: ['Offline-first sync across field tablets', 'Audit-grade record integrity', 'Built under real operational pressure'],
      pt: ['Sincronização offline-first entre tablets', 'Integridade de registros auditável', 'Construído sob pressão operacional real'],
    },
    tech: ['Java', 'Android', 'PostgreSQL', 'Sync'],
  },
  {
    id: 'itajai', seed: 14, year: '2019', stakes: true,
    kicker: { en: '// smart city · itajaí', pt: '// cidade inteligente · itajaí' },
    title: { en: "Brazil's top-ranked smart city", pt: 'A cidade inteligente nº 1 do Brasil' },
    desc: {
      en: 'A tangled municipal platform made to scale — services, data and citizens on one system that had grown over years.',
      pt: 'Uma plataforma municipal complexa feita para escalar — serviços, dados e cidadãos em um só sistema que cresceu por anos.',
    },
    bullets: {
      en: ['Untangled a years-deep legacy core', 'Citizen-facing services at city scale', 'Top national smart-city ranking'],
      pt: ['Desembaraçou um núcleo legado de anos', 'Serviços ao cidadão em escala municipal', 'Melhor ranking nacional de cidade inteligente'],
    },
    tech: ['.NET', 'React', 'SQL Server', 'Azure'],
  },
  {
    id: 'bv', seed: 21, year: '2017', stakes: true,
    kicker: { en: '// supply chain · bureau veritas', pt: '// cadeia de suprimentos · bureau veritas' },
    title: { en: 'Global grain supply chains', pt: 'Cadeias globais de grãos' },
    desc: {
      en: 'Tracking the world grain supply for BASF and Bayer — inspection and certification data feeding decisions that move commodities.',
      pt: 'Rastreando o suprimento mundial de grãos para BASF e Bayer — dados de inspeção e certificação que movem commodities.',
    },
    bullets: {
      en: ['Inspection data across continents', 'Certification workflows for BASF/Bayer', 'Reliable under heavy load'],
      pt: ['Dados de inspeção entre continentes', 'Fluxos de certificação BASF/Bayer', 'Confiável sob carga pesada'],
    },
    tech: ['Java', 'Oracle', 'Web'],
  },
  {
    id: 'edu', seed: 28, year: '2011', stakes: false,
    kicker: { en: '// edtech · scale', pt: '// edtech · escala' },
    title: { en: "The world's largest educational software", pt: 'O maior software educacional do mundo' },
    desc: {
      en: 'Part of a platform serving millions of students — the kind of scale where every query and every render budget matters.',
      pt: 'Parte de uma plataforma para milhões de alunos — a escala em que cada consulta e cada render conta.',
    },
    bullets: {
      en: ['Built for millions of students', 'Performance budgets at scale', 'Long-lived, maintained codebase'],
      pt: ['Feito para milhões de alunos', 'Orçamentos de performance em escala', 'Base de código longeva e mantida'],
    },
    tech: ['.NET', 'JavaScript', 'SQL Server'],
  },
];

const POSTS = [
  {
    id: 'crawl', date: '2026-03-14', read: '8 min',
    kicker: { en: '// writing · engineering', pt: '// escrita · engenharia' },
    title: { en: 'Crawling and self-hosting 70 dead sites', pt: 'Rastreando e auto-hospedando 70 sites mortos' },
    excerpt: {
      en: 'Most of ~70 shipped projects are discontinued. Here is how I crawled, archived and self-host them as honest live snapshots — and why the act of doing it is itself a craft signal.',
      pt: 'A maioria dos ~70 projetos foi descontinuada. Veja como eu os rastreei, arquivei e auto-hospedo como snapshots honestos — e por que fazer isso já é um sinal de ofício.',
    },
  },
  {
    id: 'eras', date: '2026-02-02', read: '11 min',
    kicker: { en: '// writing · career', pt: '// escrita · carreira' },
    title: { en: 'Shipping across five eras of the web', pt: 'Construindo através de cinco eras da web' },
    excerpt: {
      en: 'Flash/Flex → PHP → Java/Android → .NET → React/Next + AI-assisted. What survives a 20-year career is not a framework — it is how you think about systems that must not fail.',
      pt: 'Flash/Flex → PHP → Java/Android → .NET → React/Next + IA. O que sobrevive a 20 anos não é um framework — é como você pensa em sistemas que não podem falhar.',
    },
  },
  {
    id: 'tangled', date: '2026-01-09', read: '6 min',
    kicker: { en: '// writing · craft', pt: '// escrita · ofício' },
    title: { en: 'On untangling systems that have grown', pt: 'Sobre desembaraçar sistemas que cresceram' },
    excerpt: {
      en: 'The engineer you want when the system actually matters — and has grown tangled. A field guide to making the messy parts scale without a rewrite.',
      pt: 'O engenheiro que você quer quando o sistema importa — e ficou emaranhado. Um guia para escalar as partes bagunçadas sem reescrever tudo.',
    },
  },
];

const T = {
  en: {
    selectedWork: 'Selected work', seeAll: 'See all ~70 projects', writing: 'Writing',
    writingLead: 'The engine. A prior site passed a million views — writing is the marketing that runs while asleep.',
    allWriting: 'All writing', engineeredWith: 'Engineered with', viewDetails: 'View details', liveSnapshot: 'Live snapshot',
    hireLead: "Open to good freelance and the right full-time role. Here's how to work with me.",
    contact: 'Get in touch', resume: 'Download résumé', archive: 'Project archive', archiveLead: '~20 years · ~70 shipped projects · five eras of the web',
    back: 'Back', readMore: 'Read', minRead: 'read',
  },
  pt: {
    selectedWork: 'Trabalho selecionado', seeAll: 'Ver todos os ~70 projetos', writing: 'Escrita',
    writingLead: 'O motor. Um site anterior passou de um milhão de views — escrever é o marketing que roda enquanto durmo.',
    allWriting: 'Toda a escrita', engineeredWith: 'Construído com', viewDetails: 'Ver detalhes', liveSnapshot: 'Snapshot ao vivo',
    hireLead: 'Aberto a bons freelas e à vaga full-time certa. Veja como trabalhar comigo.',
    contact: 'Fale comigo', resume: 'Baixar currículo', archive: 'Arquivo de projetos', archiveLead: '~20 anos · ~70 projetos · cinco eras da web',
    back: 'Voltar', readMore: 'Ler', minRead: 'leitura',
  },
};

Object.assign(window, { PROJECTS, POSTS, T });
