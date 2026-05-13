// File: src/components/sections/ProjectsSection.tsx
"use client";

import styles from "./ProjectsSection.module.css";
import { videos } from "@/data/videos";
import { projects, type ProjectMeta } from "@/data/projects";
import { VideoCard } from "@/components/cards/VideoCard";
import { RepoButton } from "@/components/ui/RepoButton";
import { UrlPill } from "@/components/ui/UrlPill";
import { useInView } from "@/hooks/useInView";

function StatusChip({ status }: { status: ProjectMeta["status"] }) {
  return (
    <span className={`${styles.statusChip} ${styles[`status_${status}`]}`}>
      <span className={styles.statusDot} aria-hidden="true" />
      <span>{status === "production" ? "Production" : "In development"}</span>
    </span>
  );
}

function ProjectHeader({ project }: { project: ProjectMeta }) {
  return (
    <header className={styles.projectHeader}>
      <div className={styles.projectMetaTop}>
        <span className={styles.projectYear}>{project.year}</span>
        <span className={styles.projectDot} aria-hidden="true">
          ·
        </span>
        <StatusChip status={project.status} />
      </div>

      <h3 className={styles.projectTitle}>{project.title}</h3>
      <p className={styles.projectTagline}>{project.tagline}</p>
      <p className={styles.projectDescription}>{project.description}</p>

      <ul className={styles.stack}>
        {project.stack.map((tech) => (
          <li key={tech} className={styles.stackChip}>
            {tech}
          </li>
        ))}
      </ul>

      <p className={styles.projectRole}>
        <span className={styles.projectRoleLabel}>Role</span>
        <span className={styles.projectRoleValue}>{project.role}</span>
      </p>
    </header>
  );
}

export function ProjectsSection() {
  const { ref: refHeader, inView: headerIn } = useInView<HTMLDivElement>({
    threshold: 0.2,
  });
  const { ref: refMob, inView: mobIn } = useInView<HTMLElement>({
    threshold: 0.05,
  });
  const { ref: refIpuy, inView: ipuyIn } = useInView<HTMLElement>({
    threshold: 0.05,
  });

  const mobtechProject = projects.find((p) => p.id === "mobtech");
  const ipuyProject = projects.find((p) => p.id === "ipuy");

  const mobtechVideos = videos.filter((v) => v.group === "mobtech");
  const ipuyVideos = videos.filter((v) => v.group === "ipuy");

  return (
    <section id="projects" className={styles.section}>
      <header
        ref={refHeader}
        className={`${styles.header} ${headerIn ? styles.isVisible : ""}`}
      >
        <span className={styles.eyebrow}>02 — Featured work</span>
        <h2 className={styles.title}>Selected projects</h2>
        <p className={styles.subtitle}>
          A look at what I&apos;ve been building lately.
        </p>
      </header>

      {/* MobTech */}
      {mobtechProject && (
        <article
          ref={refMob}
          className={`${styles.project} ${mobIn ? styles.isVisible : ""}`}
        >
          <ProjectHeader project={mobtechProject} />

          <div className={styles.mobtechGrid}>
            {mobtechVideos.map((v) => (
              <div key={v.id} className={styles.mobtechCardWrap}>
                <VideoCard item={v} />
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <RepoButton
              href={mobtechProject.repoUrl}
              titleTop={mobtechProject.title}
              titleMain={mobtechProject.repoLabel}
              username="@CalebeRRdev"
              ariaLabel="Open MobTech repository on GitHub"
            />
          </div>
        </article>
      )}

      {/* IPUY */}
      {ipuyProject && (
        <article
          ref={refIpuy}
          className={`${styles.project} ${ipuyIn ? styles.isVisible : ""}`}
        >
          <ProjectHeader project={ipuyProject} />

          <div className={styles.ipuyStack}>
            {ipuyVideos.map((v) => (
              <div key={v.id} className={styles.ipuyCardWrap}>
                <VideoCard item={v} />
              </div>
            ))}
          </div>

          <div className={styles.actionsCol}>
            <RepoButton
              href={ipuyProject.repoUrl}
              titleTop={ipuyProject.title}
              titleMain={ipuyProject.repoLabel}
              username="@CalebeRRdev"
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
        </article>
      )}
    </section>
  );
}