/**
 * Minimal recursive serializer that emits valid TypeScript object/array
 * literal syntax for plain data (strings, numbers, booleans, null, Date,
 * arrays, plain objects) — used instead of JSON.stringify because JSON has
 * no way to represent a `Date` as a `new Date("...")` constructor call.
 */

function indent(level: number): string {
  return "  ".repeat(level);
}

export function serializeValue(value: unknown, level = 0): string {
  if (value === null || value === undefined) return "null";
  if (value instanceof Date) return `new Date(${JSON.stringify(value.toISOString())})`;
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => indent(level + 1) + serializeValue(v, level + 1));
    return `[\n${items.join(",\n")},\n${indent(level)}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines = entries.map(
      ([key, v]) => `${indent(level + 1)}${JSON.stringify(key)}: ${serializeValue(v, level + 1)}`
    );
    return `{\n${lines.join(",\n")},\n${indent(level)}}`;
  }

  throw new Error(`Cannot serialize value of type ${typeof value}`);
}

export function buildBlogDataModule(posts: unknown[]): string {
  return `import type { Lang } from "./data";

export interface BlogAuthor {
  name: string;
  email: string;
  avatar: string;
  about: string;
}

export interface BlogComment {
  id: number;
  author: string;
  authorUrl: string | null;
  authorEmail: string | null;
  avatar: string | null;
  isAuthor: boolean;
  isPingback: boolean;
  date: Date;
  content: string;
  replies: BlogComment[];
}

export interface BlogPost {
  id: number;
  slug: Record<Lang, string>;
  date: Date;
  modified: Date;
  featuredImage: string | null;
  category: string[];
  tags: string[];
  featured: boolean;
  author: BlogAuthor;
  comments: BlogComment[];
  commentCount: number;
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  content: Record<Lang, string>;
}

export const BLOG_POSTS: BlogPost[] = ${serializeValue(posts)};
`;
}
