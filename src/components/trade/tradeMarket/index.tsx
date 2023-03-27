import { selectLoggedIn } from "@/redux/appSlice";
import { selectCurrentTradingPair } from "@/redux/tradingSlice";
import orderlyService from "@/service/orderlyService";
import React from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { TradeMarketCell } from "./cell";

export const TradeMarket = () => {
  // const isLoggedIn = useSelector(selectLoggedIn);
  const currentTradingPair = useSelector(selectCurrentTradingPair);

  const [line, setLine] = React.useState(0);

  const { data, isLoading } = useSWR(
    () => ["/api/tradeMarket", currentTradingPair!.symbol],
    ([_, symbol]) => orderlyService.api.public.getMarketTrades(symbol!),
    {
      fallbackData: [],
    }
  );

  //   const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-[200px]">
      <div className="px-3 py-1 border-b border-solid flex flex-row justify-between items-center text-sm">
        TradeMarket
      </div>
      <div>
        {data?.map((item: any, index) => {
          return (
            <TradeMarketCell
              key={index}
              price={item.executed_price}
              amount={item.executed_quantity}
              side={item.side}
              time={item.executed_timestamp}
            />
          );
        })}
      </div>
    </div>
  );
};
