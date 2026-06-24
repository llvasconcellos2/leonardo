import "./BlogPost.css";
import "./WritingSection.css";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Kicker } from "./Primitives";
import { PostCard } from "./WritingSection";
import { POSTS, T } from "../../data/data";
import type { Lang } from "../../data/data";

export function BlogPost({ lang, id }: { lang: Lang; id: string | null }) {
  const post = POSTS.find((x) => x.id === id) || POSTS[0];
  const t = T[lang];
  const body =
    lang === "pt"
      ? [
          "A maioria dos meus ~70 projetos enviados foi descontinuada. Em vez de deixá-los morrer como links quebrados, eu os rastreei e os auto-hospedo como snapshots honestos.",
          "O truque não é só o crawler. É tratar cada captura como um artefato versionado — caminhos reescritos, mixed-content resolvido, e um rótulo claro de que aquilo é um arquivo, não o sistema vivo.",
          "O ato de fazer isso já é um sinal de ofício. Mostra como penso sobre sistemas que devem durar mais do que o contrato que os criou.",
        ]
      : [
          "Most of my ~70 shipped projects are discontinued. Rather than let them rot into broken links, I crawled and now self-host them as honest snapshots.",
          "The trick is not just the crawler. It is treating each capture as a versioned artifact — rewritten paths, resolved mixed-content, and a clear label that this is an archive, not the live system.",
          "The act of doing it is itself a craft signal. It shows how I think about systems meant to outlast the contract that created them.",
        ];

  return (
    <article className="lv-read">
      <Link href={`/${lang}/writing`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {t.back}
      </Link>
      <Kicker as="p">{post.kicker[lang]}</Kicker>
      <h1 className="lv-read-title">{post.title[lang]}</h1>
      <div className="lv-read-meta">
        <span>{post.date}</span>
        <span>
          {post.read} {t.minRead}
        </span>
        <span>PT-BR · EN</span>
      </div>
      <div className="prose lv-read-body">
        <p className="lv-read-lede">{post.excerpt[lang]}</p>
        {body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <pre className="lv-code-block">
          <code>
            <span className="cm">// crawl + rewrite + self-host</span>
            {"\n"}
            <span className="kw">const</span> snap ={" "}
            <span className="kw">await</span> crawl(url,{" "}
            {"{ rewriteBase: "}
            <span className="tr">true</span>
            {" }"});
          </code>
        </pre>
        <p>
          {lang === "pt"
            ? "É assim que 70 sistemas mortos continuam contando a história."
            : "That is how 70 dead systems keep telling the story."}
        </p>
      </div>
    </article>
  );
}

export function WritingIndex({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <section className="lv-section">
      <Link href={`/${lang}`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {t.back}
      </Link>
      <Kicker as="p">// the engine</Kicker>
      <h1 className="lv-archive-title">{t.writing}</h1>
      <p className="lv-archive-lead">{t.writingLead}</p>
      <div className="lv-posts lv-posts-index">
        {POSTS.map((p) => (
          <PostCard key={p.id} post={p} lang={lang} />
        ))}
      </div>
    </section>
  );
}
