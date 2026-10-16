// File: src/components/SlimeNav.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import styles from "./Navbar.module.css";

type Props<T extends string> = {
  ids: readonly T[];
  labels: Record<T, string>;
  activeId: T;
  onGo: (id: T) => void;
};

// Fast start, long soft landing
const LEAD_EASE = [0.16, 1, 0.3, 1] as const;
const TRAIL_EASE = [0.33, 1, 0.68, 1] as const;

/**
 * Desktop nav whose highlight moves like slime in a tube: the leading edge
 * shoots ahead, the trailing edge catches up, and the blob thins as it stretches.
 * It follows the hovered link and settles back on the active section.
 */
export function SlimeNav<T extends string>({ ids, labels, activeId, onGo }: Props<T>) {
  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef(new Map<T, HTMLAnchorElement>());
  const [hoverId, setHoverId] = useState<T | null>(null);
  const reduced = useReducedMotion();

  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const squash = useMotionValue(1);
  const width = useTransform(() => right.get() - left.get());
  const placed = useRef(false);

  const target = hoverId ?? activeId;

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const link = linkRefs.current.get(target);
      if (!link) return null;
      return { l: link.offsetLeft, r: link.offsetLeft + link.offsetWidth };
    };

    const move = (instant: boolean) => {
      const to = measure();
      if (!to) return;
      if (instant || reduced) {
        left.set(to.l);
        right.set(to.r);
        return;
      }

      const goingRight = to.l > left.get();
      const distance = Math.abs(to.l - left.get());
      // Longer trips stay quick: duration grows gently with distance
      const lead = 0.26 + Math.min(distance, 600) * 0.00035;
      const trail = lead + 0.2;

      const [leading, trailing] = goingRight ? [right, left] : [left, right];
      const [leadTo, trailTo] = goingRight ? [to.r, to.l] : [to.l, to.r];

      animate(leading, leadTo, { duration: lead, ease: LEAD_EASE });
      animate(trailing, trailTo, { duration: trail, ease: TRAIL_EASE, delay: 0.04 });
      if (distance > 4) {
        animate(squash, [1, 0.74, 1.06, 1], { duration: trail + 0.1, times: [0, 0.35, 0.75, 1] });
      }
    };

    move(!placed.current);
    placed.current = true;

    const ro = new ResizeObserver(() => move(true));
    ro.observe(nav);
    return () => ro.disconnect();
  }, [target, reduced, left, right, squash]);

  return (
    <nav
      ref={navRef}
      className={styles.navDesktop}
      aria-label="Primary"
      onMouseLeave={() => setHoverId(null)}
    >
      <motion.span
        className={styles.slime}
        style={{ left, width, scaleY: squash }}
        aria-hidden="true"
      />
      {ids.map((id) => (
        <a
          key={id}
          ref={(el) => {
            if (el) linkRefs.current.set(id, el);
            else linkRefs.current.delete(id);
          }}
          href={`#${id}`}
          className={`${styles.navLink} ${target === id ? styles.navLinkActive : ""}`}
          aria-current={activeId === id ? "true" : undefined}
          onMouseEnter={() => setHoverId(id)}
          onFocus={() => setHoverId(id)}
          onBlur={() => setHoverId(null)}
          onClick={(e) => {
            e.preventDefault();
            setHoverId(null);
            onGo(id);
          }}
        >
          <span className={styles.navLinkText}>{labels[id]}</span>
        </a>
      ))}
    </nav>
  );
}
