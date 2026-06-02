"use client";

import { ArrowRight } from "lucide-react";
import type { Lang } from "../data";
import type { GoFn } from "./types";

interface NavProps {
  route: string;
  go: GoFn;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const items = [
  { id: "work", label: { en: "Work", pt: "Trabalho" }, route: "archive" },
  { id: "writing", label: { en: "Writing", pt: "Escrita" }, route: "writing" },
  { id: "about", label: { en: "About", pt: "Sobre" }, route: "about" },
] as const;

export function Nav({ route, go, lang, setLang }: NavProps) {
  return (
    <header className="lv-nav">
      <button
        className="lv-nav-mark"
        onClick={() => go("home")}
        aria-label="Home"
      >
        LV
      </button>
      <nav className="lv-nav-links">
        {items.map((it) => (
          <button
            key={it.id}
            className={`lv-nav-link ${route === it.id ? "is-active" : ""}`}
            onClick={() => go(it.route)}
          >
            {it.label[lang]}
          </button>
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
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          className="lv-btn lv-btn-primary lv-nav-cta"
          onClick={() => go("about")}
        >
          {lang === "pt" ? "Currículo" : "Résumé"}
        </button>
      </div>
    </header>
  );
}
