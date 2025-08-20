import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { type LocaleCode } from "@orderly.network/i18n";
import { PathEnum } from "@/constant";
import { DEFAULT_SYMBOL } from "@/storage";

const localePaths = Object.values(PathEnum);

export const i18nCookieKey = "orderly_i18nLng";

enum LocaleEnum {
  /** English */
  en = "en",
  /** Chinese */
  zh = "zh",
  /** Japanese */
  ja = "ja",
  /** Spanish */
  es = "es",
  /** Korean */
  ko = "ko",
  /** Vietnamese */
  vi = "vi",
  /** German */
  de = "de",
  /** French */
  fr = "fr",
}

export function parseI18nLang(
  lang: string,
  localeCodes?: LocaleCode[],
  defaultLang?: LocaleCode,
) {
  localeCodes = localeCodes || Object.values(LocaleEnum);
  defaultLang = defaultLang || LocaleEnum.en;

  const regex = /^([a-z]{2})/i;
  const match = lang?.match(regex);

  if (!match) return defaultLang;

  const matchLang = match[1];

  if (localeCodes.includes(lang)) {
    return lang;
  }

  if (localeCodes.includes(matchLang)) {
    return matchLang;
  }

  return defaultLang;
}

export function getLocalePathFromPathname(
  pathname: string,
  localeCodes?: string[],
) {
  const locale = pathname.split("/")[1];
  localeCodes = localeCodes || Object.values(LocaleEnum);
  return localeCodes.includes(locale as LocaleEnum) ? locale : null;
}

// Get the locale from cookie
function getLocaleFromCookie(request: NextRequest) {
  const lang = request.cookies.get(i18nCookieKey)?.value;
  return parseI18nLang(lang!);
}

function removeLangPrefix(pathname: string, localeCodes?: string[]) {
  const localePath = getLocalePathFromPathname(pathname, localeCodes);

  return localePath
    ? pathname.replace(new RegExp(`^/${localePath}(?=/)`), "")
    : pathname;
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;

  const localePath = getLocalePathFromPathname(pathname);

  const pathWithoutLang = removeLangPrefix(pathname);

  if (pathWithoutLang === PathEnum.Perp) {
    request.nextUrl.pathname = `/${localePath}${PathEnum.Perp}/${DEFAULT_SYMBOL}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // If the pathname has a locale path, return
  if (localePath) return;

  let newPathname = pathname;

  const cookieLocale = getLocaleFromCookie(request);

  if (pathname === "/") {
    newPathname = `/${cookieLocale}${PathEnum.Perp}/${DEFAULT_SYMBOL}`;
  } else if (localePaths.includes(pathname as PathEnum)) {
    newPathname = `/${cookieLocale}${pathname}`;
  } else if (pathname.startsWith(PathEnum.Perp)) {
    newPathname = `/${cookieLocale}${PathEnum.Perp}/${DEFAULT_SYMBOL}`;
  }

  if (newPathname !== pathname) {
    request.nextUrl.pathname = newPathname;
    console.log(`redirect: ${pathname} ==> ${newPathname}`);
    return NextResponse.redirect(request.nextUrl);
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
  ],
};
