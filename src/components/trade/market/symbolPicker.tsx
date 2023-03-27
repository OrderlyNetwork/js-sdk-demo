import { Dropdown } from "@douyinfe/semi-ui";
import React, { useState } from "react";
import { IconChevronDown } from "@douyinfe/semi-icons";
import { SymbolCell } from "./symbolCell";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentTradingPair,
  selectTradingPairs,
  setCurrentTradingPair,
  TradingPair,
} from "@/redux/tradingSlice";
import { SymbolLabel } from "./symbolLabel";

export const SymbolPicker = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const tradingPairs = useSelector(selectTradingPairs);
  const currentTradingPair = useSelector(selectCurrentTradingPair);

  const onSelectTradingPair = (tradingPair: TradingPair) => {
    dispatch(setCurrentTradingPair(tradingPair));
  };

  return (
    <Dropdown
      trigger={"click"}
      position={"bottomLeft"}
      clickToHide
      onVisibleChange={(visible) => {
        setVisible(visible);
      }}
      render={
        <Dropdown.Menu>
          {tradingPairs.map((pair) => {
            return (
              <SymbolCell
                tradingPair={pair}
                key={pair.symbol}
                active={pair.symbol === currentTradingPair?.symbol}
                onClick={onSelectTradingPair}
              />
            );
          })}
        </Dropdown.Menu>
      }
    >
      <div className="h-full">
        <SymbolLabel
          tradingPair={currentTradingPair}
          loading={!currentTradingPair}
          open={visible}
        />
      </div>
    </Dropdown>
  );
};
