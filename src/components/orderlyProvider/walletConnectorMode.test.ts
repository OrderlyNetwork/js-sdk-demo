import { describe, expect, it, vi } from "vitest";
import {
  isLegacyWalletConnectorEnabled,
  USE_LEGACY_WALLET_CONNECTOR_KEY,
} from "./walletConnectorMode";

const createStorage = (value: string | null) => ({
  getItem: vi.fn(() => value),
});

describe("isLegacyWalletConnectorEnabled", () => {
  it("enables the legacy connector only for the exact true value", () => {
    const storage = createStorage("true");

    expect(isLegacyWalletConnectorEnabled(storage)).toBe(true);
    expect(storage.getItem).toHaveBeenCalledWith(
      USE_LEGACY_WALLET_CONNECTOR_KEY,
    );
  });

  it.each([null, "false", "", "TRUE", "1", "legacy"])(
    "keeps Privy enabled for %s",
    (value) => {
      expect(isLegacyWalletConnectorEnabled(createStorage(value))).toBe(false);
    },
  );

  it("keeps Privy enabled when browser storage is unavailable", () => {
    expect(isLegacyWalletConnectorEnabled()).toBe(false);
  });
});
