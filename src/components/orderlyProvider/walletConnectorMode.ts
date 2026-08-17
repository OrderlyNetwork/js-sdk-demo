export const USE_LEGACY_WALLET_CONNECTOR_KEY = "USE_LEGACY_WALLET_CONNECTOR";

type StorageReader = Pick<Storage, "getItem">;

export const isLegacyWalletConnectorEnabled = (
  storage?: StorageReader,
): boolean => {
  const browserStorage =
    storage ??
    (typeof window === "undefined" ? undefined : window.localStorage);

  return browserStorage?.getItem(USE_LEGACY_WALLET_CONNECTOR_KEY) === "true";
};
