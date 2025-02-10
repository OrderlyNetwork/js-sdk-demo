"use client";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { useLocalStorage } from "@orderly.network/hooks";
import walletConnectModule, {
  type WalletConnectOptions,
} from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import ledgerModule, { LedgerOptionsWCv2 } from "@web3-onboard/ledger";
import binanceModule from "@binance/w3w-blocknative-connector";
import trezorModule from "@web3-onboard/trezor";

import config from "@/config";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  const [networkId, setNetworkId] = useLocalStorage(
    "dmm-local-storage-network-id",
    "mainnet"
  );
  const [wcOptions, setWcOptions] = useState();

  useEffect(() => {
    const wcV2InitOptions: WalletConnectOptions = {
      version: 2,
      projectId: "93dba83e8d9915dc6a65ffd3ecfd19fd",
      requiredChains: [42161],
      optionalChains: [42161, 10, 1, 56, 43114, 8453, 137, 59144, 421614, 420],
      dappUrl: window.location.host,
    };

    setWcOptions(wcV2InitOptions);
  }, []);

  const walletConnect = useMemo(() => {
    if (!wcOptions) return undefined;
    return walletConnectModule(wcOptions ?? {});
  }, [wcOptions]);

  const trezor = trezorModule({
    email: "<EMAIL_CONTACT>",
    appUrl: "<APP_URL>",
  });
  const injected = injectedModule();
  const ledgerInitOptions: LedgerOptionsWCv2 = {
    walletConnectVersion: 2,
    projectId: "93dba83e8d9915dc6a65ffd3ecfd19fd",
  };
  const ledger = ledgerModule(ledgerInitOptions);

  const binance = binanceModule({ options: { lng: "en" } });

  if (!walletConnect) {
    return <></>;
  }

  const wallets = [
    injected,
    trezor,
    ledger,
    binance,
    walletConnect /* bitgetWallet */,
  ];

  const solWallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new LedgerWalletAdapter(),
  ];

  return (
    <WalletConnectorProvider
      evmInitial={{
        options: {
          wallets,
        },
      }}
      solanaInitial={{
        wallets: solWallets,
        network:
          networkId === "testnet"
            ? WalletAdapterNetwork.Devnet
            : WalletAdapterNetwork.Mainnet,
        mainnetRpc:
          "https://svc.blockdaemon.com/solana/mainnet/native?apiKey=zpka_381d681090f84230916faabd81615b10_74010639",
      }}
    >
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
          console.log("on chain changed", chainId, state);
          // const curChainId = curChain.current;
          // const nextChainId = chainId;
          // curChain.current = nextChainId;
          const nextState = state.isTestnet ? "testnet" : "mainnet";
          setNetworkId(nextState);
          // if (networkId !== nextState || (curChainId !== nextChainId))
          window.location.reload();
        }}
      >
        {props.children}
      </OrderlyAppProvider>
    </WalletConnectorProvider>
  );
};

export default OrderlyProvider;
