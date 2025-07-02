"use client";
import React, { FC, ReactNode, useEffect } from "react";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { useLocalStorage } from "@orderly.network/hooks";
import {
  WalletConnectorPrivyProvider,
  wagmiConnectors,
} from "@orderly.network/wallet-connector-privy";
import { Adapter, WalletError } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import {
  getLocalePathFromPathname,
  i18n,
  LocaleCode,
  LocaleEnum,
  LocaleProvider,
  parseI18nLang,
} from "@orderly.network/i18n";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import { usePathname } from "next/navigation";

const getPrivyId = () => {
  // dev privy id
  return "cm86zfufk01n2ojo83s2becsr";
};

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();
  const pathname = usePathname();

  const [networkId, setNetworkId] = useLocalStorage(
    "dmm-local-storage-network-id",
    "mainnet"
  );

  const solWallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new LedgerWalletAdapter(),
  ];

  const onLanguageChanged = async (lang: LocaleCode) => {
    window.history.replaceState({}, "", `/${lang}${path}`);
  };

  const loadPath = (lang: LocaleCode) => {
    const _lang = parseI18nLang(lang);
    if (_lang === LocaleEnum.en) {
      // because en is built-in, we need to load the en extend only
      return `/locales/extend/${_lang}.json`;
    }
    return [`/locales/${_lang}.json`, `/locales/extend/${_lang}.json`];
  };

  useEffect(() => {
    const lang = getLocalePathFromPathname(pathname);
    // if url is include lang, and url lang is not the same as the i18n language, change the i18n language
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [pathname]);

  return (
    <LocaleProvider
      onLanguageChanged={onLanguageChanged}
      backend={{ loadPath }}
    >
      <WalletConnectorPrivyProvider
        termsOfUse={"https://learn.woo.org/legal/terms-of-use"}
        network={networkId}
        solanaConfig={{
          wallets: solWallets as Adapter[],
          onError: (error: WalletError, adapter?: Adapter) => {
            console.log("solana wallet error", error, adapter);
            console.error(error);
          },
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
      >
        <OrderlyAppProvider
          brokerId="demo"
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
            const nextState = state.isTestnet ? "testnet" : "mainnet";
            setNetworkId(nextState);
            if (networkId !== nextState) {
              window.location.reload();
            }
          }}
        >
          {props.children}
        </OrderlyAppProvider>
      </WalletConnectorPrivyProvider>
    </LocaleProvider>
  );
};

export default OrderlyProvider;
