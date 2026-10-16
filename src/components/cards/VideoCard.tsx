// File: src/components/cards/VideoCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { VideoItem } from "@/data/videos";
import { getLenis } from "@/lib/scroll";
import styles from "./VideoCard.module.css";

type Props = {
  item: VideoItem;
  title: string;
  description: string;
  tag: string;
  playLabel: string;
  closeLabel: string;
  variant?: "phone" | "screen";
  /** Keep the caption for screen readers only */
  hideCaption?: boolean;
};

const morph = { type: "spring", stiffness: 260, damping: 32 } as const;

export function VideoCard({
  item,
  title,
  description,
  tag,
  playLabel,
  closeLabel,
  variant = "screen",
  hideCaption = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const layoutId = `video-${item.id}`;

  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target only exists on the client
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    getLenis()?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      getLenis()?.start();
      document.body.style.overflow = prev;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <figure className={`${styles.card} ${variant === "phone" ? styles.phone : styles.screen}`}>
      <div className={styles.slot} style={{ aspectRatio: item.aspect.replace("/", " / ") }}>
        {!open && (
          <motion.button
            ref={triggerRef}
            type="button"
            layoutId={layoutId}
            transition={morph}
            className={styles.thumb}
            onClick={() => setOpen(true)}
            aria-label={`${playLabel}: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.poster} alt="" className={styles.poster} loading="lazy" draggable={false} />
            <span className={styles.tag}>{tag}</span>
            <span className={styles.play} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5.5v13l10.5-6.5z" />
              </svg>
            </span>
          </motion.button>
        )}
      </div>

      <figcaption className={hideCaption ? "sr-only" : styles.caption}>
        <span className={styles.title}>{title}</span>
        <span className={styles.desc}>{description}</span>
      </figcaption>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label={title}
              >
                <motion.div
                  layoutId={layoutId}
                  transition={morph}
                  className={`${styles.player} ${item.aspect.startsWith("9/") ? styles.playerTall : styles.playerWide}`}
                  style={
                    {
                      aspectRatio: item.aspect.replace("/", " / "),
                      "--ar": item.aspect.replace("/", " / "),
                    } as React.CSSProperties
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    className={styles.video}
                    src={item.src}
                    poster={item.poster}
                    controls
                    autoPlay
                    playsInline
                    onEnded={() => setOpen(false)}
                  />
                </motion.div>
                <motion.button
                  ref={closeRef}
                  type="button"
                  className={styles.close}
                  onClick={() => setOpen(false)}
                  aria-label={closeLabel}
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
