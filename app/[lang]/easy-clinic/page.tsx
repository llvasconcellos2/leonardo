import type { Metadata } from "next";
import { EasyClinicPage } from "@/app/components/EasyClinicPage";
import type { Lang } from "@/data/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "pt"
        ? "Clínica Fácil — Sistema de gestão clínica · Leonardo Vasconcellos"
        : "Easy Clinic — Clinic management system · Leonardo Vasconcellos",
    description:
      lang === "pt"
        ? "Sistema completo de gestão de clínicas (2016, Meteor + MongoDB) — prontuários, agenda, prescrições e faturamento. Capturado e re-hospedado como arquivo estático navegável."
        : "A full clinic-management system (2016, Meteor + MongoDB) — records, scheduling, prescriptions, and billing. Crawled and re-hosted as a clickable static archive.",
  };
}

export default async function EasyClinicRoute({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EasyClinicPage lang={lang as Lang} />;
}
