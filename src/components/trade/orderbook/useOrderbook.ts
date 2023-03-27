import { TradingPair } from "@/redux/tradingSlice";
import orderlyService from "@/service/orderlyService";
import { RootState } from "@/store/store";
import Decimal from "decimal.js-light";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import useSWR from "swr";

export interface OrderBookItem {
  price: number;
  quantity: number;
  total: number;
}

type useOrderbookReturn = {
  asks: OrderBookItem[];
  bids: OrderBookItem[];
  error: any;
  isLoading: boolean;
};

const accFn = (acc: OrderBookItem, cur: OrderBookItem): OrderBookItem => {
  // acc.total += cur.quantity;
  cur.total = new Decimal(acc.total).plus(cur.quantity).toFixed();
  // console.log(cur.total);
  return cur;
};

const paddingFn = (len: number) =>
  Array(len).fill({ price: "-", quantity: "-", total: "-" });

export const useOrderbook = (): useOrderbookReturn => {
  const [level, setLevel] = useState(10);

  const tradingPair = useSelector<RootState, TradingPair | undefined>(
    (state) => state.trading.currentTradingPair
  );

  const initialValue = useMemo(() => {
    return paddingFn(level);
  }, [level]);

  const { data, isLoading, error } = useSWR(
    () => [`/api/orderbook/${tradingPair!.symbol}}`, level],
    ([_, level]) =>
      orderlyService.api.orders
        .getOrderbook(tradingPair?.symbol!, level)
        .then((res) => {
          res.asks.reduce(accFn, { total: 0 });
          res.asks.reverse();

          if (res.asks.length < level) {
            res.asks = paddingFn(level - res.asks.length).concat(res.asks);
          }

          res.bids.reverse();
          res.bids.reduce(accFn, { total: 0 });

          if (res.bids.length < level) {
            res.bids = res.bids.concat(paddingFn(level - res.bids.length));
          }

          return res;
        }),
    {
      // errorRetryCount: 0,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      // refreshInterval: 1000,
      fallbackData: {
        asks: initialValue,
        bids: initialValue,
        mock: true,
      },
    }
  );

  return {
    asks: data?.asks ?? [],
    bids: data?.bids ?? [],
    error,
    isLoading,
  };
};
