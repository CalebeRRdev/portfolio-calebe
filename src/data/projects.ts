// File: portfolio-site/src/data/projects.ts

export type AspectRatio = "9/16" | "16/9" | "4/3" | "1/1";

export type ProjectMedia = {
  label: string;
  src: string;
  kind: "video" | "image";
  aspectRatio?: AspectRatio; // ✅ controls card sizing per media
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  media: ProjectMedia[];
  links: {
    repo?: string;
    live?: string;
    caseStudy?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "mobtech-solutions",
    title: "MobTech Solutions",
    description:
      "Cross-platform mobile app for real-time bus tracking, trip status, and dynamic ETA with map-based UX.",
    tags: [
      "React Native",
      "Expo",
      "JavaScript",
      "Express.js",
      "PostgreSQL",
      "PostGIS",
      "Google Maps",
    ],
    media: [
      {
        label: "iOS",
        src: "/projects/mobtech-ios.mp4",
        kind: "video",
        aspectRatio: "9/16",
      },
      {
        label: "Android",
        src: "/projects/mobtech-android.mp4",
        kind: "video",
        aspectRatio: "9/16",
      },
    ],
    links: {
      repo: "https://github.com/CalebeRRdev/MobTech_Solutions",
    },
  },
  {
    slug: "ipuy-website",
    title: "IPUY Website",
    description:
      "Responsive website built with Next.js, TypeScript, and vanilla CSS, focused on clean UI and performance.",
    tags: ["Next.js", "TypeScript", "JavaScript", "CSS"],
    media: [
      {
        label: "Light",
        src: "/projects/ipuy-light.mp4",
        kind: "video",
        aspectRatio: "16/9",
      },
      {
        label: "Dark",
        src: "/projects/ipuy-dark.mp4",
        kind: "video",
        aspectRatio: "16/9",
      },
    ],
    links: {
      repo: "https://github.com/CalebeRRdev/site-ipuy",
      live: "https://ipuy.org.uy/",
    },
  },
];