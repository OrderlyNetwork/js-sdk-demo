import React, { FC } from "react";

import { IconStar } from "@douyinfe/semi-icons";
import { TradingPair } from "@/redux/tradingSlice";
import { Dropdown } from "@douyinfe/semi-ui";

interface Props {
  tradingPair: TradingPair;
  onClick?: (tradingPair: TradingPair) => void;
  active?: boolean;
}

export const SymbolCell: FC<Props> = (props) => {
  const { tradingPair, onClick } = props;
  return (
    <Dropdown.Item
      active={props.active}
      className={props.active ? "bg-slate-200" : ""}
      onClick={() => {
        onClick?.(tradingPair);
      }}
    >
      <div className="flex flex-row items-center " style={{ width: "300px" }}>
        <div className="flex-1">{`${tradingPair.quote}/${tradingPair.base}`}</div>
        <div className="flex flex-col">
          <div className="text-right">28,121.12</div>
          <div className="text-right text-green-500 text-xs">+0.12%</div>
        </div>
      </div>
    </Dropdown.Item>
  );
};
