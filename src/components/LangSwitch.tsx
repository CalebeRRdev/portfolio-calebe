// File: src/components/LangSwitch.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { markLanguageSwitch, saveLocale } from "@/lib/scroll";
import styles from "./LangSwitch.module.css";

const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** One split-flap tile: on change it riffles through a few letters before landing. */
function FlapChar({ char }: { char: string }) {
  const [shown, setShown] = useState(char);
  const shownRef = useRef(char);

  useEffect(() => {
    if (char === shownRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = FLAP_CHARS.indexOf(shownRef.current);
    const to = FLAP_CHARS.indexOf(char);
    // Walk forward through the alphabet, like a real flap board, but cap the steps
    const distance = (to - from + FLAP_CHARS.length) % FLAP_CHARS.length;
    const steps = reduced ? 1 : Math.min(distance, 6);
    const stride = distance / steps;

    let i = 0;
    const id = window.setInterval(() => {
      i++;
      const next =
        i >= steps ? char : FLAP_CHARS[Math.round(from + stride * i) % FLAP_CHARS.length];
      shownRef.current = next;
      setShown(next);
      if (i >= steps) window.clearInterval(id);
    }, 70);
    return () => window.clearInterval(id);
  }, [char]);

  return (
    <span className={styles.tile}>
      <span key={shown} className={styles.flap}>
        {shown}
      </span>
      <span className={styles.hinge} />
    </span>
  );
}

export function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState<Locale>(locale);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDisplay(locale);
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    setDisplay(next);
    saveLocale(next);
    markLanguageSwitch();

    const rest = pathname.replace(/^\/(en|pt|es)(?=\/|$)/, "");
    // Let the flaps riffle before the copy swaps
    window.setTimeout(() => router.replace(`/${next}${rest}`, { scroll: false }), 380);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.board}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${localeNames[locale]}`}
      >
        {display
          .toUpperCase()
          .split("")
          .map((c, i) => (
            <FlapChar key={i} char={c} />
          ))}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            className={styles.menu}
            initial={{ opacity: 0, y: -6, scale: 0.96, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, scale: 0.98, filter: "blur(2px)" }}
            transition={{ type: "spring", stiffness: 520, damping: 34 }}
          >
            {locales.map((l, i) => (
              <motion.li
                key={l}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.04 * i } }}
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={l === locale}
                  className={`${styles.option} ${l === locale ? styles.optionActive : ""}`}
                  onClick={() => choose(l)}
                  lang={l}
                >
                  <span className={styles.optionCode}>{l.toUpperCase()}</span>
                  <span>{localeNames[l]}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
