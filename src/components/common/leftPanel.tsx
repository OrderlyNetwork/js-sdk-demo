import React from "react";
import { OrderPane } from "../trade/order";
import { WalletPanel } from "../trade/wallet";
import { Divider } from "@douyinfe/semi-ui";

export const LeftPanel = () => {
  return (
    <div>
      <OrderPane />
      <Divider />
      <div>
        <WalletPanel />
      </div>
    </div>
  );
};
