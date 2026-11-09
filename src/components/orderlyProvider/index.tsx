import React, { FC, lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import * as Sentry from "@sentry/react";
import { useAccount } from "@orderly.network/hooks";
import { ErrorBoundary, OrderlyAppProvider } from "@orderly.network/react-app";
import { AnnouncementProvider } from "@orderly.network/ui-notification";
import { appTargetConfig } from "@/components/orderlyConfig/appTargetConfig";
import PageLoading from "@/components/pageLoading/pageLoading";
import { plugins } from "@/config/plugins";
import { getOrderlyConfig, switchAppNetwork } from "@/config/runtime";
import { themes } from "@/config/themes";
import { useAnnouncementFromUrl } from "@/hooks/useAnnouncementFromUrl";
import { useBrokerFromUrl } from "@/hooks/useBrokerFromUrl";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { useWalletModeFromUrl } from "@/hooks/useWalletModeFromUrl";
import { setSentryUserAddress } from "@/sentry";
import { chainFilter, dataAdapter } from "./chains";
import { useConfigStore } from "./configStore";
import { OrderlyLocaleProvider } from "./orderlyLocaleProvider";
import { createSolanaWallets } from "./solanaWallets";
import { DEFAULT_WALLET_MODE } from "./walletMode";

const LegacyWalletConnector = lazy(() => import("./legacyWalletConnector"));
const PrivyWalletConnector = lazy(() => import("./privyWalletConnector"));

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
  const walletMode = useWalletModeFromUrl();
  const [initialWalletMode] = useState(() =>
    walletMode === "legacy" && !import.meta.env.DEV
      ? DEFAULT_WALLET_MODE
      : walletMode,
  );
  const { networkId } = orderlyConfig;
  const { brokerId, brokerName } = useBrokerFromUrl(networkId);
  const widgetConfigs = useAnnouncementFromUrl(networkId);
  const configStore = useConfigStore({
    brokerId,
    brokerName,
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

  const appProvider = (
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
        widgetConfigs={widgetConfigs}
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
        dataAdapter={dataAdapter}
      >
        <AnnouncementProvider>
          <SentryUserSync />
          {props.children || <Outlet />}
        </AnnouncementProvider>
      </OrderlyAppProvider>
    </ErrorBoundary>
  );

  const walletProvider = (
    <Suspense fallback={<PageLoading />}>
      {initialWalletMode === "legacy" ? (
        <LegacyWalletConnector networkId={networkId} solanaWallets={solWallets}>
          {appProvider}
        </LegacyWalletConnector>
      ) : (
        <PrivyWalletConnector
          enablePrivyLogin={initialWalletMode === "privy"}
          networkId={networkId}
          solanaWallets={solWallets}
        >
          {appProvider}
        </PrivyWalletConnector>
      )}
    </Suspense>
  );

  return <OrderlyLocaleProvider>{walletProvider}</OrderlyLocaleProvider>;
};

export default OrderlyProvider;
