import "./BlogIndex.css";

import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowUpRight, MessageSquare } from "lucide-react";
import { Kicker } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { BLOG_POSTS } from "@/data/blog";
import type { BlogPost } from "@/data/blog";
import {
  BLOG_T,
  commentCountLabel,
  formatDate,
  postSlug,
  txt,
  uniqueCategories,
} from "../lib/blog";
import type { Lang } from "@/data/data";

function BlogRow({ post, lang }: { post: BlogPost; lang: Lang }) {
  const t = BLOG_T[lang];
  const href = `/${lang}/blog/${postSlug(post, lang)}`;
  const cats = uniqueCategories(post);

  return (
    <li className="lv-bl-row">
      {/* LEFT — entry meta */}
      <div className="lv-bl-meta">
        <p className="lv-bl-by">
          <ViewTransition name={`post-author-${post.id}`} share="morph">
            {t.by} <span className="lv-bl-author">{post.author.name}</span>
          </ViewTransition>
        </p>
        <ViewTransition name={`post-date-${post.id}`} share="morph">
          <p className="lv-bl-date">
            {t.on} {formatDate(post.date, lang)}
          </p>
        </ViewTransition>
        {cats.length > 0 && (
          <p className="lv-bl-cats">
            {t.inCats}{" "}
            {cats.map((c, i) => (
              <span key={c}>
                <span className="lv-bl-cat">{c}</span>
                {i < cats.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
        <ViewTransition name={`post-comments-${post.id}`} share="morph">
          <p className="lv-bl-comments">
            <MessageSquare size={13} />
            {commentCountLabel(post.commentCount, lang)}
          </p>
        </ViewTransition>
      </div>

      {/* RIGHT — entry content */}
      <div className="lv-bl-content">
        <ViewTransition name={`post-title-${post.id}`} share="morph">
          <h2 className="lv-bl-title">
            <Link href={href} transitionTypes={["nav-forward"]}>
              {txt(post.title, lang)}
            </Link>
          </h2>
        </ViewTransition>
        <Link
          href={href}
          className="lv-bl-figure"
          aria-hidden="true"
          tabIndex={-1}
        >
          <ViewTransition name={`post-image-${post.id}`} share="morph">
            {post.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.featuredImage} alt="" loading="lazy" />
            ) : (
              <LowPolyField seed={post.id} />
            )}
          </ViewTransition>
        </Link>

        <p className="lv-bl-excerpt">{txt(post.excerpt, lang)}</p>

        <Link href={href} className="lv-bl-more">
          {t.readMore} <ArrowUpRight size={14} />
        </Link>
      </div>
    </li>
  );
}

export function BlogIndex({ lang }: { lang: Lang }) {
  const t = BLOG_T[lang];
  const posts = [...BLOG_POSTS].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return (
    <section className="lv-section lv-blog-index">
      <Link href={`/${lang}`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {lang === "pt" ? "Início" : "Home"}
      </Link>
      <div className="lv-section-head">
        <Kicker as="p">// the engine</Kicker>
        <h1 className="lv-blog-h1">{t.title}</h1>
        <p className="lv-blog-lead">{t.lead}</p>
      </div>
      <ul className="lv-bl-list">
        {posts.map((p) => (
          <BlogRow key={p.id} post={p} lang={lang} />
        ))}
      </ul>
    </section>
  );
}
