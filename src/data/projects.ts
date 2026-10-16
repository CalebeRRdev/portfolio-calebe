// File: src/data/projects.ts
// Language-independent project data. Copy lives in src/i18n/dictionaries.
import type { ProjectId, VideoId } from "@/i18n/dictionaries/en";

export type ProjectStatus = "production" | "development";

export type ProjectMedia =
  | { kind: "videos"; videos: VideoId[]; layout: "phones" | "screens" }
  | {
      kind: "page";
      /** Tall full-page screenshot, scrolled inside a browser frame */
      src: string;
      width: number;
      height: number;
      /** Optional phone recording layered over the browser */
      phoneVideo?: VideoId;
    };

export type ProjectMeta = {
  id: ProjectId;
  status: ProjectStatus;
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;
  liveDisplayText?: string;
  tabTitle?: string;
  faviconSrc?: string;
  media: ProjectMedia;
};

export const projects: ProjectMeta[] = [
  {
    id: "voltaaflora",
    status: "production",
    stack: ["Next.js", "React", "Vercel"],
    liveUrl: "https://www.voltaaflora.com/",
    liveDisplayText: "voltaaflora.com",
    tabTitle: "Volta à Flora",
    media: {
      kind: "page",
      src: "/projects/voltaaflora-page.jpg",
      width: 1200,
      height: 3030,
      phoneVideo: "voltaaflora-mobile",
    },
  },
  {
    id: "ipuy",
    status: "production",
    stack: ["Next.js", "React", "TypeScript", "CSS Modules"],
    repoUrl: "https://github.com/CalebeRRdev/site-ipuy",
    liveUrl: "https://ipuy.org.uy/",
    liveDisplayText: "ipuy.org.uy",
    tabTitle: "Iglesia Presbiteriana del Uruguay",
    faviconSrc: "/projects/favicon-light.png",
    media: { kind: "videos", videos: ["ipuy-light", "ipuy-dark"], layout: "screens" },
  },
  {
    id: "mobtech",
    status: "development",
    stack: ["React Native", "Expo", "TypeScript", "PostGIS"],
    repoUrl: "https://github.com/CalebeRRdev/MobTech_Solutions",
    media: {
      kind: "videos",
      videos: ["mobtech-ios", "mobtech-android"],
      layout: "phones",
    },
  },
];
