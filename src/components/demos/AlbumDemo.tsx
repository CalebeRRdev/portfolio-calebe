// File: src/components/demos/AlbumDemo.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, Flip, prefersReducedMotion } from "@/lib/gsap";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./AlbumDemo.module.css";

type Phase = "messy" | "scanning" | "arranged";

type Tile = {
  id: "a" | "b" | "c" | "d" | "e";
  scene: "group" | "portrait" | "landscape" | "caps" | "couple";
  /** Scattered position on the table: left, top, width, height (%) and rotation */
  messy: [number, number, number, number, number];
};

const TILES: Tile[] = [
  { id: "a", scene: "group", messy: [6, 26, 34, 46, -7] },
  { id: "b", scene: "landscape", messy: [50, 6, 28, 38, 5] },
  { id: "c", scene: "portrait", messy: [72, 44, 19, 44, -4] },
  { id: "d", scene: "caps", messy: [30, 50, 22, 40, 11] },
  { id: "e", scene: "couple", messy: [38, 10, 24, 32, -13] },
];

/** Simple illustrated "photos". Heads carry face boxes for the recognition pass. */
function Scene({ scene }: { scene: Tile["scene"] }) {
  const faces: [number, number, number][] =
    scene === "group"
      ? [[28, 50, 9], [50, 46, 10], [72, 50, 9]]
      : scene === "portrait"
        ? [[50, 40, 15]]
        : scene === "couple"
          ? [[38, 46, 11], [62, 44, 11]]
          : scene === "caps"
            ? [[34, 62, 8], [66, 60, 8]]
            : [];

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={styles.scene}>
      <rect width="100" height="100" className={styles[`bg_${scene}`]} />
      {scene === "landscape" && (
        <>
          <circle cx="70" cy="30" r="10" className={styles.sun} />
          <path d="M0 78 Q 25 52 48 72 T 100 64 V100 H0Z" className={styles.hillA} />
          <path d="M0 88 Q 35 70 62 86 T 100 82 V100 H0Z" className={styles.hillB} />
        </>
      )}
      {scene === "caps" && (
        <>
          <path d="M20 22 l14 -6 14 6 -14 6z" className={styles.cap} transform="rotate(-18 34 22)" />
          <path d="M56 14 l12 -5 12 5 -12 5z" className={styles.cap} transform="rotate(14 68 14)" />
          <path d="M40 34 l9 -4 9 4 -9 4z" className={styles.cap} transform="rotate(30 49 34)" />
        </>
      )}
      {faces.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} className={styles.head} />
          <path
            d={`M${x - r * 1.9} 100 Q ${x - r * 1.9} ${y + r * 1.2} ${x} ${y + r * 1.15} Q ${x + r * 1.9} ${y + r * 1.2} ${x + r * 1.9} 100Z`}
            className={styles.body}
          />
          <g className={styles.faceBox}>
            {(() => {
              const s = r * 1.35;
              const c = r * 0.55;
              return (
                <path
                  d={`M${x - s} ${y - s + c}V${y - s}H${x - s + c} M${x + s - c} ${y - s}H${x + s}V${y - s + c} M${x + s} ${y + s - c}V${y + s}H${x + s - c} M${x - s + c} ${y + s}H${x - s}V${y + s - c}`}
                />
              );
            })()}
          </g>
        </g>
      ))}
    </svg>
  );
}

export function AlbumDemo({ dict }: { dict: Dictionary["experience"]["album"] }) {
  const [phase, setPhase] = useState<Phase>("messy");
  const spreadRef = useRef<HTMLDivElement | null>(null);
  const pendingFlip = useRef<Flip.FlipState | null>(null);
  const timer = useRef<number | null>(null);

  // Play the Flip after React has committed the new layout
  useLayoutEffect(() => {
    const state = pendingFlip.current;
    if (!state) return;
    pendingFlip.current = null;
    Flip.from(state, {
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.07,
      absolute: true,
      onComplete: () => gsap.set(`.${styles.tile}`, { clearProps: "zIndex" }),
    });
  }, [phase]);

  useLayoutEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const relayout = (next: Phase) => {
    const tiles = spreadRef.current?.querySelectorAll(`.${styles.tile}`);
    if (tiles && !prefersReducedMotion()) pendingFlip.current = Flip.getState(tiles);
    setPhase(next);
  };

  const onClick = () => {
    if (phase === "scanning") return;
    if (phase === "arranged") {
      relayout("messy");
      return;
    }
    setPhase("scanning");
    timer.current = window.setTimeout(() => relayout("arranged"), prefersReducedMotion() ? 0 : 1100);
  };

  const status =
    phase === "scanning" ? dict.arranging : phase === "arranged" ? dict.arranged : null;

  return (
    <div className={styles.demo}>
      <div
        ref={spreadRef}
        className={`${styles.spread} ${phase === "arranged" ? styles.arranged : styles.messy} ${
          phase === "scanning" ? styles.scanning : ""
        }`}
        aria-hidden="true"
      >
        <span className={styles.fold} />
        {TILES.map((t) => (
          <div
            key={t.id}
            className={styles.tile}
            data-tile={t.id}
            style={
              {
                "--l": `${t.messy[0]}%`,
                "--t": `${t.messy[1]}%`,
                "--w": `${t.messy[2]}%`,
                "--h": `${t.messy[3]}%`,
                "--r": `${t.messy[4]}deg`,
              } as React.CSSProperties
            }
          >
            <Scene scene={t.scene} />
          </div>
        ))}
        <span className={styles.scan} />
      </div>

      <div className={styles.bar}>
        {!status && <span className={styles.pageLabel}>{dict.spread} 07</span>}
        <AnimatePresence mode="popLayout" initial={false}>
          {status && (
            <motion.span
              key={status}
              className={styles.status}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              role="status"
            >
              {phase === "arranged" && (
                <svg viewBox="0 0 16 16" className={styles.check} aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
              )}
              {status}
            </motion.span>
          )}
        </AnimatePresence>
        <button type="button" className={styles.action} onClick={onClick} disabled={phase === "scanning"}>
          <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.sparkle}>
            <path d="M8 1.5l1.6 4.2 4.4 1.3-4.4 1.3L8 12.5 6.4 8.3 2 7l4.4-1.3z" />
          </svg>
          {phase === "arranged" ? dict.reset : dict.autoLayout}
        </button>
      </div>
    </div>
  );
}
