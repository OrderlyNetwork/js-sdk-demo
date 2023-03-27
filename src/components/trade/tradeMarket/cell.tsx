import { TimeLabel } from "@/components/ui/timeLabel";
import React, { FC } from "react";

interface Props {
  price: number;
  amount: string;
  time: number;
  side: string;
}

export const TradeMarketCell: FC<Props> = (props) => {
  return (
    <div className="flex flex-row text-xs px-3 mb-[1px] h-[20px] items-center odd:bg-slate-50">
      <div
        className="flex-1"
        style={{
          color:
            props.side === "SELL" ? "rgb(14, 203, 129)" : "rgb(246, 70, 93)",
        }}
      >
        {props.price}
      </div>
      <div className="flex-1 text-right">{props.amount}</div>
      <div className="flex-1 text-right">
        <TimeLabel value={props.time} format="HH:mm:ss" />
      </div>
    </div>
  );
};
