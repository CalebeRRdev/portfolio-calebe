// File: src/data/skills.ts

export type SkillLogo = {
  name: string;
  src: string;
};

export const hardSkillsLogos: SkillLogo[] = [
  { name: "React Native", src: "/skills/reactnative.png" },
  { name: "React", src: "/skills/react.png" },
  { name: "Expo", src: "/skills/expo.png" },
  { name: "Next.js", src: "/skills/nextjs.png" },
  { name: "HTML5", src: "/skills/html5.png" },
  { name: "CSS3", src: "/skills/css3.png" },
  { name: "JavaScript", src: "/skills/javascript.png" },
  { name: "TypeScript", src: "/skills/typescript.png" },
  { name: "Node.js", src: "/skills/nodejs.png" },
  { name: "Express.js", src: "/skills/expressjs.png" },
  { name: "Vercel", src: "/skills/vercel.png" },
  { name: "PostgreSQL", src: "/skills/postgresql.png" },
  { name: "PostGIS", src: "/skills/postgis.png" },
  { name: "Git", src: "/skills/git.png" },
  { name: "GitHub", src: "/skills/github.png" },
];

export type SoftSkillGroupId = "collaboration" | "mindset" | "growth";

export type SoftSkillGroup = {
  id: SoftSkillGroupId;
  label: string;
  description: string;
  items: string[];
};

export const softSkillGroups: SoftSkillGroup[] = [
  {
    id: "collaboration",
    label: "Collaboration",
    description: "How I work with others",
    items: [
      "Communication",
      "Teamwork",
      "Empathy",
      "Knowledge sharing",
      "Multicultural awareness",
    ],
  },
  {
    id: "mindset",
    label: "Mindset",
    description: "How I show up",
    items: [
      "Ownership",
      "Accountability",
      "Resilience",
      "Proactiveness",
      "Effort",
      "Attention to detail",
    ],
  },
  {
    id: "growth",
    label: "Growth",
    description: "How I keep improving",
    items: [
      "Problem-solving",
      "Fast learner",
      "Adaptability",
      "Critical thinking",
      "Creativity",
      "Versatility",
      "Organization",
    ],
  },
];