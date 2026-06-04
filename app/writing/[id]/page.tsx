import type { Metadata } from "next";
import { POSTS } from "../../data";
import { BlogPost } from "../../components/BlogPost";
import { MiniFooter } from "../../components/ContactFooter";

export function generateStaticParams() {
  return POSTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = POSTS.find((x) => x.id === id) || POSTS[0];
  return {
    title: `${post.title.en} — Leonardo Vasconcellos`,
    description: post.excerpt.en,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <BlogPost id={id} />
      <MiniFooter />
    </>
  );
}
