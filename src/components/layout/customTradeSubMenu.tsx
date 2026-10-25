import React from "react";
import { useParams } from "react-router";
import { TradeSubMenuWidget } from "@orderly.network/markets";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import { DEFAULT_SYMBOL } from "@/perpSymbolStorage";
import { getTradeSubMenuTab } from "./tradeSubMenuTab";

export const TradeSubMenu: React.FC = () => {
  const params = useParams();
  const activeKey = getTradeSubMenuTab(usePathWithoutLang());

  return (
    <TradeSubMenuWidget
      activeKey={activeKey}
      // Prediction round symbols are ignored inside the widget via isBinarySymbol.
      symbol={params.symbol}
      defaultSymbol={DEFAULT_SYMBOL}
    />
  );
};
