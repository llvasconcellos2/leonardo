import type { Metadata } from "next";
import { ResumePage } from "@/app/components/ResumePage";
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
        ? "Currículo — Leonardo Vasconcellos · Engenheiro Full-Stack"
        : "Résumé — Leonardo Vasconcellos · Full-Stack Engineer",
    description:
      lang === "pt"
        ? "~20 anos de experiência, ~70 projetos entregues. De Médicos Sem Fronteiras a cidades inteligentes — sistemas críticos feitos para durar."
        : "~20 years of experience, ~70 shipped projects. From Doctors Without Borders to smart cities — mission-critical systems built to last.",
  };
}

export default async function ResumePageRoute({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <ResumePage lang={lang as Lang} />;
}
