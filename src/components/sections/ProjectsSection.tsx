// File: src/components/sections/ProjectsSection.tsx

import styles from "./ProjectsSection.module.css";
import { videos } from "@/data/videos";
import { projects } from "@/data/projects";
import { VideoCard } from "@/components/cards/VideoCard";
import { RepoButton } from "@/components/ui/RepoButton";
import { UrlPill } from "@/components/ui/UrlPill";

export function ProjectsSection() {
  const mobtechProject = projects.find((p) => p.id === "mobtech");
  const ipuyProject = projects.find((p) => p.id === "ipuy");

  const mobtechVideos = videos.filter((v) => v.group === "mobtech");
  const ipuyVideos = videos.filter((v) => v.group === "ipuy");

  return (
    <section id="projects" className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Projects</h2>
      </header>

      {/* MobTech */}
      {mobtechProject && (
        <>
          <h3 className={styles.subTitle}>{mobtechProject.title}</h3>

          <div className={styles.mobtechGrid}>
            {mobtechVideos.map((v) => (
              <div key={v.id} className={styles.mobtechCardWrap}>
                <VideoCard item={v} />
              </div>
            ))}
          </div>

          <div className={styles.centerRow}>
            <RepoButton
              href={mobtechProject.repoUrl}
              titleTop={mobtechProject.title}
              titleMain={mobtechProject.repoLabel}
              username="@CalebeRRdev"
              title="Open MobTech repository on GitHub"
              ariaLabel="Open MobTech repository on GitHub"
            />
          </div>
        </>
      )}

      {/* IPUY */}
      {ipuyProject && (
        <>
          <h3 className={styles.subTitle}>{ipuyProject.title}</h3>

          <div className={styles.ipuyStack}>
            {ipuyVideos.map((v) => (
              <div key={v.id} className={styles.ipuyCardWrap}>
                <VideoCard item={v} />
              </div>
            ))}
          </div>

          <div className={styles.centerCol}>
            <RepoButton
              href={ipuyProject.repoUrl}
              titleTop={ipuyProject.title}
              titleMain={ipuyProject.repoLabel}
              username="@CalebeRRdev"
              title="Open IPUY repository on GitHub"
              ariaLabel="Open IPUY repository on GitHub"
            />

            {ipuyProject.liveUrl && (
              <UrlPill
                href={ipuyProject.liveUrl}
                displayText={ipuyProject.liveDisplayText ?? ipuyProject.liveUrl}
                tabTitle="Iglesia Presbiteriana del Uruguay"
                faviconSrc="/projects/favicon-light.png"
              />
            )}
          </div>
        </>
      )}
    </section>
  );
}