import type { Lang } from "@/data/data";

/**
 * The two rich tables from project_archive/easy-clinic/README.md that the
 * build pipeline (scripts/build-works.mjs) does NOT parse into data/work.ts:
 * the detailed per-category feature breakdown and the Free-vs-Paid matrix.
 * Hand-authored bilingual copy — the README is the English source of truth.
 */

type Bi = Record<Lang, string>;

export interface FeatureRow {
  name: Bi;
  desc: Bi;
  paid?: boolean;
}
export interface FeatureCategory {
  title: Bi;
  rows: FeatureRow[];
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    title: { en: "Dashboard & Analytics", pt: "Painel & Análises" },
    rows: [
      {
        name: { en: "KPI cards", pt: "Cartões de KPI" },
        desc: {
          en: "Total patients, appointments this month, clinical records this month, total prescriptions, monthly billing.",
          pt: "Total de pacientes, consultas no mês, prontuários no mês, total de prescrições e faturamento mensal.",
        },
      },
      {
        name: { en: "Appointment history chart", pt: "Gráfico de histórico de consultas" },
        desc: {
          en: "12-month bar chart of completed appointments.",
          pt: "Gráfico de barras de 12 meses das consultas concluídas.",
        },
      },
      {
        name: { en: "Records breakdown", pt: "Distribuição de prontuários" },
        desc: {
          en: "Pie chart of clinical record types (forms, prescriptions, certificates, exam requests).",
          pt: "Gráfico de pizza dos tipos de registro clínico (formulários, prescrições, atestados, pedidos de exame).",
        },
      },
      {
        name: { en: "Age group distribution", pt: "Distribuição por faixa etária" },
        desc: {
          en: "Bar chart of patient population by age band (0–17, 18–29, 30–44, 45–59, 60+).",
          pt: "Gráfico de barras da população de pacientes por faixa etária (0–17, 18–29, 30–44, 45–59, 60+).",
        },
      },
      {
        name: { en: "Gender demographics", pt: "Perfil por sexo" },
        desc: {
          en: "Donut chart of patient gender split.",
          pt: "Gráfico de rosca da divisão de pacientes por sexo.",
        },
      },
      {
        name: { en: "Today's agenda", pt: "Agenda do dia" },
        desc: {
          en: "Scrollable list of today's scheduled appointments with quick access to patient records.",
          pt: "Lista rolável das consultas agendadas para hoje, com acesso rápido aos prontuários.",
        },
      },
    ],
  },
  {
    title: { en: "Patient Management", pt: "Gestão de Pacientes" },
    rows: [
      {
        name: { en: "Patient registration", pt: "Cadastro de pacientes" },
        desc: {
          en: "Full profile: name, CPF (with validation), date of birth, gender, address, phone, email.",
          pt: "Perfil completo: nome, CPF (com validação), data de nascimento, sexo, endereço, telefone e e-mail.",
        },
      },
      {
        name: { en: "Photo capture", pt: "Captura de foto" },
        desc: {
          en: "Camera capture or file upload for patient profile photos.",
          pt: "Captura pela câmera ou upload de arquivo para a foto do paciente.",
        },
      },
      {
        name: { en: "Patient list", pt: "Lista de pacientes" },
        desc: {
          en: "Searchable, sortable DataTables list with inline avatars and accent-neutralized search.",
          pt: "Lista DataTables pesquisável e ordenável, com avatares embutidos e busca que ignora acentos.",
        },
      },
      {
        name: { en: "Age-aware context", pt: "Contexto por idade" },
        desc: {
          en: "Patient age passed to the exam catalog for gender- and age-appropriate reference ranges.",
          pt: "A idade do paciente é passada ao catálogo de exames para faixas de referência adequadas ao sexo e à idade.",
        },
      },
    ],
  },
  {
    title: { en: "Clinical Records", pt: "Prontuário Clínico" },
    rows: [
      {
        name: { en: "Patient timeline", pt: "Linha do tempo do paciente" },
        desc: {
          en: "Chronological timeline of all encounters; expandable entries per visit.",
          pt: "Linha do tempo cronológica de todos os atendimentos; entradas expansíveis por consulta.",
        },
      },
      {
        name: { en: "Custom intake forms", pt: "Formulários de admissão personalizados" },
        desc: {
          en: "Fill any form model during a consultation; results stored in the patient's record.",
          pt: "Preencha qualquer modelo de formulário durante a consulta; os resultados ficam no prontuário.",
        },
      },
      {
        name: { en: "Prescriptions", pt: "Prescrições" },
        desc: {
          en: "Generate prescriptions from rich-text templates; stored in the timeline.",
          pt: "Gere prescrições a partir de modelos em texto rico; ficam guardadas na linha do tempo.",
        },
      },
      {
        name: { en: "Medical certificates", pt: "Atestados médicos" },
        desc: {
          en: "Issue certificates from templates; stored in the timeline.",
          pt: "Emita atestados a partir de modelos; ficam guardados na linha do tempo.",
        },
      },
      {
        name: { en: "Exam requests", pt: "Pedidos de exame" },
        desc: {
          en: "Order lab exams from document templates; stored in the timeline.",
          pt: "Solicite exames laboratoriais a partir de modelos de documento; ficam na linha do tempo.",
        },
      },
      {
        name: { en: "Lab exam results", pt: "Resultados de exames" },
        desc: {
          en: "Enter measured values against a catalog of exams; altered results flagged automatically.",
          pt: "Registre os valores medidos contra um catálogo de exames; resultados alterados são sinalizados automaticamente.",
        },
      },
    ],
  },
  {
    title: { en: "Patient Evolution Tracking", pt: "Acompanhamento de Evolução" },
    rows: [
      {
        name: { en: "BMI", pt: "IMC" },
        desc: {
          en: "Computed from weight and height; classified (normal / overweight / obese) with delta since first visit.",
          pt: "Calculado a partir de peso e altura; classificado (normal / sobrepeso / obeso) com variação desde a primeira consulta.",
        },
      },
      {
        name: { en: "Weight & height", pt: "Peso & altura" },
        desc: {
          en: "Trend over all visits.",
          pt: "Tendência ao longo de todas as consultas.",
        },
      },
      {
        name: { en: "Blood pressure", pt: "Pressão arterial" },
        desc: {
          en: "Systolic / diastolic; classified (normal / elevated / hypertensive).",
          pt: "Sistólica / diastólica; classificada (normal / elevada / hipertensa).",
        },
      },
      {
        name: { en: "Heart rate & SpO₂", pt: "Frequência cardíaca & SpO₂" },
        desc: {
          en: "Trend over all consultations.",
          pt: "Tendência ao longo de todas as consultas.",
        },
      },
      {
        name: { en: "Trend charts", pt: "Gráficos de tendência" },
        desc: {
          en: "Four Chart.js line charts — BMI, weight, blood pressure, heart rate & SpO₂ — on the patient's Evolution tab.",
          pt: "Quatro gráficos de linha em Chart.js — IMC, peso, pressão arterial, frequência cardíaca & SpO₂ — na aba de Evolução do paciente.",
        },
      },
    ],
  },
  {
    title: { en: "Appointment Scheduling", pt: "Agendamento de Consultas" },
    rows: [
      {
        name: { en: "Visual calendar", pt: "Calendário visual" },
        desc: {
          en: "Calendar Scheduler with day, week, and month views.",
          pt: "Agenda em calendário com visões de dia, semana e mês.",
        },
      },
      {
        name: { en: "Multi-doctor resource view", pt: "Visão por recurso multi-médico" },
        desc: {
          en: "Timeline view with one column per doctor; patient photo shown on the event.",
          pt: "Visão em linha do tempo com uma coluna por médico; a foto do paciente aparece no evento.",
        },
      },
      {
        name: { en: "Drag & drop", pt: "Arrastar & soltar" },
        desc: {
          en: "Move and resize events directly on the calendar.",
          pt: "Mova e redimensione eventos diretamente no calendário.",
        },
      },
      {
        name: { en: "Appointment statuses", pt: "Status das consultas" },
        desc: {
          en: "Scheduled → Waiting → Attending → Finished / No-show; color-coded.",
          pt: "Agendada → Aguardando → Em atendimento → Finalizada / Faltou; codificadas por cor.",
        },
      },
      {
        name: { en: "Quick patient creation", pt: "Criação rápida de paciente" },
        desc: {
          en: "Create a new patient from within the scheduling form without leaving the calendar.",
          pt: "Crie um novo paciente de dentro do formulário de agendamento, sem sair do calendário.",
        },
      },
      {
        name: { en: "Configurable slots", pt: "Horários configuráveis" },
        desc: {
          en: "Admin sets the appointment duration per doctor.",
          pt: "O administrador define a duração da consulta por médico.",
        },
      },
      {
        name: { en: "Automated reminders", pt: "Lembretes automáticos" },
        desc: {
          en: "Cron job fires every 30 minutes; sends email and SMS to patients with upcoming appointments.",
          pt: "Um cron job dispara a cada 30 minutos; envia e-mail e SMS aos pacientes com consultas próximas.",
        },
      },
      {
        name: { en: "Calendar export (.ics)", pt: "Exportação de calendário (.ics)" },
        desc: {
          en: "Download a single appointment or the visible day/week/month range as a standard .ics file.",
          pt: "Baixe uma consulta ou o intervalo visível de dia/semana/mês como um arquivo .ics padrão.",
        },
      },
      {
        name: { en: "Calendar sync", pt: "Sincronização de calendário" },
        desc: {
          en: "Doctors get a personal, revocable feed link to subscribe their schedule in Google, Outlook, or Apple Calendar.",
          pt: "Os médicos recebem um link de feed pessoal e revogável para assinar a agenda no Google, Outlook ou Apple Calendar.",
        },
        paid: true,
      },
    ],
  },
  {
    title: { en: "Document & Form Engine", pt: "Motor de Documentos & Formulários" },
    rows: [
      {
        name: { en: "Document model editor", pt: "Editor de modelos de documento" },
        desc: {
          en: "SummerNote rich-text editor with variable interpolation (patient name, date, doctor, etc.).",
          pt: "Editor de texto rico SummerNote com interpolação de variáveis (nome do paciente, data, médico etc.).",
        },
      },
      {
        name: { en: "Prescription templates", pt: "Modelos de prescrição" },
        desc: {
          en: "Reusable prescription layouts; selected at consultation time.",
          pt: "Layouts de prescrição reutilizáveis; escolhidos no momento da consulta.",
        },
      },
      {
        name: { en: "Certificate templates", pt: "Modelos de atestado" },
        desc: {
          en: "Medical certificate templates with free-text and structured fields.",
          pt: "Modelos de atestado médico com campos de texto livre e estruturados.",
        },
      },
      {
        name: { en: "Exam request templates", pt: "Modelos de pedido de exame" },
        desc: {
          en: "Templates for lab or imaging referrals.",
          pt: "Modelos para encaminhamentos de laboratório ou de imagem.",
        },
      },
      {
        name: { en: "Form model designer", pt: "Construtor de formulários" },
        desc: {
          en: "Drag-and-drop form builder (form-builder.js); supports text, select, checkbox, date, and more.",
          pt: "Construtor de formulários por arrastar-e-soltar (form-builder.js); suporta texto, seleção, caixa, data e mais.",
        },
      },
      {
        name: { en: "Custom form rendering", pt: "Renderização de formulários" },
        desc: {
          en: "Built forms render inside the consultation modal and their data is persisted to the patient record.",
          pt: "Os formulários criados são exibidos no modal de consulta e seus dados são gravados no prontuário.",
        },
      },
    ],
  },
  {
    title: { en: "Exam Catalog", pt: "Catálogo de Exames" },
    rows: [
      {
        name: { en: "Searchable catalog", pt: "Catálogo pesquisável" },
        desc: {
          en: "Autocomplete search across hundreds of lab exams.",
          pt: "Busca com autocompletar entre centenas de exames laboratoriais.",
        },
      },
      {
        name: { en: "Smart reference ranges", pt: "Faixas de referência inteligentes" },
        desc: {
          en: "Reference values filterable by patient gender and age group.",
          pt: "Valores de referência filtráveis por sexo e faixa etária do paciente.",
        },
      },
      {
        name: { en: "Machine learning", pt: "Aprendizado de máquina" },
        desc: {
          en: 'When a doctor enters a free-text reference value for a new exam, the system parses it (e.g. "13–17", "até 200", "> 30") and stores a structured rule for future use.',
          pt: 'Quando um médico digita um valor de referência em texto livre para um exame novo, o sistema o interpreta (ex.: "13–17", "até 200", "> 30") e guarda uma regra estruturada para uso futuro.',
        },
      },
      {
        name: { en: "Usage tracking", pt: "Rastreamento de uso" },
        desc: {
          en: "Exams are ranked by usage count so the most-ordered tests surface first in autocomplete.",
          pt: "Os exames são ordenados por frequência de uso, então os mais solicitados aparecem primeiro no autocompletar.",
        },
      },
    ],
  },
  {
    title: { en: "Reference Catalogs", pt: "Catálogos de Referência" },
    rows: [
      {
        name: { en: "Drug catalog", pt: "Catálogo de medicamentos" },
        desc: {
          en: "Searchable medication database with offline support (ground:db).",
          pt: "Base de medicamentos pesquisável com suporte offline (ground:db).",
        },
      },
      {
        name: { en: "ICD-10 browser", pt: "Navegador CID-10" },
        desc: {
          en: "Complete international disease classification; offline-capable with persistent client cache.",
          pt: "Classificação internacional de doenças completa; funciona offline com cache persistente no cliente.",
        },
      },
      {
        name: { en: "Medical specialties", pt: "Especialidades médicas" },
        desc: {
          en: "CRUD management of clinical specialties assigned to doctors.",
          pt: "Gestão CRUD das especialidades clínicas atribuídas aos médicos.",
        },
      },
    ],
  },
  {
    title: { en: "Administration & Reporting", pt: "Administração & Relatórios" },
    rows: [
      {
        name: { en: "Doctor profiles", pt: "Perfis de médicos" },
        desc: {
          en: "Name, specialty, photo, and configurable work-hour blocks per day.",
          pt: "Nome, especialidade, foto e blocos de horário de trabalho configuráveis por dia.",
        },
      },
      {
        name: { en: "User management", pt: "Gestão de usuários" },
        desc: {
          en: "Create / edit users; assign roles; send enrollment email automatically.",
          pt: "Crie / edite usuários; atribua papéis; envie e-mail de cadastro automaticamente.",
        },
      },
      {
        name: { en: "Role-based access", pt: "Acesso por papéis" },
        desc: {
          en: "Roles: super-admin, medical_doctor, default; privileged methods guarded server-side.",
          pt: "Papéis: super-admin, medical_doctor, default; métodos privilegiados protegidos no servidor.",
        },
      },
      {
        name: { en: "Clinic settings", pt: "Configurações da clínica" },
        desc: {
          en: "Set appointment value (used for billing KPI).",
          pt: "Defina o valor da consulta (usado no KPI de faturamento).",
        },
      },
      {
        name: { en: "CSV import", pt: "Importação CSV" },
        desc: {
          en: "Bulk patient import via CSV (PapaParse); validation run on a staging collection before commit.",
          pt: "Importação em lote de pacientes via CSV (PapaParse); validação em uma coleção de teste antes de confirmar.",
        },
      },
      {
        name: { en: "Report — Appointments", pt: "Relatório — Consultas" },
        desc: {
          en: "Monthly appointment counts by doctor; filterable date range.",
          pt: "Contagem mensal de consultas por médico; intervalo de datas filtrável.",
        },
      },
      {
        name: { en: "Report — Patients", pt: "Relatório — Pacientes" },
        desc: {
          en: "Demographics: age distribution, gender breakdown, new patients over time.",
          pt: "Perfil demográfico: distribuição etária, divisão por sexo, novos pacientes ao longo do tempo.",
        },
      },
      {
        name: { en: "Report — Production", pt: "Relatório — Produção" },
        desc: {
          en: "Monthly billing KPI, total procedures by type (forms, prescriptions, certificates, exam requests), 12-month production bar chart.",
          pt: "KPI de faturamento mensal, total de procedimentos por tipo (formulários, prescrições, atestados, pedidos de exame) e gráfico de produção de 12 meses.",
        },
      },
      {
        name: { en: "Multi-language", pt: "Multi-idioma" },
        desc: {
          en: "pt-BR, English, and Spanish via tap:i18n.",
          pt: "pt-BR, inglês e espanhol via tap:i18n.",
        },
      },
    ],
  },
];

/** A comparison cell: an icon (optionally annotated) or a plain text value. */
export type CompareCell =
  | { kind: "yes" | "no" | "warn"; note?: Bi }
  | { kind: "text"; text: Bi };

export interface CompareRow {
  feature: Bi;
  free: CompareCell;
  paid: CompareCell;
}

const yes: CompareCell = { kind: "yes" };
const no: CompareCell = { kind: "no" };

export const COMPARE_COLUMNS = {
  feature: { en: "Feature", pt: "Recurso" },
  free: { en: "Free PWA", pt: "PWA Gratuito" },
  paid: { en: "Paid (Meteor)", pt: "Pago (Meteor)" },
} satisfies Record<string, Bi>;

export const COMPARE_INTRO: Bi = {
  en: "The free edition is a static PWA — no server, no database, no install. It runs in any browser and stores data locally via IndexedDB. The paid edition is the full-stack Meteor application with a MongoDB backend, multi-user access, and real-time data sync.",
  pt: "A edição gratuita é um PWA estático — sem servidor, sem banco de dados, sem instalação. Roda em qualquer navegador e guarda os dados localmente via IndexedDB. A edição paga é a aplicação Meteor full-stack, com backend MongoDB, acesso multiusuário e sincronização de dados em tempo real.",
};

export const COMPARE_ROWS: CompareRow[] = [
  {
    feature: { en: "Data storage", pt: "Armazenamento de dados" },
    free: { kind: "text", text: { en: "Browser (IndexedDB)", pt: "Navegador (IndexedDB)" } },
    paid: { kind: "text", text: { en: "MongoDB", pt: "MongoDB" } },
  },
  {
    feature: { en: "Deployment", pt: "Implantação" },
    free: { kind: "text", text: { en: "Static hosting", pt: "Hospedagem estática" } },
    paid: { kind: "text", text: { en: "Docker / Server", pt: "Docker / Servidor" } },
  },
  {
    feature: { en: "Offline support", pt: "Suporte offline" },
    free: { kind: "yes", note: { en: "Service Worker + IndexedDB", pt: "Service Worker + IndexedDB" } },
    paid: { kind: "warn", note: { en: "Fallback page only", pt: "Apenas página de fallback" } },
  },
  { feature: { en: "Dashboard & KPIs", pt: "Painel & KPIs" }, free: yes, paid: yes },
  { feature: { en: "Patient management", pt: "Gestão de pacientes" }, free: yes, paid: yes },
  { feature: { en: "Patient photo upload", pt: "Upload de foto do paciente" }, free: yes, paid: yes },
  { feature: { en: "Clinical records timeline", pt: "Linha do tempo do prontuário" }, free: yes, paid: yes },
  { feature: { en: "Prescriptions & certificates", pt: "Prescrições & atestados" }, free: yes, paid: yes },
  { feature: { en: "Exam requests", pt: "Pedidos de exame" }, free: yes, paid: yes },
  { feature: { en: "Lab exam results", pt: "Resultados de exames" }, free: yes, paid: yes },
  { feature: { en: "Patient evolution charts", pt: "Gráficos de evolução" }, free: yes, paid: yes },
  { feature: { en: "Document model editor", pt: "Editor de modelos de documento" }, free: yes, paid: yes },
  { feature: { en: "Drag & drop form designer", pt: "Construtor de formulários" }, free: yes, paid: yes },
  { feature: { en: "Exam catalog with smart ranges", pt: "Catálogo de exames com faixas inteligentes" }, free: yes, paid: yes },
  { feature: { en: "Drug catalog", pt: "Catálogo de medicamentos" }, free: yes, paid: yes },
  { feature: { en: "ICD-10 browser", pt: "Navegador CID-10" }, free: yes, paid: yes },
  { feature: { en: "Reports (3 screens)", pt: "Relatórios (3 telas)" }, free: yes, paid: yes },
  { feature: { en: "CSV patient import", pt: "Importação de pacientes CSV" }, free: yes, paid: yes },
  { feature: { en: "Multi-language (pt-BR / en / es)", pt: "Multi-idioma (pt-BR / en / es)" }, free: yes, paid: yes },
  { feature: { en: "Responsive (mobile / tablet / desktop)", pt: "Responsivo (celular / tablet / desktop)" }, free: yes, paid: yes },
  { feature: { en: "Installable (PWA / add to home screen)", pt: "Instalável (PWA / adicionar à tela inicial)" }, free: yes, paid: yes },
  { feature: { en: "Appointment scheduling", pt: "Agendamento de consultas" }, free: yes, paid: yes },
  { feature: { en: "Multi-doctor resource view", pt: "Visão por recurso multi-médico" }, free: yes, paid: yes },
  { feature: { en: "Drag & drop calendar", pt: "Calendário arrastar & soltar" }, free: yes, paid: yes },
  { feature: { en: "Calendar export (.ics download)", pt: "Exportação de calendário (.ics)" }, free: yes, paid: yes },
  { feature: { en: "Calendar feed (Google/Outlook/Apple)", pt: "Feed de calendário (Google/Outlook/Apple)" }, free: no, paid: yes },
  { feature: { en: "Live connection status banner", pt: "Banner de status de conexão ao vivo" }, free: no, paid: yes },
  { feature: { en: "Non-disruptive update prompt (hot code push)", pt: "Aviso de atualização não intrusivo (hot code push)" }, free: no, paid: yes },
  { feature: { en: "Taskbar icon badge (live waiting-patient count)", pt: "Badge no ícone (contagem de pacientes na espera ao vivo)" }, free: no, paid: yes },
  {
    feature: { en: "Multi-user accounts", pt: "Contas multiusuário" },
    free: { kind: "no", note: { en: "Single user", pt: "Usuário único" } },
    paid: { kind: "yes", note: { en: "Unlimited", pt: "Ilimitado" } },
  },
  { feature: { en: "Role-based access control", pt: "Controle de acesso por papéis" }, free: no, paid: yes },
  { feature: { en: "Real-time reactive data sync", pt: "Sincronização reativa em tempo real" }, free: no, paid: yes },
  { feature: { en: "Server-side validation & security", pt: "Validação & segurança no servidor" }, free: no, paid: yes },
  { feature: { en: "Automated SMS reminders", pt: "Lembretes automáticos por SMS" }, free: no, paid: yes },
  { feature: { en: "Automated email reminders", pt: "Lembretes automáticos por e-mail" }, free: no, paid: yes },
  { feature: { en: "Audit hooks (before insert/update)", pt: "Hooks de auditoria (antes de inserir/atualizar)" }, free: no, paid: yes },
];
