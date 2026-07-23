import React, { FC, useMemo } from "react";
import { Outlet } from "react-router";
import { useLocalStorage } from "@orderly.network/hooks";
import { ErrorBoundary, OrderlyAppProvider } from "@orderly.network/react-app";
import {
  WalletConnectorPrivyProvider,
  wagmiConnectors,
} from "@orderly.network/wallet-connector-privy";
import { appTargetConfig } from "@/components/orderlyConfig/appTargetConfig";
import { plugins } from "@/config/plugins";
import { themes } from "@/config/themes";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { chainFilter } from "./chains";
import { OrderlyLocaleProvider } from "./orderlyLocaleProvider";
import { createSolanaWallets, handleSolanaWalletError } from "./solanaWallets";

const getPrivyId = () => {
  // dev privy id
  return "cm86zfufk01n2ojo83s2becsr";
};

const OrderlyProvider: FC<React.PropsWithChildren> = (props) => {
  const config = useOrderlyConfig();
  const { onRouteChange } = useNav();
  const [networkId, setNetworkId] = useLocalStorage(
    "dmm-local-storage-network-id",
    "mainnet",
  );

  const solWallets = useMemo(
    () =>
      createSolanaWallets({
        networkId,
        appName: appTargetConfig.title,
        appOrigin: window.location.origin,
        appIcon: "orderly-logo.svg",
      }),
    [networkId],
  );

  return (
    <OrderlyLocaleProvider>
      <WalletConnectorPrivyProvider
        termsOfUse={"https://learn.woo.org/legal/terms-of-use"}
        network={networkId}
        solanaConfig={{
          wallets: solWallets,
          onError: handleSolanaWalletError,
        }}
        wagmiConfig={{
          connectors: [
            wagmiConnectors.injected(),
            wagmiConnectors.walletConnect({
              projectId: "93dba83e8d9915dc6a65ffd3ecfd19fd",
              showQrModal: true,
              storageOptions: {},
              metadata: {
                name: "Orderly",
                description: "Orderly",
                url: "https://orderly.network",
                icons: ["/orderly-logo.svg"],
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
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("Application render error", error, errorInfo);
          }}
          onRefresh={() => window.location.reload()}
        >
          <OrderlyAppProvider
            brokerId={appTargetConfig.brokerId}
            brokerName={appTargetConfig.brokerName}
            networkId={networkId}
            appIcons={config.orderlyAppProvider.appIcons}
            widgetConfigs={appTargetConfig.widgetConfigs}
            enableSwapDeposit
            onChainChanged={(
              chainId: number,
              state: {
                isTestnet: boolean;
                isWalletConnected: boolean;
              },
            ) => {
              const nextState = state.isTestnet ? "testnet" : "mainnet";
              setNetworkId(nextState);
              if (networkId !== nextState) {
                window.location.reload();
              }
            }}
            onRouteChange={onRouteChange}
            notification={{
              orderFilled: {
                media: "https://oss.orderly.network/static/sdk/coin.mp3",
                defaultOpen: false,
                displayInOrderEntry: true,
              },
            }}
            themes={themes}
            plugins={plugins}
            chainFilter={chainFilter}
          >
            {props.children || <Outlet />}
          </OrderlyAppProvider>
        </ErrorBoundary>
      </WalletConnectorPrivyProvider>
    </OrderlyLocaleProvider>
  );
};

export default OrderlyProvider;
