// File: src/components/EdgeBounce.tsx
"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { EDGE_BOUNCE_EVENT } from "@/lib/scroll";

/** How far the page can be stretched past an edge, in px */
const MAX_PULL = 110;
/** Higher = more input needed to reach MAX_PULL */
const RESISTANCE = 240;
/** Wheel/trackpad: let go once input pauses this long */
const WHEEL_RELEASE_MS = 140;

/**
 * Slingshot effect at the top and bottom of the page: pull past the edge with
 * the wheel, trackpad or a finger, and the content stretches with growing
 * resistance, then springs back with a "boing" when released.
 * Moves the element marked [data-overscroll]; the map background stays put.
 */
export function EdgeBounce() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-overscroll]");
    if (!el || prefersReducedMotion()) return;

    let pull = 0; // raw input: > 0 pulled down past the top, < 0 pulled up past the bottom
    let releaseTimer = 0;
    let lastTouchY = 0;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    const atTop = () => window.scrollY <= 0;
    const atBottom = () => window.scrollY >= maxScroll() - 1;
    // A menu or a video is open: the page itself shouldn't stretch
    const locked = () => document.body.style.overflow === "hidden";

    const rubber = (raw: number) => Math.sign(raw) * MAX_PULL * (1 - Math.exp(-Math.abs(raw) / RESISTANCE));

    const apply = () => {
      gsap.killTweensOf(el);
      gsap.set(el, { y: rubber(pull) });
    };

    const release = () => {
      window.clearTimeout(releaseTimer);
      if (pull === 0) return;
      pull = 0;
      gsap.to(el, { y: 0, duration: 1.1, ease: "elastic.out(1, 0.32)", clearProps: "transform" });
    };

    const onWheel = (e: WheelEvent) => {
      if (locked()) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;

      if ((pull > 0 && dy > 0) || (pull < 0 && dy < 0)) {
        // Reversing direction: let it spring back right away
        release();
        return;
      }
      if (dy < 0 && atTop()) pull -= dy;
      else if (dy > 0 && atBottom()) pull -= dy;
      else return;

      apply();
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(release, WHEEL_RELEASE_MS);
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (locked()) return;
      const y = e.touches[0].clientY;
      const dy = y - lastTouchY; // > 0 = finger moving down
      lastTouchY = y;

      if ((dy > 0 && atTop()) || pull > 0) pull = Math.max(0, pull + dy);
      else if ((dy < 0 && atBottom()) || pull < 0) pull = Math.min(0, pull + dy);
      else return;
      apply();
    };

    // "Início" / "Back to top" landing: a small slingshot when the trip ends
    const onArrive = (e: Event) => {
      const dir = (e as CustomEvent<number>).detail || 1;
      gsap.killTweensOf(el);
      gsap
        .timeline()
        .to(el, { y: 34 * dir, duration: 0.16, ease: "power2.out" })
        .to(el, { y: 0, duration: 1.1, ease: "elastic.out(1, 0.3)", clearProps: "transform" });
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", release);
    window.addEventListener("touchcancel", release);
    window.addEventListener(EDGE_BOUNCE_EVENT, onArrive);

    return () => {
      window.clearTimeout(releaseTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", release);
      window.removeEventListener("touchcancel", release);
      window.removeEventListener(EDGE_BOUNCE_EVENT, onArrive);
      gsap.set(el, { clearProps: "transform" });
    };
  }, []);

  return null;
}
