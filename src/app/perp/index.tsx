"use client";
import { useCallback, useEffect, useState } from "react";
import { API } from "@orderly.network/types";
import { TradingPage } from "@orderly.network/trading";
import { getSymbol, updateSymbol } from "@/storage";
import { PathEnum } from "@/constant";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { generateLocalePath, i18n } from "@orderly.network/i18n";
import { BaseLayout } from "@/components/baseLayout";
import { usePathname } from "next/navigation";
import { useMarketMap } from "@orderly.network/hooks";
import { formatSymbol, generatePageTitle } from "@/utils";

function getSymbolFromPathname(pathname: string) {
  const match = pathname.match(/\/(?:trade|perp)\/([^\/]+)\/?$/);
  return match ? match[1] : null;
}

export function PerpPage() {
  const pathname = usePathname();
  const marketMap = useMarketMap();
  let urlSymbol = getSymbolFromPathname(pathname);

  if (!marketMap?.[urlSymbol]) {
    urlSymbol = getSymbol();
  }

  const config = useOrderlyConfig();
  const [symbol, setSymbol] = useState(urlSymbol);

  useEffect(() => {
    setSymbol(urlSymbol);
  }, [urlSymbol]);

  useEffect(() => {
    updateSymbol(symbol);
    const title = formatSymbol(symbol);
    document.title = generatePageTitle(title);
    const path = generateLocalePath(
      i18n.language,
      `${PathEnum.Perp}/${symbol}`
    );
    window.history.replaceState({}, "", path);
  }, [symbol]);

  const onSymbolChange = useCallback((data: API.Symbol) => {
    const symbol = data.symbol;
    setSymbol(symbol);
  }, []);

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
