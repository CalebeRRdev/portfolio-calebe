// File: src/app/[locale]/page.tsx
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { RouteLine } from "@/components/RouteLine";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import styles from "./page.module.css";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <main className={styles.main}>
        <RouteLine />
        <HeroSection dict={dict.hero} />
        <ExperienceSection dict={dict.experience} />
        <ProjectsSection dict={dict.projects} />
        <SkillsSection dict={dict.skills} />
        <ContactSection dict={dict.contact} />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
