import type { Metadata } from "next";
import { BlogIndex } from "../../components/BlogIndex";
import { MiniFooter } from "../../components/ContactFooter";
import { BLOG_T } from "../../lib/blog";
import type { Lang } from "../../../data/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = (lang as Lang) ?? "en";
  return {
    title: `${BLOG_T[l].title} — Leonardo Vasconcellos`,
    description: BLOG_T[l].lead,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <BlogIndex lang={lang as Lang} />
      <MiniFooter />
    </>
  );
}
