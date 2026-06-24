import fs from "node:fs";
import { loadDatabase } from "./db";
import { enumerateSlugs, extractAuthorAvatar, extractPost, type ExtractedComment } from "./html-extractor";
import { avatarStats, ensurePublicDirs } from "./images";
import { buildBlogDataModule } from "./serialize";
import { OUTPUT_DATA_FILE } from "./constants";

function countComments(comments: ExtractedComment[]): number {
  let n = comments.length;
  for (const c of comments) n += countComments(c.replies);
  return n;
}

async function main() {
  const warnings: string[] = [];
  const warn = (message: string) => warnings.push(message);

  ensurePublicDirs();

  console.log("Parsing SQL dump...");
  const db = loadDatabase();

  console.log("Enumerating published post slugs...");
  const slugs = enumerateSlugs(db, warn);
  const knownSlugs = new Set(slugs);

  // Single-author site — confirmed by the SQL dump (one row in wp_users).
  const sqlAuthor = [...db.authorById.values()][0];
  if (!sqlAuthor) throw new Error("No author found in wp_users");
  const authorAvatar = await extractAuthorAvatar(warn);
  const author = {
    name: sqlAuthor.name,
    email: sqlAuthor.email,
    avatar: authorAvatar ?? "",
    about: db.authorBioByUserId.get(sqlAuthor.id) ?? "",
  };

  console.log(`Extracting ${slugs.length} posts...`);
  const posts: unknown[] = [];
  const diagnostics: { slug: string; rendered: number; rawApproved: number }[] = [];

  for (const slug of slugs) {
    const extracted = await extractPost(slug, db, knownSlugs, warn);
    const rendered = countComments(extracted.comments);
    const rawApproved = db.commentsByPostId.get(extracted.id)?.length ?? 0;
    diagnostics.push({ slug, rendered, rawApproved });

    posts.push({
      id: extracted.id,
      slug: extracted.slug,
      date: extracted.date,
      modified: extracted.modified,
      featuredImage: extracted.featuredImage,
      category: extracted.category,
      tags: extracted.tags,
      featured: false,
      author,
      comments: extracted.comments,
      commentCount: extracted.commentCount,
      title: { pt: extracted.title, en: "" },
      excerpt: { pt: extracted.excerpt, en: "" },
      content: { pt: extracted.content, en: "" },
    });
  }

  if (posts.length !== knownSlugs.size) {
    throw new Error(`Expected ${knownSlugs.size} posts, but extracted ${posts.length}`);
  }

  posts.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());

  console.log("Writing data/blog.ts...");
  fs.writeFileSync(OUTPUT_DATA_FILE, buildBlogDataModule(posts), "utf8");

  const totalComments = diagnostics.reduce((sum, d) => sum + d.rendered, 0);
  const mismatches = diagnostics.filter((d) => d.rendered !== d.rawApproved);

  console.log("\n=== Migration summary ===");
  console.log(`Posts written: ${posts.length}`);
  console.log(`Comments written (flattened, incl. pingbacks): ${totalComments}`);
  console.log(`Avatars — local: ${avatarStats.local}, live-fetched: ${avatarStats.liveFetched}, failed: ${avatarStats.failed}`);
  console.log(`Posts with featured image: ${posts.filter((p: any) => p.featuredImage).length} / ${posts.length}`);

  if (mismatches.length) {
    console.log("\n--- Per-post comment count diagnostics (rendered vs raw-approved-in-SQL) ---");
    for (const d of mismatches) {
      console.log(`  ${d.slug}: rendered=${d.rendered} raw=${d.rawApproved}`);
    }
  }

  console.log(`\n--- Warnings (${warnings.length}) ---`);
  for (const w of warnings) console.log(`  ${w}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
