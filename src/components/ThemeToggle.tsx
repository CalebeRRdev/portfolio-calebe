// File: src/components/ThemeToggle.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";


/**
 * A wobbly circle as a CSS polygon — the edge of the theme reveal looks like
 * a contour line growing out of the button instead of a perfect circle.
 */
function contourPolygon(cx: number, cy: number, r: number, phase: number) {
  const points: string[] = [];
  const n = 72;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const wobble = 1 + 0.11 * Math.sin(3 * a + phase) + 0.06 * Math.sin(7 * a - phase * 1.7);
    const rr = r * wobble;
    points.push(`${(cx + Math.cos(a) * rr).toFixed(1)}px ${(cy + Math.sin(a) * rr).toFixed(1)}px`);
  }
  return `polygon(${points.join(",")})`;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

export function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const busy = useRef(false);

  const pathname = usePathname();

  // Re-apply on every navigation: switching language re-renders <html>
  // and would otherwise drop the attribute set by the pre-paint script
  useLayoutEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("theme");
    } catch {}
    const current: Theme =
      saved === "dark" || saved === "light"
        ? saved
        : document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light";
    document.documentElement.setAttribute("data-theme", current);
    setTheme(current);
  }, [pathname]);

  const toggle = async () => {
    if (busy.current) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    const btn = btnRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!btn || reduced || !("startViewTransition" in document)) {
      applyTheme(next);
      setTheme(next);
      return;
    }

    busy.current = true;
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const reach = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
      applyTheme(next);
    });

    try {
      await transition.ready;
      const phase = Math.random() * Math.PI * 2;
      document.documentElement.animate(
        {
          clipPath: [
            contourPolygon(x, y, 0, phase),
            contourPolygon(x, y, reach * 0.3, phase + 1.2),
            contourPolygon(x, y, reach * 1.45, phase + 2.6),
          ],
        },
        {
          duration: 1100,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
      await transition.finished;
    } finally {
      busy.current = false;
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      ref={btnRef}
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={isDark ? toLight : toDark}
      title={isDark ? toLight : toDark}
      data-mounted={theme !== null}
    >
      <svg viewBox="0 0 40 40" className={styles.scene} aria-hidden="true">
        <defs>
          <clipPath id="tt-window">
            <circle cx="20" cy="20" r="19" />
          </clipPath>
          <mask id="tt-crescent">
            <rect width="40" height="40" fill="#fff" />
            <circle cx="24.5" cy="13.5" r="5.6" fill="#000" />
          </mask>
        </defs>

        <g clipPath="url(#tt-window)">
          <rect width="40" height="40" className={styles.sky} />

          <g className={styles.stars}>
            <circle cx="9" cy="10" r="0.9" />
            <circle cx="30" cy="8" r="0.7" />
            <circle cx="33" cy="17" r="0.9" />
            <circle cx="14" cy="5.5" r="0.6" />
          </g>

          <g className={styles.sun}>
            <g className={styles.rays}>
              {Array.from({ length: 8 }, (_, i) => (
                <line
                  key={i}
                  x1="20"
                  y1="6.2"
                  x2="20"
                  y2="8.4"
                  transform={`rotate(${i * 45} 20 17)`}
                />
              ))}
            </g>
            <circle cx="20" cy="17" r="5.4" className={styles.sunDisc} />
          </g>

          <g className={styles.moon}>
            <circle cx="20" cy="16" r="6" mask="url(#tt-crescent)" />
          </g>

          {/* Hills with a contour line, in front of sun and moon */}
          <path d="M-2 29 C 6 23, 12 23, 19 28 S 32 24, 42 27 V 42 H -2 Z" className={styles.hillBack} />
          <path d="M-2 33 C 8 28, 16 30, 22 32.5 S 34 29, 42 31 V 42 H -2 Z" className={styles.hill} />
          <path d="M2 36 C 10 33, 17 34.5, 23 36 S 33 34, 40 35" className={styles.contour} />
        </g>
        <circle cx="20" cy="20" r="19" className={styles.rim} />
      </svg>
    </button>
  );
}
