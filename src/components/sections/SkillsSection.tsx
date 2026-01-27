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
  
    // ===== Curvatura do arco (ajuste aqui) =====
    const ARC_HEIGHT = 26; // px (quanto "alto" fica o arco no centro)
    const ARC_ROT = 6;     // deg (inclinação sutil opcional)
  
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
  
        // posição "visual" do centro do item dentro do viewport (considera o translateX do track)
        const cx = ox + xRef.current;
  
        // normaliza: -1 (esquerda) ... 0 (centro) ... +1 (direita)
        const n = Math.max(-1, Math.min(1, (cx - centerX) / half));
  
        // parábola: pico no centro e 0 nas bordas
        const y = -ARC_HEIGHT * (1 - n * n);
  
        // rotação sutil (opcional)
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
  
        // atualiza arco quando muda tamanho
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
      // Mesmo com reduced motion, a curvatura estática ainda é legal
      if (reducedMotion) {
        // aplica uma vez no client
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
  
        // ✅ aplica a curva junto do movimento
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
  
      // ✅ mantém arco coerente durante drag
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
 *  SOFT PILLS (SEM OVERLAP):
 *  - usa slots em honeycomb (centros em %)
 *  - cada pill sempre ocupa um slot livre
 *  - troca com fade out -> troca label -> fade in
 * ================================= */

type Slot = { x: number; y: number };

type FloatingPill = {
  id: string;        // id FIXO por “instância”
  label: string;
  slotIndex: number; // pode mudar, mas sempre pra slot livre
  scale: number;
  visible: boolean;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickDifferent(pool: readonly string[], avoid: Set<string>) {
  const candidates = pool.filter((s) => !avoid.has(s));
  if (candidates.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function buildHoneycombSlots(rows = 4, cols = 7): Slot[] {
  const slots: Slot[] = [];
  const xStep = 100 / (cols + 1);
  const yStep = 100 / (rows + 1);

  for (let r = 0; r < rows; r++) {
    const y = (r + 1) * yStep;
    const offset = (r % 2) * (xStep / 2);

    for (let c = 0; c < cols; c++) {
      const x = (c + 1) * xStep + offset;

      if (x > 8 && x < 92 && y > 14 && y < 88) slots.push({ x, y });
    }
  }
  return slots;
}

function pickFreeSlotIndex(total: number, used: Set<number>) {
  const free: number[] = [];
  for (let i = 0; i < total; i++) if (!used.has(i)) free.push(i);
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
}

/** estado inicial determinístico (SSR-friendly) */
function initialPillsDeterministic(pool: readonly string[], count: number, slotsCount: number) {
  const labels = pool.slice(0, count);
  return labels.map((label, i) => ({
    id: `pill-${i}`, // ✅ FIXO (não muda!)
    label,
    slotIndex: i % Math.max(1, slotsCount),
    scale: 1,
    visible: true,
  })) as FloatingPill[];
}

function SoftPillsField({ skills }: { skills: readonly string[] }) {
  const reducedMotion = usePrefersReducedMotion();

  const VISIBLE_COUNT = Math.max(6, Math.round(skills.length * 0.35));

  const slots = useMemo(() => buildHoneycombSlots(4, 7), []);
  const SLOTS_COUNT = slots.length;

  const actualCount = Math.min(VISIBLE_COUNT, SLOTS_COUNT);

  const [pills, setPills] = useState<FloatingPill[]>(
    () => initialPillsDeterministic(skills, actualCount, SLOTS_COUNT)
  );

  const timersRef = useRef<number[]>([]);
  const runningRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;
    if (runningRef.current) return;
    runningRef.current = true;

    // embaralha no client: labels únicos + slots únicos
    setPills(() => {
      const usedLabels = new Set<string>();
      const usedSlots = new Set<number>();
      const next: FloatingPill[] = [];

      for (let i = 0; i < actualCount; i++) {
        const label = pickDifferent(skills, usedLabels);
        usedLabels.add(label);

        const slotIndex = pickFreeSlotIndex(SLOTS_COUNT, usedSlots) ?? (i % SLOTS_COUNT);
        usedSlots.add(slotIndex);

        next.push({
          id: `pill-${i}`, // ✅ continua fixo
          label,
          slotIndex,
          scale: rand(0.96, 1.05),
          visible: true,
        });
      }
      return next;
    });

    const scheduleOne = (pillId: string) => {
        const delay = rand(900, 1900);

      const t = window.setTimeout(() => {
        // 1) fade out (mantém o mesmo item, só muda visible)
        setPills((prev) =>
          prev.map((p) => (p.id === pillId ? { ...p, visible: false } : p))
        );

        const t2 = window.setTimeout(() => {
          // 2) troca label + pega slot livre + fade in
          setPills((prev) => {
            const usedVisibleLabels = new Set(prev.filter((p) => p.visible).map((p) => p.label));
            const usedVisibleSlots = new Set(prev.filter((p) => p.visible).map((p) => p.slotIndex));

            return prev.map((p) => {
              if (p.id !== pillId) return p;

              const nextLabel = pickDifferent(skills, usedVisibleLabels);

              // ✅ escolhe novo slot livre (dispersa) — não pode colidir com slots visíveis
              const nextSlot =
                pickFreeSlotIndex(SLOTS_COUNT, usedVisibleSlots) ??
                p.slotIndex; // fallback

              return {
                ...p,
                label: nextLabel,
                slotIndex: nextSlot,
                scale: rand(0.96, 1.05),
                visible: true,
              };
            });
          });

          scheduleOne(pillId);
        }, 320);

        timersRef.current.push(t2);
      }, delay);

      timersRef.current.push(t);
    };

    for (let i = 0; i < actualCount; i++) scheduleOne(`pill-${i}`);

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      runningRef.current = false;
    };
  }, [skills, actualCount, reducedMotion, SLOTS_COUNT]);

  return (
    <div className={styles.softField} aria-label="Soft skills animated field">
      {pills.map((p) => {
        const pos = slots[p.slotIndex] ?? { x: 50, y: 50 };

        return (
          <span
            key={p.id} // ✅ FIXO = transição funciona!
            className={`${styles.softPill} ${p.visible ? styles.softPillIn : styles.softPillOut}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) scale(${p.scale})`,
            }}
            title={p.label}
          >
            {p.label}
          </span>
        );
      })}
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