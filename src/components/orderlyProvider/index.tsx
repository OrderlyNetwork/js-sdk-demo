"use client";
import React, { FC, ReactNode } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import config from "@/config";

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  return (
    <WalletConnectorProvider>
      <OrderlyAppProvider
        brokerId="demo"
        brokerName="Orderly"
        networkId="testnet"
        appIcons={config.orderlyAppProvider.appIcons}
      >
        {props.children}
      </OrderlyAppProvider>
    </WalletConnectorProvider>
  );
};

export default OrderlyProvider;
