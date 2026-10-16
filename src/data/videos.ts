// File: src/data/videos.ts
import type { VideoId } from "@/i18n/dictionaries/en";

export type VideoAspect = "9/16" | "9/19.5" | "16/9" | "16/10";

export type VideoItem = {
  id: VideoId;
  src: string;
  aspect: VideoAspect;
  poster?: string; // usado no iOS pra preview confiável
};

export const videos: Record<VideoId, VideoItem> = {
  "voltaaflora-mobile": {
    id: "voltaaflora-mobile",
    src: "/projects/voltaaflora-mobile.mp4",
    poster: "/projects/voltaaflora-mobile.jpg",
    aspect: "9/19.5",
  },
  "mobtech-ios": {
    id: "mobtech-ios",
    src: "/projects/mobtech-ios.mp4",
    poster: "/projects/preview-mobtech-ios.jpg",
    aspect: "9/16",
  },
  "mobtech-android": {
    id: "mobtech-android",
    src: "/projects/mobtech-android.mp4",
    poster: "/projects/preview-mobtech-android.jpg",
    aspect: "9/16",
  },
  "ipuy-light": {
    id: "ipuy-light",
    src: "/projects/ipuy-light.mp4",
    poster: "/projects/ipuy-light.jpg",
    aspect: "16/10",
  },
  "ipuy-dark": {
    id: "ipuy-dark",
    src: "/projects/ipuy-dark.mp4",
    poster: "/projects/ipuy-dark.jpg",
    aspect: "16/10",
  },
};
