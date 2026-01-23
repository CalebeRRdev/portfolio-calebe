// File: src/components/cards/VideoCard.tsx

"use client";

import { useEffect, useState } from "react";
import styles from "./VideoCard.module.css";
import type { VideoItem } from "@/data/videos";

export function VideoCard({ item }: { item: VideoItem }) {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <article className={styles.card}>
        <button
          type="button"
          className={styles.mediaButton}
          onClick={() => setOpen(true)}
          aria-label={`Open ${item.title}`}
        >
          <div className={styles.frame} style={{ aspectRatio: item.aspect }}>
            <video className={styles.video} preload="metadata" playsInline muted>
              <source src={item.src} type="video/mp4" />
            </video>

            <div className={styles.overlay} aria-hidden="true">
              <div className={styles.overlayInner}>
                <span className={styles.playIcon}>▶</span>
              </div>
            </div>
          </div>
        </button>

        <div className={styles.body}>
          <h4 className={styles.title}>{item.title}</h4>
          <p className={styles.desc}>{item.description}</p>
        </div>
      </article>

      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.modalClose} onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>

            <video className={styles.modalVideo} controls autoPlay playsInline>
              <source src={item.src} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}