import "./EasyClinicPage.css";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Archive, Check } from "lucide-react";
import { Kicker, TechChip } from "./Primitives";
import { MiniFooter } from "./ContactFooter";
import type { Lang } from "@/data/data";

/** Live, self-hosted archive of the original 2016 Meteor app. */
const LIVE_URL = "https://leonardo-vasconcellos.vercel.app/clinica-facil/";

const copy = {
  back: { en: "Back", pt: "Voltar" },
  kicker: {
    en: "// clinic management system · archived & self-hosted",
    pt: "// sistema de gestão clínica · arquivado e auto-hospedado",
  },
  title: { en: "Easy Clinic", pt: "Clínica Fácil" },
  lead: {
    en: "A full clinic-management system — patient records, scheduling, prescriptions, exams, and billing — built for Brazilian practices. Originally a 2016 Meteor app; crawled, anonymized, and re-hosted as a static archive you can open and click through today.",
    pt: "Um sistema completo de gestão de clínicas — prontuários, agenda, prescrições, exames e faturamento — feito para consultórios brasileiros. Originalmente um app Meteor de 2016; capturado, anonimizado e re-hospedado como um arquivo estático que você pode abrir e navegar hoje.",
  },
  tech: ["Meteor", "MongoDB", "JavaScript", "Blaze"],
  open: { en: "Open the live archive", pt: "Abrir o arquivo ao vivo" },
  openNote: {
    en: "// single-user demo · login is pre-filled · just click Entrar",
    pt: "// demo single-user · login já preenchido · basta clicar em Entrar",
  },
  featuresHead: { en: "What it does", pt: "O que faz" },
  features: {
    en: [
      "Patient records with a clinical timeline and evolution notes",
      "Appointment scheduling with automated email and SMS reminders",
      "Prescriptions and ANVISA-compliant controlled-drug documents",
      "Exam catalog, ICD-10 lookup, and reusable document & form models",
      "Role-based access for doctors and admins, plus billing analytics",
    ],
    pt: [
      "Prontuários com linha do tempo clínica e notas de evolução",
      "Agenda de consultas com lembretes automáticos por e-mail e SMS",
      "Prescrições e documentos de medicamentos controlados conforme a ANVISA",
      "Catálogo de exames, busca CID-10 e modelos reutilizáveis de documentos e formulários",
      "Acesso por perfil para médicos e administradores, além de análises de faturamento",
    ],
  },
  snapshot: { en: "archive snapshot · self-hosted", pt: "captura do arquivo · auto-hospedado" },
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

export function EasyClinicPage({ lang }: { lang: Lang }) {
  return (
    <article className="lv-ec enable-smooth">
      <Link href={`/${lang}`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {copy.back[lang]}
      </Link>

      <Kicker as="p">{copy.kicker[lang]}</Kicker>
      <h1 className="lv-ec-title">{copy.title[lang]}</h1>
      <p className="lv-ec-lead">{copy.lead[lang]}</p>

      <div className="lv-ec-tech">
        {copy.tech.map((x) => (
          <TechChip key={x}>{x}</TechChip>
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

      <div className="lv-ec-grid">
        <div className="lv-ec-prose">
          <h2 className="lv-ec-h2">{copy.featuresHead[lang]}</h2>
          <ul className="lv-ec-bullets">
            {copy.features[lang].map((b, i) => (
              <li key={i}>
                <Check size={16} />
                {b}
              </li>
            ))}
          </ul>
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

      <MiniFooter />
    </article>
  );
}
