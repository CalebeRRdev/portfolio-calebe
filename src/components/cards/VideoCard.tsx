// file: portfolio-site/src/components/cards/VideoCard.module.css

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./VideoCard.module.css";
import type { VideoItem } from "@/data/videos";

export function VideoCard({ item }: { item: VideoItem }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);

    // trava scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // ✅ sempre que fechar: pausa e volta pro início (evita bug de "áudio preso" no iOS)
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
        <div
          className={styles.modalOverlay}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Video modal: ${item.title}`}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* ✅ Close sempre acessível no iOS (no mobile vira FIXED via CSS) */}
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment @ts-expect-error - atributo iOS
              webkit-playsinline="true"
              onEnded={close}
            >
              <source src={item.src} type="video/mp4" />
            </video>

            {/* ✅ segunda rota de saída no mobile */}
            <div className={styles.mobileCloseBar}>
              <button type="button" onClick={close} className={styles.mobileCloseBtn}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}