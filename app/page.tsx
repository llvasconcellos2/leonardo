"use client";

import { useState, useRef } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { WorkSection } from "./components/WorkSection";
import { WritingSection } from "./components/WritingSection";
import { Testimonials } from "./components/Testimonials";
import { ContactFooter, MiniFooter } from "./components/ContactFooter";
import { ProjectDetail, ArchiveView } from "./components/Views";
import { BlogPost, WritingIndex } from "./components/BlogPost";
import type { Lang } from "./data";
import { Parallax } from "./components/Parallax";

interface View {
  route: string;
  id: string | null;
}

export default function Portfolio() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>({ route: "home", id: null });
  const scrollRef = useRef<HTMLDivElement>(null);

  const go = (route: string, id: string | null = null) => {
    if (route === "about") {
      setView({ route: "home", id: null });
      setTimeout(() => {
        const el = document.getElementById("about");
        const sc = scrollRef.current;
        if (el && sc)
          sc.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
      }, 60);
      return;
    }
    setView({ route, id });
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  };

  const navId = ["work", "project", "archive"].includes(view.route)
    ? "work"
    : ["writing", "post"].includes(view.route)
      ? "writing"
      : view.route === "about"
        ? "about"
        : "";

  let content: React.ReactNode;
  switch (view.route) {
    case "project":
      content = <ProjectDetail id={view.id} lang={lang} go={go} />;
      break;
    case "archive":
      content = <ArchiveView lang={lang} go={go} />;
      break;
    case "post":
      content = <BlogPost id={view.id} lang={lang} go={go} />;
      break;
    case "writing":
      content = <WritingIndex lang={lang} go={go} />;
      break;
    default:
      content = (
        <>
          <Hero lang={lang} go={go} background="pattern" />
          <AboutSection lang={lang} go={go} embedded />
          <Parallax flip={true} />
          <WorkSection lang={lang} go={go} />
          <Parallax />
          <WritingSection lang={lang} go={go} />
          <Parallax flip={true} />
          <Testimonials lang={lang} />
          <Parallax
            targetColor="44, 47, 52" /*style={{ marginTop: "2rem" }}*/
          />
          <ContactFooter lang={lang} go={go} />
        </>
      );
  }

  const isHome = view.route === "home";

  return (
    <div className="lv-app">
      <Nav route={navId} go={go} lang={lang} setLang={setLang} />
      <main ref={scrollRef} className="lv-scroll">
        {content}
        {!isHome && <MiniFooter />}
      </main>
    </div>
  );
}
