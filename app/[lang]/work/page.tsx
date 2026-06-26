import type { Metadata } from "next";
import { ArchiveView } from "@/app/components/Views";
import { MiniFooter } from "@/app/components/ContactFooter";
import type { Lang } from "@/data/data";

const titles: Record<Lang, string> = {
  en: "Work — Leonardo Vasconcellos",
  pt: "Trabalho — Leonardo Vasconcellos",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return { title: titles[lang as Lang] ?? titles.en };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  return (
    <>
      <ArchiveView lang={l} />
      <MiniFooter />
    </>
  );
}
