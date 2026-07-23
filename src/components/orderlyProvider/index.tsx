import React, { FC, useEffect, useMemo } from "react";
import { Outlet } from "react-router";
import * as Sentry from "@sentry/react";
import { useAccount } from "@orderly.network/hooks";
import { ErrorBoundary, OrderlyAppProvider } from "@orderly.network/react-app";
import {
  Network,
  WalletConnectorPrivyProvider,
  wagmiConnectors,
} from "@orderly.network/wallet-connector-privy";
import { appTargetConfig } from "@/components/orderlyConfig/appTargetConfig";
import { plugins } from "@/config/plugins";
import { getOrderlyConfig, switchAppNetwork } from "@/config/runtime";
import { themes } from "@/config/themes";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { setSentryUserAddress } from "@/sentry";
import { chainFilter } from "./chains";
import { useConfigStore } from "./configStore";
import { OrderlyLocaleProvider } from "./orderlyLocaleProvider";
import { createSolanaWallets, handleSolanaWalletError } from "./solanaWallets";

const getPrivyId = () => {
  // All deployment environments and Orderly networks intentionally share one Privy app.
  return "cm86zfufk01n2ojo83s2becsr";
};

const SentryUserSync = () => {
  const { state } = useAccount();
  const address = state.address;

  useEffect(() => {
    setSentryUserAddress(address);

    return () => setSentryUserAddress();
  }, [address]);

  return null;
};

const OrderlyProvider: FC<React.PropsWithChildren> = (props) => {
  const config = useOrderlyConfig();
  const { onRouteChange } = useNav();
  const orderlyConfig = useMemo(() => getOrderlyConfig(), []);
  const { networkId } = orderlyConfig;
  const configStore = useConfigStore({
    brokerId: appTargetConfig.brokerId,
    brokerName: appTargetConfig.brokerName,
    networkId,
    appEnv: orderlyConfig.appEnv,
    urls: orderlyConfig.urls,
  });

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
        network={networkId as Network}
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
            Sentry.withScope((scope) => {
              scope.setContext("react", {
                componentStack: errorInfo.componentStack,
              });
              Sentry.captureException(error);
            });
            console.error("Application render error", error, errorInfo);
          }}
          onRefresh={() => window.location.reload()}
        >
          <OrderlyAppProvider
            configStore={configStore}
            appIcons={config.orderlyAppProvider.appIcons}
            widgetConfigs={appTargetConfig.widgetConfigs}
            enableSwapDeposit
            onChainChanged={(
              _chainId: number,
              state: {
                isTestnet: boolean;
                isWalletConnected: boolean;
              },
            ) => {
              const nextNetworkId = state.isTestnet ? "testnet" : "mainnet";
              if (networkId !== nextNetworkId) {
                switchAppNetwork(nextNetworkId);
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
            <SentryUserSync />
            {props.children || <Outlet />}
          </OrderlyAppProvider>
        </ErrorBoundary>
      </WalletConnectorPrivyProvider>
    </OrderlyLocaleProvider>
  );
};

export default OrderlyProvider;
