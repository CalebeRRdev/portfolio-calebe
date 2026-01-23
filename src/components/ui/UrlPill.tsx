// File: src/components/ui/UrlPill.tsx

import styles from "./UrlPill.module.css";

type Props = {
  href: string;
  displayText?: string;
};

export function UrlPill({ href, displayText }: Props) {
  const text = displayText ?? href.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <a
      className={styles.wrap}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${text}`}
      title={text}
    >
      {/* Toolbar (cinza) */}
      <div className={styles.toolbar} aria-hidden="true">
        <div className={styles.windowControls}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>

        {/* Address bubble (mais escuro) */}
        <div className={styles.address}>
          <span className={styles.text}>{text}</span>
        </div>
      </div>
    </a>
  );
}