"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@orderly.network/types";
import { TradingPage, TradingPageProps } from "@orderly.network/trading";
import { updateSymbol } from "@/storage";
import { PathEnum } from "@/constant";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { BaseLayout } from "@/components/baseLayout";

export type PerpViewProps = Pick<TradingPageProps, "symbol">;

export default function PerpView(props: PerpViewProps) {
  const config = useOrderlyConfig();
  const [symbol, setSymbol] = useState(props.symbol);
  const router = useRouter();

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
    <BaseLayout>
      <TradingPage
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </BaseLayout>
  );
}
