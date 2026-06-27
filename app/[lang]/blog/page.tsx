import type { Metadata } from "next";
import { headers } from "next/headers";
import { BlogIndex } from "@/app/components/BlogIndex";
import { MiniFooter } from "@/app/components/ContactFooter";
import { BLOG_T, isNotBlogPath } from "@/app/lib/blog";
import type { Lang } from "@/data/data";

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
  const headersList = await headers();
  // const referrer = headersList.get("referer");

  const { lang } = await params;

  return (
    // <div className={isNotBlogPath(referrer ?? "") ? "enable-smooth" : ""}>
    <div className="enable-smooth">
      <BlogIndex lang={lang as Lang} />
      <MiniFooter />
    </div>
  );
}
