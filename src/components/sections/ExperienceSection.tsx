// File: src/components/sections/ExperienceSection.tsx
"use client";

import { useRef } from "react";
import type { Dictionary } from "@/i18n/getDictionary";
import type { JobId } from "@/i18n/dictionaries/en";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AlbumDemo } from "@/components/demos/AlbumDemo";
import { PipelineDemo } from "@/components/demos/PipelineDemo";
import styles from "./ExperienceSection.module.css";

const LETSPIC_STACK = ["Svelte", "Python", "C#", "JavaScript", "CSS", "PostgreSQL", "Azure SWA", "Google Cloud"];
const MOBTECH_STACK = ["React Native", "Expo", "TypeScript", "PostgreSQL", "PostGIS"];
const FREELANCE_SITES = [
  { href: "https://www.voltaaflora.com/", label: "voltaaflora.com" },
  { href: "https://ipuy.org.uy/", label: "ipuy.org.uy" },
];

function Chips({ items }: { items: string[] }) {
  return (
    <ul className={styles.chips}>
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export function ExperienceSection({ dict }: { dict: Dictionary["experience"] }) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Each stop's rule is surveyed in from left to right as it arrives
      gsap.utils.toArray<HTMLElement>(`.${styles.stop}`).forEach((stop) => {
        gsap.from(stop.querySelector(`.${styles.rule}`), {
          scaleX: 0,
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: { trigger: stop, start: "top 85%", once: true },
        });
        gsap.from(stop.querySelectorAll("[data-reveal]"), {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: stop, start: "top 80%", once: true },
        });
      });
    },
    { scope: rootRef }
  );

  const job = (id: JobId) => dict.jobs[id];

  return (
    <section id="experience" ref={rootRef} className={styles.section}>
      <SectionHeading waypoint="experience" title={dict.title} subtitle={dict.subtitle} />

      <ol className={styles.timeline}>
        {/* LetsPic */}
        <li className={`${styles.stop} ${styles.current}`}>
          <span className={styles.rule} />
          <div className={styles.when}>
            <span className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              {dict.current}
            </span>
            <span className={styles.period}>{job("letspic").period}</span>
            <span className={styles.kind}>{job("letspic").kind}</span>
          </div>

          <div className={styles.what}>
            <h3 className={styles.org} data-reveal>
              {job("letspic").org}
            </h3>
            <p className={styles.role} data-reveal>
              {job("letspic").role}
            </p>
            <p className={styles.summary} data-reveal>
              {job("letspic").summary}
            </p>
            <p className={styles.summary} data-reveal>
              {job("letspic").detail}
            </p>

            <h4 className={styles.subhead} data-reveal>
              {dict.builtLabel}
            </h4>
            <div className={styles.products}>
              <article className={styles.product} data-reveal>
                <header className={styles.productHead}>
                  <h5 className={styles.productName}>{dict.products.album.name}</h5>
                  <p className={styles.productDesc}>{dict.products.album.description}</p>
                </header>
                <AlbumDemo dict={dict.album} />
              </article>
              <article className={styles.product} data-reveal>
                <header className={styles.productHead}>
                  <h5 className={styles.productName}>{dict.products.crm.name}</h5>
                  <p className={styles.productDesc}>{dict.products.crm.description}</p>
                </header>
                <PipelineDemo dict={dict.crm} />
              </article>
            </div>

            <div className={styles.stackRow} data-reveal>
              <span className={styles.stackLabel}>{dict.stackLabel}</span>
              <Chips items={LETSPIC_STACK} />
            </div>
          </div>
        </li>

        {/* Freelance */}
        <li className={styles.stop}>
          <span className={styles.rule} />
          <div className={styles.when}>
            <span className={styles.period}>{job("freelance").period}</span>
            <span className={styles.kind}>{job("freelance").kind}</span>
          </div>
          <div className={styles.what}>
            <h3 className={styles.org} data-reveal>
              {job("freelance").org}
            </h3>
            <p className={styles.role} data-reveal>
              {job("freelance").role}
            </p>
            <p className={styles.summary} data-reveal>
              {job("freelance").summary}
            </p>
            <ul className={styles.links} data-reveal>
              {FREELANCE_SITES.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className={styles.siteLink}>
                    {s.label}
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M5 11 11 5M6 5h5v5" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>

        {/* University */}
        <li className={styles.stop}>
          <span className={styles.rule} />
          <div className={styles.when}>
            <span className={styles.period}>{job("university").period}</span>
            <span className={styles.kind}>{job("university").kind}</span>
          </div>
          <div className={styles.what}>
            <h3 className={styles.org} data-reveal>
              {job("university").org}
            </h3>
            <p className={styles.role} data-reveal>
              {job("university").role}
            </p>
            <p className={styles.summary} data-reveal>
              {job("university").summary}
            </p>
            <div className={styles.stackRow} data-reveal>
              <Chips items={MOBTECH_STACK} />
            </div>
          </div>
        </li>
      </ol>
    </section>
  );
}
