import { ReactNode, useMemo } from "react";
import type { Adapter } from "@solana/wallet-adapter-base";
import injectedWallets from "@web3-onboard/injected-wallets";
import walletConnect from "@web3-onboard/walletconnect";
import type { NetworkId } from "@orderly.network/types";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import {
  getSolanaWalletNetwork,
  handleSolanaWalletError,
} from "./solanaWallets";
import {
  WALLET_CONNECT_APP_METADATA,
  WALLET_CONNECT_PROJECT_ID,
} from "./walletConnectorConfig";

type LegacyWalletConnectorProps = {
  children: ReactNode;
  networkId: NetworkId;
  solanaWallets: Adapter[];
};

const LegacyWalletConnector = ({
  children,
  networkId,
  solanaWallets,
}: LegacyWalletConnectorProps) => {
  const evmWallets = useMemo(
    () => [
      injectedWallets(),
      walletConnect({
        projectId: WALLET_CONNECT_PROJECT_ID,
        dappUrl: window.location.origin,
        qrModalOptions: {
          themeMode: "dark",
        },
      }),
    ],
    [],
  );

  return (
    <WalletConnectorProvider
      evmInitial={{
        options: {
          wallets: evmWallets,
          appMetadata: {
            name: WALLET_CONNECT_APP_METADATA.name,
            description: WALLET_CONNECT_APP_METADATA.description,
            icon: WALLET_CONNECT_APP_METADATA.icon,
            explore: WALLET_CONNECT_APP_METADATA.url,
          },
        },
      }}
      solanaInitial={{
        network: getSolanaWalletNetwork(networkId),
        wallets: solanaWallets,
        onError: handleSolanaWalletError,
      }}
    >
      {children}
    </WalletConnectorProvider>
  );
};

export default LegacyWalletConnector;
