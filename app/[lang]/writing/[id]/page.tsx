import type { Metadata } from "next";
import { POSTS } from "../../../data";
import { BlogPost } from "../../../components/BlogPost";
import { MiniFooter } from "../../../components/ContactFooter";
import type { Lang } from "../../../data";

export function generateStaticParams() {
  return POSTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const post = POSTS.find((x) => x.id === id) || POSTS[0];
  const l = lang as Lang;
  return {
    title: `${post.title[l]} — Leonardo Vasconcellos`,
    description: post.excerpt[l],
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  return (
    <>
      <BlogPost lang={lang as Lang} id={id} />
      <MiniFooter />
    </>
  );
}
