import type { Metadata } from "next";
import { JucaPage } from "@/app/components/JucaPage";
import type { Lang } from "@/data/data";
import { alternatesFor } from "@/app/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: alternatesFor(lang as Lang, "juca"),
    title:
      lang === "pt"
        ? "Histórias do Juca — Ficção interativa acessível · Leonardo Vasconcellos"
        : "Histórias do Juca — Accessible interactive fiction · Leonardo Vasconcellos",
    description:
      lang === "pt"
        ? "Ficção interativa baseada em escolhas para um projeto social de inclusão de pessoas cegas — feita para funcionar de verdade com leitores de tela e teclado (Next.js + React), com narração no navegador e um motor separado do conteúdo."
        : "Choice-based interactive fiction for a social project on blind inclusion — built to genuinely work with screen readers and keyboards (Next.js + React), with in-browser narration and a content-agnostic story engine.",
  };
}

export default async function JucaRoute({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <JucaPage lang={lang as Lang} />;
}
