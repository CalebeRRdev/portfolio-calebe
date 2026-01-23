// File: src/components/sections/HeroSection.tsx

import styles from "./HeroSection.module.css";
import Image from "next/image";

export function HeroSection() {
  return (
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
          My name is Calebe and I’m a software engineer and front-end developer focused on
          building mobile and web products.
          <br />
          I love clean UI, practical UX, and fixing problems.
        </p>

        <p className={styles.subtitle}>
          In my free time I enjoy playing and watching basketball, watching anime and movies,
          and what I like doing the most is travelling.
          <br />
          My dream is to visit every country in the world someday.
        </p>

        <p className={styles.subtitleMuted}>
          Here on this website you’ll find my projects, skills, and the best ways to reach me.
          <br />
          Hope you like it!
        </p>
      </div>
    </section>
  );
}