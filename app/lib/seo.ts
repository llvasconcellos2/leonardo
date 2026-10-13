import type { Metadata } from "next";
import type { Lang } from "@/data/data";

export const SITE_URL = "https://leonardo-vasconcellos.vercel.app";
export const LANGS: Lang[] = ["en", "pt"];

/**
 * Absolute URL for a localised page. Always ends with "/" to match
 * `trailingSlash: true` — slash-less URLs 308-redirect and never get indexed.
 */
export function pageUrl(lang: Lang, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return `${SITE_URL}/${lang}/${clean ? `${clean}/` : ""}`;
}

/** hreflang map for a page whose path may differ per locale (e.g. blog slugs). */
export function languagesFor(pathByLang: Record<Lang, string>) {
  return {
    en: pageUrl("en", pathByLang.en),
    pt: pageUrl("pt", pathByLang.pt),
    "x-default": pageUrl("en", pathByLang.en),
  };
}

/** `alternates` metadata: canonical for `lang` plus hreflang for both locales. */
export function alternatesFor(
  lang: Lang,
  path: string | Record<Lang, string> = "",
): Metadata["alternates"] {
  const byLang = typeof path === "string" ? { en: path, pt: path } : path;
  return {
    canonical: pageUrl(lang, byLang[lang]),
    languages: languagesFor(byLang),
  };
}
