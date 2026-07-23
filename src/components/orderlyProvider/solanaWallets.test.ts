import { SolanaMobileWalletAdapter } from "@solana-mobile/wallet-adapter-mobile";
import {
  Adapter,
  WalletAdapterNetwork,
  WalletNotReadyError,
} from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { describe, expect, it, vi } from "vitest";
import {
  createSolanaMobileWalletConfig,
  createSolanaWallets,
  getSolanaWalletNetwork,
  handleSolanaWalletError,
} from "./solanaWallets";

vi.mock("@solana/wallet-adapter-wallets", () => ({
  PhantomWalletAdapter: class PhantomWalletAdapter {},
  SolflareWalletAdapter: class SolflareWalletAdapter {},
  LedgerWalletAdapter: class LedgerWalletAdapter {},
}));

const options = {
  networkId: "testnet" as const,
  appName: "Orderly SDK Demo",
  appOrigin: "https://demo.example.com",
  appIcon: "orderly-logo.svg",
};

describe("getSolanaWalletNetwork", () => {
  it("maps Orderly networks to Solana networks", () => {
    expect(getSolanaWalletNetwork("mainnet")).toBe(
      WalletAdapterNetwork.Mainnet,
    );
    expect(getSolanaWalletNetwork("testnet")).toBe(WalletAdapterNetwork.Devnet);
  });
});

describe("createSolanaMobileWalletConfig", () => {
  it("uses the requested chain and application identity", () => {
    const config = createSolanaMobileWalletConfig(options);

    expect(config.chain).toBe(WalletAdapterNetwork.Devnet);
    expect(config.appIdentity).toEqual({
      name: "Orderly SDK Demo",
      uri: "https://demo.example.com",
      icon: "orderly-logo.svg",
    });
  });

  it("handles a missing mobile wallet without rejecting", async () => {
    const config = createSolanaMobileWalletConfig(options);

    await expect(
      config.onWalletNotFound({} as SolanaMobileWalletAdapter),
    ).resolves.toBeUndefined();
  });
});

describe("createSolanaWallets", () => {
  it("registers the same four Solana wallet adapters as WOOFi", () => {
    const wallets = createSolanaWallets(options);

    expect(wallets).toHaveLength(4);
    expect(wallets[0]).toBeInstanceOf(PhantomWalletAdapter);
    expect(wallets[1]).toBeInstanceOf(SolflareWalletAdapter);
    expect(wallets[2]).toBeInstanceOf(LedgerWalletAdapter);
    expect(wallets[3]).toBeInstanceOf(SolanaMobileWalletAdapter);
  });
});

describe("handleSolanaWalletError", () => {
  const adapter = { url: "https://wallet.example.com" } as Adapter;

  it("opens the wallet URL for local WalletNotReadyError instances", () => {
    const openUrl = vi.fn();

    expect(
      handleSolanaWalletError(
        new WalletNotReadyError("wallet not ready"),
        adapter,
        openUrl,
      ),
    ).toBe(true);
    expect(openUrl).toHaveBeenCalledWith("https://wallet.example.com");
  });

  it("recognizes WalletNotReadyError from another dependency instance", () => {
    const openUrl = vi.fn();
    const error = new Error("wallet not ready");
    error.name = "WalletNotReadyError";

    expect(handleSolanaWalletError(error, adapter, openUrl)).toBe(true);
    expect(openUrl).toHaveBeenCalledWith("https://wallet.example.com");
  });

  it("does not open a URL for unrelated wallet errors", () => {
    const openUrl = vi.fn();
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(handleSolanaWalletError(new Error("failed"), adapter, openUrl)).toBe(
      false,
    );
    expect(openUrl).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
