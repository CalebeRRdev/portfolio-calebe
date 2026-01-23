// File: portfolio-site/src/components/ui/UrlPill.tsx

import styles from "./UrlPill.module.css";

type Props = {
  href: string;
  displayText?: string; // "ipuy.org.uy"
  tabTitle?: string; // "Iglesia Presbiteriana del Uruguay"
  faviconSrc?: string; // "/projects/favicon-light.png"
};

type MaskIconProps = {
  src: string;
  className?: string;
  title?: string;
};

function MaskIcon({ src, className, title }: MaskIconProps) {
  return (
    <span
      className={`${styles.maskIcon} ${className ?? ""}`}
      style={{ ["--icon-url" as any]: `url("${src}")` }}
      aria-hidden="true"
      title={title}
    />
  );
}

export function UrlPill({ href, displayText, tabTitle, faviconSrc }: Props) {
  const domain =
    displayText ?? href.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const title = tabTitle ?? domain;

  // ✅ default pro favicon light
  const fav = faviconSrc ?? "/projects/favicon-light.png";

  return (
    <a
      className={styles.wrap}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${domain}`}
      title={domain}
    >
      {/* ===== OUTER MOST ===== */}
      <div className={styles.outer} aria-hidden="true">
        {/* mac dots (no outer) */}
        <div className={styles.macDots}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />

        </div>

        {/* ===== INNER STRIP (contém inner-1 + inner-2) ===== */}

        <span className={styles.tabPlus}>+</span>
          {/* ===== INNER-1 (TAB STRIP) ===== */}
          <div className={styles.tabStrip}>
            <div className={styles.tabCard}>
              <span className={styles.faviconBadge} aria-hidden="true">
                <img
                  className={styles.favicon}
                  src={fav}
                  alt=""
                  draggable={false}
                />
              </span>

              <span className={styles.tabTitle}>{title}</span>
              

              <span className={styles.tabActions} aria-hidden="true">
                <span className={styles.tabClose}>×</span>
              </span>
              
            </div>
          </div>

          {/* ===== INNER-2 (TOOLBAR STRIP) ===== */}
          <div className={styles.toolbarStrip}>
            {/* arrows (fora da pill) */}
            <div className={styles.navIcons}>
              <span className={styles.iconBtn} aria-hidden="true">
                <MaskIcon
                  src="/projects/go-back-arrow-icon.png"
                  className={styles.iconArrow}
                  title="Back"
                />
              </span>

              <span className={styles.iconBtn} aria-hidden="true">
                <MaskIcon
                  src="/projects/go-forward-arrow-icon.png"
                  className={styles.iconArrow}
                  title="Forward"
                />
              </span>

              <span className={styles.iconBtn} aria-hidden="true">
                <MaskIcon
                  src="/projects/reload-arrow-icon.png"
                  className={styles.iconArrow}
                  title="Reload"
                />
              </span>
            </div>

            {/* ===== INNER-MOST (OMNIBOX PILL) ===== */}
            <div className={styles.omnibox}>
              <span className={styles.infoBadge} aria-hidden="true">
                <MaskIcon
                  src="/projects/view-site-information-icon.png"
                  className={styles.iconInfo}
                  title="View site information"
                />
              </span>

              <span className={styles.domain}>{domain}</span>
            </div>
          </div>
      </div>
    </a>
  );
}
