// File: src/app/page.tsx

import styles from "./page.module.css";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/projects/ProjectsSection";

const hardSkills = [
  "React Native (Expo)",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "Node.js / Express",
  "PostgreSQL",
  "PostGIS",
  "Git / GitHub",
];

const softSkills = [
  "Communication",
  "Teamwork",
  "Ownership",
  "Problem-solving",
  "Fast learner",
  "Attention to detail",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        {/* INICIO / HERO */}
        <section id="inicio" className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.avatarWrap}>
              <Image
                src="/projects/foto-portfolio.jpg"
                alt="Calebe portrait"
                width={320}
                height={320}
                className={styles.avatar}
                priority
              />
            </div>
          </div>

          <div className={styles.heroRight}>
            <h1 className={styles.title}>Hello :)</h1>
            <p className={styles.subtitle}>
              My name is Caleb and I’m a software engineer and front-end 
              developer focused on building mobile and web products. 
              <br></br>I love clean UI, practical UX, and fixing problems. In my free time I enjoy 
              playing and watching basketball, watching anime, movies, and what I like do most is: 
              travelling. <br></br>My dream is to have visited every country in the world someday.
            </p>

            <p className={styles.subtitleMuted}>
              Here in this website you’ll find my projects, skills, and the best ways to reach me. <br></br>Hope you like it!
            </p>
          </div>
        </section>

        {/* PROJECTS */}
        <ProjectsSection />

        {/* SKILLS */}
        <section id="skills" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Skills</h2>
          </div>

          <div className={styles.skillsGrid}>
            <div className={styles.skillBlock}>
              <h3 className={styles.skillTitle}>Hard skills</h3>
              <div className={styles.chips}>
                {hardSkills.map((s) => (
                  <span key={s} className={styles.chip}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.skillBlock}>
              <h3 className={styles.skillTitle}>Soft skills</h3>
              <div className={styles.chips}>
                {softSkills.map((s) => (
                  <span key={s} className={styles.chip}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Contact</h2>
          </div>

          <div className={styles.contactGrid}>
            <a
              className={styles.contactCard}
              href="https://linkedin.com/in/SEU_LINK"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
              <span className={styles.contactMeta}>Professional profile</span>
            </a>

            <a
              className={styles.contactCard}
              href="https://wa.me/55SEUNUMERO"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
              <span className={styles.contactMeta}>Fastest reply</span>
            </a>

            <a className={styles.contactCard} href="mailto:caleberolim72@gmail.com">
              Gmail
              <span className={styles.contactMeta}>Email me</span>
            </a>

            <a
              className={styles.contactCard}
              href="https://instagram.com/SEU_USER"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
              <span className={styles.contactMeta}>More about me</span>
            </a>

            <a
              className={styles.contactCard}
              href="https://github.com/CalebeRRdev"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <span className={styles.contactMeta}>Code & repositories</span>
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Calebe Rodrigues Rolim
      </footer>
    </div>
  );
}