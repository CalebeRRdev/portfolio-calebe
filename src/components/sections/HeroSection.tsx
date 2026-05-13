// File: src/components/sections/HeroSection.tsx
"use client";

import styles from "./HeroSection.module.css";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const navH =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
      10
    ) || 72;
  const y = el.getBoundingClientRect().top + window.scrollY - (navH + 12);
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
};

export function HeroSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="inicio" className={styles.hero}>
      <div
        ref={ref}
        className={`${styles.heroInner} ${inView ? styles.isVisible : ""}`}
      >
        <div className={styles.heroLeft}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>Available for work</span>
          </span>

          <h1 className={styles.title}>
            <span className={styles.titleHello}>Hello, I&apos;m</span>
            <span className={styles.titleName}>Calebe</span>
          </h1>

          <p className={styles.role}>
            Software Engineer{" "}
            <span className={styles.roleDivider}>·</span> Front-end{" "}
            <span className={styles.roleDivider}>·</span> Mobile
          </p>

          <p className={styles.tagline}>
            Building thoughtful interfaces for mobile and web —{" "}
            <span className={styles.taglineAccent}>one detail at a time.</span>
          </p>

          <p className={styles.bio}>
            I love clean UI, practical UX, and fixing problems. Off-screen
            you&apos;ll find me on a basketball court, watching anime, or
            planning the next trip — my dream is to visit every country one
            day.
          </p>

          <div className={styles.ctas}>
            <button
              type="button"
              className={`${styles.cta} ${styles.ctaPrimary}`}
              onClick={() => scrollToId("projects")}
              aria-label="See projects"
            >
              <span>View projects</span>
              <svg
                viewBox="0 0 24 24"
                className={styles.ctaIcon}
                aria-hidden="true"
              >
                <path
                  d="M12 5v14M5 12l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <a
              className={`${styles.cta} ${styles.ctaSecondary}`}
              href="https://github.com/CalebeRRdev"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub profile"
            >
              <svg
                viewBox="0 0 24 24"
                className={styles.ctaIcon}
                aria-hidden="true"
              >
                <path
                  d="M12 .5C5.73.5.75 5.68.75 12.1c0 5.14 3.29 9.5 7.86 11.04.58.11.8-.26.8-.57v-2.1c-3.2.72-3.87-1.39-3.87-1.39-.52-1.37-1.27-1.73-1.27-1.73-1.04-.73.08-.72.08-.72 1.15.08 1.75 1.21 1.75 1.21 1.02 1.78 2.67 1.26 3.32.96.1-.76.4-1.26.73-1.55-2.55-.3-5.24-1.32-5.24-5.86 0-1.29.45-2.34 1.19-3.17-.12-.3-.52-1.53.11-3.18 0 0 .98-.32 3.2 1.21a10.8 10.8 0 0 1 2.91-.4c.99 0 1.99.14 2.91.4 2.22-1.53 3.2-1.21 3.2-1.21.63 1.65.23 2.88.11 3.18.74.83 1.19 1.88 1.19 3.17 0 4.55-2.7 5.56-5.27 5.85.41.37.78 1.1.78 2.22v3.29c0 .31.22.69.81.57 4.56-1.54 7.85-5.9 7.85-11.04C23.25 5.68 18.27.5 12 .5z"
                  fill="currentColor"
                />
              </svg>
              <span>GitHub</span>
            </a>

            <button
              type="button"
              className={`${styles.cta} ${styles.ctaSecondary}`}
              onClick={() => scrollToId("contact")}
              aria-label="Get in touch"
            >
              <svg
                viewBox="0 0 24 24"
                className={styles.ctaIcon}
                aria-hidden="true"
              >
                <path
                  d="M4 6h16v12H4z M4 6l8 7 8-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Get in touch</span>
            </button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.avatarOuter}>
            <span className={styles.avatarRing} aria-hidden="true" />
            <span className={styles.avatarGlow} aria-hidden="true" />
            <div className={styles.avatarWrap}>
              <Image
                src="/projects/foto-portfolio.jpg"
                alt="Calebe portrait"
                width={400}
                height={400}
                className={styles.avatar}
                priority
              />
            </div>
          </div>

          <p className={styles.nowLine}>
            <span className={styles.nowLabel}>Now</span>
            <span className={styles.nowArrow}>→</span>
            <span className={styles.nowText}>
              working on map-based mobile apps with React Native + Expo
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}