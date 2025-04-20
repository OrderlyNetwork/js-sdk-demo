import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  getLocalePathFromPathname,
  removeLangPrefix,
} from "@orderly.network/i18n";

/**
 * Get the pathname without the language prefix
 * /en/perp/PERP_BTC_USDC => /perp/PERP_BTC_USDC
 * /en/markets => /markets
 */
export function usePathWithoutLang() {
  const pathname = usePathname();

  return useMemo(() => {
    const localePath = getLocalePathFromPathname(pathname);
    return localePath ? removeLangPrefix(pathname) : pathname;
  }, [pathname]);
}
