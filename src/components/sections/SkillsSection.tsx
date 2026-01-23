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
 *  sem container visível nos logos (só wrapper invisível)
 * ================================= */
function LogosCarousel({ items }: { items: Array<{ name: string; src: string }> }) {
  const reducedMotion = usePrefersReducedMotion();

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const halfWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const xRef = useRef(0);
  const vRef = useRef(0);

  const baseSpeed = 44; // px/s
  const targetSpeedRef = useRef(baseSpeed);

  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);

  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const loopItems = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const full = track.scrollWidth;
      halfWidthRef.current = full / 2;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [loopItems.length]);

  useEffect(() => {
    if (reducedMotion) return;
    targetSpeedRef.current = isHover ? 0 : baseSpeed;
  }, [isHover, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

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

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
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
            <img
              className={styles.logoImg}
              src={it.src}
              alt={it.name}
              draggable={false}
              loading="lazy"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/** ================================
 *  SOFT PILLS: 30–40% visíveis, posições aleatórias,
 *  trocas intercaladas e aleatórias
 * ================================= */

type FloatingPill = {
  id: string;
  label: string;
  x: number; // %
  y: number; // %
  rot: number; // deg
  scale: number;
  visible: boolean;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickDifferent(pool: readonly string[], avoid: Set<string>) {
  const candidates = pool.filter((s) => !avoid.has(s));
  if (candidates.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function makePill(label: string): FloatingPill {
  return {
    id: `${label}-${Math.random().toString(16).slice(2)}`,
    label,
    x: rand(6, 94),
    y: rand(10, 90),
    rot: rand(-6, 6),
    scale: rand(0.96, 1.04),
    visible: true,
  };
}

/** estado inicial determinístico (pra SSR/hydration) */
function initialPillsDeterministic(pool: readonly string[], count: number) {
  const labels = pool.slice(0, count);
  return labels.map((label, i) => ({
    id: `${label}-seed-${i}`,
    label,
    x: 12 + (i * 11) % 76,
    y: 18 + (i * 13) % 68,
    rot: 0,
    scale: 1,
    visible: true,
  })) as FloatingPill[];
}

function SoftPillsField({ skills }: { skills: readonly string[] }) {
  const reducedMotion = usePrefersReducedMotion();

  // ~35% visível
  const VISIBLE_COUNT = Math.max(6, Math.round(skills.length * 0.35));

  const [pills, setPills] = useState<FloatingPill[]>(
    () => initialPillsDeterministic(skills, VISIBLE_COUNT)
  );

  const timersRef = useRef<number[]>([]);
  const runningRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;

    // começa só no client (evita hydration mismatch)
    if (runningRef.current) return;
    runningRef.current = true;

    // primeiro “embaralha” o estado inicial
    setPills(() => {
      const used = new Set<string>();
      const next: FloatingPill[] = [];
      for (let i = 0; i < VISIBLE_COUNT; i++) {
        const label = pickDifferent(skills, used);
        used.add(label);
        next.push(makePill(label));
      }
      return next;
    });

    // agenda trocas intercaladas (cada pill tem um ritmo)
    const scheduleOne = (index: number) => {
      const delay = rand(650, 1500); // troca suave e aleatória
      const t = window.setTimeout(() => {
        setPills((prev) => {
          if (index >= prev.length) return prev;

          // 1) fade out
          const out = [...prev];
          out[index] = { ...out[index], visible: false };
          return out;
        });

        const t2 = window.setTimeout(() => {
          setPills((prev) => {
            if (index >= prev.length) return prev;

            // labels já visíveis (pra evitar repetição)
            const used = new Set(prev.filter((p) => p.visible).map((p) => p.label));

            // 2) troca label + reposiciona + fade in
            const next = [...prev];
            const nextLabel = pickDifferent(skills, used);
            next[index] = { ...makePill(nextLabel), visible: true };
            return next;
          });

          // 3) reagenda essa mesma posição
          scheduleOne(index);
        }, 260);

        timersRef.current.push(t2);
      }, delay);

      timersRef.current.push(t);
    };

    for (let i = 0; i < VISIBLE_COUNT; i++) scheduleOne(i);

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      runningRef.current = false;
    };
  }, [skills, VISIBLE_COUNT, reducedMotion]);

  return (
    <div className={styles.softField} aria-label="Soft skills animated field">
      {pills.map((p) => (
        <span
          key={p.id}
          className={`${styles.softPill} ${p.visible ? styles.softPillIn : styles.softPillOut}`}
          style={{
            left: `${clamp(p.x, 4, 96)}%`,
            top: `${clamp(p.y, 6, 92)}%`,
            transform: `translate(-50%, -50%) scale(${p.scale})`,
          }}
          title={p.label}
        >
          {p.label}
        </span>
      ))}
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

        <div className={`${styles.card} ${styles.cardWide}`}>
          <SoftPillsField skills={softSkills} />
        </div>
      </div>
    </section>
  );
}