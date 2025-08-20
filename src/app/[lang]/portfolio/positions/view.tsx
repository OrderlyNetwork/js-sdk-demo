"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { PositionsModule } from "@orderly.network/portfolio";
import { useTradingLocalStorage } from "@orderly.network/trading";
import { API } from "@orderly.network/types";
import { Box } from "@orderly.network/ui";
import { PathEnum } from "@/constant";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { updateSymbol } from "@/storage";

export default function PositionsView() {
  const config = useOrderlyConfig();
  const local = useTradingLocalStorage();
  const router = useRouter();

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      updateSymbol(symbol);
      router.push(`/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`);
    },
    [router],
  );

  return (
    <Box
      p={6}
      pb={0}
      intensity={900}
      r="xl"
      width="100%"
      style={{
        minHeight: 379,
        maxHeight: 2560,
        overflow: "hidden",
        // Make the table scroll instead of the page scroll
        height: "calc(100vh - 48px - 29px - 48px)",
      }}
    >
      <PositionsModule.PositionsPage
        sharePnLConfig={config.tradingPage.sharePnLConfig}
        pnlNotionalDecimalPrecision={local.pnlNotionalDecimalPrecision}
        calcMode={local.unPnlPriceBasis}
        onSymbolChange={onSymbolChange}
      />
    </Box>
  );
}
