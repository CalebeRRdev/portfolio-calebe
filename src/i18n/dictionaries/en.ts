// File: src/i18n/dictionaries/en.ts

export type JobId = "letspic" | "freelance" | "university";
export type ProductId = "album" | "crm";
export type ProjectId = "voltaaflora" | "ipuy" | "mobtech";
export type VideoId =
  | "voltaaflora-mobile"
  | "ipuy-mobile"
  | "mobtech-ios"
  | "mobtech-android"
  | "ipuy-light"
  | "ipuy-dark";
export type SkillGroupId = "frontend" | "mobile" | "backend" | "data" | "cloud";
export type SoftSkillGroupId = "collaboration" | "mindset" | "growth";

export type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    experience: string;
    projects: string;
    skills: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
    toLight: string;
    toDark: string;
    language: string;
  };
  hero: {
    greeting: string;
    role: string;
    tagline: string;
    bio: string;
    nowLabel: string;
    now: string;
    open: string;
    ctaWork: string;
    ctaContact: string;
    portraitAlt: string;
    ringsCaption: string;
  };
  experience: {
    title: string;
    subtitle: string;
    current: string;
    builtLabel: string;
    stackLabel: string;
    demoNote: { title: string; body: string };
    diploma: { view: string; alt: string; caption: string };
    jobs: Record<
      JobId,
      {
        org: string;
        role: string;
        period: string;
        kind: string;
        summary: string;
        detail?: string;
      }
    >;
    products: Record<ProductId, { name: string; description: string }>;
    album: {
      autoLayout: string;
      reset: string;
      arranging: string;
      arranged: string;
      spread: string;
    };
    crm: { stages: [string, string, string, string]; deals: string[]; advance: string };
  };
  projects: {
    title: string;
    subtitle: string;
    production: string;
    development: string;
    paused: string;
    roleLabel: string;
    repo: string;
    visit: string;
    playVideo: string;
    closeVideo: string;
    close: string;
    items: Record<
      ProjectId,
      {
        title: string;
        tagline: string;
        description: string;
        role: string;
        year: string;
        /** Invitation shown next to the repository link */
        invite?: string;
      }
    >;
    videos: Record<VideoId, { title: string; description: string; tag: string }>;
  };
  skills: {
    title: string;
    subtitle: string;
    legend: string;
    groups: Record<SkillGroupId, string>;
    softTitle: string;
    soft: Record<SoftSkillGroupId, { label: string; description: string; items: string[] }>;
  };
  contact: {
    title: string;
    subtitle: string;
    copyEmail: string;
    copied: string;
    labels: { linkedin: string; whatsapp: string; email: string; instagram: string; github: string };
  };
  footer: { madeBy: string; top: string };
};

export const en: Dictionary = {
  meta: {
    title: "Calebe Dev",
    description:
      "Calebe Rodrigues Rolim, software engineer and full-stack developer at LetsPic. I build web and mobile products end to end.",
  },
  nav: {
    home: "Home",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    language: "Change language",
  },
  hero: {
    greeting: "Hi, I'm",
    role: "Full-stack developer at LetsPic",
    tagline:
      "I build web and mobile products end to end, from the database to the last pixel of the interface.",
    bio: "I like clean UI, practical UX, and solving hard problems. Off-screen you'll find me on a basketball court or a football pitch, watching anime, or planning the next trip. My dream is to visit every country in the world one day, and I'm on my way.",
    nowLabel: "Now",
    now: "Building photo and album tools at LetsPic",
    open: "Open to hearing proposals",
    ctaWork: "See my work",
    ctaContact: "Get in touch",
    portraitAlt: "Portrait of Calebe",
    ringsCaption: "Each ring is a year of experience, like the growth rings of a tree trunk",
  },
  experience: {
    title: "Experience",
    subtitle: "Where I've been building, most recent first.",
    current: "Current",
    builtLabel: "What I built",
    stackLabel: "Stack",
    demoNote: {
      title: "Why demos instead of screenshots?",
      body: "These apps are LetsPic products, so showing real screens would break the company's confidentiality. Instead, I rebuilt their core ideas as small interactive examples. Go ahead and click them.",
    },
    diploma: {
      view: "View diploma",
      alt: "Bachelor's diploma in Software Engineering from UniEVANGÉLICA",
      caption: "Verifiable at diploma.unievangelica.edu.br",
    },
    jobs: {
      letspic: {
        org: "LetsPic",
        role: "Junior full-stack developer",
        period: "Feb 2026 — present",
        kind: "Startup, photography and events",
        summary:
          "LetsPic serves photography and event companies, especially graduation photographers. Facial recognition, online backup, and image processing take the heavy lifting off their hands, so they deliver faster and surprise their clients.",
        detail:
          "I work across the whole stack: backend, database, and frontend, with deploys on Azure Static Web Apps and Google Cloud.",
      },
      freelance: {
        org: "Freelance",
        role: "Web developer",
        period: "Dec 2025 — Jan 2026",
        kind: "Independent",
        summary:
          "Right after graduating, I designed, built, sold, and deployed two websites from scratch in two months: one for a church in Uruguay and one for a compounding pharmacy in Brazil.",
      },
      university: {
        org: "Software Engineering",
        role: "Bachelor's degree",
        period: "Graduated Dec 2025",
        kind: "UniEVANGÉLICA",
        summary:
          "My capstone project (TCC) was MobTech, an urban mobility app built on geospatial data, with real-time tracking and map-based trip flows. The app itself is still unfinished.",
      },
    },
    products: {
      album: {
        name: "Album designer",
        description:
          "Lays out and edits photo albums: crop and everyday edits, a live preview of how each spread is coming along, and automatic album assembly with AI.",
      },
      crm: {
        name: "Internal CRM",
        description:
          "A sales pipeline for the team, modeled on Pipedrive, to follow every deal from first contact to close.",
      },
    },
    album: {
      autoLayout: "Arrange with AI",
      reset: "Mess it up",
      arranging: "Arranging…",
      arranged: "Spread arranged",
      spread: "Spread",
    },
    crm: {
      stages: ["Lead", "Contacted", "Proposal", "Won"],
      deals: ["Class of '26", "Studio Luz", "Med school"],
      advance: "Move a deal forward",
    },
  },
  projects: {
    title: "Projects",
    subtitle: "Things I designed, built, and shipped.",
    production: "Live",
    development: "In development",
    paused: "Paused",
    roleLabel: "My role",
    repo: "View repository",
    visit: "Visit site",
    playVideo: "Play video",
    closeVideo: "Close video",
    close: "Close",
    items: {
      voltaaflora: {
        title: "Volta à Flora",
        tagline: "Website for a compounding pharmacy",
        description:
          "A pharmacy in Anápolis with over 40 years of history needed a home online. I designed it, built it, sold it, and deployed it: the story and team, a request flow for custom formulas, and direct contact by WhatsApp, phone, and email.",
        role: "Freelance, from design to deploy",
        year: "2026",
      },
      ipuy: {
        title: "IPUY",
        tagline: "Institutional website with light and dark themes",
        description:
          "Website for Iglesia Presbiteriana del Uruguay, with responsive layouts, full theming, and clear content sections. Built for clarity and accessibility on every device.",
        role: "Freelance, frontend developer",
        year: "2025",
      },
      mobtech: {
        title: "MobTech",
        tagline: "Urban mobility app for iOS and Android",
        description:
          "My capstone project: a cross-platform app for real-time tracking and trip flows, powered by geospatial data. Built with React Native and Expo, with map-based interactions and a native feel on both platforms.",
        role: "Mobile developer, capstone project",
        year: "2024 — 2025",
        invite:
          "The project is paused for now. If you'd like to help bring it back, open an issue or send a pull request. I'd love to keep building it with others.",
      },
    },
    videos: {
      "ipuy-mobile": {
        title: "IPUY on a phone",
        description: "The whole site on an iPhone, in dark mode.",
        tag: "iPhone",
      },
      "voltaaflora-mobile": {
        title: "Volta à Flora on a phone",
        description: "The whole page, start to finish, on an iPhone.",
        tag: "iPhone",
      },
      "mobtech-ios": {
        title: "MobTech on iOS",
        description: "Main flow, navigation, and map-based tracking.",
        tag: "iOS",
      },
      "mobtech-android": {
        title: "MobTech on Android",
        description: "Interactions, trip status, and real-time tracking.",
        tag: "Android",
      },
      "ipuy-light": {
        title: "IPUY in light mode",
        description: "Layout, responsiveness, and UI details.",
        tag: "Light",
      },
      "ipuy-dark": {
        title: "IPUY in dark mode",
        description: "Theming consistency across every section.",
        tag: "Dark",
      },
    },
  },
  skills: {
    title: "Skills",
    subtitle: "The tools I reach for, and how I work with people.",
    legend: "Legend",
    groups: {
      frontend: "Frontend",
      mobile: "Mobile",
      backend: "Backend",
      data: "Data",
      cloud: "Cloud and tools",
    },
    softTitle: "How I work",
    soft: {
      collaboration: {
        label: "Collaboration",
        description: "Working with others",
        items: ["Communication", "Teamwork", "Empathy", "Knowledge sharing", "Multicultural awareness"],
      },
      mindset: {
        label: "Mindset",
        description: "How I show up",
        items: ["UX/UI first", "Accountability", "Resilience", "Proactiveness", "Attention to detail"],
      },
      growth: {
        label: "Growth",
        description: "How I keep improving",
        items: ["Problem-solving", "Fast learner", "Adaptability", "Critical thinking", "Creativity"],
      },
    },
  },
  contact: {
    title: "Let's build something good together.",
    subtitle:
      "I'm currently working at LetsPic, but I'm still open to hearing proposals and freelance projects, or simply talking about ideas.",
    copyEmail: "Copy email",
    copied: "Copied",
    labels: {
      linkedin: "LinkedIn",
      whatsapp: "WhatsApp",
      email: "Email",
      instagram: "Instagram",
      github: "GitHub",
    },
  },
  footer: {
    madeBy: "Developed by",
    top: "Back to top",
  },
};
