// File: src/components/sections/SkillsSection.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SkillsSection.module.css";
import { hardSkillsLogos, softSkillGroups, type SkillLogo } from "@/data/skills";
import { useInView } from "@/hooks/useInView";

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

/** Infinite tech-logo carousel (autoplay + easing + hover pause + drag + arc) */
function LogosCarousel({ items }: { items: SkillLogo[] }) {
  const reducedMotion = usePrefersReducedMotion();

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const halfWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const xRef = useRef(0);
  const vRef = useRef(0);

  const baseSpeed = 56;
  const targetSpeedRef = useRef(baseSpeed);

  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);

  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const loopItems = useMemo(() => [...items, ...items], [items]);

  // Arc curvature
  const ARC_HEIGHT = 22;
  const ARC_ROT = 5;

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
      className={`${styles.carousel} ${
        isDragging ? styles.carouselDragging : ""
      }`}
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
          <span className={styles.logoWrap} key={`${it.name}-${idx}`}>
            <img
              className={styles.logoImg}
              src={it.src}
              alt={it.name}
              draggable={false}
              loading="lazy"
            />
            <span className={styles.logoLabel} aria-hidden="true">
              {it.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const { ref: headerRef, inView: headerIn } = useInView<HTMLDivElement>({
    threshold: 0.2,
  });
  const { ref: hardRef, inView: hardIn } = useInView<HTMLDivElement>({
    threshold: 0.05,
  });
  const { ref: softRef, inView: softIn } = useInView<HTMLDivElement>({
    threshold: 0.05,
  });

  return (
    <section id="skills" className={styles.section}>
      <header
        ref={headerRef}
        className={`${styles.header} ${headerIn ? styles.isVisible : ""}`}
      >
        <span className={styles.eyebrow}>03 — Toolkit</span>
        <h2 className={styles.title}>Skills</h2>
        <p className={styles.subtitle}>What I build with and how I work.</p>
      </header>

      <div
        ref={hardRef}
        className={`${styles.group} ${hardIn ? styles.isVisible : ""}`}
      >
        <h3 className={styles.groupTitle}>
          <span className={styles.groupTitleNum}>01</span>
          <span>Hard skills</span>
        </h3>
        <p className={styles.groupSubtitle}>
          The stack I reach for the most.
        </p>

        <div className={styles.carouselWrap}>
          <LogosCarousel items={hardSkillsLogos} />
        </div>
      </div>

      <div
        ref={softRef}
        className={`${styles.group} ${softIn ? styles.isVisible : ""}`}
      >
        <h3 className={styles.groupTitle}>
          <span className={styles.groupTitleNum}>02</span>
          <span>Soft skills</span>
        </h3>
        <p className={styles.groupSubtitle}>
          How I show up and collaborate.
        </p>

        <div className={styles.softGrid}>
          {softSkillGroups.map((group) => (
            <div key={group.id} className={styles.softCol}>
              <header className={styles.softHeader}>
                <h4 className={styles.softLabel}>{group.label}</h4>
                <p className={styles.softDesc}>{group.description}</p>
              </header>
              <ul className={styles.softList}>
                {group.items.map((item) => (
                  <li key={item} className={styles.softPill}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}