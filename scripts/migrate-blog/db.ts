import { extractTableRows, loadSqlDump, type SqlRow } from "./sql-parser";

export interface PublishedPost {
  id: number;
  authorId: number;
  date: string; // raw "YYYY-MM-DD HH:MM:SS"
  modified: string;
  title: string;
  excerpt: string;
  slug: string;
}

export interface SqlComment {
  id: number;
  postId: number;
  author: string;
  authorEmail: string | null;
  authorUrl: string | null;
  date: string; // raw "YYYY-MM-DD HH:MM:SS"
  content: string;
  approved: string; // '0' | '1' | 'spam' | 'trash'
  type: string; // '' | 'pingback' | 'trackback'
  parent: number;
  userId: number;
}

export interface CategoriesAndTags {
  categories: string[];
  tags: string[];
}

export interface SqlAuthor {
  id: number;
  name: string;
  email: string;
}

export interface DbData {
  postsBySlug: Map<string, PublishedPost>;
  commentsByPostId: Map<number, SqlComment[]>;
  commentsById: Map<number, SqlComment>;
  featuredImagePathByPostId: Map<number, string>;
  categoriesAndTagsByPostId: Map<number, CategoriesAndTags>;
  authorById: Map<number, SqlAuthor>;
  authorBioByUserId: Map<number, string>;
}

function str(v: SqlRow[string], fallback = ""): string {
  return typeof v === "string" ? v : v == null ? fallback : String(v);
}

function num(v: SqlRow[string], fallback = 0): number {
  return typeof v === "number" ? v : Number(v ?? fallback);
}

export function loadDatabase(): DbData {
  const sql = loadSqlDump();

  const postRows = extractTableRows(sql, "posts");
  const commentRows = extractTableRows(sql, "comments");
  const postmetaRows = extractTableRows(sql, "postmeta");
  const usermetaRows = extractTableRows(sql, "usermeta");
  const termRelRows = extractTableRows(sql, "term_relationships");
  const termTaxRows = extractTableRows(sql, "term_taxonomy");
  const termRows = extractTableRows(sql, "terms");
  const userRows = extractTableRows(sql, "users");

  // --- Published posts, keyed by slug ---
  const postsBySlug = new Map<string, PublishedPost>();
  for (const row of postRows) {
    if (row.post_type !== "post" || row.post_status !== "publish") continue;
    const slug = str(row.post_name);
    if (!slug) continue;
    postsBySlug.set(slug, {
      id: num(row.ID),
      authorId: num(row.post_author),
      date: str(row.post_date),
      modified: str(row.post_modified),
      title: str(row.post_title),
      excerpt: str(row.post_excerpt),
      slug,
    });
  }

  // --- Comments, filtered to approved only, keyed by post id ---
  const commentsByPostId = new Map<number, SqlComment[]>();
  const commentsById = new Map<number, SqlComment>();
  for (const row of commentRows) {
    const approved = str(row.comment_approved);
    if (approved !== "1") continue;
    const comment: SqlComment = {
      id: num(row.comment_ID),
      postId: num(row.comment_post_ID),
      author: str(row.comment_author),
      authorEmail: str(row.comment_author_email) || null,
      authorUrl: str(row.comment_author_url) || null,
      date: str(row.comment_date),
      content: str(row.comment_content),
      approved,
      type: str(row.comment_type),
      parent: num(row.comment_parent),
      userId: num(row.user_id),
    };
    commentsById.set(comment.id, comment);
    const list = commentsByPostId.get(comment.postId) ?? [];
    list.push(comment);
    commentsByPostId.set(comment.postId, list);
  }

  // --- Featured images: _thumbnail_id (per post) -> _wp_attached_file (per attachment) ---
  const thumbnailIdByPostId = new Map<number, number>();
  const attachedFileByAttachmentId = new Map<number, string>();
  for (const row of postmetaRows) {
    const key = str(row.meta_key);
    const postId = num(row.post_id);
    if (key === "_thumbnail_id") {
      thumbnailIdByPostId.set(postId, num(row.meta_value));
    } else if (key === "_wp_attached_file") {
      attachedFileByAttachmentId.set(postId, str(row.meta_value));
    }
  }
  const featuredImagePathByPostId = new Map<number, string>();
  for (const [postId, attachmentId] of thumbnailIdByPostId) {
    const file = attachedFileByAttachmentId.get(attachmentId);
    if (file) featuredImagePathByPostId.set(postId, file);
  }

  // --- Categories & tags ---
  const termNameById = new Map<number, string>();
  for (const row of termRows) {
    termNameById.set(num(row.term_id), str(row.name));
  }
  const taxonomyByTermTaxonomyId = new Map<
    number,
    { termId: number; taxonomy: string }
  >();
  for (const row of termTaxRows) {
    taxonomyByTermTaxonomyId.set(num(row.term_taxonomy_id), {
      termId: num(row.term_id),
      taxonomy: str(row.taxonomy),
    });
  }
  const categoriesAndTagsByPostId = new Map<number, CategoriesAndTags>();
  for (const row of termRelRows) {
    const objectId = num(row.object_id);
    const ttId = num(row.term_taxonomy_id);
    const tax = taxonomyByTermTaxonomyId.get(ttId);
    if (!tax) continue;
    const name = termNameById.get(tax.termId);
    if (!name) continue;
    const entry =
      categoriesAndTagsByPostId.get(objectId) ?? { categories: [], tags: [] };
    if (tax.taxonomy === "category") entry.categories.push(name);
    else if (tax.taxonomy === "post_tag") entry.tags.push(name);
    categoriesAndTagsByPostId.set(objectId, entry);
  }

  // --- Author identity & bio ---
  const authorById = new Map<number, SqlAuthor>();
  for (const row of userRows) {
    authorById.set(num(row.ID), {
      id: num(row.ID),
      name: str(row.display_name) || str(row.user_login),
      email: str(row.user_email),
    });
  }
  const authorBioByUserId = new Map<number, string>();
  for (const row of usermetaRows) {
    if (str(row.meta_key) !== "description") continue;
    const bio = str(row.meta_value);
    if (bio) authorBioByUserId.set(num(row.user_id), bio);
  }

  return {
    postsBySlug,
    commentsByPostId,
    commentsById,
    featuredImagePathByPostId,
    categoriesAndTagsByPostId,
    authorById,
    authorBioByUserId,
  };
}
