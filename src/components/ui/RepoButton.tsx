// File: src/components/ui/RepoButton.tsx

import styles from "./RepoButton.module.css";
import { GoArrowUpRight } from "react-icons/go";

function GitHubIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path d="M12 .5C5.73.5.75 5.68.75 12.1c0 5.14 3.29 9.5 7.86 11.04.58.11.8-.26.8-.57v-2.1c-3.2.72-3.87-1.39-3.87-1.39-.52-1.37-1.27-1.73-1.27-1.73-1.04-.73.08-.72.08-.72 1.15.08 1.75 1.21 1.75 1.21 1.02 1.78 2.67 1.26 3.32.96.1-.76.4-1.26.73-1.55-2.55-.3-5.24-1.32-5.24-5.86 0-1.29.45-2.34 1.19-3.17-.12-.3-.52-1.53.11-3.18 0 0 .98-.32 3.2 1.21a10.8 10.8 0 0 1 2.91-.4c.99 0 1.99.14 2.91.4 2.22-1.53 3.2-1.21 3.2-1.21.63 1.65.23 2.88.11 3.18.74.83 1.19 1.88 1.19 3.17 0 4.55-2.7 5.56-5.27 5.85.41.37.78 1.1.78 2.22v3.29c0 .31.22.69.81.57 4.56-1.54 7.85-5.9 7.85-11.04C23.25 5.68 18.27.5 12 .5z" />
    </svg>
  );
}

type RepoButtonProps = {
  href: string;

  /** Small label above the main line (ex: "MobTech Solutions") */
  titleTop?: string;

  /** Main action text (ex: "View repository") */
  titleMain?: string;

  /** Optional handle shown on the right (ex: "@CalebeRRdev") */
  username?: string;

  /** Tooltip */
  title?: string;

  ariaLabel?: string;
};

export function RepoButton({
  href,
  titleTop = "GitHub",
  titleMain = "View repository",
  username,
  title,
  ariaLabel = "Open GitHub repository",
}: RepoButtonProps) {
  return (
    <a
      className={styles.btn}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      title={title ?? titleMain}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        <GitHubIcon className={styles.icon} />
      </span>

      <span className={styles.textCol}>
        <span className={styles.top}>{titleTop}</span>
        <span className={styles.main}>
          {titleMain}
          {username ? <span className={styles.handle}>{username}</span> : null}
        </span>
      </span>

      <span className={styles.chev} aria-hidden="true">
      <GoArrowUpRight />
      </span>
    </a>
  );
}