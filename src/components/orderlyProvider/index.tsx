import React, { FC, lazy, Suspense, useEffect, useMemo } from "react";
import { Outlet } from "react-router";
import * as Sentry from "@sentry/react";
import { useAccount } from "@orderly.network/hooks";
import { ErrorBoundary, OrderlyAppProvider } from "@orderly.network/react-app";
import { appTargetConfig } from "@/components/orderlyConfig/appTargetConfig";
import PageLoading from "@/components/pageLoading/pageLoading";
import { plugins } from "@/config/plugins";
import { getOrderlyConfig, switchAppNetwork } from "@/config/runtime";
import { themes } from "@/config/themes";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { setSentryUserAddress } from "@/sentry";
import { chainFilter } from "./chains";
import { useConfigStore } from "./configStore";
import { OrderlyLocaleProvider } from "./orderlyLocaleProvider";
import { createSolanaWallets } from "./solanaWallets";
import { isLegacyWalletConnectorEnabled } from "./walletConnectorMode";

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
  const useLegacyWalletConnector = useMemo(
    () => isLegacyWalletConnectorEnabled(),
    [],
  );
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
  );

  const walletProvider = (
    <Suspense fallback={<PageLoading />}>
      {useLegacyWalletConnector ? (
        <LegacyWalletConnector networkId={networkId} solanaWallets={solWallets}>
          {appProvider}
        </LegacyWalletConnector>
      ) : (
        <PrivyWalletConnector networkId={networkId} solanaWallets={solWallets}>
          {appProvider}
        </PrivyWalletConnector>
      )}
    </Suspense>
  );

  return <OrderlyLocaleProvider>{walletProvider}</OrderlyLocaleProvider>;
};

export default OrderlyProvider;
