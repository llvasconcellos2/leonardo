"use client";
import "./Nav.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import type { Lang } from "../data";

const items = [
  { id: "work", label: { en: "Work", pt: "Trabalho" }, href: "/work" },
  { id: "writing", label: { en: "Writing", pt: "Escrita" }, href: "/writing" },
  { id: "about", label: { en: "About", pt: "Sobre" }, href: "/#about" },
] as const;

export function Nav() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();

  const activeId = pathname.startsWith("/work")
    ? "work"
    : pathname.startsWith("/writing")
      ? "writing"
      : "";

  return (
    <header className="lv-nav">
      <Link href="/" className="lv-nav-mark" aria-label="Home">
        LV
      </Link>
      <nav className="lv-nav-links">
        {items.map((it) => (
          <Link
            key={it.id}
            href={it.href}
            className={`lv-nav-link ${activeId === it.id ? "is-active" : ""}`}
          >
            {it.label[lang]}
          </Link>
        ))}
      </nav>
      <div className="lv-nav-right">
        <div className="lv-lang">
          {(["en", "pt"] as Lang[]).map((l) => (
            <button
              key={l}
              className={`lv-lang-b ${lang === l ? "is-on" : ""}`}
              onClick={() => setLang(l)}
            >
              {l === "en" ? "🇺🇸" : "🇧🇷"}
            </button>
          ))}
        </div>
        <Link href="/#about" className="lv-btn lv-btn-primary lv-nav-cta">
          {lang === "pt" ? "Currículo" : "Résumé"}
        </Link>
      </div>
    </header>
  );
}
