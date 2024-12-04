"use client";
import React, { FC, ReactNode } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { useLocalStorage } from "@orderly.network/hooks";
import config from "@/config";

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  const [networkId, setNetworkId] = useLocalStorage(
    "dmm-local-storage-network-id",
    "mainnet"
  );

  return (
    <WalletConnectorProvider>
      <OrderlyAppProvider
        brokerId="orderly"
        brokerName="Orderly"
        networkId={networkId}
        appIcons={config.orderlyAppProvider.appIcons}
        onChainChanged={(
          chainId: number,
          state: {
            isTestnet: boolean;
            isWalletConnected: boolean;
          }
        ) => {
          setNetworkId(state.isTestnet ? "testnet" : "mainnet");
        }}
      >
        {props.children}
      </OrderlyAppProvider>
    </WalletConnectorProvider>
  );
};

export default OrderlyProvider;
