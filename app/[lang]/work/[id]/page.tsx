import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKS } from "@/data/work";
import { WorkDetail } from "@/app/components/Views";
import { MiniFooter } from "@/app/components/ContactFooter";
import type { Lang } from "@/data/data";
import { alternatesFor } from "@/app/lib/seo";

export function generateStaticParams() {
  return WORKS.map((w) => ({ id: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const w = WORKS.find((x) => x.slug === id);
  if (!w) return {};
  const l = lang as Lang;
  return {
    title: `${w.name[l]} — Leonardo Vasconcellos`,
    description: w.tagline[l],
    alternates: alternatesFor(l, `work/${w.slug}`),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  // Unknown slugs 404 instead of silently rendering WORKS[0] (a soft duplicate).
  if (!WORKS.some((w) => w.slug === id)) notFound();
  return (
    <>
      <WorkDetail lang={lang as Lang} id={id} />
      <MiniFooter />
    </>
  );
}
