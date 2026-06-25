import type { Lang } from "../../data/data";
import type { BlogPost } from "../../data/blog";

/** Bilingual field accessor with PT fallback (the migrated posts are PT-only). */
export function txt(field: Record<Lang, string>, lang: Lang): string {
  return field[lang] || field.pt;
}

/** The canonical slug for a post in a given locale (always the PT slug today). */
export function postSlug(post: BlogPost, lang: Lang): string {
  return post.slug[lang] || post.slug.pt;
}

/** Localised long date, e.g. "27 de ago. de 2015" / "Aug 27, 2015". */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Categories with duplicates removed (the source data repeats some). */
export function uniqueCategories(post: BlogPost): string[] {
  return [...new Set(post.category)];
}

/** "Nenhum comentário" / "3 comentários" — matches the old WordPress meta line. */
export function commentCountLabel(n: number, lang: Lang): string {
  if (lang === "pt") {
    if (n === 0) return "Nenhum comentário";
    return n === 1 ? "1 comentário" : `${n} comentários`;
  }
  if (n === 0) return "No comments";
  return n === 1 ? "1 comment" : `${n} comments`;
}

export const BLOG_T: Record<Lang, Record<string, string>> = {
  en: {
    title: "Writing",
    lead: "Two decades of notes from the trenches — Linux, the JVM, the web stack, and the occasional war story.",
    by: "By",
    on: "On",
    inCats: "In",
    readMore: "Read more",
    back: "Back to writing",
    tags: "Tags",
    comments: "Comments",
    noComments: "No comments yet.",
    author: "author",
    pingback: "linked this post",
  },
  pt: {
    title: "Escrita",
    lead: "Duas décadas de anotações da trincheira — Linux, a JVM, a stack web e uma ou outra história de guerra.",
    by: "Por",
    on: "Em",
    inCats: "Em",
    readMore: "Leia mais",
    back: "Voltar para escrita",
    tags: "Tags",
    comments: "Comentários",
    noComments: "Nenhum comentário ainda.",
    author: "autor",
    pingback: "mencionou este post",
  },
};
