import "./WritingSection.css";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Kicker } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { BLOG_POSTS } from "@/data/blog";
import type { BlogPost } from "@/data/blog";
import type { Lang } from "@/data/data";
import { formatDate, postSlug, txt, uniqueCategories } from "../lib/blog";

const WRITING_T: Record<Lang, Record<string, string>> = {
  en: {
    writing: "Writing",
    writingLead:
      "My technical blog. At first the idea was to build a cheat sheet of technical things so I wouldn't forget them. It turns out the blog has already passed a million views!",
    allWriting: "All writing",
    readMore: "Read",
    minRead: "read",
  },
  pt: {
    writing: "Escrita",
    writingLead:
      'Meu blog técnico. De início a ideia era criar uma "colinha" sobre coisas técnicas para que eu não esquecesse. Acabou que o blog já soma mais de um milhão de visualizações!',
    allWriting: "Toda a escrita",
    readMore: "Ler",
    minRead: "leitura",
  },
};

const PINNED_POSTS = BLOG_POSTS.filter((p) => p.pinned)
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 3);

function readMinutes(post: BlogPost, lang: Lang): number {
  const words = txt(post.content, lang).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function PostCard({ post, lang }: { post: BlogPost; lang: Lang }) {
  const t = WRITING_T[lang];
  const kicker = uniqueCategories(post)[0];
  return (
    <Link
      href={`/${lang}/blog/${postSlug(post, lang)}`}
      className="lv-post"
    >
      <div className="lv-post-figure" aria-hidden="true">
        {post.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.featuredImage} alt="" loading="lazy" />
        ) : (
          <LowPolyField seed={post.id} />
        )}
      </div>
      {kicker && <Kicker as="p">{kicker}</Kicker>}
      <h3 className="lv-post-title">{txt(post.title, lang)}</h3>
      <p className="lv-post-excerpt">{txt(post.excerpt, lang)}</p>
      <div className="lv-post-meta">
        <span>{formatDate(post.date, lang)}</span>
        <span>
          {readMinutes(post, lang)} min {t.minRead}
        </span>
        <span className="lv-link-arrow lv-post-read">
          {t.readMore} <ArrowUpRight size={12} />
        </span>
      </div>
    </Link>
  );
}

export function WritingSection({ lang }: { lang: Lang }) {
  const t = WRITING_T[lang];
  return (
    <section className="lv-section lv-writing" id="writing">
      <div className="lv-section-head">
        <Kicker as="p">// the engine</Kicker>
        <h2 className="lv-section-title">{t.writing}</h2>
        <p className="lv-writing-lead">{t.writingLead}</p>
      </div>
      <div className="lv-posts">
        {PINNED_POSTS.map((p) => (
          <PostCard key={p.id} post={p} lang={lang} />
        ))}
      </div>
      <Link href={`/${lang}/blog`} className="lv-link-arrow lv-writing-all">
        {t.allWriting} <ArrowRight size={15} />
      </Link>
    </section>
  );
}
