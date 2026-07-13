import "./EasyClinicPage.css";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Archive, Check, X, AlertTriangle } from "lucide-react";
import { Kicker } from "./Primitives";
import { MiniFooter } from "./ContactFooter";
import { Gallery } from "./Gallery";
import { renderInline } from "@/app/lib/inline-md";
import { WORKS } from "@/data/work";
import type { Lang } from "@/data/data";
import {
  FEATURE_CATEGORIES,
  COMPARE_ROWS,
  COMPARE_COLUMNS,
  COMPARE_INTRO,
  type CompareCell,
} from "./easyClinicContent";

/** Live, self-hosted archive of the original 2016 Meteor app. */
const LIVE_URL = "https://leonardo-vasconcellos.vercel.app/clinica-facil/";

const work = WORKS.find((w) => w.slug === "easy-clinic")!;

/** Page-specific copy that has no home in the generated work catalog. */
const copy = {
  back: { en: "Back", pt: "Voltar" },
  engineeredWith: { en: "// built with", pt: "// construído com" },
  open: { en: "Open the live archive", pt: "Abrir o arquivo ao vivo" },
  openNote: {
    en: "// single-user demo · login is pre-filled · just click Entrar",
    pt: "// demo single-user · login já preenchido · basta clicar em Entrar",
  },
  snapshot: { en: "archive snapshot · self-hosted", pt: "captura do arquivo · auto-hospedado" },
  galleryLabel: { en: "screenshots · easy clinic", pt: "capturas · clínica fácil" },
  galleryHead: { en: "Screenshots", pt: "Capturas de tela" },
  overviewHead: { en: "Overview", pt: "Visão geral" },
  highlightsHead: { en: "Highlights", pt: "Destaques" },
  featuresHead: { en: "Features", pt: "Recursos" },
  compareHead: { en: "Free vs. Paid edition", pt: "Edição gratuita vs. paga" },
  paidTag: { en: "Paid", pt: "Pago" },
  meta: {
    en: [
      ["Released", "2016"],
      ["Stack", "Meteor 1.4 · MongoDB"],
      ["Locale", "pt-BR · en · es"],
      ["Status", "Archived demo"],
    ],
    pt: [
      ["Lançado", "2016"],
      ["Stack", "Meteor 1.4 · MongoDB"],
      ["Idioma", "pt-BR · en · es"],
      ["Status", "Demo arquivada"],
    ],
  },
} as const;

/** Descriptive alt text per screenshot, keyed by file basename. */
const ALT: Record<string, Record<Lang, string>> = {
  "01-patient": {
    en: "Patient clinical record with tabbed sections and a visit timeline",
    pt: "Prontuário do paciente com abas e linha do tempo de atendimentos",
  },
  "02-dashboard": {
    en: "Dashboard with KPI cards and a 12-month appointment history chart",
    pt: "Painel com cartões de KPI e gráfico de histórico de consultas de 12 meses",
  },
  "03-scheduel": {
    en: "Appointment calendar scheduler with a multi-doctor resource view",
    pt: "Agenda em calendário com visão de recurso por múltiplos médicos",
  },
  "04-login": { en: "Login screen", pt: "Tela de login" },
  "05-patient-evolution": {
    en: "Patient evolution tab with BMI, weight, and vitals trend charts",
    pt: "Aba de evolução do paciente com gráficos de IMC, peso e sinais vitais",
  },
  "06-patient-timeline": {
    en: "Patient timeline of clinical encounters",
    pt: "Linha do tempo de atendimentos clínicos do paciente",
  },
  "rip-patient-list": {
    en: "Patient list in the free browser-only PWA edition",
    pt: "Lista de pacientes na edição gratuita PWA (apenas navegador)",
  },
  "rip-doctors": {
    en: "Doctors management in the free PWA edition",
    pt: "Gestão de médicos na edição gratuita PWA",
  },
  "report-patients": {
    en: "Patient demographics report",
    pt: "Relatório de perfil demográfico dos pacientes",
  },
  "report-production": {
    en: "Production billing report",
    pt: "Relatório de faturamento de produção",
  },
  "exam-catalog": {
    en: "Exam catalog with smart reference ranges",
    pt: "Catálogo de exames com faixas de referência inteligentes",
  },
  "document-models": {
    en: "Document model editor",
    pt: "Editor de modelos de documento",
  },
  "form-models": {
    en: "Drag-and-drop form model designer",
    pt: "Construtor de modelos de formulário por arrastar-e-soltar",
  },
  "orig-ipad": {
    en: "The app running responsively on an iPad",
    pt: "O app rodando de forma responsiva em um iPad",
  },
  "v-patients-mobile": {
    en: "Patient list on a phone",
    pt: "Lista de pacientes em um celular",
  },
  "v-patients-drawer": {
    en: "Patient screen with the navigation drawer open on mobile",
    pt: "Tela de pacientes com a gaveta de navegação aberta no celular",
  },
  "v-schedule-mobile": {
    en: "Schedule on a phone",
    pt: "Agenda em um celular",
  },
  "v-mobile-open": {
    en: "Mobile view with the off-canvas navigation open",
    pt: "Visão mobile com a navegação off-canvas aberta",
  },
  "v-patient-photos": {
    en: "Patient photos on mobile",
    pt: "Fotos de pacientes no celular",
  },
  "v-drawer-submenu": {
    en: "Navigation drawer submenu on mobile",
    pt: "Submenu da gaveta de navegação no celular",
  },
};

function altFor(src: string, lang: Lang): string {
  const base = src.split("/").pop()?.replace(/\.\w+$/, "") ?? "";
  return ALT[base]?.[lang] ?? "Easy Clinic screenshot";
}

function CompareValue({ cell, lang }: { cell: CompareCell; lang: Lang }) {
  if (cell.kind === "text") {
    return <span className="lv-ec-cmp-text">{cell.text[lang]}</span>;
  }
  const icon =
    cell.kind === "yes" ? (
      <Check size={17} className="lv-ec-cmp-yes" aria-label={lang === "pt" ? "Sim" : "Yes"} />
    ) : cell.kind === "warn" ? (
      <AlertTriangle
        size={16}
        className="lv-ec-cmp-warn"
        aria-label={lang === "pt" ? "Parcial" : "Partial"}
      />
    ) : (
      <X size={16} className="lv-ec-cmp-no" aria-label={lang === "pt" ? "Não" : "No"} />
    );
  return (
    <span className="lv-ec-cmp-cell">
      {icon}
      {cell.note && <span className="lv-ec-cmp-note">{cell.note[lang]}</span>}
    </span>
  );
}

export function EasyClinicPage({ lang }: { lang: Lang }) {
  const featured = work.screenshots.filter((s) => s.featured);
  const rest = work.screenshots.filter((s) => !s.featured);
  const shots = [...featured, ...rest].map((s) => ({
    src: s.src,
    alt: altFor(s.src, lang),
  }));

  return (
    <article className="lv-ec enable-smooth">
      <Link href={`/${lang}`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {copy.back[lang]}
      </Link>

      <Kicker as="p">{work.kicker[lang]}</Kicker>
      <h1 className="lv-ec-title">{work.name[lang]}</h1>
      <p className="lv-ec-lead">{renderInline(work.intro[lang], "lead")}</p>

      <div className="lv-ec-tech">
        <span className="lv-ec-tech-lab">{copy.engineeredWith[lang]}</span>
        {work.tech.map((t) => (
          <span key={t.name} className={`lv-chip ${t.icon ? "has-logo" : ""}`}>
            {t.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="lv-chip-logo" src={t.icon} alt="" width={14} height={14} />
            )}
            {t.name}
            {t.version && <span className="lv-ec-tech-ver">{t.version}</span>}
          </span>
        ))}
      </div>

      <a
        href={LIVE_URL}
        className="lv-btn lv-btn-primary lv-ec-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        {copy.open[lang]} <ArrowUpRight size={17} />
      </a>
      <p className="lv-ec-cta-note">{copy.openNote[lang]}</p>

      <a
        href={LIVE_URL}
        className="lv-ec-frame"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.open[lang]}
      >
        <span className="lv-ec-frame-bar">
          <Archive size={14} /> {copy.snapshot[lang]}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="lv-ec-shot"
          src="/clinica-facil/screenshots/dashboard-after-login.png"
          alt={
            lang === "pt"
              ? "Painel de controle do Clínica Fácil com estatísticas e gráfico de atendimentos"
              : "Easy Clinic dashboard showing clinic stats and an appointments chart"
          }
          width={1280}
          height={720}
          loading="lazy"
        />
      </a>

      {/* Screenshot gallery */}
      <section className="lv-ec-block">
        <h2 className="lv-ec-h2">{copy.galleryHead[lang]}</h2>
        <Gallery images={shots} label={copy.galleryLabel[lang]} />
      </section>

      {/* Overview prose + meta sidebar */}
      <div className="lv-ec-grid">
        <div className="lv-ec-prose">
          <h2 className="lv-ec-h2">{copy.overviewHead[lang]}</h2>
          {work.body[lang].map((para, i) => (
            <p key={i} className="lv-ec-para">
              {renderInline(para, `body-${i}`)}
            </p>
          ))}
        </div>
        <aside className="lv-ec-meta">
          {copy.meta[lang].map(([k, v]) => (
            <div className="lv-ec-meta-row" key={k}>
              <span className="lv-ec-meta-k">{k}</span>
              <span className="lv-ec-meta-v">{v}</span>
            </div>
          ))}
        </aside>
      </div>

      {/* Highlights (key features) */}
      <section className="lv-ec-block">
        <h2 className="lv-ec-h2">{copy.highlightsHead[lang]}</h2>
        <div className="lv-ec-highlights">
          {work.features.map((f, i) => (
            <div className="lv-ec-highlight" key={i}>
              <h3 className="lv-ec-highlight-h">{f.heading[lang]}</h3>
              <p className="lv-ec-highlight-b">{renderInline(f.body[lang], `feat-${i}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed features by category */}
      <section className="lv-ec-block">
        <h2 className="lv-ec-h2">{copy.featuresHead[lang]}</h2>
        <div className="lv-ec-cats">
          {FEATURE_CATEGORIES.map((cat) => (
            <div className="lv-ec-cat" key={cat.title.en}>
              <h3 className="lv-ec-cat-h">{cat.title[lang]}</h3>
              <dl className="lv-ec-cat-rows">
                {cat.rows.map((row) => (
                  <div className="lv-ec-cat-row" key={row.name.en}>
                    <dt className="lv-ec-cat-name">
                      {row.name[lang]}
                      {row.paid && <span className="lv-ec-paid">{copy.paidTag[lang]}</span>}
                    </dt>
                    <dd className="lv-ec-cat-desc">{row.desc[lang]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Free vs Paid comparison */}
      <section className="lv-ec-block">
        <h2 className="lv-ec-h2">{copy.compareHead[lang]}</h2>
        <p className="lv-ec-para lv-ec-cmp-intro">{COMPARE_INTRO[lang]}</p>
        <div className="lv-ec-cmp-wrap">
          <table className="lv-ec-cmp">
            <thead>
              <tr>
                <th scope="col">{COMPARE_COLUMNS.feature[lang]}</th>
                <th scope="col" className="lv-ec-cmp-col">
                  {COMPARE_COLUMNS.free[lang]}
                </th>
                <th scope="col" className="lv-ec-cmp-col">
                  {COMPARE_COLUMNS.paid[lang]}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.feature.en}>
                  <th scope="row" className="lv-ec-cmp-feat">
                    {row.feature[lang]}
                  </th>
                  <td className="lv-ec-cmp-col">
                    <CompareValue cell={row.free} lang={lang} />
                  </td>
                  <td className="lv-ec-cmp-col">
                    <CompareValue cell={row.paid} lang={lang} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <MiniFooter />
    </article>
  );
}
