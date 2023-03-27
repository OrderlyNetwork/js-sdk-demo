import React from "react";

import { IconArrowDown } from "@douyinfe/semi-icons";

export const Ticker = () => {
  return (
    <div className="p-2 flex flex-row items-center">
      <div className="text-xl text-trade-green">
        <span>28,121.12</span>
        <IconArrowDown />
      </div>
    </div>
  );
};
