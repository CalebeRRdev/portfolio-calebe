// File: src/lib/scroll.ts
"use client";

import type Lenis from "lenis";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

function navOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  return (parseInt(raw, 10) || 72) + 40;
}

export function scrollToId(id: string) {
  const section = document.getElementById(id);
  if (!section) return;
  // Sections have generous top padding; aim for the heading so it sits right under the navbar
  const el = section.querySelector<HTMLElement>("[data-waypoint]") ?? section;

  // Pass a number, not the element: Lenis would also subtract the page's scroll-padding-top
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset());
  if (lenis) lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

/** Fired by RouteLine whenever the trail is (re)drawn. */
export const ROUTE_LINE_EVENT = "route-line";
type RouteXAt = (pageY: number) => number | null;
let routeXAt: RouteXAt | null = null;

export function setRouteLine(xAt: RouteXAt) {
  routeXAt = xAt;
  window.dispatchEvent(new Event(ROUTE_LINE_EVENT));
}

/** Where the trail crosses a given page height, in screen x (px); null before it's drawn. */
export function routeXAtPageY(pageY: number) {
  return routeXAt?.(pageY) ?? null;
}

/** Fired when a trip to the top ends; EdgeBounce answers with a small slingshot. */
export const EDGE_BOUNCE_EVENT = "edge-bounce";

export function scrollToTop() {
  const arrive = () => window.dispatchEvent(new CustomEvent(EDGE_BOUNCE_EVENT, { detail: 1 }));
  if (lenis) lenis.scrollTo(0, { duration: 1.6, onComplete: arrive });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Timestamp set right before a language switch so headings can scramble in. */
const LANG_SWITCH_KEY = "lang-switch-at";

export function markLanguageSwitch() {
  try {
    sessionStorage.setItem(LANG_SWITCH_KEY, String(Date.now()));
  } catch {}
}

export function cameFromLanguageSwitch() {
  try {
    const at = Number(sessionStorage.getItem(LANG_SWITCH_KEY));
    return !!at && Date.now() - at < 4000;
  } catch {
    return false;
  }
}

/** Remembers the visitor's language choice; the proxy reads it before geo detection. */
export function saveLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
