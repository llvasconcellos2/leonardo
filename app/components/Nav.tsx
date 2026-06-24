"use client";
import "./Nav.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "../data";

const items = [
  { id: "home", path: "/", label: { en: "Home", pt: "Início" } },
  { id: "work", path: "/work", label: { en: "Work", pt: "Trabalho" } },
  { id: "writing", path: "/blog", label: { en: "Writing", pt: "Escrita" } },
  { id: "about", path: "/#about", label: { en: "About", pt: "Sobre" } },
] as const;

export function Nav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const otherLang: Lang = lang === "en" ? "pt" : "en";
  const switchHref = pathname.replace(/^\/(en|pt)/, `/${otherLang}`);

  const activeId = pathname.includes("/work")
    ? "work"
    : pathname.includes("/writing")
      ? "writing"
      : pathname === `/${lang}`
        ? "home"
        : "";

  return (
    <header className="lv-nav">
      <Link href={`/${lang}`} className="lv-nav-mark" aria-label="Home">
        LV
      </Link>
      <nav className="lv-nav-links">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${lang}${item.path}`}
            className={`lv-nav-link ${activeId === item.id ? "is-active" : ""}`}
          >
            {item.label[lang]}
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
        <Link
          href={`/${lang}/resume`}
          className="lv-btn lv-btn-primary lv-nav-cta"
        >
          {lang === "pt" ? "Currículo" : "Résumé"}
        </Link>
      </div>
    </header>
  );
}
