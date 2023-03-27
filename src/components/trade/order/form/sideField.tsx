import clsx from "clsx";
import { OrderSide } from "orderly-sdk/lib/enums";
import React, { FC } from "react";

interface Props {
  onChange: (side: OrderSide) => void;
  value: OrderSide;
}

export const SideField: FC<Props> = (props) => {
  return (
    <div className="flex flex-row ">
      <button
        type="button"
        onClick={() => props.onChange(OrderSide.BUY)}
        className={clsx(
          "flex-1 text-center text-sm py-1 rounded-tl rounded-bl ",
          props.value === OrderSide.BUY
            ? "bg-trade-green text-white"
            : "bg-gray-100 text-gray-600"
        )}
      >
        Buy
      </button>
      <button
        type="button"
        onClick={() => props.onChange(OrderSide.SELL)}
        className={clsx(
          "flex-1 text-center text-sm py-1 rounded-tr rounded-br",
          props.value === OrderSide.SELL
            ? "bg-trade-red text-white"
            : "bg-gray-100 text-gray-600"
        )}
      >
        Sell
      </button>
    </div>
  );
};
