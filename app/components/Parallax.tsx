"use client";

import { useEffect, useState } from "react";
import "./Parallax.css";

export function Parallax({
  flip = false,
  targetColor = "32, 35, 39",
  speed = 0.3,
  style,
}: {
  flip?: boolean;
  targetColor?: string;
  /** Multiplier applied to the base duration. >1 is faster, <1 is slower. */
  speed?: number;
  style?: React.CSSProperties;
}) {
  const [numWaves, setNumWaves] = useState(0);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => {
      setNumWaves(Math.ceil(window.innerWidth / 100));
      setWidth(window.innerWidth);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  if (numWaves === 0) return null;

  // Scale duration with viewport width so waves move at a consistent visual speed
  // across screen sizes (7s feels right on mobile ~375px, ~19s on 1920px FullHD).
  const duration = Math.max(7, width / 100) / speed;
  const scaleFactor = duration / 7;

  return (
    <div
      style={style}
      className={`lv-parallax-section ${flip ? "lv-parallax-section-fliped" : ""}`}
    >
      <div className={`lv-parallax-container ${flip ? "flip-vertical" : ""}`}>
        <svg
          viewBox={`0 ${!flip ? "24" : "32"} ${width / 2.4} ${!flip ? "20" : "30"}`}
          preserveAspectRatio="none"
          shapeRendering="auto"
          aria-hidden="true"
          focusable="false"
        >
          <g className="parallax">
            {Array.from({ length: numWaves }).map((_, i) => {
              // Scale delay by the same factor so waves stay evenly distributed
              // regardless of duration.
              const delay =
                Math.round(
                  (-2 - (i / (numWaves - 1)) * 12) * scaleFactor * 100,
                ) / 100;
              const opacity =
                Math.round((0.2 + (i / (numWaves - 1)) * 0.7) * 100) / 100;
              if (!flip) {
                return (
                  <path
                    d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    fill={`rgba(${targetColor}, ${opacity})`}
                    style={{
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                    }}
                    key={i}
                  ></path>
                );
              } else {
                return (
                  <path
                    fill={`rgba(${targetColor}, ${opacity})`}
                    d="M-160 32c30 0 58 18 88 18s58-18 88-18 58 18 88 18 58-18 88-18v-44h-352z"
                    style={{
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                    }}
                    key={i}
                  />
                );
              }
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
