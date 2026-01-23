// File: src/components/projects/ProjectsSection.tsx

import styles from "./ProjectsSection.module.css";
import { videos } from "@/data/videos";
import { VideoCard } from "@/components/cards/VideoCard";
import { RepoButton } from "@/components/ui/RepoButton";
import { UrlPill } from "@/components/ui/UrlPill";

export function ProjectsSection() {
  const mobtech = videos.filter((v) => v.group === "mobtech");
  const ipuy = videos.filter((v) => v.group === "ipuy");

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Projects</h2>
      </div>

      {/* MobTech */}
      <h3 className={styles.subTitle}>MobTech Solutions app</h3>
      <div className={styles.mobtechGrid}>
        {mobtech.map((v) => (
          <div key={v.id} className={styles.mobtechCardWrap}>
            <VideoCard item={v} />
          </div>
        ))}
      </div>

      <div className={styles.centerRow}>
        <RepoButton
          href="https://github.com/CalebeRRdev/MobTech_Solutions"
          username="@CalebeRRdev"
          labelMuted="Repo"
          title="MobTech repository"
        />
      </div>

      {/* IPUY */}
      <h3 className={styles.subTitle}>IPUY's Website</h3>
      <div className={styles.ipuyStack}>
        {ipuy.map((v) => (
          <div key={v.id} className={styles.ipuyCardWrap}>
            <VideoCard item={v} />
          </div>
        ))}
      </div>

      <div className={styles.centerCol}>
        <RepoButton
          href="https://github.com/CalebeRRdev/site-ipuy"
          username="@CalebeRRdev"
          labelMuted="Repo"
          title="IPUY repository"
        />

        <UrlPill href="https://ipuy.org.uy/" displayText="ipuy.org.uy" />
      </div>
    </section>
  );
}