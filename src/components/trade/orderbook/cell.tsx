import { TokenNum } from "@/components/common/tokenNum";
import React, { FC } from "react";
import { OrderBookItem } from "./useOrderbook";

export type orderBookType = "ask" | "bid";

interface Props {
  // color: OrderBookColor;
  color: string;
  item: OrderBookItem;
  maxTotal: number;
  onClick?: (price: string) => void;
  dp?: number;
}

export const OrderBookCell: FC<Props> = (props) => {
  const { item, color } = props;
  // console.log(item.total, props.maxTotal);
  const position =
    item.total === "-" ? 2 : Math.max(item.total / props.maxTotal, 0.02) * 100;

  // console.log("position", position);
  return (
    <div className="px-3 relative cursor-pointer mb-[1px] odd:bg-slate-50">
      <div
        className="absolute left-[-100%] top-0 bottom-0 z-0 opacity-10 w-full transition-transform"
        style={{
          backgroundColor: color,
          transform: `translate3d(${position}%,0,0)`,
        }}
      />
      <div className="flex flex-row z-10 relative h-[20px] items-center">
        <div className="flex-1 " style={{ color: color }}>
          {item.price}
        </div>
        <div className="flex-1 text-right">{item.quantity}</div>

        <div className="flex-1 text-right">
          <TokenNum value={item.total} dp={props.dp} />
        </div>
      </div>
    </div>
  );
};
