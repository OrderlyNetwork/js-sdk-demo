import React from "react";
import { PriceCell } from "./priceCell";

export const Prices = () => {
  return (
    <div className="flex flex-row gap-5">
      <PriceCell label="24h Change" value="$28,213.32" />
      <PriceCell label="24h High" value="$28,213.32" />
      <PriceCell label="24h Low" value="$28,213.32" />
      {/* <PriceCell label="" value="$28,213.32" /> */}
    </div>
  );
};
