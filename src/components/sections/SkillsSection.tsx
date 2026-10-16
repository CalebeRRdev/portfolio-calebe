// File: src/components/sections/SkillsSection.tsx
"use client";

import { useRef } from "react";
import type { Dictionary } from "@/i18n/getDictionary";
import { skillGroups, softSkillGroupIds, type Skill } from "@/data/skills";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./SkillsSection.module.css";

function SkillIcon({ icon }: { icon: Skill["icon"] }) {
  if ("mask" in icon) {
    return (
      <span
        className={styles.maskIcon}
        style={{ ["--icon" as string]: `url("${icon.mask}")` } as React.CSSProperties}
      />
    );
  }
  const Icon = icon;
  return <Icon className={styles.icon} />;
}

export function SkillsSection({ dict }: { dict: Dictionary["skills"] }) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Symbols are stamped onto the legend, one group at a time
      gsap.utils.toArray<HTMLElement>(`.${styles.row}`).forEach((row) => {
        gsap.from(row.querySelectorAll(`.${styles.symbol}`), {
          scale: 1.6,
          opacity: 0,
          rotate: () => gsap.utils.random(-25, 25),
          duration: 0.55,
          ease: "back.out(2.2)",
          stagger: 0.05,
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });
      });
      gsap.from(`.${styles.softCol}`, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.soft}`, start: "top 80%", once: true },
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="skills" ref={rootRef} className={styles.section}>
      <SectionHeading waypoint="skills" title={dict.title} subtitle={dict.subtitle} />

      <div className={styles.legend}>
        <span className={styles.legendTab}>{dict.legend}</span>
        {skillGroups.map((group) => (
          <div key={group.id} className={styles.row}>
            <h3 className={styles.groupName}>{dict.groups[group.id]}</h3>
            <ul className={styles.symbols}>
              {group.skills.map((skill) => (
                <li key={skill.name} className={styles.symbol}>
                  <span className={styles.glyph} aria-hidden="true">
                    <SkillIcon icon={skill.icon} />
                  </span>
                  <span className={styles.skillName}>{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.soft}>
        <h3 className={styles.softTitle}>{dict.softTitle}</h3>
        <div className={styles.softGrid}>
          {softSkillGroupIds.map((id) => {
            const g = dict.soft[id];
            return (
              <div key={id} className={styles.softCol}>
                <h4 className={styles.softLabel}>{g.label}</h4>
                <p className={styles.softDesc}>{g.description}</p>
                <ul className={styles.softList}>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
