// File: src/components/sections/HeroSection.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/getDictionary";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cameFromLanguageSwitch, scrollToId } from "@/lib/scroll";
import { contourPath } from "@/lib/blob";
import { Magnetic } from "@/components/ui/Magnetic";
import styles from "./HeroSection.module.css";

const RINGS = [
  { r: 128, seed: 0.4, year: "2024", offset: "8%", spin: 120 },
  { r: 156, seed: 2.1, year: "2025", offset: "30%", spin: -160 },
  { r: 184, seed: 4.3, year: "2026", offset: "56%", spin: 200 },
];
const RING_PATHS = RINGS.map((ring) => contourPath(200, 200, ring.r, ring.seed, 0.06));
// Portrait mask in objectBoundingBox units (0..1). The box is taller than wide,
// so the ring stretches into an organic pebble around face, neck and shoulders.
const PORTRAIT_CLIP = contourPath(0.5, 0.5, 0.48, 1.3, 0.05);

export function HeroSection({ dict }: { dict: Dictionary["hero"] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      const name = nameRef.current;
      if (!root || !name || prefersReducedMotion()) return;

      const split = SplitText.create(name.querySelectorAll(`.${styles.nameLine}`), {
        type: "chars",
        charsClass: styles.char,
      });
      const chars = split.chars as HTMLElement[];
      gsap.set(chars, { "--wght": 650, "--wdth": 100 });
      const fades = root.querySelectorAll("[data-hero-fade]");
      const rings = root.querySelectorAll(`.${styles.ring}`);
      const labels = root.querySelectorAll(`.${styles.ringLabel}`);
      const portrait = root.querySelector(`.${styles.portrait}`);

      const switched = cameFromLanguageSwitch();
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: switched ? 0 : 0.15 });

      if (switched) {
        tl.from(fades, { opacity: 0, filter: "blur(6px)", duration: 0.6, stagger: 0.04 });
      } else {
        tl.fromTo(
          chars,
          { yPercent: 115, "--wght": 200, "--wdth": 75 },
          { yPercent: 0, "--wght": 650, "--wdth": 100, duration: 1.4, stagger: 0.05 }
        )
          .from(
            portrait,
            { scale: 0.6, opacity: 0, rotate: -8, duration: 1.4, ease: "elastic.out(1, 0.75)" },
            0.3
          )
          .from(rings, { drawSVG: "0%", duration: 1.8, stagger: 0.18, ease: "power2.inOut" }, 0.45)
          .from(labels, { opacity: 0, duration: 0.6, stagger: 0.15 }, 1.4)
          .from(
            fades,
            { opacity: 0, y: 18, filter: "blur(8px)", duration: 1, stagger: 0.07 },
            0.55
          );
      }

      // After the intro: letters near the cursor get heavier and wider
      const setters = chars.map((c) => ({
        el: c,
        wght: gsap.quickTo(c, "--wght", { duration: 0.6, ease: "power3.out" }),
        wdth: gsap.quickTo(c, "--wdth", { duration: 0.6, ease: "power3.out" }),
      }));

      const onMove = contextSafe!((e: PointerEvent) => {
        if (e.pointerType !== "mouse" || tl.isActive()) return;
        for (const s of setters) {
          const r = s.el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / 260);
          const eased = falloff * falloff * (3 - 2 * falloff);
          s.wght(650 + 150 * eased);
          s.wdth(100 - 16 * eased);
        }
      });
      const onLeave = contextSafe!(() => {
        for (const s of setters) {
          s.wght(650);
          s.wdth(100);
        }
      });

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef }
  );

  return (
    <section id="home" ref={rootRef} className={styles.hero}>
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className={styles.greeting} data-hero-fade>
            {dict.greeting}
          </p>
          <h1 ref={nameRef} className={styles.name} aria-label="Calebe Rolim">
            <span className={styles.nameLine}>Calebe</span>
            <span className={styles.nameLine}>Rolim</span>
          </h1>
        </div>

        <figure className={styles.summit}>
          <svg viewBox="0 0 400 400" className={styles.rings} aria-hidden="true">
            <defs>
              {RING_PATHS.map((d, i) => (
                <path key={i} id={`hero-ring-${i}`} d={d} />
              ))}
            </defs>
            {RINGS.map((ring, i) => (
              <g
                key={ring.year}
                className={styles.ringGroup}
                style={{ ["--spin" as string]: `${ring.spin}s` } as React.CSSProperties}
              >
                <path d={RING_PATHS[i]} className={styles.ring} />
                <text className={styles.ringLabel} dy="4">
                  <textPath href={`#hero-ring-${i}`} startOffset={ring.offset}>
                    {ring.year}
                  </textPath>
                </text>
              </g>
            ))}
            {/* Summit marker */}
            <g className={styles.summitMark}>
              <path d="M200 10 l6 10 h-12 z" />
            </g>
          </svg>

          <div className={styles.portrait}>
            <svg width="0" height="0" aria-hidden="true" focusable="false">
              <clipPath id="portrait-clip" clipPathUnits="objectBoundingBox">
                <path d={PORTRAIT_CLIP} />
              </clipPath>
            </svg>
            <Image
              src="/projects/calebe-hero-2.jpg"
              alt={dict.portraitAlt}
              width={770}
              height={1242}
              sizes="(max-width: 640px) 50vw, 300px"
              className={styles.photo}
              priority
            />
          </div>
          <figcaption className={styles.caption} data-hero-fade>
            {dict.ringsCaption}
          </figcaption>
        </figure>

        <div className={styles.details}>
          <p className={styles.role} data-hero-fade>
            {dict.role}
          </p>
          <p className={styles.tagline} data-hero-fade>
            {dict.tagline}
          </p>
          <p className={styles.bio} data-hero-fade>
            {dict.bio}
          </p>

          <div className={styles.ctas} data-hero-fade>
            <Magnetic>
              <button type="button" className={styles.ctaPrimary} onClick={() => scrollToId("projects")}>
                {dict.ctaWork}
                <svg viewBox="0 0 24 24" className={styles.ctaIcon} aria-hidden="true">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" className={styles.ctaSecondary} onClick={() => scrollToId("contact")}>
                {dict.ctaContact}
              </button>
            </Magnetic>
            <Magnetic strength={0.45}>
              <a
                className={styles.ctaIconOnly}
                href="https://github.com/CalebeRRdev"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 .5C5.73.5.75 5.68.75 12.1c0 5.14 3.29 9.5 7.86 11.04.58.11.8-.26.8-.57v-2.1c-3.2.72-3.87-1.39-3.87-1.39-.52-1.37-1.27-1.73-1.27-1.73-1.04-.73.08-.72.08-.72 1.15.08 1.75 1.21 1.75 1.21 1.02 1.78 2.67 1.26 3.32.96.1-.76.4-1.26.73-1.55-2.55-.3-5.24-1.32-5.24-5.86 0-1.29.45-2.34 1.19-3.17-.12-.3-.52-1.53.11-3.18 0 0 .98-.32 3.2 1.21a10.8 10.8 0 0 1 2.91-.4c.99 0 1.99.14 2.91.4 2.22-1.53 3.2-1.21 3.2-1.21.63 1.65.23 2.88.11 3.18.74.83 1.19 1.88 1.19 3.17 0 4.55-2.7 5.56-5.27 5.85.41.37.78 1.1.78 2.22v3.29c0 .31.22.69.81.57 4.56-1.54 7.85-5.9 7.85-11.04C23.25 5.68 18.27.5 12 .5z"
                  />
                </svg>
              </a>
            </Magnetic>
          </div>

          <dl className={styles.status} data-hero-fade>
            <div className={styles.statusRow}>
              <dt className={styles.statusLabel}>
                <span className={styles.liveDot} aria-hidden="true" />
                {dict.nowLabel}
              </dt>
              <dd>{dict.now}</dd>
            </div>
            <div className={styles.statusRow}>
              <dt className="sr-only">{dict.open}</dt>
              <dd className={styles.open}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 6h16v12H4z M4 7l8 6 8-6" />
                </svg>
                {dict.open}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
