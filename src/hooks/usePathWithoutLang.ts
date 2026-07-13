import { useMemo } from "react";
import { useLocation } from "react-router";
import { removeLangPrefix } from "@orderly.network/i18n";

/**
 * Get the pathname without the language prefix
 * /en/perp/PERP_BTC_USDC => /perp/PERP_BTC_USDC
 * /en/markets => /markets
 */
export function usePathWithoutLang() {
  const { pathname } = useLocation();

  return useMemo(() => removeLangPrefix(pathname), [pathname]);
}
