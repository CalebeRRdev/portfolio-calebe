// File: src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  localeFromAcceptLanguage,
  localeFromCountry,
  locales,
} from "@/i18n/config";

/**
 * Picks the visitor's language:
 * 1. a language they chose before (cookie)
 * 2. the country they're browsing from (Vercel / Cloudflare geo headers)
 * 3. their browser language
 * 4. English
 */
function detectLocale(request: NextRequest) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  const byCountry = localeFromCountry(country);
  if (byCountry) return byCountry;

  return (
    localeFromAcceptLanguage(request.headers.get("accept-language")) ??
    defaultLocale
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip Next internals and any file with an extension (public assets)
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
  ],
};
