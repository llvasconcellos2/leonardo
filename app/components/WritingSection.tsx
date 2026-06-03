"use client";
import "./WritingSection.css";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Kicker } from "./Primitives";
import { POSTS, T } from "../data";
import type { Lang, Post } from "../data";
import type { GoFn } from "./types";

export function PostCard({
  post,
  lang,
  go,
}: {
  post: Post;
  lang: Lang;
  go: GoFn;
}) {
  const t = T[lang];
  return (
    <article className="lv-post" onClick={() => go("post", post.id)}>
      <Kicker as="p">{post.kicker[lang]}</Kicker>
      <h3 className="lv-post-title">{post.title[lang]}</h3>
      <p className="lv-post-excerpt">{post.excerpt[lang]}</p>
      <div className="lv-post-meta">
        <span>{post.date}</span>
        <span>
          {post.read} {t.minRead}
        </span>
        <span className="lv-link-arrow lv-post-read">
          {t.readMore} <ArrowUpRight size={12} />
        </span>
      </div>
    </article>
  );
}

export function WritingSection({ lang, go }: { lang: Lang; go: GoFn }) {
  const t = T[lang];
  return (
    <section className="lv-section lv-writing" id="writing">
      <div className="lv-section-head">
        <Kicker as="p">// the engine</Kicker>
        <h2 className="lv-section-title">{t.writing}</h2>
        <p className="lv-writing-lead">{t.writingLead}</p>
      </div>
      <div className="lv-posts">
        {POSTS.map((p) => (
          <PostCard key={p.id} post={p} lang={lang} go={go} />
        ))}
      </div>
      <button
        className="lv-link-arrow lv-writing-all"
        onClick={() => go("writing")}
      >
        {t.allWriting} <ArrowRight size={15} />
      </button>
    </section>
  );
}
