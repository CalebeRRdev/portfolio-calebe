// File: src/components/cards/VideoCard.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./VideoCard.module.css";
import type { VideoItem } from "@/data/videos";

function getVideoTag(id: string): string | null {
  if (id.includes("ios")) return "iOS";
  if (id.includes("android")) return "Android";
  if (id.includes("light")) return "Light theme";
  if (id.includes("dark")) return "Dark theme";
  return null;
}

export function VideoCard({ item }: { item: VideoItem }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const tag = getVideoTag(item.id);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Pause + reset on close (prevents iOS audio bleed)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!open) {
      try {
        v.pause();
        v.currentTime = 0;
      } catch {}
    }
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
            <video
              className={styles.video}
              preload="metadata"
              playsInline
              muted
              poster={item.poster}
            >
              <source src={item.src} type="video/mp4" />
            </video>

            {tag && (
              <span className={styles.tag} aria-hidden="true">
                {tag}
              </span>
            )}

            <div className={styles.overlay} aria-hidden="true">
              <span className={styles.playRing}>
                <span className={styles.playBtn}>
                  <svg viewBox="0 0 24 24" className={styles.playIcon}>
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </button>

        <div className={styles.body}>
          <h4 className={styles.title}>{item.title}</h4>
          <p className={styles.desc}>{item.description}</p>
        </div>
      </article>

      {open && (
        <div
          className={styles.modalOverlay}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Video modal: ${item.title}`}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={close}
              aria-label="Close video"
            >
              ✕
            </button>

            <video
              ref={videoRef}
              className={styles.modalVideo}
              controls
              autoPlay
              playsInline
              poster={item.poster}
              webkit-playsinline="true"
              onEnded={close}
            >
              <source src={item.src} type="video/mp4" />
            </video>

            <div className={styles.mobileCloseBar}>
              <button
                type="button"
                onClick={close}
                className={styles.mobileCloseBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}