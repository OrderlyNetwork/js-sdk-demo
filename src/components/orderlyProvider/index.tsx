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
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import {
  LocaleCode,
  LocaleEnum,
  LocaleProvider,
  parseI18nLang,
} from "@orderly.network/i18n";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();

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

  return (
    <LocaleProvider
      onLanguageChanged={onLanguageChanged}
      backend={{ loadPath }}
    >
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
            "https://svc.blockdaemon.com/solana/mainnet/native?apiKey=zpka_a8c397bf72c241bea3d5562b39797cfd_3acf7e3d",
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
            // const curChainId = curChain.current;
            // const nextChainId = chainId;
            // curChain.current = nextChainId;
            const nextState = state.isTestnet ? "testnet" : "mainnet";
            // console.log("nextState", {
            //   networkId,
            //   nextState,
            // });
            setNetworkId(nextState);
            if (networkId !== nextState) {
              window.location.reload();
            }
          }}
        >
          {props.children}
        </OrderlyAppProvider>
      </WalletConnectorProvider>
    </LocaleProvider>
  );
};

export default OrderlyProvider;
