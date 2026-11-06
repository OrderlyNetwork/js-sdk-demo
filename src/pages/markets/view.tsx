import { useCallback } from "react";
import { MarketsHomePage } from "@orderly.network/markets";
import { API, perpRoute } from "@orderly.network/types";
import { useNav } from "@/hooks/useNav";
import { setPerpSymbol } from "@/perpSymbolStorage";

export default function MarketsView() {
  const { onRouteChange } = useNav();

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setPerpSymbol(symbol);
      onRouteChange(perpRoute(symbol));
    },
    [onRouteChange],
  );

  return <MarketsHomePage onSymbolChange={onSymbolChange} />;
}
