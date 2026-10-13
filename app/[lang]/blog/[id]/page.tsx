import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { BLOG_POSTS } from "@/data/blog";
import { BlogArticle } from "@/app/components/BlogArticle";
import { MiniFooter } from "@/app/components/ContactFooter";
import { txt, postSlug } from "@/app/lib/blog";
import { DEFAULT_OG_IMAGE } from "@/app/[lang]/layout";
import type { Lang } from "@/data/data";
import { alternatesFor, pageUrl } from "@/app/lib/seo";

export function generateStaticParams({ params }: { params: { lang: string } }) {
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
  const title = `${txt(post.title, l)} — Leonardo Vasconcellos`;
  const description = txt(post.excerpt, l);
  // Blog articles share their featured image; fall back to the site default.
  const image = post.featuredImage ?? DEFAULT_OG_IMAGE;
  // Canonical always uses this locale's slug, so /en/blog/<pt-slug>/ folds into
  // /en/blog/<en-slug>/ instead of being indexed as a duplicate.
  const alternates = alternatesFor(l, {
    en: `blog/${postSlug(post, "en")}`,
    pt: `blog/${postSlug(post, "pt")}`,
  });
  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "article",
      siteName: "Leonardo Vasconcellos",
      title,
      description,
      url: pageUrl(l, `blog/${postSlug(post, l)}`),
      publishedTime: post.date.toISOString(),
      modifiedTime: post.modified.toISOString(),
      images: [{ url: image, alt: txt(post.title, l) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
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
      {/* <ViewTransition
        enter={{
          "nav-forward": "nav-forward",
          "nav-back": "nav-back",
          default: "none",
        }}
        exit={{
          "nav-forward": "nav-forward",
          "nav-back": "nav-back",
          default: "none",
        }}
        default="none"
      > */}
      <BlogArticle post={post} lang={lang as Lang} />
      <MiniFooter />
      {/* </ViewTransition> */}
    </>
  );
}
