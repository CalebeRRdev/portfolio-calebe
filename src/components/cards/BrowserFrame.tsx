// File: src/components/cards/BrowserFrame.tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import styles from "./BrowserFrame.module.css";

type Props = {
  src: string;
  width: number;
  height: number;
  url: string;
  href: string;
  alt: string;
};

/** A browser window whose page scrolls along with the reader's scroll. */
export function BrowserFrame({ src, width, height, url, href, alt }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLAnchorElement | null>(null);
  const pageRef = useRef<HTMLImageElement | null>(null);

  useGSAP(
    () => {
      const viewport = viewportRef.current;
      const page = pageRef.current;
      if (!viewport || !page || prefersReducedMotion()) return;

      gsap.to(page, {
        y: () => -(page.offsetHeight - viewport.offsetHeight),
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          end: "bottom 20%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={styles.browser}>
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.omnibox}>
          <svg viewBox="0 0 16 16">
            <path d="M5 7V5.5a3 3 0 0 1 6 0V7M4 7h8v6H4z" />
          </svg>
          {url}
        </span>
      </div>
      <a ref={viewportRef} className={styles.viewport} href={href} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={pageRef}
          src={src}
          width={width}
          height={height}
          alt={alt}
          className={styles.page}
          loading="lazy"
          onLoad={() => window.dispatchEvent(new Event("resize"))}
        />
      </a>
    </div>
  );
}
