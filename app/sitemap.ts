import type { MetadataRoute } from "next";
import { WORKS } from "@/data/work";
import { BLOG_POSTS } from "@/data/blog";
import { postSlug } from "@/app/lib/blog";
import { LANGS, pageUrl, languagesFor } from "@/app/lib/seo";
import type { Lang } from "@/data/data";

// /clinica-facil is an alias of /easy-clinic — left out on purpose.
const STATIC_PATHS = ["", "work", "blog", "resume", "easy-clinic", "juca"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const add = (pathByLang: Record<Lang, string>, lastModified?: Date) => {
    const languages = languagesFor(pathByLang);
    for (const lang of LANGS) {
      entries.push({
        url: pageUrl(lang, pathByLang[lang]),
        lastModified,
        alternates: { languages },
      });
    }
  };

  for (const p of STATIC_PATHS) add({ en: p, pt: p });
  for (const w of WORKS) add({ en: `work/${w.slug}`, pt: `work/${w.slug}` });
  for (const post of BLOG_POSTS) {
    add(
      {
        en: `blog/${postSlug(post, "en")}`,
        pt: `blog/${postSlug(post, "pt")}`,
      },
      post.modified,
    );
  }

  return entries;
}
