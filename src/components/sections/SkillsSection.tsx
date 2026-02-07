// File: src/components/sections/SkillsSection.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SkillsSection.module.css";

const hardSkills = [
  "React Native",
  "React",
  "Expo",
  "Next.js",
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Express.js",
  "Vercel",
  "PostgreSQL",
  "PostGIS",
  "Git",
  "GitHub",
] as const;

const softSkills = [
  "Communication",
  "Teamwork",
  "Ownership",
  "Problem-solving",
  "Fast learner",
  "Attention to detail",
  "Adaptability",
  "Effort",
  "Creativity",
  "Accountability",
  "Empathy",
  "Multicultural awareness",
  "Resilience",
  "Critical thinking",
  "Versatility",
  "Knowledge sharing",
  "Proactiveness",
  "Organization",
] as const;

const logos: Array<{ name: string; src: string }> = [
  { name: "React Native", src: "/skills/reactnative.png" },
  { name: "React", src: "/skills/react.png" },
  { name: "Expo", src: "/skills/expo.png" },
  { name: "Next.js", src: "/skills/nextjs.png" },
  { name: "HTML5", src: "/skills/html5.png" },
  { name: "CSS3", src: "/skills/css3.png" },
  { name: "JavaScript", src: "/skills/javascript.png" },
  { name: "TypeScript", src: "/skills/typescript.png" },
  { name: "Node.js", src: "/skills/nodejs.png" },
  { name: "Express.js", src: "/skills/expressjs.png" },
  { name: "Vercel", src: "/skills/vercel.png" },
  { name: "PostgreSQL", src: "/skills/postgresql.png" },
  { name: "PostGIS", src: "/skills/postgis.png" },
  { name: "Git", src: "/skills/git.png" },
  { name: "GitHub", src: "/skills/github.png" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/** ================================
 *  CAROUSEL infinito (autoplay + easing + hover pause + drag)
 * ================================= */
function LogosCarousel({ items }: { items: Array<{ name: string; src: string }> }) {
  const reducedMotion = usePrefersReducedMotion();

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const halfWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const xRef = useRef(0);
  const vRef = useRef(0);

  const baseSpeed = 60; // px/s
  const targetSpeedRef = useRef(baseSpeed);

  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);

  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const loopItems = useMemo(() => [...items, ...items], [items]);

  // ===== Curvatura do arco (ajuste aqui) =====
  const ARC_HEIGHT = 26; // px
  const ARC_ROT = 6; // deg

  const applyArc = () => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;

    const vpW = vp.clientWidth || 1;
    const centerX = vpW / 2;
    const half = Math.max(1, vpW / 2);

    const children = Array.from(track.children) as HTMLElement[];

    for (const el of children) {
      const ox = el.offsetLeft + el.offsetWidth / 2;
      const cx = ox + xRef.current;

      const n = Math.max(-1, Math.min(1, (cx - centerX) / half));
      const y = -ARC_HEIGHT * (1 - n * n);
      const rot = n * ARC_ROT;

      el.style.setProperty("--arc-y", `${y}px`);
      el.style.setProperty("--arc-rot", `${rot}deg`);
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    const vp = viewportRef.current;
    if (!track || !vp) return;

    const measure = () => {
      const full = track.scrollWidth;
      halfWidthRef.current = full / 2;
      applyArc();
    };

    measure();

    const ro1 = new ResizeObserver(measure);
    ro1.observe(track);

    const ro2 = new ResizeObserver(() => applyArc());
    ro2.observe(vp);

    window.addEventListener("resize", applyArc);

    return () => {
      ro1.disconnect();
      ro2.disconnect();
      window.removeEventListener("resize", applyArc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopItems.length]);

  useEffect(() => {
    if (reducedMotion) return;
    targetSpeedRef.current = isHover ? 0 : baseSpeed;
  }, [isHover, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      const id = window.setTimeout(() => applyArc(), 0);
      return () => window.clearTimeout(id);
    }

    const tick = (t: number) => {
      const half = halfWidthRef.current;

      const lastT = lastTRef.current || t;
      const dt = Math.min(0.032, (t - lastT) / 1000);
      lastTRef.current = t;

      const ease = 0.12;
      vRef.current = vRef.current + (targetSpeedRef.current - vRef.current) * ease;

      if (!draggingRef.current && half > 0) {
        xRef.current -= vRef.current * dt;
      }

      if (half > 0) {
        if (xRef.current <= -half) xRef.current += half;
        if (xRef.current > 0) xRef.current -= half;
      }

      const track = trackRef.current;
      if (track) track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;

      applyArc();

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const onPointerDown = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (!vp) return;

    draggingRef.current = true;
    setIsDragging(true);
    vp.setPointerCapture(e.pointerId);

    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();

    targetSpeedRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    xRef.current += dx;
    lastXRef.current = e.clientX;

    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;

    applyArc();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (!vp) return;

    draggingRef.current = false;
    setIsDragging(false);

    try {
      vp.releasePointerCapture(e.pointerId);
    } catch {}

    targetSpeedRef.current = isHover ? 0 : baseSpeed;
  };

  return (
    <div
      ref={viewportRef}
      className={`${styles.carousel} ${isDragging ? styles.carouselDragging : ""}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="group"
      aria-label="Tech stack carousel"
    >
      <div className={styles.carouselEdgeLeft} aria-hidden="true" />
      <div className={styles.carouselEdgeRight} aria-hidden="true" />

      <div className={styles.carouselTrack} ref={trackRef}>
        {loopItems.map((it, idx) => (
          <span className={styles.logoWrap} key={`${it.name}-${idx}`} title={it.name}>
            <img className={styles.logoImg} src={it.src} alt={it.name} draggable={false} loading="lazy" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Skills</h2>
      </header>

      <div className={styles.stack}>
        <h3 className={styles.groupTitle}>Hard skills</h3>

        <div className={`${styles.card} ${styles.cardNarrow}`}>
          <div className={styles.chips}>
            {hardSkills.map((s) => (
              <span key={s} className={styles.chip}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardWide} ${styles.cardFullBleed}`}>
          <LogosCarousel items={logos} />
        </div>

        <h3 className={styles.groupTitle}>Soft skills</h3>

        <div className={`${styles.card} ${styles.cardNarrow}`}>
          <div className={styles.chips}>
            {softSkills.map((s) => (
              <span key={s} className={styles.chip}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ✅ REMOVIDO: honeycomb / SoftPillsField */}
      </div>
    </section>
  );
}