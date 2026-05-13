// File: src/components/Navbar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Navbar.module.css";

type NavItem = { id: string; label: string };

export function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);

  const items: NavItem[] = useMemo(
    () => [
      { id: "inicio", label: "Home" },
      { id: "projects", label: "Projects" },
      { id: "skills", label: "Skills" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("inicio");

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    const nav = navRef.current;
    if (!el) return;

    const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 72;
    const gap = 12;

    const y = el.getBoundingClientRect().top + window.scrollY - (navH + gap);
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  // ESC closes drawer + lock body scroll while open
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Keep --nav-h in sync with actual navbar height
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const update = () => {
      const h = Math.ceil(nav.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(nav);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Scroll-aware background opacity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlights active section
  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.1, 0.4, 0.7, 1],
      }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [items]);

  return (
    <>
      <header
        ref={navRef}
        className={`${styles.header} ${scrolled ? styles.isScrolled : ""}`}
      >
        <a
          className={styles.brand}
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("inicio");
            closeMenu();
          }}
          aria-label="Go to Home section"
        >
          <span className={styles.brandText}>Calebe</span>
          <span className={styles.brandDot}>.</span>
        </a>

        <nav className={styles.navDesktop} aria-label="Primary">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`${styles.navLink} ${
                activeId === it.id ? styles.navLinkActive : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(it.id);
              }}
            >
              {it.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`${styles.navburger} ${open ? styles.isOpen : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={toggleMenu}
        >
          <span className={styles.navburgerIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      <button
        type="button"
        className={`${styles.overlay} ${open ? styles.isOpen : ""}`}
        aria-label="Close menu"
        onClick={closeMenu}
        tabIndex={open ? 0 : -1}
      />

      <aside
        id="mobile-nav"
        className={`${styles.drawer} ${open ? styles.isOpen : ""}`}
        aria-label="Menu"
      >
        <div
          className={styles.drawerLinks}
          role="navigation"
          aria-label="Sections"
        >
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`${styles.drawerLink} ${
                activeId === it.id ? styles.drawerLinkActive : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(it.id);
                closeMenu();
              }}
            >
              <span className={styles.drawerLinkText}>{it.label}</span>
              <span className={styles.drawerLinkArrow} aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </aside>
    </>
  );
}