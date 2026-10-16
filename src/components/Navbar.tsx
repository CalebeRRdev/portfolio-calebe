// File: src/components/Navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { getLenis, ROUTE_LINE_EVENT, routeXAtPageY, scrollToId, scrollToTop } from "@/lib/scroll";
import { ThemeToggle } from "./ThemeToggle";
import { LangSwitch } from "./LangSwitch";
import { SlimeNav } from "./SlimeNav";
import styles from "./Navbar.module.css";

type NavId = "home" | "experience" | "projects" | "skills" | "contact";
const NAV_IDS: NavId[] = ["home", "experience", "projects", "skills", "contact"];

/** Three nested contour rings: the site's mark */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" className={styles.mark} aria-hidden="true">
      <path d="M16 2.5c7.6 0 13.5 5.2 13.5 12.6S23.3 29.5 15.4 29.5 2.5 23.8 2.5 16.2 8.4 2.5 16 2.5Z" />
      <path d="M16.4 8c4.6 0 8 3.3 8 7.7s-3.6 8.3-8.4 8.3-7.9-3.6-7.9-8 3.7-8 8.3-8Z" />
      <path d="M16.6 13c1.9 0 3.2 1.3 3.2 3s-1.4 3.1-3.3 3.1-3.1-1.3-3.1-3 1.4-3.1 3.2-3.1Z" />
    </svg>
  );
}

export function Navbar({ dict, locale }: { dict: Dictionary["nav"]; locale: Locale }) {
  const navRef = useRef<HTMLElement | null>(null);
  const brandRef = useRef<HTMLAnchorElement | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<NavId>("home");

  const go = (id: NavId) => {
    const wasOpen = open;
    setOpen(false);
    const run = () => (id === "home" ? scrollToTop() : scrollToId(id));
    // The open drawer locks scrolling; wait until it has released the page
    if (wasOpen) window.setTimeout(run, 60);
    else run();
  };

  // ESC closes the drawer, and the page stops scrolling behind it
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    getLenis()?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      getLenis()?.start();
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Wide screens: keep the brand clear of the route line that runs down the page.
  // It steps left of the trail when there's room, otherwise to its right.
  useEffect(() => {
    const brand = brandRef.current;
    if (!brand) return;
    const GAP = 20;
    const EDGE = 16;
    const place = () => {
      brand.style.marginLeft = "";
      if (window.innerWidth < 900) return;
      const r = brand.getBoundingClientRect();
      // The navbar is fixed, so at the top of the page it sits at this page height
      const lineX = routeXAtPageY(r.top + r.height / 2);
      if (lineX === null || r.right + GAP <= lineX || r.left - GAP >= lineX) return;
      const toLeft = lineX - GAP - r.right;
      const shift = r.left + toLeft >= EDGE ? toLeft : lineX + GAP - r.left;
      brand.style.marginLeft = `${Math.round(shift)}px`;
    };
    place();
    window.addEventListener(ROUTE_LINE_EVENT, place);
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => {
      window.removeEventListener(ROUTE_LINE_EVENT, place);
      window.removeEventListener("resize", place);
    };
  }, []);

  // Keep --nav-h in sync with the real navbar height
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${Math.ceil(nav.getBoundingClientRect().height)}px`
      );
    update();
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy
  useEffect(() => {
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id as NavId);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.1, 0.4, 0.7, 1] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <header ref={navRef} className={`${styles.header} ${scrolled ? styles.isScrolled : ""}`}>
        <a
          ref={brandRef}
          className={styles.brand}
          href={`/${locale}`}
          onClick={(e) => {
            e.preventDefault();
            go("home");
          }}
        >
          <Mark />
          <span className={styles.brandText}>Calebe</span>
        </a>

        <SlimeNav ids={NAV_IDS} labels={dict} activeId={activeId} onGo={go} />

        <div className={styles.actions}>
          <LangSwitch locale={locale} label={dict.language} />
          <ThemeToggle toLight={dict.toLight} toDark={dict.toDark} />
          <button
            type="button"
            className={`${styles.burger} ${open ? styles.isOpen : ""}`}
            aria-label={open ? dict.closeMenu : dict.openMenu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burgerIcon} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className={styles.overlay}
              aria-label={dict.closeMenu}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.nav
              id="mobile-nav"
              className={styles.drawer}
              aria-label="Sections"
              initial={{ clipPath: "inset(0 0 100% 0 round 20px)" }}
              animate={{ clipPath: "inset(0 0 0% 0 round 20px)" }}
              exit={{ clipPath: "inset(0 0 100% 0 round 20px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {NAV_IDS.map((id, i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  className={`${styles.drawerLink} ${activeId === id ? styles.drawerLinkActive : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(id);
                  }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.045, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {dict[id]}
                </motion.a>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
