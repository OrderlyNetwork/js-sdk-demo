import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { removeLangPrefix } from "@orderly.network/i18n";

/**
 * Get the pathname without the language prefix
 * /en/perp/PERP_BTC_USDC => /perp/PERP_BTC_USDC
 * /en/markets => /markets
 */
export function usePathWithoutLang() {
  const pathname = usePathname();

  return useMemo(() => {
    const removedTrailingSlash = pathname.replace(/\/$/, "");
    return removeLangPrefix(removedTrailingSlash);
  }, [pathname]);
}
