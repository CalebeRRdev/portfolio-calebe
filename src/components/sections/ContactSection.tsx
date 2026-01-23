// File: src/components/sections/ContactSection.tsx

import styles from "./ContactSection.module.css";

function IconLinkedIn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.15 1.45-2.15 2.95v5.67H9.32V9h3.42v1.56h.05c.48-.9 1.65-1.86 3.39-1.86 3.62 0 4.29 2.38 4.29 5.47v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.56V9H3.56v11.45z" />
    </svg>
  );
}

function IconWhatsApp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.03 0C5.46 0 .15 5.32.15 11.88c0 2.1.55 4.15 1.59 5.96L0 24l6.34-1.66a11.8 11.8 0 0 0 5.69 1.45h.01c6.56 0 11.87-5.32 11.87-11.88 0-3.17-1.23-6.14-3.39-8.43Zm-8.49 18.3h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.22-3.76.98 1.01-3.67-.23-.38A9.84 9.84 0 0 1 2.2 11.88C2.2 6.45 6.61 2.05 12.03 2.05c2.63 0 5.1 1.02 6.96 2.88a9.76 9.76 0 0 1 2.89 6.95c0 5.43-4.41 9.9-9.85 9.9Zm5.4-7.4c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.48-1.74-1.65-2.03-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.28.3-1.05 1.03-1.05 2.52s1.08 2.93 1.23 3.13c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function IconGmail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5-8-5V6l8 5 8-5v2.2Z" />
    </svg>
  );
}

function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z" />
      <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      <path d="M17.5 6.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
    </svg>
  );
}

function IconGitHub(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.75 5.68.75 12.1c0 5.14 3.29 9.5 7.86 11.04.58.11.8-.26.8-.57v-2.1c-3.2.72-3.87-1.39-3.87-1.39-.52-1.37-1.27-1.73-1.27-1.73-1.04-.73.08-.72.08-.72 1.15.08 1.75 1.21 1.75 1.21 1.02 1.78 2.67 1.26 3.32.96.1-.76.4-1.26.73-1.55-2.55-.3-5.24-1.32-5.24-5.86 0-1.29.45-2.34 1.19-3.17-.12-.3-.52-1.53.11-3.18 0 0 .98-.32 3.2 1.21a10.8 10.8 0 0 1 2.91-.4c.99 0 1.99.14 2.91.4 2.22-1.53 3.2-1.21 3.2-1.21.63 1.65.23 2.88.11 3.18.74.83 1.19 1.88 1.19 3.17 0 4.55-2.7 5.56-5.27 5.85.41.37.78 1.1.78 2.22v3.29c0 .31.22.69.81.57 4.56-1.54 7.85-5.9 7.85-11.04C23.25 5.68 18.27.5 12 .5z" />
    </svg>
  );
}

type ContactBtnProps = {
    href: string;
    label: string;
    className: string;
    icon: React.ReactNode;
    ariaLabel?: string;
  };
  
  function ContactBtn({ href, label, className, icon, ariaLabel }: ContactBtnProps) {
    const isMail = href.startsWith("mailto:");
    return (
      <a
        className={`${styles.btnSocial} ${className}`}
        href={href}
        target={isMail ? undefined : "_blank"}
        rel={isMail ? undefined : "noreferrer"}
        aria-label={ariaLabel ?? label}
        title={label}
      >
        <span className={styles.socialIco} aria-hidden="true">
          {icon}
        </span>
        {label}
      </a>
    );
  }
  
  export function ContactSection() {
    return (
      <section id="contact" className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Contact</h2>
        </header>
  
        <div className={styles.grid}>
          <ContactBtn
            className={styles.btnLinkedin}
            href="https://www.linkedin.com/in/calebe-rodrigues-rolim/"
            label="LinkedIn"
            icon={<IconLinkedIn className={styles.socialSvg} />}
          />
  
          <ContactBtn
            className={styles.btnWhatsapp}
            href="https://wa.me/5562991429651"
            label="WhatsApp"
            icon={<IconWhatsApp className={styles.socialSvg} />}
          />
  
          <ContactBtn
            className={styles.btnGmail}
            href="mailto:caleberolim72@gmail.com"
            label="Gmail"
            icon={<IconGmail className={styles.socialSvg} />}
          />
  
          <ContactBtn
            className={styles.btnInstagram}
            href="https://instagram.com/caleb__rodrigues/"
            label="Instagram"
            icon={<IconInstagram className={styles.socialSvg} />}
          />
  
          <ContactBtn
            className={styles.btnGithub}
            href="https://github.com/CalebeRRdev"
            label="GitHub"
            icon={<IconGitHub className={styles.socialSvg} />}
          />
        </div>
      </section>
    );
  }