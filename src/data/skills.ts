// File: src/data/skills.ts
import type { IconType } from "react-icons";
import {
  SiCss3,
  SiDotnet,
  SiExpo,
  SiExpress,
  SiGit,
  SiGithub,
  SiGooglecloud,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSvelte,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { TbBrandAzure } from "react-icons/tb";
import { CSharpIcon } from "@/components/icons/CSharpIcon";
import type { SkillGroupId, SoftSkillGroupId } from "@/i18n/dictionaries/en";

export type Skill = {
  name: string;
  /** react-icons glyph, or a PNG used as a tinted mask */
  icon: IconType | { mask: string };
};

export const skillGroups: { id: SkillGroupId; skills: Skill[] }[] = [
  {
    id: "frontend",
    skills: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Svelte", icon: SiSvelte },
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss3 },
    ],
  },
  {
    id: "mobile",
    skills: [
      { name: "React Native", icon: SiReact },
      { name: "Expo", icon: SiExpo },
    ],
  },
  {
    id: "backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express", icon: SiExpress },
      { name: "Python", icon: SiPython },
      { name: "C#", icon: CSharpIcon },
      { name: ".NET", icon: SiDotnet },
    ],
  },
  {
    id: "data",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "PostGIS", icon: { mask: "/skills/postgis.png" } },
    ],
  },
  {
    id: "cloud",
    skills: [
      { name: "Azure", icon: TbBrandAzure },
      { name: "Google Cloud", icon: SiGooglecloud },
      { name: "Vercel", icon: SiVercel },
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
    ],
  },
];

export const softSkillGroupIds: SoftSkillGroupId[] = ["collaboration", "mindset", "growth"];
