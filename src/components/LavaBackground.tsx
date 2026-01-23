// File: src/components/LavaBackground.tsx
import styles from "./LavaBackground.module.css";

export default function LavaBackground() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.lava}>
        <span className={`${styles.blob} ${styles.b1}`} />
        <span className={`${styles.blob} ${styles.b2}`} />
        <span className={`${styles.blob} ${styles.b3}`} />
        <span className={`${styles.blob} ${styles.b4}`} />
        <span className={`${styles.blob} ${styles.b5}`} />
      </div>

      <div className={styles.vignette} />
      <div className={styles.noise} />
    </div>
  );
}