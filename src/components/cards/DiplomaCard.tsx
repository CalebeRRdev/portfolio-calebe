// File: src/components/cards/DiplomaCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/lib/scroll";
import styles from "./DiplomaCard.module.css";

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  viewLabel: string;
  closeLabel: string;
  caption: string;
};

const morph = { type: "spring", stiffness: 260, damping: 30 } as const;

/** A framed diploma that lifts off the page into a full view on click. */
export function DiplomaCard({ src, width, height, alt, viewLabel, closeLabel, caption }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target only exists on the client
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    getLenis()?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = prev;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <figure className={styles.figure}>
      <div className={styles.slot} style={{ aspectRatio: `${width} / ${height}` }}>
        {!open && (
          <motion.button
            ref={triggerRef}
            type="button"
            layoutId="diploma"
            transition={morph}
            className={styles.thumb}
            onClick={() => setOpen(true)}
            aria-label={viewLabel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} width={width} height={height} alt={alt} className={styles.img} loading="lazy" />
            <span className={styles.zoom} aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5 14 14M7 5v4M5 7h4" />
              </svg>
            </span>
          </motion.button>
        )}
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className={styles.overlay}
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  layoutId="diploma"
                  transition={morph}
                  className={styles.full}
                  style={{ aspectRatio: `${width} / ${height}` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} width={width} height={height} alt={alt} className={styles.img} />
                </motion.div>
                <motion.button
                  ref={closeRef}
                  type="button"
                  className={styles.close}
                  aria-label={closeLabel}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, transition: { delay: 0.2 } }}
                  exit={{ opacity: 0, scale: 0.6 }}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </figure>
  );
}
