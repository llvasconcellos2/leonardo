import type { Metadata } from "next";
import { PROJECTS } from "../../data";
import { ProjectDetail } from "../../components/Views";
import { MiniFooter } from "../../components/ContactFooter";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = PROJECTS.find((x) => x.id === id) || PROJECTS[0];
  return {
    title: `${p.title.en} — Leonardo Vasconcellos`,
    description: p.desc.en,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <ProjectDetail id={id} />
      <MiniFooter />
    </>
  );
}
