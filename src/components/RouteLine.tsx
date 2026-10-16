// File: src/components/RouteLine.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setRouteLine } from "@/lib/scroll";
import styles from "./RouteLine.module.css";

type Pin = { id: string; x: number; y: number };
type Point = { x: number; y: number };
type Segment = [Point, Point, Point, Point];

/** x of the trail at height y, sampled from the cubic segment that spans it. */
function xAtY(segments: Segment[], y: number) {
  const seg = segments.find(([a, , , b]) => y >= a.y && y <= b.y);
  if (!seg) return null;
  const [p0, p1, p2, p3] = seg;
  let best = { dy: Infinity, x: p0.x };
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const u = 1 - t;
    const py = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
    if (Math.abs(py - y) < best.dy) {
      best = { dy: Math.abs(py - y), x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x };
    }
  }
  return best.x;
}

/** Where on screen the head of the route sits while scrolling (0 = top, 1 = bottom). */
const HEAD_AT = 0.62;
/**
 * The trail runs well past both ends of the page so its start and end are never
 * seen, not even when EdgeBounce stretches the page. The excess is clipped by
 * [data-overscroll] (overflow: clip) so it doesn't add scrollable height.
 */
const RUN_OFF = 600;
const LUT_STEPS = 400;

/**
 * A trail drawn in the left gutter that follows the reader down the page.
 * Waypoints are any elements inside the parent marked with [data-waypoint].
 */
export function RouteLine() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const revealRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const [geometry, setGeometry] = useState<{ d: string; w: number; h: number; pins: Pin[] }>({
    d: "",
    w: 0,
    h: 0,
    pins: [],
  });
  const [reached, setReached] = useState<Record<string, boolean>>({});

  // 1. Build the path from the waypoints' positions
  useEffect(() => {
    const root = rootRef.current;
    const container = root?.parentElement;
    if (!root || !container) return;

    const build = () => {
      const box = container.getBoundingClientRect();
      const gutter = parseFloat(getComputedStyle(container).paddingLeft) || 48;
      const x = Math.max(14, gutter * 0.42);
      const swing = Math.max(8, gutter * 0.3);

      const pins: Pin[] = Array.from(
        container.querySelectorAll<HTMLElement>("[data-waypoint]")
      ).map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.dataset.waypoint ?? "", x, y: r.top - box.top + 18 };
      });

      const h = container.scrollHeight;
      const stops = [{ x, y: -RUN_OFF }, ...pins, { x, y: h + RUN_OFF }];

      // Meander between stops with alternating cubic bends, like a trail on a hillside
      let d = `M ${x} ${-RUN_OFF}`;
      const segments: Segment[] = [];
      for (let i = 1; i < stops.length; i++) {
        const a = stops[i - 1];
        const b = stops[i];
        const span = b.y - a.y;
        const dir = i % 2 === 0 ? 1 : -1;
        const bend = Math.min(swing, span * 0.08) * dir;
        const c1 = { x: a.x + bend * 2.2, y: a.y + span * 0.3 };
        const c2 = { x: b.x - bend * 1.6, y: b.y - span * 0.35 };
        d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
        segments.push([a, c1, c2, b]);
      }

      setGeometry({ d, w: Math.max(40, gutter), h, pins });
      // Let others (the navbar brand) know where the trail runs
      const left = box.left;
      const top = box.top + window.scrollY;
      setRouteLine((pageY) => {
        const lx = xAtY(segments, pageY - top);
        return lx === null ? null : left + lx;
      });
    };

    build();
    const ro = new ResizeObserver(() => {
      build();
      ScrollTrigger.refresh();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // 2. Draw it in sync with scroll
  useEffect(() => {
    const root = rootRef.current;
    const reveal = revealRef.current;
    const marker = markerRef.current;
    if (!root || !reveal || !marker || !geometry.d) return;

    const total = reveal.getTotalLength();
    const lut: { len: number; y: number }[] = [];
    for (let i = 0; i <= LUT_STEPS; i++) {
      const len = (total * i) / LUT_STEPS;
      lut.push({ len, y: reveal.getPointAtLength(len).y });
    }
    const lengthAtY = (y: number) => {
      if (y <= 0) return 0;
      let lo = 0;
      let hi = lut.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (lut[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      return lut[lo].len;
    };

    reveal.style.strokeDasharray = `${total}`;
    const state = { len: 0 };

    const render = () => {
      reveal.style.strokeDashoffset = `${total - state.len}`;
      const p = reveal.getPointAtLength(state.len);
      marker.style.transform = `translate(${p.x}px, ${p.y}px)`;
    };

    const reduced = prefersReducedMotion();
    const toLen = reduced
      ? (v: number) => {
          state.len = v;
          render();
        }
      : gsap.quickTo(state, "len", { duration: 0.9, ease: "power3.out", onUpdate: render });

    const update = () => {
      const top = root.getBoundingClientRect().top;
      const headY = window.innerHeight * HEAD_AT - top;
      toLen(lengthAtY(headY));

      setReached((prev) => {
        let changed = false;
        const next: Record<string, boolean> = { ...prev };
        for (const pin of geometry.pins) {
          const hit = headY >= pin.y;
          if (!!prev[pin.id] !== hit) {
            next[pin.id] = hit;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: update,
      onRefresh: update,
    });
    update();

    return () => st.kill();
  }, [geometry]);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <svg
        ref={svgRef}
        className={styles.svg}
        width={geometry.w}
        height={geometry.h}
        viewBox={`0 0 ${geometry.w} ${geometry.h}`}
      >
        <defs>
          <mask id="route-reveal" maskUnits="userSpaceOnUse">
            <path ref={revealRef} d={geometry.d} className={styles.revealPath} />
          </mask>
        </defs>
        {/* The planned route, faint */}
        <path d={geometry.d} className={styles.planned} />
        {/* The travelled route, revealed by the mask */}
        <path d={geometry.d} className={styles.travelled} mask="url(#route-reveal)" />
      </svg>

      {geometry.pins.map((pin) => (
        <span
          key={pin.id}
          className={`${styles.pin} ${reached[pin.id] ? styles.pinReached : ""}`}
          style={{ transform: `translate(${pin.x}px, ${pin.y}px)` }}
        >
          <svg viewBox="0 0 24 32" className={styles.pinIcon}>
            <path d="M12 31s10-11.2 10-19A10 10 0 0 0 2 12c0 7.8 10 19 10 19Z" />
            <circle cx="12" cy="12" r="3.6" />
          </svg>
          <span className={styles.pinShadow} />
        </span>
      ))}

      <span ref={markerRef} className={styles.marker}>
        <span className={styles.markerDot} />
        <span className={styles.markerPulse} />
      </span>
    </div>
  );
}
