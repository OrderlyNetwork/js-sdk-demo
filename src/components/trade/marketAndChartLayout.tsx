import React from "react";
import MarketPrice from "./market";
import { TradingViewPanel } from "./tradingview";

export const MarketAndChartLayout = () => {
  return (
    <div className="h-full grid grid-rows-[_60px_1fr]">
      <div className="">
        <MarketPrice />
      </div>
      <div>
        <TradingViewPanel />
      </div>
    </div>
  );
};
