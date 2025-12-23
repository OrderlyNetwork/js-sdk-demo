"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Adapter,
  WalletError,
  WalletAdapterNetwork,
} from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@orderly.network/hooks";
import {
  getLocalePathFromPathname,
  i18n,
  LocaleCode,
  LocaleEnum,
  LocaleProvider,
} from "@orderly.network/i18n";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import { initOnBoard } from "./web3OnboardConfig";

const OrderlyProvider: FC<React.PropsWithChildren> = (props) => {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();
  const pathname = usePathname();
  const { onRouteChange } = useNav();

  const [networkId, setNetworkId] = useLocalStorage(
    "dmm-local-storage-network-id",
    "mainnet",
  );
  const [initWallet, setInitWallet] = useState(false);

  const solanaNetwork =
    networkId === "testnet"
      ? WalletAdapterNetwork.Devnet
      : WalletAdapterNetwork.Mainnet;

  const solWallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new LedgerWalletAdapter(),
  ];

  useEffect(() => {
    initOnBoard().then(() => {
      setInitWallet(true);
    });
  }, []);

  const onLanguageChanged = async (lang: LocaleCode) => {
    window.history.replaceState({}, "", `/${lang}${path}`);
  };

  const loadPath = (lang: LocaleCode) => {
    if (lang === LocaleEnum.en) {
      // because en is built-in, we need to load the en extend only
      return `/locales/extend/${lang}.json`;
    }
    return [`/locales/${lang}.json`, `/locales/extend/${lang}.json`];
  };

  useEffect(() => {
    const lang = getLocalePathFromPathname(pathname);
    // if url is include lang, and url lang is not the same as the i18n language, change the i18n language
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [pathname]);

  if (!initWallet) {
    return null;
  }

  return (
    <LocaleProvider
      onLanguageChanged={onLanguageChanged}
      backend={{ loadPath }}
    >
      <WalletConnectorProvider
        evmInitial={{
          skipInit: true,
        }}
        solanaInitial={{
          network: solanaNetwork,
          wallets: solWallets as Adapter[],
          onError: (error: WalletError, adapter?: Adapter) => {
            console.log("solana wallet error", error, adapter);
            console.error(error);
          },
        }}
      >
        <OrderlyAppProvider
          brokerId="demo"
          brokerName="Orderly"
          networkId={networkId}
          appIcons={config.orderlyAppProvider.appIcons}
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
        >
          {props.children}
        </OrderlyAppProvider>
      </WalletConnectorProvider>
    </LocaleProvider>
  );
};

export default OrderlyProvider;
