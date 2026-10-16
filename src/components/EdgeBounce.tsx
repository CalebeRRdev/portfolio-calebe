// File: src/components/EdgeBounce.tsx
"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { EDGE_BOUNCE_EVENT, getLenis } from "@/lib/scroll";

/** Rubber-band stiffness: how much of the pull shows at first (iOS uses 0.55) */
const RUBBER = 0.55;
/** The stretch approaches this share of the screen height but never reaches it */
const MAX_SHARE = 0.4;
/** Wheel/trackpad: no input for this long counts as letting go */
const WHEEL_RELEASE_MS = 300;
/** Trackpad momentum (fingers already lifted) shows up as steadily shrinking deltas */
const MOMENTUM_FREEZE = 3;
const MOMENTUM_RELEASE = 6;
/** Wheel input is stepped, so the page follows it through a stiff, critically damped spring */
const FOLLOW = { stiffness: 1500, damping: 78 };
/** Let go: a quick snap back with a small overshoot, like a bowstring */
const RELEASE = { stiffness: 320, damping: 20 };
/** Kick given by "back to top" when it lands, in px/s */
const ARRIVE_KICK = 950;

/**
 * The top and bottom of the page are elastic. Keep scrolling past an edge (wheel,
 * trackpad or finger) and the content stretches with the motion, ever harder to
 * pull; hold and it stays; let go and it springs back with the speed it had.
 * A finger drives it directly; pulling back the other way eases the tension.
 * Moves the element marked [data-overscroll]; the map background stays put.
 */
export function EdgeBounce() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-overscroll]");
    if (!el || prefersReducedMotion()) return;

    let pull = 0; // raw input distance: > 0 pulled down past the top, < 0 up past the bottom
    let pullSign = 0; // which edge is being pulled: 1 = top, -1 = bottom
    let mode: "idle" | "wheel" | "touch" = "idle";
    let y = 0; // offset on screen
    let v = 0; // px/s
    let running = false;
    let releaseTimer = 0;

    // Wheel gesture tracking
    let lastWheelAt = 0;
    let lastMag = 0;
    let lastSign = 0;
    let decays = 0;

    // Touch tracking
    let lastTouchY = 0;
    let samples: { t: number; y: number }[] = [];

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    // Lenis lags the input: only count as "at the edge" once it has actually arrived
    const scrolled = () => getLenis()?.animatedScroll ?? window.scrollY;
    const atTop = () => scrolled() <= 0.5 && window.scrollY <= 0;
    const atBottom = () => scrolled() >= maxScroll() - 1 && window.scrollY >= maxScroll() - 1;
    // A menu or a video is open: the page itself shouldn't stretch
    const locked = () => document.body.style.overflow === "hidden";

    // iOS-style rubber band: follows ~55% of the input at first, then stiffens
    const limit = () => window.innerHeight * MAX_SHARE;
    const rubber = (raw: number) => {
      const d = limit();
      return Math.sign(raw) * d * (1 - 1 / ((Math.abs(raw) * RUBBER) / d + 1));
    };
    const unrubber = (offset: number) => {
      const d = limit();
      const f = Math.min(Math.abs(offset), d * 0.98) / d;
      return Math.sign(offset) * (d / RUBBER) * (1 / (1 - f) - 1);
    };

    const render = () => {
      el.style.transform = y === 0 ? "" : `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    // Physics, stepped on GSAP's ticker
    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 64) / 1000;
      if (mode === "touch") {
        // The finger drives the page directly; velocity comes from its recent movement
        y = rubber(pull);
        render();
        return;
      }
      const target = mode === "wheel" ? rubber(pull) : 0;
      const { stiffness, damping } = mode === "wheel" ? FOLLOW : RELEASE;
      const steps = Math.ceil(dt / (1 / 240));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        v += (stiffness * (target - y) - damping * v) * h;
        y += v * h;
      }
      if (mode === "idle" && Math.abs(y) < 0.15 && Math.abs(v) < 4) {
        y = 0;
        v = 0;
        stop();
      }
      render();
    };

    const start = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      running = false;
      gsap.ticker.remove(tick);
    };

    // Catch the page wherever it is (even mid-bounce), so a new pull never jumps
    const grab = (how: "wheel" | "touch", sign: number) => {
      pullSign = sign;
      pull = Math.sign(y) === sign ? unrubber(y) : 0;
      mode = how;
      start();
    };

    const release = () => {
      window.clearTimeout(releaseTimer);
      if (mode === "idle") return;
      if (mode === "touch") {
        // Hand the finger's speed over to the spring
        const now = performance.now();
        const recent = samples.filter((s) => now - s.t < 90);
        if (recent.length > 1) {
          const a = recent[0];
          const b = recent[recent.length - 1];
          v = b.t > a.t ? ((b.y - a.y) / (b.t - a.t)) * 1000 : 0;
        } else {
          v = 0;
        }
      }
      mode = "idle";
      pull = 0;
      start();
    };

    const swallow = (e: Event) => {
      // While stretched, the wheel belongs to the spring: keep it from Lenis and the page
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };

    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      if (dy === 0) return;

      const now = performance.now();
      const mag = Math.abs(dy);
      const sign = Math.sign(dy);
      if (now - lastWheelAt > 100 || sign !== lastSign) decays = 0;
      else if (mag < lastMag) decays++;
      else if (mag > lastMag * 1.2 + 1) decays = 0; // a fresh push
      lastWheelAt = now;
      lastMag = mag;
      lastSign = sign;

      if (mode === "wheel") {
        swallow(e);
        if (decays >= MOMENTUM_RELEASE) {
          release();
          return;
        }
        // Momentum after the fingers lift doesn't stretch any further
        if (decays < MOMENTUM_FREEZE) {
          pull -= dy;
          if (Math.sign(pull) !== pullSign) {
            pull = 0;
            release();
            return;
          }
        }
      } else {
        if (mode === "touch" || locked()) return;
        // The tail end of a fast scroll arriving at an edge doesn't load the spring
        if (decays >= MOMENTUM_FREEZE) return;
        if (dy < 0 && atTop()) grab("wheel", 1);
        else if (dy > 0 && atBottom()) grab("wheel", -1);
        else return;
        swallow(e);
        pull -= dy;
      }

      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(release, WHEEL_RELEASE_MS);
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
      samples = [];
      // Caught mid-bounce: hold it right there
      if (mode === "idle" && y !== 0 && !locked()) {
        grab("touch", Math.sign(y));
        v = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (locked() && mode !== "touch") return;
      const ty = e.touches[0].clientY;
      const dy = ty - lastTouchY; // > 0 = finger moving down
      lastTouchY = ty;

      if (mode === "touch") {
        pull += dy;
        // Eased all the way back: it rests at the edge until the finger lifts
        if (Math.sign(pull) !== pullSign) pull = 0;
      } else if ((dy > 0 && atTop()) || (dy < 0 && atBottom())) {
        grab("touch", Math.sign(dy));
        pull += dy;
      } else {
        return;
      }

      samples.push({ t: performance.now(), y: rubber(pull) });
      if (samples.length > 8) samples.shift();
      // The finger is stretching the page, not scrolling it
      if (e.cancelable) e.preventDefault();
    };

    const onTouchEnd = () => {
      if (mode === "touch") release();
    };

    // "Início" / "Back to top" landing: the trip's momentum carries a little past the edge
    const onArrive = (e: Event) => {
      if (mode !== "idle") return;
      const dir = (e as CustomEvent<number>).detail || 1;
      v += ARRIVE_KICK * dir;
      start();
    };

    // Capture on window runs before Lenis' own wheel listener
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener(EDGE_BOUNCE_EVENT, onArrive);

    return () => {
      window.clearTimeout(releaseTimer);
      stop();
      el.style.transform = "";
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener(EDGE_BOUNCE_EVENT, onArrive);
    };
  }, []);

  return null;
}
