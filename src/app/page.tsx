// File: src/app/page.tsx

import styles from "./page.module.css";
import { Navbar } from "@/components/Navbar";
import ReloadToTop from "@/components/ReloadToTop";

import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <ReloadToTop />

      <main className={styles.main}>
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Calebe Rodrigues Rolim
      </footer>
    </div>
  );
}