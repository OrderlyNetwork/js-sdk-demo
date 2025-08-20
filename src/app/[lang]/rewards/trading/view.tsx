"use client";

import { TradingRewards } from "@orderly.network/trading-rewards";

export default function TradingRewardsView() {
  return (
    <TradingRewards.HomePage
      className="oui-py-6 oui-px-4 lg:oui-px-6 xl:oui-pl-4 xl:oui-pr-6"
      titleConfig={{
        brokerName: "Orderly",
        docOpenOptions: {
          target: "_blank",
          url: "https://orderly.network/docs/introduction/tokenomics/trading-rewards/trading-rewards",
        },
      }}
    />
  );
}
