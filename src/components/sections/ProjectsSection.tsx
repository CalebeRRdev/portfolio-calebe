// File: src/components/sections/ProjectsSection.tsx
"use client";

import { useRef } from "react";
import type { Dictionary } from "@/i18n/getDictionary";
import { projects, type ProjectMeta } from "@/data/projects";
import { videos } from "@/data/videos";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoCard } from "@/components/cards/VideoCard";
import { BrowserFrame } from "@/components/cards/BrowserFrame";
import styles from "./ProjectsSection.module.css";

type Dict = Dictionary["projects"];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.arrow}>
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}

function Media({ project, dict }: { project: ProjectMeta; dict: Dict }) {
  const { media } = project;
  const copy = dict.items[project.id];

  if (media.kind === "page") {
    const phone = media.phoneVideo;
    return (
      <div className={phone ? styles.composite : undefined}>
        <BrowserFrame
          src={media.src}
          width={media.width}
          height={media.height}
          url={project.liveDisplayText ?? ""}
          href={project.liveUrl ?? "#"}
          alt={`${copy.title}: ${copy.tagline}`}
        />
        {phone && (
          <div className={styles.compositePhone} data-parallax>
            <VideoCard
              item={videos[phone]}
              title={dict.videos[phone].title}
              description={dict.videos[phone].description}
              tag={dict.videos[phone].tag}
              playLabel={dict.playVideo}
              closeLabel={dict.closeVideo}
              variant="phone"
              hideCaption
            />
          </div>
        )}
      </div>
    );
  }

  const phone = media.phoneVideo;
  return (
    <div className={media.layout === "phones" ? styles.phones : styles.screens}>
      {media.videos.map((id) => (
        <div key={id} className={styles.mediaItem} data-parallax>
          <VideoCard
            item={videos[id]}
            title={dict.videos[id].title}
            description={dict.videos[id].description}
            tag={dict.videos[id].tag}
            playLabel={dict.playVideo}
            closeLabel={dict.closeVideo}
            variant={media.layout === "phones" ? "phone" : "screen"}
            hideCaption={media.layout === "screens"}
          />
        </div>
      ))}
      {phone && (
        <div className={styles.screensPhone}>
          <VideoCard
            item={videos[phone]}
            title={dict.videos[phone].title}
            description={dict.videos[phone].description}
            tag={dict.videos[phone].tag}
            playLabel={dict.playVideo}
            closeLabel={dict.closeVideo}
            variant="phone"
            hideCaption
          />
        </div>
      )}
    </div>
  );
}

export function ProjectsSection({ dict }: { dict: Dict }) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>(`.${styles.project}`).forEach((project) => {
        // Media is unveiled like a print sliding out of a sleeve
        gsap.fromTo(
          project.querySelector(`.${styles.media}`),
          { clipPath: "inset(18% 8% 18% 8% round 24px)", scale: 0.94 },
          {
            // Slightly past the edges: phone rims that overhang the media stay whole
            clipPath: "inset(-6% -5% -12% -5% round 0px)",
            scale: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: project, start: "top 85%", end: "top 35%", scrub: 0.6 },
          }
        );

        gsap.from(project.querySelectorAll("[data-reveal]"), {
          opacity: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: project, start: "top 75%", once: true },
        });

        // Second media item drifts at a different speed: depth between the two
        const items = project.querySelectorAll<HTMLElement>("[data-parallax]");
        const drifting =
          project.querySelector<HTMLElement>(`.${styles.compositePhone}, .${styles.screensPhone}`) ??
          (items.length > 1 ? items[1] : null);
        if (drifting) {
          gsap.fromTo(
            drifting,
            { y: 40 },
            {
              y: -40,
              ease: "none",
              scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="projects" ref={rootRef} className={styles.section}>
      <SectionHeading waypoint="projects" title={dict.title} subtitle={dict.subtitle} />

      <div className={styles.list}>
        {projects.map((project, i) => {
          const copy = dict.items[project.id];
          const statusLabel = { production: dict.production, development: dict.development, paused: dict.paused }[
            project.status
          ];
          return (
            <article
              key={project.id}
              className={`${styles.project} ${i % 2 === 1 ? styles.flip : ""}`}
            >
              <div className={styles.media}>
                <Media project={project} dict={dict} />
              </div>

              <div className={styles.info}>
                <div className={styles.meta} data-reveal>
                  <span className={styles.year}>{copy.year}</span>
                  <span className={`${styles.status} ${styles[`status_${project.status}`]}`}>
                    {project.status === "paused" ? (
                      <svg viewBox="0 0 12 12" className={styles.pauseIcon} aria-hidden="true">
                        <rect x="2.5" y="2" width="2.4" height="8" rx="0.8" />
                        <rect x="7.1" y="2" width="2.4" height="8" rx="0.8" />
                      </svg>
                    ) : (
                      <span className={styles.statusDot} aria-hidden="true" />
                    )}
                    {statusLabel}
                  </span>
                </div>

                <h3 className={styles.title} data-reveal>
                  {copy.title}
                </h3>
                <p className={styles.tagline} data-reveal>
                  {copy.tagline}
                </p>
                <p className={styles.description} data-reveal>
                  {copy.description}
                </p>

                <dl className={styles.role} data-reveal>
                  <dt>{dict.roleLabel}</dt>
                  <dd>{copy.role}</dd>
                </dl>

                <ul className={styles.stack} data-reveal>
                  {project.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                <div className={styles.actions} data-reveal>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className={styles.primary}>
                      {dict.visit}
                      <span className={styles.domain}>{project.liveDisplayText}</span>
                      <ArrowUpRight />
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className={styles.secondary}>
                      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.gh}>
                        <path d="M12 .5C5.73.5.75 5.68.75 12.1c0 5.14 3.29 9.5 7.86 11.04.58.11.8-.26.8-.57v-2.1c-3.2.72-3.87-1.39-3.87-1.39-.52-1.37-1.27-1.73-1.27-1.73-1.04-.73.08-.72.08-.72 1.15.08 1.75 1.21 1.75 1.21 1.02 1.78 2.67 1.26 3.32.96.1-.76.4-1.26.73-1.55-2.55-.3-5.24-1.32-5.24-5.86 0-1.29.45-2.34 1.19-3.17-.12-.3-.52-1.53.11-3.18 0 0 .98-.32 3.2 1.21a10.8 10.8 0 0 1 2.91-.4c.99 0 1.99.14 2.91.4 2.22-1.53 3.2-1.21 3.2-1.21.63 1.65.23 2.88.11 3.18.74.83 1.19 1.88 1.19 3.17 0 4.55-2.7 5.56-5.27 5.85.41.37.78 1.1.78 2.22v3.29c0 .31.22.69.81.57 4.56-1.54 7.85-5.9 7.85-11.04C23.25 5.68 18.27.5 12 .5z" />
                      </svg>
                      {dict.repo}
                      <ArrowUpRight />
                    </a>
                  )}
                </div>

                {copy.invite && (
                  <aside className={styles.invite} data-reveal>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.inviteIcon}>
                      <circle cx="6" cy="6" r="2.5" />
                      <circle cx="6" cy="18" r="2.5" />
                      <circle cx="18" cy="18" r="2.5" />
                      <path d="M6 8.5v7M18 15.5V10a3 3 0 0 0-3-3h-4M13 4.5 10.5 7l2.5 2.5" />
                    </svg>
                    <p>{copy.invite}</p>
                  </aside>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
