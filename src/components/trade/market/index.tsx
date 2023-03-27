import React from "react";
import { SymbolPicker } from "@/components/trade/market/symbolPicker";
import { Prices } from "./prices";
import { Price } from "./price";

const MarketPrice = () => {
  return (
    <div
      className={
        "h-[60px] flex flex-row items-center px-2 border-b border-solid"
      }
    >
      <SymbolPicker />
      <Price />
      <Prices />
    </div>
  );
};

export default MarketPrice;
