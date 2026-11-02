import { describe, expect, it } from "vitest";
import { DEFAULT_WALLET_MODE } from "@/components/orderlyProvider/walletMode";
import { resolveWalletModeFromUrl } from "./useWalletModeFromUrl";

const createSearchParams = (walletMode?: string | null) => ({
  get: (key: string) => {
    if (key !== "walletMode") return null;
    return walletMode ?? null;
  },
});

describe("resolveWalletModeFromUrl", () => {
  it.each(["privy", "wallet", "legacy"] as const)(
    "reads the %s wallet mode from the URL",
    (mode) => {
      expect(resolveWalletModeFromUrl(createSearchParams(mode))).toBe(mode);
    },
  );

  it.each([undefined, null, "", "unknown"])(
    "defaults to Privy for %s",
    (value) => {
      expect(resolveWalletModeFromUrl(createSearchParams(value))).toBe(
        DEFAULT_WALLET_MODE,
      );
    },
  );
});
