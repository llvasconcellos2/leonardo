import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "../../../../data/blog";
import { BlogArticle } from "../../../components/BlogArticle";
import { MiniFooter } from "../../../components/ContactFooter";
import { txt, postSlug } from "../../../lib/blog";
import type { Lang } from "../../../../data/data";

export function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  return BLOG_POSTS.map((p) => ({ id: postSlug(p, params.lang as Lang) }));
}

/** Resolve a post by its slug in either locale (en or pt). */
const findPost = (id: string) =>
  BLOG_POSTS.find((p) => p.slug.en === id || p.slug.pt === id);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const post = findPost(id);
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
  const post = findPost(id);
  if (!post) notFound();
  return (
    <>
      <BlogArticle post={post} lang={lang as Lang} />
      <MiniFooter />
    </>
  );
}
