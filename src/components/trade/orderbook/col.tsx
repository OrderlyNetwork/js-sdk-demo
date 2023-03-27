import React from "react";
import { OrderBookCell } from "./cell";
import { OrderBookHeader } from "./header";

export const OrderBookCol = () => {
  return (
    <div>
      <OrderBookHeader />
      <div className="flex flex-col">
        <OrderBookCell />
      </div>
    </div>
  );
};
