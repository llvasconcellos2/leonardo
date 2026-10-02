"use client";
import "./Nav.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Lang } from "@/data/data";

const items = [
  { id: "home", path: "/", label: { en: "Home", pt: "Início" } },
  { id: "work", path: "/work", label: { en: "Work", pt: "Trabalho" } },
  { id: "writing", path: "/blog", label: { en: "Writing", pt: "Escrita" } },
  {
    id: "clinica-facil",
    path: "/easy-clinic",
    label: { en: "Easy Clinic", pt: "Clínica Fácil" },
  },
  { id: "juca", path: "/juca", label: { en: "Juca", pt: "Juca" } },
  { id: "about", path: "/#about", label: { en: "About", pt: "Sobre" } },
] as const;

export function Nav({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes.
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    // The app scrolls inside .lv-scroll, not the window — lock that instead.
    const scroller = document.querySelector<HTMLElement>(".lv-scroll");
    const prevOverflow = scroller?.style.overflow ?? "";
    if (scroller) scroller.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    // Past the breakpoint the panel is hidden by CSS; drop the open state too.
    const desktop = window.matchMedia("(min-width: 861px)");
    const onDesktop = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      if (scroller) scroller.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const toggle = () => {
    setOpenedAt(pathname);
    setOpen((o) => !o);
  };
  const otherLang: Lang = lang === "en" ? "pt" : "en";
  const switchHref = pathname.replace(/^\/(en|pt)/, `/${otherLang}`);

  const activeId = pathname.includes("/work")
    ? "work"
    : pathname.includes("/blog") || pathname.includes("/writing")
      ? "writing"
      : pathname.includes("/easy-clinic") ||
          pathname.includes("/clinica-facil")
        ? "clinica-facil"
        : pathname.includes("/juca")
          ? "juca"
          : pathname === `/${lang}`
            ? "home"
            : "";

  return (
    // <header className="lv-nav" style={{ viewTransitionName: "site-header" }}>
    <header
      className={`lv-nav ${open ? "is-menu-open" : ""}`}
      style={{ viewTransitionName: "site-header" }}
    >
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
        <button
          ref={toggleRef}
          type="button"
          className="lv-nav-toggle"
          aria-expanded={open}
          aria-controls="lv-nav-menu"
          aria-label={
            open
              ? lang === "pt"
                ? "Fechar menu"
                : "Close menu"
              : lang === "pt"
                ? "Abrir menu"
                : "Open menu"
          }
          onClick={toggle}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav
        id="lv-nav-menu"
        className="lv-nav-menu"
        aria-label={lang === "pt" ? "Menu principal" : "Main menu"}
        inert={!open}
      >
        <ul className="lv-nav-menu-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${lang}${item.path}`}
                className={`lv-nav-menu-link ${activeId === item.id ? "is-active" : ""}`}
                aria-current={activeId === item.id ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="lv-nav-menu-label">{item.label[lang]}</span>
                <span className="lv-nav-menu-path">{item.path}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
