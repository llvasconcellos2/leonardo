import "./BlogArticle.css";
import { headers } from "next/headers";
import { ViewTransition } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Kicker } from "./Primitives";
import { LowPolyField } from "./LowPolyField";
import { Markdown } from "./Markdown";
import type { BlogComment, BlogPost } from "@/data/blog";
import {
  BLOG_T,
  commentCountLabel,
  formatDate,
  txt,
  uniqueCategories,
} from "../lib/blog";
import type { Lang } from "@/data/data";
import { BlogBackLink } from "./BlogBackLink";

function CommentNode({ comment, lang }: { comment: BlogComment; lang: Lang }) {
  const t = BLOG_T[lang];
  return (
    <li className={`lv-cmt ${comment.isPingback ? "is-pingback" : ""}`}>
      <div className="lv-cmt-head">
        {comment.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="lv-cmt-avatar"
            src={comment.avatar}
            alt=""
            loading="lazy"
          />
        ) : (
          <span
            className="lv-cmt-avatar lv-cmt-avatar-blank"
            aria-hidden="true"
          />
        )}
        <div className="lv-cmt-ident">
          <span className="lv-cmt-author">
            {comment.authorUrl ? (
              <a
                href={comment.authorUrl}
                rel="nofollow noopener noreferrer ugc"
              >
                {comment.author}
              </a>
            ) : (
              comment.author
            )}
            {comment.isAuthor && (
              <span className="lv-cmt-badge">{t.author}</span>
            )}
            {comment.isPingback && (
              <span className="lv-cmt-badge lv-cmt-badge-ping">
                {t.pingback}
              </span>
            )}
          </span>
          <time className="lv-cmt-date">{formatDate(comment.date, lang)}</time>
        </div>
      </div>
      <div className="lv-cmt-body">
        <Markdown
          source={comment.content}
          lang={lang}
          className="lv-md lv-md-tight"
        />
      </div>
      {comment.replies.length > 0 && (
        <ul className="lv-cmt-replies">
          {comment.replies.map((r) => (
            <CommentNode key={r.id} comment={r} lang={lang} />
          ))}
        </ul>
      )}
    </li>
  );
}

export async function BlogArticle({
  post,
  lang,
}: {
  post: BlogPost;
  lang: Lang;
}) {
  const t = BLOG_T[lang];
  const cats = uniqueCategories(post);

  const headersList = await headers();
  const referrer = headersList.get("referer");

  return (
    <article className="lv-section lv-article">
      <BlogBackLink referrer={referrer ?? ""}>
        <ArrowLeft size={15} /> {t.back}
      </BlogBackLink>

      <header className="lv-article-head">
        {cats.length > 0 && <Kicker as="p">// {cats.join(" · ")}</Kicker>}
        <ViewTransition name={`post-title-${post.id}`} share="morph">
          <h1 className="lv-article-title">{txt(post.title, lang)}</h1>
        </ViewTransition>
        <div className="lv-article-meta">
          <span>
            <ViewTransition name={`post-author-${post.id}`} share="morph">
              {t.by} <span className="lv-blog-author">{post.author.name}</span>
            </ViewTransition>
          </span>
          <ViewTransition name={`post-date-${post.id}`} share="morph">
            <span className="lv-article-date">
              {formatDate(post.date, lang)}
            </span>
          </ViewTransition>
          <ViewTransition name={`post-comments-${post.id}`} share="morph">
            <span className="lv-article-cmtcount">
              <MessageSquare size={13} />
              {commentCountLabel(post.commentCount, lang)}
            </span>
          </ViewTransition>
        </div>
      </header>
      <ViewTransition name={`post-image-${post.id}`} share="morph">
        <div className="lv-article-figure">
          {post.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.featuredImage} alt="" />
          ) : (
            <LowPolyField seed={post.id} />
          )}
        </div>
      </ViewTransition>
      <Markdown
        source={txt(post.content, lang)}
        lang={lang}
        className="lv-md lv-article-body"
      />

      {post.tags.length > 0 && (
        <div className="lv-article-tags">
          <span className="lv-article-tags-label">{t.tags}</span>
          {[...new Set(post.tags)].map((tag) => (
            <span key={tag} className="lv-article-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <section className="lv-comments" id="comments">
        <h2 className="lv-comments-title">
          {t.comments}{" "}
          <span className="lv-comments-count">{post.commentCount}</span>
        </h2>
        {post.comments.length > 0 ? (
          <ul className="lv-cmt-list">
            {post.comments.map((c) => (
              <CommentNode key={c.id} comment={c} lang={lang} />
            ))}
          </ul>
        ) : (
          <p className="lv-comments-empty">{t.noComments}</p>
        )}
      </section>
    </article>
  );
}
