// File: src/data/videos.ts

export type VideoGroup = "mobtech" | "ipuy";
export type VideoAspect = "9/16" | "16/9";

export type VideoItem = {
  id: string;
  group: VideoGroup;
  title: string;
  description: string;
  src: string;
  aspect: VideoAspect;
};

export const videos: VideoItem[] = [
  {
    id: "mobtech-ios",
    group: "mobtech",
    title: "MobTech — iOS Demo",
    description:
      "iOS screen recording showcasing the main flow, navigation, and map-based tracking experience.",
    src: "/projects/mobtech-ios.mp4",
    aspect: "9/16",
  },
  {
    id: "mobtech-android",
    group: "mobtech",
    title: "MobTech — Android Demo",
    description:
      "Android screen recording highlighting interactions, trip status, and real-time tracking UX.",
    src: "/projects/mobtech-android.mp4",
    aspect: "9/16",
  },
  {
    id: "ipuy-light",
    group: "ipuy",
    title: "IPUY Website — Light Theme",
    description:
      "Walkthrough of the website in light mode, focusing on layout, responsiveness, and UI details.",
    src: "/projects/ipuy-light.mp4",
    aspect: "16/9",
  },
  {
    id: "ipuy-dark",
    group: "ipuy",
    title: "IPUY Website — Dark Theme",
    description:
      "Walkthrough of the website in dark mode, showcasing theming consistency and sections.",
    src: "/projects/ipuy-dark.mp4",
    aspect: "16/9",
  },
];