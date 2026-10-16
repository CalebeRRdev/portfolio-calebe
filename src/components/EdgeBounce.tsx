// File: src/components/EdgeBounce.tsx
"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { EDGE_BOUNCE_EVENT, getLenis } from "@/lib/scroll";

/** How far the page can be stretched past an edge, in px */
const MAX_PULL = 120;
/** Higher = more input needed to reach MAX_PULL */
const RESISTANCE = 260;
/** Wheel/trackpad: no input for this long counts as letting go */
const WHEEL_RELEASE_MS = 180;
/** While held, the page follows the input this tightly (critically damped) */
const FOLLOW = { stiffness: 900, damping: 60 };
/** Let go: a quick snap back with one small overshoot, like a bowstring */
const RELEASE = { stiffness: 320, damping: 17 };
/** Kick given by "back to top" when it lands, in px/s */
const ARRIVE_KICK = 950;

/**
 * Slingshot at the top and bottom of the page. Keep scrolling (wheel, trackpad or
 * finger) past an edge and the page stretches with the motion, with growing
 * resistance; hold and it stays loaded; let go and it springs back. Pulling back
 * the other way eases the tension first, then scrolls normally.
 * Moves the element marked [data-overscroll]; the map background stays put.
 */
export function EdgeBounce() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-overscroll]");
    if (!el || prefersReducedMotion()) return;

    let pull = 0; // raw input: > 0 pulled down past the top, < 0 pulled up past the bottom
    let holding = false;
    let y = 0; // what's on screen
    let v = 0; // px/s
    let running = false;
    let releaseTimer = 0;
    let lastTouchY = 0;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    // Lenis lags the input: only count as "at the edge" once it has actually arrived
    const scrolled = () => getLenis()?.animatedScroll ?? window.scrollY;
    const atTop = () => scrolled() <= 0.5 && window.scrollY <= 0;
    const atBottom = () => scrolled() >= maxScroll() - 1 && window.scrollY >= maxScroll() - 1;
    // A menu or a video is open: the page itself shouldn't stretch
    const locked = () => document.body.style.overflow === "hidden";

    const rubber = (raw: number) => Math.sign(raw) * MAX_PULL * (1 - Math.exp(-Math.abs(raw) / RESISTANCE));

    // Spring simulation, stepped on GSAP's ticker
    const tick = (_time: number, deltaMs: number) => {
      const target = holding ? rubber(pull) : 0;
      const { stiffness, damping } = holding ? FOLLOW : RELEASE;
      const dt = Math.min(deltaMs, 64) / 1000;
      const steps = Math.ceil(dt / (1 / 240));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        v += (stiffness * (target - y) - damping * v) * h;
        y += v * h;
      }

      if (!holding && Math.abs(y) < 0.15 && Math.abs(v) < 4) {
        y = 0;
        v = 0;
        stop();
        return;
      }
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const start = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      running = false;
      gsap.ticker.remove(tick);
      el.style.transform = "";
    };

    const grab = () => {
      holding = true;
      start();
    };

    const release = () => {
      window.clearTimeout(releaseTimer);
      if (!holding) return;
      holding = false;
      pull = 0;
    };

    const onWheel = (e: WheelEvent) => {
      if (locked() && !holding) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;

      if (holding) {
        // Follow the input both ways; easing all the way back lets go
        const next = pull - dy;
        pull = Math.sign(next) === Math.sign(pull) ? next : 0;
        if (pull === 0) {
          release();
          return;
        }
      } else if (dy < 0 && atTop()) {
        pull = -dy;
        grab();
      } else if (dy > 0 && atBottom()) {
        pull = -dy;
        grab();
      } else {
        return;
      }

      // While stretched, the wheel belongs to the spring: keep it from Lenis and the page
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(release, WHEEL_RELEASE_MS);
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (locked() && !holding) return;
      const ty = e.touches[0].clientY;
      const dy = ty - lastTouchY; // > 0 = finger moving down
      lastTouchY = ty;

      if (holding) {
        const next = pull + dy;
        pull = Math.sign(next) === Math.sign(pull) ? next : 0;
        if (pull === 0) {
          release();
          return;
        }
      } else if ((dy > 0 && atTop()) || (dy < 0 && atBottom())) {
        pull = dy;
        grab();
      } else {
        return;
      }
      // The finger is stretching the page, not scrolling it
      if (e.cancelable) e.preventDefault();
    };

    // "Início" / "Back to top" landing: the trip's momentum carries a little past the edge
    const onArrive = (e: Event) => {
      if (holding) return;
      const dir = (e as CustomEvent<number>).detail || 1;
      v += ARRIVE_KICK * dir;
      start();
    };

    // Capture on window runs before Lenis' own wheel listener
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", release);
    window.addEventListener("touchcancel", release);
    window.addEventListener(EDGE_BOUNCE_EVENT, onArrive);

    return () => {
      window.clearTimeout(releaseTimer);
      stop();
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", release);
      window.removeEventListener("touchcancel", release);
      window.removeEventListener(EDGE_BOUNCE_EVENT, onArrive);
    };
  }, []);

  return null;
}
