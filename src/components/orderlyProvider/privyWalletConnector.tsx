import { ReactNode } from "react";
import type { Adapter } from "@solana/wallet-adapter-base";
import type { NetworkId } from "@orderly.network/types";
import {
  Network,
  WalletConnectorPrivyProvider,
  wagmiConnectors,
} from "@orderly.network/wallet-connector-privy";
import { handleSolanaWalletError } from "./solanaWallets";
import {
  WALLET_CONNECT_APP_METADATA,
  WALLET_CONNECT_PROJECT_ID,
} from "./walletConnectorConfig";

type PrivyWalletConnectorProps = {
  children: ReactNode;
  networkId: NetworkId;
  solanaWallets: Adapter[];
};

const getPrivyId = () => {
  // All deployment environments and Orderly networks intentionally share one Privy app.
  return "cm86zfufk01n2ojo83s2becsr";
};

const PrivyWalletConnector = ({
  children,
  networkId,
  solanaWallets,
}: PrivyWalletConnectorProps) => {
  return (
    <WalletConnectorPrivyProvider
      termsOfUse={"https://learn.woo.org/legal/terms-of-use"}
      network={networkId as Network}
      solanaConfig={{
        wallets: solanaWallets,
        onError: handleSolanaWalletError,
      }}
      wagmiConfig={{
        connectors: [
          wagmiConnectors.injected(),
          wagmiConnectors.walletConnect({
            projectId: WALLET_CONNECT_PROJECT_ID,
            showQrModal: true,
            storageOptions: {},
            metadata: {
              name: WALLET_CONNECT_APP_METADATA.name,
              description: WALLET_CONNECT_APP_METADATA.description,
              url: WALLET_CONNECT_APP_METADATA.url,
              icons: [WALLET_CONNECT_APP_METADATA.icon],
            },
          }),
        ],
      }}
      privyConfig={{
        appid: getPrivyId(),
        config: {
          loginMethods: ["email", "google", "twitter"],
          appearance: {
            theme: "dark",
            accentColor: "#181C23",
            logo: "/orderly-logo.svg",
          },
        },
      }}
      abstractConfig={{}}
    >
      {children}
    </WalletConnectorPrivyProvider>
  );
};

export default PrivyWalletConnector;
