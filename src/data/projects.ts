// File: src/data/projects.ts

export type ProjectId = "mobtech" | "ipuy";
export type ProjectStatus = "production" | "development";

export type ProjectMeta = {
  id: ProjectId;
  title: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  status: ProjectStatus;
  stack: string[];

  repoUrl: string;
  repoLabel: string;

  liveUrl?: string;
  liveDisplayText?: string;
};

export const projects: ProjectMeta[] = [
  {
    id: "mobtech",
    title: "MobTech Solutions",
    tagline: "Mobile ride-tracking platform · iOS & Android",
    description:
      "Cross-platform mobile app focused on real-time tracking and trip flows. Built with React Native and Expo, with map-based interactions, status states, and a native feel on both platforms.",
    role: "Mobile Developer",
    year: "2024 — present",
    status: "development",
    stack: ["React Native", "Expo", "TypeScript", "Maps API"],
    repoUrl: "https://github.com/CalebeRRdev/MobTech_Solutions",
    repoLabel: "View repository",
  },
  {
    id: "ipuy",
    title: "IPUY Website",
    tagline: "Institutional website · light & dark theming",
    description:
      "Modern website for Iglesia Presbiteriana del Uruguay, with responsive layouts, full theming support, and clean content sections. Designed for clarity and accessibility on every device.",
    role: "Frontend Developer",
    year: "2024",
    status: "production",
    stack: ["Next.js", "React", "TypeScript", "CSS Modules"],
    repoUrl: "https://github.com/CalebeRRdev/site-ipuy",
    repoLabel: "View repository",
    liveUrl: "https://ipuy.org.uy/",
    liveDisplayText: "ipuy.org.uy",
  },
];