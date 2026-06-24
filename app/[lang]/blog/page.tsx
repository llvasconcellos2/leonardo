import type { Metadata } from "next";
import { WritingIndex } from "../../components/BlogPost";
import { MiniFooter } from "../../components/ContactFooter";
import type { Lang } from "../../data";

const titles: Record<Lang, string> = {
  en: "Writing — Leonardo Vasconcellos",
  pt: "Escrita — Leonardo Vasconcellos",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return { title: titles[lang as Lang] ?? titles.en };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <WritingIndex lang={lang as Lang} />
      <MiniFooter />
    </>
  );
}
