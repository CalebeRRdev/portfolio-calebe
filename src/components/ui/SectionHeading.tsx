// File: src/components/ui/SectionHeading.tsx
"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cameFromLanguageSwitch } from "@/lib/scroll";
import styles from "./SectionHeading.module.css";

type Props = {
  /** Marks this heading as a stop on the route line */
  waypoint: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ waypoint, title, subtitle }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      const el = titleRef.current;
      if (!el || prefersReducedMotion()) return;

      // After a language switch the new copy "decodes" into place instead
      if (cameFromLanguageSwitch()) {
        gsap.to(el, {
          duration: 1,
          scrambleText: { text: title, chars: "lowerCase", speed: 0.5, revealDelay: 0.15 },
        });
        return;
      }

      // Letters inflate through the variable font's weight and width axes
      SplitText.create(el, {
        type: "words,chars",
        charsClass: styles.char,
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.chars,
            { "--wght": 200, "--wdth": 75, yPercent: 35, opacity: 0 },
            {
              "--wght": 650,
              "--wdth": 100,
              yPercent: 0,
              opacity: 1,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.028,
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
            }
          );
        },
      });

      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.9,
          delay: 0.25,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      }
    },
    { scope: rootRef }
  );

  return (
    <header ref={rootRef} className={styles.header} data-waypoint={waypoint}>
      <h2 ref={titleRef} className={styles.title}>
        {title}
      </h2>
      {subtitle && (
        <p ref={subtitleRef} className={styles.subtitle}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
