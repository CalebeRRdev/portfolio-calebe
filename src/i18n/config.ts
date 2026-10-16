// File: src/i18n/config.ts

export const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

export const htmlLang: Record<Locale, string> = {
  en: "en",
  pt: "pt-BR",
  es: "es",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** ISO 3166-1 alpha-2 codes of Portuguese-speaking countries (CPLP). */
const PORTUGUESE_COUNTRIES = new Set([
  "BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL", "MO",
]);

/** ISO 3166-1 alpha-2 codes of Spanish-speaking countries. */
const SPANISH_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO",
  "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "GQ",
]);

export function localeFromCountry(country: string | null | undefined): Locale | null {
  if (!country) return null;
  const code = country.toUpperCase();
  if (PORTUGUESE_COUNTRIES.has(code)) return "pt";
  if (SPANISH_COUNTRIES.has(code)) return "es";
  return "en";
}

/** Fallback when no geo header is available (e.g. local dev). */
export function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const tags = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}
