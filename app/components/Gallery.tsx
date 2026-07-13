"use client";

import "./Gallery.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, Maximize2, X } from "lucide-react";

export interface GalleryImage {
  src: string;
  alt?: string;
}

/**
 * Reusable screenshot gallery. Zero dependencies: the strip is a CSS
 * scroll-snap track, so touch/trackpad swiping works natively on mobile.
 * Prev/next buttons and a thumbnail rail drive it on the desktop; clicking a
 * shot opens a full-screen lightbox with keyboard + swipe navigation.
 *
 * Takes a plain `images` array so any project page can pass its own
 * `work.screenshots`.
 */
export function Gallery({
  images,
  label = "screenshots",
}: {
  images: GalleryImage[];
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Derive the active slide from scroll position (native swipe updates this).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = track.clientWidth || 1;
        setActive(Math.round(track.scrollLeft / w));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const count = images.length;
  const go = useCallback(
    (dir: number) => scrollToIndex(Math.min(count - 1, Math.max(0, active + dir))),
    [active, count, scrollToIndex],
  );

  if (count === 0) return null;

  return (
    <figure className="lv-gallery">
      <div className="lv-gallery-frame">
        <div className="lv-gallery-bar">
          <span className="lv-gallery-bar-label">
            <Images size={14} /> {label}
          </span>
          <span className="lv-gallery-count" aria-live="polite">
            {active + 1} / {count}
          </span>
        </div>

        <div
          className="lv-gallery-viewport"
          role="group"
          aria-roledescription="carousel"
          aria-label={label}
        >
          <button
            type="button"
            className="lv-gallery-nav lv-gallery-nav-prev"
            onClick={() => go(-1)}
            disabled={active === 0}
            aria-label="Previous screenshot"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="lv-gallery-track" ref={trackRef}>
            {images.map((img, i) => (
              <button
                type="button"
                key={img.src}
                className="lv-gallery-slide"
                onClick={() => setLightbox(i)}
                aria-label={`Open screenshot ${i + 1} of ${count}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt ?? ""} loading="lazy" />
                <span className="lv-gallery-zoom" aria-hidden="true">
                  <Maximize2 size={16} />
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="lv-gallery-nav lv-gallery-nav-next"
            onClick={() => go(1)}
            disabled={active === count - 1}
            aria-label="Next screenshot"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      <div className="lv-gallery-thumbs" role="tablist" aria-label={`${label} thumbnails`}>
        {images.map((img, i) => (
          <button
            type="button"
            key={img.src}
            className={`lv-gallery-thumb ${i === active ? "is-active" : ""}`}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to screenshot ${i + 1}`}
            aria-selected={i === active}
            role="tab"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox
          images={images}
          index={lightbox}
          onIndex={(i) => {
            setLightbox(i);
            scrollToIndex(i, false);
          }}
          onClose={() => setLightbox(null)}
        />
      )}
    </figure>
  );
}

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const count = images.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const prev = useCallback(() => onIndex(Math.max(0, index - 1)), [index, onIndex]);
  const next = useCallback(
    () => onIndex(Math.min(count - 1, index + 1)),
    [index, count, onIndex],
  );

  // Keyboard nav + focus the close button on open.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  // Lock scroll on the app's scroll container (the app scrolls in `.lv-scroll`,
  // not on <body>), falling back to <body> if it isn't found.
  useEffect(() => {
    const scroller =
      (document.querySelector(".lv-scroll") as HTMLElement | null) ?? document.body;
    const prevOverflow = scroller.style.overflow;
    scroller.style.overflow = "hidden";
    return () => {
      scroller.style.overflow = prevOverflow;
    };
  }, []);

  const img = images[index];

  return (
    <div
      className="lv-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 50) prev();
        else if (dx < -50) next();
        touchX.current = null;
      }}
    >
      <div className="lv-lightbox-bar" onClick={(e) => e.stopPropagation()}>
        <span className="lv-lightbox-count">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          ref={closeRef}
          className="lv-lightbox-close"
          onClick={onClose}
          aria-label="Close viewer"
        >
          <X size={20} />
        </button>
      </div>

      <button
        type="button"
        className="lv-lightbox-nav lv-lightbox-nav-prev"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        disabled={index === 0}
        aria-label="Previous screenshot"
      >
        <ChevronLeft size={30} />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="lv-lightbox-img"
        src={img.src}
        alt={img.alt ?? ""}
        onClick={(e) => e.stopPropagation()}
      />

      <button
        type="button"
        className="lv-lightbox-nav lv-lightbox-nav-next"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        disabled={index === count - 1}
        aria-label="Next screenshot"
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
}
