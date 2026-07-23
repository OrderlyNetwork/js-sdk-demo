import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
} from "@solana-mobile/wallet-adapter-mobile";
import {
  Adapter,
  WalletAdapterNetwork,
  WalletError,
  WalletNotReadyError,
} from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import type { NetworkId } from "@orderly.network/types";

type SolanaWalletFactoryOptions = {
  networkId: NetworkId;
  appName: string;
  appOrigin: string;
  appIcon: string;
};

type WalletUrlOpener = (url: string) => void;

export const getSolanaWalletNetwork = (
  networkId: NetworkId,
): WalletAdapterNetwork => {
  return networkId === "testnet"
    ? WalletAdapterNetwork.Devnet
    : WalletAdapterNetwork.Mainnet;
};

export const createSolanaMobileWalletConfig = (
  options: SolanaWalletFactoryOptions,
) => ({
  addressSelector: createDefaultAddressSelector(),
  appIdentity: {
    name: options.appName,
    uri: options.appOrigin,
    icon: options.appIcon,
  },
  authorizationResultCache: createDefaultAuthorizationResultCache(),
  chain: getSolanaWalletNetwork(options.networkId),
  onWalletNotFound: createDefaultWalletNotFoundHandler(),
});

export const createSolanaWallets = (
  options: SolanaWalletFactoryOptions,
): Adapter[] => {
  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new LedgerWalletAdapter(),
    new SolanaMobileWalletAdapter(createSolanaMobileWalletConfig(options)),
  ];
};

const openWalletUrl: WalletUrlOpener = (url) => {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

export const isWalletNotReadyError = (error: unknown): boolean => {
  return (
    error instanceof WalletNotReadyError ||
    (error instanceof Error && error.name === "WalletNotReadyError")
  );
};

export const handleSolanaWalletError = (
  error: WalletError | Error,
  adapter?: Adapter,
  openUrl: WalletUrlOpener = openWalletUrl,
): boolean => {
  if (isWalletNotReadyError(error) && adapter?.url) {
    openUrl(adapter.url);
    return true;
  }

  console.error("Solana wallet error", error, adapter);
  return false;
};
