"use client";
import "./WritingSection.css";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Kicker } from "./Primitives";
import { POSTS, T } from "../data";
import type { Post } from "../data";
import { useLanguage } from "./LanguageProvider";

export function PostCard({ post }: { post: Post }) {
  const { lang } = useLanguage();
  const t = T[lang];
  const router = useRouter();
  return (
    <article
      className="lv-post"
      onClick={() => router.push(`/writing/${post.id}`)}
      style={{ cursor: "pointer" }}
    >
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

export function WritingSection() {
  const { lang } = useLanguage();
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
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <Link href="/writing" className="lv-link-arrow lv-writing-all">
        {t.allWriting} <ArrowRight size={15} />
      </Link>
    </section>
  );
}
