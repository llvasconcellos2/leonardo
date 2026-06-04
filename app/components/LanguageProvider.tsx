"use client";
import { createContext, useContext, useState } from "react";
import type { Lang } from "../data";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage(): LangCtx {
  return useContext(LangContext);
}
