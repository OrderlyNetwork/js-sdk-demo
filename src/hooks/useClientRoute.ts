"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  getLocalePathFromPathname,
  i18n,
  parseI18nLang,
} from "@orderly.network/i18n";
import { PathEnum } from "@/constant";

export function useClientRouting() {
  const router = useRouter();
  let currentLocale = parseI18nLang(i18n?.language);
  const pathname = usePathname();
  const localePath = getLocalePathFromPathname(pathname);

  if (["/health", "/health/"].includes(pathname)) {
    return;
  }

  if (!localePath && pathname !== PathEnum.Root) {
    // redirect to the current locale path
    // /perp/PERP_ETH_USDC => /en/perp/PERP_ETH_USDC
    const redirectPath = `/${currentLocale}${pathname}`;
    router.push(redirectPath);
    return;
  }
  if (localePath && localePath !== currentLocale) {
    currentLocale = localePath;
    i18n.changeLanguage(localePath);
  } else if (currentLocale !== i18n?.language) {
    i18n.changeLanguage(currentLocale);
  }
}
