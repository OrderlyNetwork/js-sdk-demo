import { selectCurrentTradingPair } from "@/redux/tradingSlice";
import React from "react";
import { useSelector } from "react-redux";
import AskIcon from "./askIcon";
import BidIcon from "./bidIcon";
import BothIcon from "./bothIcon";

export const OrderBookHeader = () => {
  const tradingPair = useSelector(selectCurrentTradingPair);
  return (
    <>
      <div className="flex flex-row items-center">
        <div className="h-[32px] flex flex-row items-center flex-1 px-3 gap-2 border-b border-solid">
          <BothIcon />
          <BidIcon />
          <AskIcon />
        </div>
      </div>
      <div className="flex flex-row px-3 text-xs py-1">
        <div className="flex-1">{`Price(${tradingPair?.base ?? ""})`}</div>
        <div className="flex-1 text-right">{`Amount(${
          tradingPair?.quote ?? ""
        })`}</div>
        <div className="flex-1 text-right">Total</div>
      </div>
    </>
  );
};
