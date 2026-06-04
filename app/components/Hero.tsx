"use client";
import "./Hero.css";

import Link from "next/link";
import { ArrowRight, ChevronsDown } from "lucide-react";
import { LowPolyField } from "./LowPolyField";
import { LeoLowPoly } from "./LeoLowPoly";
import { Blueprint } from "./BluePrint";
import { BGPattern } from "./BG-Pattern";
import { useLanguage } from "./LanguageProvider";

const heroCopy = {
  en: {
    kicker: "// full-stack engineer · since 2005",
    tagline:
      "From Doctors Without Borders to smart cities — two decades building the software people depend on.",
    subline:
      "I take tangled, mission-critical systems and make them scale: clean, fast, built to last.",
    cta: "View résumé",
    cta2: "Selected work",
  },
  pt: {
    kicker: "// engenheiro full-stack · desde 2005",
    tagline:
      "De Médicos Sem Fronteiras a cidades inteligentes — duas décadas construindo o software de que as pessoas dependem.",
    subline:
      "Eu transformo sistemas complexos e essenciais em soluções escaláveis: limpas, rápidas e feitas para durar.",
    cta: "Ver currículo",
    cta2: "Trabalho selecionado",
  },
};

export function Hero({
  background = "none",
}: {
  background?: "none" | "lowpoly" | "shader" | "pattern";
}) {
  const { lang } = useLanguage();
  const c = heroCopy[lang];
  const hasField =
    background === "lowpoly" ||
    background === "shader" ||
    background === "pattern";
  return (
    <section className={"lv-hero lv-hero-background"}>
      {hasField && (
        <div className="lv-hero-field">
          {background === "lowpoly" && (
            <LowPolyField
              seed={42}
              style={{ position: "absolute", inset: 0 }}
            />
          )}
          {background === "shader" && (
            <div style={{ position: "absolute", inset: 0, height: "100dvh" }}>
              <Blueprint />
            </div>
          )}
          {background === "pattern" && (
            <BGPattern variant="grid" mask="fade-edges" style={{ zIndex: 1 }} />
          )}
          <div className="lv-hero-scrim" />
          <div className="lv-hero-ghost">LV</div>
        </div>
      )}
      <div className="lv-hero-inner">
        <p className="lv-kicker lv-hero-kicker">{c.kicker}</p>
        <h1 className="lv-hero-name">LEONARDO VASCONCELLOS</h1>
        <p className="lv-hero-tagline">{c.tagline}</p>
        <p className="lv-hero-subline">{c.subline}</p>
        <div className="lv-hero-actions">
          <Link href="/#about" className="lv-btn lv-btn-primary">
            {c.cta} <ArrowRight size={16} />
          </Link>
          <Link href="/work" className="lv-btn lv-btn-ghost">
            {c.cta2}
          </Link>
        </div>
      </div>
      <div className="lv-hero-leolowpoly">
        <LeoLowPoly className="" />
      </div>
      <div className="lv-hero-scrollhint">
        <ChevronsDown size={22} />
      </div>
    </section>
  );
}
