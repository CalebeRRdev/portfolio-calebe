// File: src/components/Footer.tsx
"use client";

import type { Dictionary } from "@/i18n/getDictionary";
import { scrollToTop } from "@/lib/scroll";
import styles from "./Footer.module.css";

export function Footer({ dict }: { dict: Dictionary["footer"] }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.made}>
          {dict.madeBy}{" "}
          <a href="https://github.com/CalebeRRdev" target="_blank" rel="noreferrer" className={styles.handle}>
            CalebeRRdev
          </a>
        </p>
        <button type="button" className={styles.top} onClick={scrollToTop}>
          <svg viewBox="0 0 24 32" aria-hidden="true">
            <path d="M12 31s10-11.2 10-19A10 10 0 0 0 2 12c0 7.8 10 19 10 19Z" />
            <circle cx="12" cy="12" r="3.6" />
          </svg>
          {dict.top}
        </button>
      </div>
    </footer>
  );
}
