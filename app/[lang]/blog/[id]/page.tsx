import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "../../../../data/blog";
import { BlogArticle } from "../../../components/BlogArticle";
import { MiniFooter } from "../../../components/ContactFooter";
import { txt } from "../../../lib/blog";
import type { Lang } from "../../../../data/data";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ id: p.slug.pt }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const post = BLOG_POSTS.find((p) => p.slug.pt === id);
  if (!post) return {};
  const l = lang as Lang;
  return {
    title: `${txt(post.title, l)} — Leonardo Vasconcellos`,
    description: txt(post.excerpt, l),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const post = BLOG_POSTS.find((p) => p.slug.pt === id);
  if (!post) notFound();
  return (
    <>
      <BlogArticle post={post} lang={lang as Lang} />
      <MiniFooter />
    </>
  );
}
