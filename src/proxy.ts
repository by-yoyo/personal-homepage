import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { locales, defaultLocale, type Locale } from "./i18n/config";

function getLocale(request: NextRequest): Locale {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return match(languages, [...locales], defaultLocale) as Locale;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Log matched path (not excluded)
  console.log("[Proxy] Matched path:", pathname);

  // Check if accessing /{language} directly, redirect to /{language}/profile
  const localeOnlyMatch = locales.find((locale) => pathname === `/${locale}`);
  if (localeOnlyMatch) {
    request.nextUrl.pathname = `/${localeOnlyMatch}/profile`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some((locale) =>
    pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);

  // Redirect root to /{language}/profile
  if (pathname === "/") {
    request.nextUrl.pathname = `/${locale}/profile`;
  } else {
    request.nextUrl.pathname = `/${locale}${pathname}`;
  }

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Match all paths except:
    "/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|.well-known|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
