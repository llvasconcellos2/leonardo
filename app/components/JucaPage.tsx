import "./JucaPage.css";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Gamepad2 } from "lucide-react";
import { Kicker } from "./Primitives";
import { MiniFooter } from "./ContactFooter";
import { Gallery } from "./Gallery";
import { renderInline } from "@/app/lib/inline-md";
import { WORKS } from "@/data/work";
import type { Lang } from "@/data/data";

const work = WORKS.find((w) => w.slug === "juca")!;

/** The live, deployed game. Not an archive — a running project. */
const LIVE_URL = work.liveUrl ?? "https://juca.vercel.app/";

/** Page-specific copy with no home in the generated work catalog. */
const copy = {
  back: { en: "Back", pt: "Voltar" },
  builtWith: { en: "// built with", pt: "// construído com" },
  play: { en: "Play it live", pt: "Jogar ao vivo" },
  playNote: {
    en: "// runs in the browser · no install · read it or listen to it",
    pt: "// roda no navegador · sem instalar · leia ou ouça",
  },
  frameBar: { en: "live project · playable", pt: "projeto ao vivo · jogável" },
  galleryLabel: { en: "screenshots · juca", pt: "capturas · juca" },
  galleryHead: { en: "Screenshots", pt: "Capturas de tela" },
  overviewHead: { en: "Overview", pt: "Visão geral" },
  highlightsHead: { en: "Highlights", pt: "Destaques" },
} as const;

/** Descriptive alt text per screenshot, keyed by file basename. */
const ALT: Record<string, Record<Lang, string>> = {
  "06-historias-do-juca": {
    en: "Story-picker screen listing two interactive stories, each a keyboard-focusable card with a cover thumbnail",
    pt: "Tela de escolha de história listando duas histórias interativas, cada uma um cartão focável por teclado com miniatura de capa",
  },
  "01-historias-do-juca": {
    en: "A scene: Juca, a blind alligator with a white cane and hat, finds a lamppost while an elderly woman points the way; a choice button sits below the narration",
    pt: "Uma cena: Juca, um jacaré cego de bengala branca e chapéu, acha um poste enquanto uma senhora aponta o caminho; um botão de escolha fica abaixo da narração",
  },
  "02-historias-do-juca": {
    en: "The barbecue ending: Juca shakes hands amid a cheering crowd at the Don Toro grill, with the money and time state shown as chips above the scene",
    pt: "O final do churrasco: Juca aperta a mão em meio a uma multidão que aplaude na churrascaria Don Toro, com o estado de dinheiro e tempo mostrado em chips acima da cena",
  },
  "03-historias-do-juca": {
    en: "A bus-stop scene with an arriving bus and three numbered choice buttons — 'what does Juca do?' — plus the money and time state; a keyboard-navigation hint runs along the footer",
    pt: "Uma cena no ponto de ônibus com um ônibus chegando e três botões de escolha numerados — 'o que Juca faz?' — além do estado de dinheiro e tempo; uma dica de navegação por teclado aparece no rodapé",
  },
  "04-historias-do-juca": {
    en: "The full ending scene with its narrated closing text and a 'Play again' button, showing how a whole branch reads top to bottom",
    pt: "A cena final completa com o texto de encerramento narrado e um botão 'Jogar novamente', mostrando como um ramo inteiro se lê de cima a baixo",
  },
  "05-historias-do-juca": {
    en: "The story intro for 'Juca e a Corrida do Churrasco' opening at the Joinville gateway, with the listen, restart, and narration-speed controls",
    pt: "A abertura da história 'Juca e a Corrida do Churrasco' no pórtico de Joinville, com os controles de ouvir, reiniciar e velocidade da narração",
  },
};

function altFor(src: string, lang: Lang): string {
  const base = src.split("/").pop()?.replace(/\.\w+$/, "") ?? "";
  return ALT[base]?.[lang] ?? "Histórias do Juca screenshot";
}

export function JucaPage({ lang }: { lang: Lang }) {
  const shots = work.screenshots.map((s) => ({
    src: s.src,
    alt: altFor(s.src, lang),
  }));
  const hero = work.screenshots[0];

  return (
    <article className="lv-juca enable-smooth">
      <Link href={`/${lang}`} className="lv-link-arrow lv-back">
        <ArrowLeft size={15} /> {copy.back[lang]}
      </Link>

      <Kicker as="p">{work.kicker[lang]}</Kicker>
      <h1 className="lv-juca-title">{work.name[lang]}</h1>
      <p className="lv-juca-lead">{renderInline(work.intro[lang], "lead")}</p>

      <div className="lv-juca-tech">
        <span className="lv-juca-tech-lab">{copy.builtWith[lang]}</span>
        {work.tech.map((t) => (
          <span key={t.name} className={`lv-chip ${t.icon ? "has-logo" : ""}`}>
            {t.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="lv-chip-logo" src={t.icon} alt="" width={14} height={14} />
            )}
            {t.name}
            {t.version && <span className="lv-juca-tech-ver">{t.version}</span>}
          </span>
        ))}
      </div>

      <a
        href={LIVE_URL}
        className="lv-btn lv-btn-primary lv-juca-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        {copy.play[lang]} <ArrowUpRight size={17} />
      </a>
      <p className="lv-juca-cta-note">{copy.playNote[lang]}</p>

      <a
        href={LIVE_URL}
        className="lv-juca-frame"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.play[lang]}
      >
        <span className="lv-juca-frame-bar">
          <Gamepad2 size={14} /> {copy.frameBar[lang]}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="lv-juca-shot"
          src={hero.src}
          alt={altFor(hero.src, lang)}
          width={1280}
          height={720}
          loading="lazy"
        />
      </a>

      {/* Screenshot gallery */}
      <section className="lv-juca-block">
        <h2 className="lv-juca-h2">{copy.galleryHead[lang]}</h2>
        <Gallery images={shots} label={copy.galleryLabel[lang]} />
      </section>

      {/* Overview prose */}
      <section className="lv-juca-block">
        <h2 className="lv-juca-h2">{copy.overviewHead[lang]}</h2>
        <div className="lv-juca-prose">
          {work.body[lang].map((para, i) => (
            <p key={i} className="lv-juca-para">
              {renderInline(para, `body-${i}`)}
            </p>
          ))}
        </div>
      </section>

      {/* Highlights (key features) */}
      <section className="lv-juca-block">
        <h2 className="lv-juca-h2">{copy.highlightsHead[lang]}</h2>
        <div className="lv-juca-highlights">
          {work.features.map((f, i) => (
            <div className="lv-juca-highlight" key={i}>
              <h3 className="lv-juca-highlight-h">{f.heading[lang]}</h3>
              <p className="lv-juca-highlight-b">{renderInline(f.body[lang], `feat-${i}`)}</p>
            </div>
          ))}
        </div>
      </section>

      <MiniFooter />
    </article>
  );
}
