import { useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  parseWalletMode,
  type WalletMode,
} from "@/components/orderlyProvider/walletMode";

/**
 * Resolve walletMode from URL query params.
 * Missing or invalid values default to privy.
 */
export function resolveWalletModeFromUrl(
  searchParams: Pick<URLSearchParams, "get">,
): WalletMode {
  return parseWalletMode(searchParams.get("walletMode"));
}

export function useWalletModeFromUrl(): WalletMode {
  const [searchParams] = useSearchParams();

  return useMemo(() => resolveWalletModeFromUrl(searchParams), [searchParams]);
}
