// File: src/components/SlimeNav.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
/** Slightly longer than the Lenis scroll to a section (1.4s) */
const TRAVEL_MS = 1700;

/**
 * Desktop nav whose highlight moves like slime in a tube: the leading edge
 * shoots ahead, the trailing edge catches up, and the blob thins as it stretches.
 * It rests on the section in view; after a click it travels straight to the
 * destination instead of stopping at every section the page scrolls past.
 */
export function SlimeNav<T extends string>({ ids, labels, activeId, onGo }: Props<T>) {
  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef(new Map<T, HTMLAnchorElement>());
  const [clickedId, setClickedId] = useState<T | null>(null);
  const reduced = useReducedMotion();

  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const squash = useMotionValue(1);
  const width = useTransform(() => right.get() - left.get());
  const placed = useRef(false);
  const targetRef = useRef<T | null>(null);

  // While a click-scroll is travelling, ignore the sections it passes through
  const target = clickedId ?? activeId;

  const travelTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(travelTimer.current), []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    targetRef.current = target;

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
  }, [target, reduced, left, right, squash]);

  // Re-snap (no animation) when the nav changes size, e.g. fonts load or language changes
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false; // fires once on observe; the layout effect already placed the pill
        return;
      }
      const link = targetRef.current && linkRefs.current.get(targetRef.current);
      if (!link) return;
      left.set(link.offsetLeft);
      right.set(link.offsetLeft + link.offsetWidth);
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, [left, right]);

  return (
    <nav ref={navRef} className={styles.navDesktop} aria-label="Primary">
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
          onClick={(e) => {
            e.preventDefault();
            // Hold the pill on the destination for the length of the scroll trip
            window.clearTimeout(travelTimer.current);
            setClickedId(id);
            travelTimer.current = window.setTimeout(() => setClickedId(null), TRAVEL_MS);
            onGo(id);
          }}
        >
          <span className={styles.navLinkText}>{labels[id]}</span>
        </a>
      ))}
    </nav>
  );
}
