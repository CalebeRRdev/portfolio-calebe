// File: src/components/sections/ContactSection.tsx
"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { IconType } from "react-icons";
import { SiGithub, SiInstagram, SiWhatsapp } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { TbMail } from "react-icons/tb";
import type { Dictionary } from "@/i18n/getDictionary";
import { contacts, EMAIL, type ContactId } from "@/data/contact";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Magnetic } from "@/components/ui/Magnetic";
import styles from "./ContactSection.module.css";

const ICONS: Record<ContactId, IconType> = {
  email: TbMail,
  linkedin: FaLinkedinIn,
  whatsapp: SiWhatsapp,
  github: SiGithub,
  instagram: SiInstagram,
};

export function ContactSection({ dict }: { dict: Dictionary["contact"] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(`.${styles.row}`, {
        opacity: 0,
        x: -24,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.list}`, start: "top 85%", once: true },
      });
    },
    { scope: rootRef }
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" ref={rootRef} className={styles.section}>
      <SectionHeading waypoint="contact" title={dict.title} subtitle={dict.subtitle} />

      <div className={styles.emailRow}>
        <a href={`mailto:${EMAIL}`} className={styles.email}>
          {EMAIL}
        </a>
        <Magnetic>
          <button type="button" className={styles.copy} onClick={copy} aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  className={styles.copyInner}
                  initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
                >
                  <svg viewBox="0 0 16 16" className={styles.check} aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7" />
                  </svg>
                  {dict.copied}
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  className={styles.copyInner}
                  initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
                >
                  <svg viewBox="0 0 16 16" className={styles.copyIcon} aria-hidden="true">
                    <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
                    <path d="M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5H5" />
                  </svg>
                  {dict.copyEmail}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </Magnetic>
      </div>

      <ul className={styles.list}>
        {contacts
          .filter((c) => c.id !== "email")
          .map((c) => {
            const Icon = ICONS[c.id];
            return (
              <li key={c.id} className={styles.row}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.link} ${styles[`brand_${c.id}`]}`}
                >
                  <span className={styles.icon} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className={styles.label}>{dict.labels[c.id]}</span>
                  <span className={styles.handle}>{c.handle}</span>
                  <svg viewBox="0 0 16 16" className={styles.arrow} aria-hidden="true">
                    <path d="M5 11 11 5M6 5h5v5" />
                  </svg>
                </a>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
