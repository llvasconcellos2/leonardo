import type { Metadata } from "next";
import { Hero } from "@/app/components/Hero";
import { AboutSection } from "@/app/components/AboutSection";
import { WorkSection } from "@/app/components/WorkSection";
import { WritingSection } from "@/app/components/WritingSection";
import { Testimonials } from "@/app/components/Testimonials";
import { ContactFooter } from "@/app/components/ContactFooter";
import { Parallax } from "@/app/components/Parallax";
import type { Lang } from "@/data/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Leonardo Vasconcellos — Full-Stack Engineer",
    description:
      lang === "pt"
        ? "Engenheiro full-stack sênior com ~20 anos e ~70 projetos entregues. De Médicos Sem Fronteiras a cidades inteligentes — sistemas críticos feitos para durar."
        : "Senior full-stack engineer with ~20 years and ~70 shipped projects. From Doctors Without Borders to smart cities — mission-critical systems built to last.",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  return (
    <>
      <Hero lang={l} background="pattern" />
      <AboutSection lang={l} />
      <Parallax flip={true} />
      <WorkSection lang={l} />
      <Parallax />
      <WritingSection lang={l} />
      <Parallax flip={true} />
      <Testimonials lang={l} />
      <Parallax targetColor="44, 47, 52" />
      <ContactFooter lang={l} />
    </>
  );
}
