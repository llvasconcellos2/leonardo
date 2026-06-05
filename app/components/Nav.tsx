"use client";
import "./Nav.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "../data";

const items = [
  { id: "work", label: { en: "Work", pt: "Trabalho" } },
  { id: "writing", label: { en: "Writing", pt: "Escrita" } },
  { id: "about", label: { en: "About", pt: "Sobre" } },
] as const;

export function Nav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const otherLang: Lang = lang === "en" ? "pt" : "en";
  const switchHref = pathname.replace(/^\/(en|pt)/, `/${otherLang}`);

  const activeId = pathname.includes("/work")
    ? "work"
    : pathname.includes("/writing")
      ? "writing"
      : "";

  const href = (id: string) =>
    id === "about" ? `/${lang}#about` : `/${lang}/${id}`;

  return (
    <header className="lv-nav">
      <Link href={`/${lang}`} className="lv-nav-mark" aria-label="Home">
        LV
      </Link>
      <nav className="lv-nav-links">
        {items.map((it) => (
          <Link
            key={it.id}
            href={href(it.id)}
            className={`lv-nav-link ${activeId === it.id ? "is-active" : ""}`}
          >
            {it.label[lang]}
          </Link>
        ))}
      </nav>
      <div className="lv-nav-right">
        <div className="lv-lang">
          {(["en", "pt"] as Lang[]).map((l) => (
            <Link
              key={l}
              href={l === lang ? "#" : switchHref}
              className={`lv-lang-b ${lang === l ? "is-on" : ""}`}
            >
              {l === "en" ? "🇺🇸" : "🇧🇷"}
            </Link>
          ))}
        </div>
        <Link href={`/${lang}#about`} className="lv-btn lv-btn-primary lv-nav-cta">
          {lang === "pt" ? "Currículo" : "Résumé"}
        </Link>
      </div>
    </header>
  );
}
