"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@orderly.network/types";
import { Scaffold } from "@orderly.network/ui-scaffold";
import { TradingPage, TradingPageProps } from "@orderly.network/trading";
import { useNav } from "@/hooks/useNav";
import { updateSymbol } from "@/storage";
import { PathEnum } from "@/constant";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { i18n, parseI18nLang } from "@orderly.network/i18n";

export type PerpViewProps = Pick<TradingPageProps, "symbol">;

export default function PerpView(props: PerpViewProps) {
  const config = useOrderlyConfig();
  const [symbol, setSymbol] = useState(props.symbol);
  const router = useRouter();
  const { onRouteChange } = useNav();

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setSymbol(symbol);
      router.push(`/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`);
    },
    [router]
  );

  return (
    <Scaffold
      mainNavProps={config.scaffold.mainNavProps}
      footerProps={config.scaffold.footerProps}
      routerAdapter={{
        onRouteChange,
        currentPath: "/",
      }}
    >
      <TradingPage
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </Scaffold>
  );
}
