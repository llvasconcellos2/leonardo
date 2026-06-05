import type { Metadata } from "next";
import { PROJECTS } from "../../../data";
import { ProjectDetail } from "../../../components/Views";
import { MiniFooter } from "../../../components/ContactFooter";
import type { Lang } from "../../../data";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const p = PROJECTS.find((x) => x.id === id) || PROJECTS[0];
  const l = lang as Lang;
  return {
    title: `${p.title[l]} — Leonardo Vasconcellos`,
    description: p.desc[l],
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  return (
    <>
      <ProjectDetail lang={lang as Lang} id={id} />
      <MiniFooter />
    </>
  );
}
