// File: portfolio-site/src/components/ui/UrlPill.tsx

import styles from "./UrlPill.module.css";

type Props = {
  href: string;
  displayText?: string;
  tabTitle?: string;
  faviconSrc?: string;
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
      <div className={styles.outer} aria-hidden="true">
        <div className={styles.macDots}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>

        <div className={styles.topRow}>
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

          <span className={styles.tabPlus} aria-hidden="true">
            +
          </span>
        </div>

        <div className={styles.toolbarStrip}>
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