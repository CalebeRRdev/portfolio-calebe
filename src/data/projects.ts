// File: src/data/projects.ts

export type ProjectId = "mobtech" | "ipuy";

export type ProjectMeta = {
  id: ProjectId;
  title: string;

  repoUrl: string;
  repoLabel: string; // texto do botão (ex: "View repository")

  liveUrl?: string;
  liveDisplayText?: string;
};

export const projects: ProjectMeta[] = [
  {
    id: "mobtech",
    title: "MobTech Solutions",
    repoUrl: "https://github.com/CalebeRRdev/MobTech_Solutions",
    repoLabel: "View repository",
  },
  {
    id: "ipuy",
    title: "IPUY Website",
    repoUrl: "https://github.com/CalebeRRdev/site-ipuy",
    repoLabel: "View repository",
    liveUrl: "https://ipuy.org.uy/",
    liveDisplayText: "ipuy.org.uy",
  },
];