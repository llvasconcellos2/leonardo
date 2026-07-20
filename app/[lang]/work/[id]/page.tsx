import type { Metadata } from "next";
import { WORKS } from "@/data/work";
import { WorkDetail } from "@/app/components/Views";
import { MiniFooter } from "@/app/components/ContactFooter";
import type { Lang } from "@/data/data";

export function generateStaticParams() {
  return WORKS.map((w) => ({ id: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const w = WORKS.find((x) => x.slug === id) || WORKS[0];
  const l = lang as Lang;
  return {
    title: `${w.name[l]} — Leonardo Vasconcellos`,
    description: w.tagline[l],
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
      <WorkDetail lang={lang as Lang} id={id} />
      <MiniFooter />
    </>
  );
}
