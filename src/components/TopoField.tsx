// File: src/components/TopoField.tsx
"use client";

import { useEffect, useRef } from "react";
import { contours } from "d3-contour";
import { createNoise3D } from "simplex-noise";
import styles from "./TopoField.module.css";

/** Grid resolution in CSS px. Lower = smoother lines, more CPU. */
const CELL = 14;
/** Every Nth contour is an "index contour": bolder and labelled, like on real survey maps. */
const INDEX_EVERY = 5;
const THRESHOLDS = Array.from({ length: 26 }, (_, i) => -1.1 + i * 0.12);
const FIELD_SCALE = 1 / 560;
const HILL_RADIUS = 120;
const FRAME_MS = 1000 / 30;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Palette = { line: string; index: string; label: string };

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  return {
    line: css.getPropertyValue("--topo-line").trim() || "rgba(0,0,0,.15)",
    index: css.getPropertyValue("--topo-index").trim() || "rgba(0,0,0,.3)",
    label: css.getPropertyValue("--text-2").trim() || "#888",
  };
}

export function TopoField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noise = createNoise3D(mulberry32(2026));
    const contourGen = contours();

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let values = new Float64Array(0);
    let palette = readPalette();
    let font = "";

    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 };
    let t = 0;
    let last = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / CELL) + 2;
      rows = Math.ceil(h / CELL) + 2;
      values = new Float64Array(cols * rows);
      contourGen.size([cols, rows]).thresholds(THRESHOLDS);

      const family = getComputedStyle(document.body).fontFamily;
      font = `500 10px ${family}`;
    };

    const sample = () => {
      // The field drifts at ~35% of scroll speed: a slow parallax under the content
      const scrollY = window.scrollY * 0.35;
      const sigma2 = 2 * HILL_RADIUS * HILL_RADIUS;
      const hill = pointer.strength * 1.25;

      for (let j = 0; j < rows; j++) {
        const sy = (j - 1) * CELL;
        const ny = (sy + scrollY) * FIELD_SCALE;
        for (let i = 0; i < cols; i++) {
          const sx = (i - 1) * CELL;
          const nx = sx * FIELD_SCALE;
          let v = noise(nx, ny, t) * 0.72 + noise(nx * 2.3, ny * 2.3, t * 1.4) * 0.22;
          if (hill > 0.001) {
            const dx = sx - pointer.x;
            const dy = sy - pointer.y;
            v += hill * Math.exp(-(dx * dx + dy * dy) / sigma2);
          }
          values[j * cols + i] = v;
        }
      }
    };

    /** Smooth a marching-squares ring with quadratic curves through midpoints. */
    const traceRing = (ring: number[][]) => {
      const n = ring.length;
      if (n < 3) return;
      const px = (p: number[]) => (p[0] - 1) * CELL;
      const py = (p: number[]) => (p[1] - 1) * CELL;
      ctx.moveTo((px(ring[0]) + px(ring[1])) / 2, (py(ring[0]) + py(ring[1])) / 2);
      for (let k = 1; k < n; k++) {
        const a = ring[k];
        const b = ring[(k + 1) % n];
        ctx.quadraticCurveTo(px(a), py(a), (px(a) + px(b)) / 2, (py(a) + py(b)) / 2);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const shapes = contourGen(values as unknown as number[]);
      const labels: { x: number; y: number; angle: number; text: string }[] = [];

      shapes.forEach((shape, level) => {
        const isIndex = level % INDEX_EVERY === 0;
        ctx.beginPath();
        let longest: number[][] | null = null;

        for (const polygon of shape.coordinates) {
          for (const ring of polygon) {
            traceRing(ring);
            if (isIndex && (!longest || ring.length > longest.length)) longest = ring;
          }
        }

        ctx.strokeStyle = isIndex ? palette.index : palette.line;
        ctx.lineWidth = isIndex ? 1.25 : 0.8;
        ctx.stroke();

        if (isIndex && longest && longest.length > 40) {
          const k = Math.floor(longest.length * 0.37);
          const a = longest[k];
          const b = longest[k + 2] ?? longest[0];
          const x = (a[0] - 1) * CELL;
          const y = (a[1] - 1) * CELL;
          if (x > 40 && x < w - 40 && y > 90 && y < h - 30) {
            let angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
            if (angle > Math.PI / 2) angle -= Math.PI;
            if (angle < -Math.PI / 2) angle += Math.PI;
            labels.push({ x, y, angle, text: String(800 + level * 20) });
          }
        }
      });

      // Elevation labels sit in a gap cut out of their contour line
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const l of labels) {
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.angle);
        const tw = ctx.measureText(l.text).width + 8;
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(-tw / 2, -6, tw, 12);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = palette.label;
        ctx.globalAlpha = 0.55;
        ctx.fillText(l.text, 0, 0.5);
        ctx.restore();
      }
    };

    const render = () => {
      sample();
      draw();
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      const dt = Math.min(64, now - last);
      last = now;

      t += dt * 0.000045;
      pointer.strength += (pointer.target - pointer.strength) * 0.06;
      render();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.target = 1;
    };
    const onPointerLeave = () => {
      pointer.target = 0;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };

    // Re-read colors whenever the theme flips
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      if (reduced) render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const onResize = () => {
      resize();
      render();
    };

    resize();
    render();

    window.addEventListener("resize", onResize);
    if (reduced) {
      window.addEventListener("scroll", render, { passive: true });
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", render);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.grain} />
    </div>
  );
}
