// File: src/data/contact.ts

export type ContactId =
  | "linkedin"
  | "whatsapp"
  | "gmail"
  | "instagram"
  | "github";

export type ContactItem = {
  id: ContactId;
  label: string;
  handle: string;
  href: string;
};

export const contacts: ContactItem[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "/in/calebe-rodrigues-rolim",
    href: "https://www.linkedin.com/in/calebe-rodrigues-rolim/",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "+55 62 99142-9651",
    href: "https://wa.me/5562991429651",
  },
  {
    id: "gmail",
    label: "Email",
    handle: "caleberolim72@gmail.com",
    href: "mailto:caleberolim72@gmail.com",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@caleb__rodrigues",
    href: "https://instagram.com/caleb__rodrigues/",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "@CalebeRRdev",
    href: "https://github.com/CalebeRRdev",
  },
];