// File: src/data/contact.ts

export type ContactId = "linkedin" | "whatsapp" | "email" | "instagram" | "github";

export type ContactItem = {
  id: ContactId;
  handle: string;
  href: string;
};

export const EMAIL = "caleberolim72@gmail.com";

export const contacts: ContactItem[] = [
  {
    id: "email",
    handle: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    id: "linkedin",
    handle: "/in/calebe-rodrigues-rolim",
    href: "https://www.linkedin.com/in/calebe-rodrigues-rolim/",
  },
  {
    id: "whatsapp",
    handle: "+55 62 99142-9651",
    href: "https://wa.me/5562991429651",
  },
  {
    id: "github",
    handle: "@CalebeRRdev",
    href: "https://github.com/CalebeRRdev",
  },
  {
    id: "instagram",
    handle: "@caleb__rodrigues",
    href: "https://instagram.com/caleb__rodrigues/",
  },
];
