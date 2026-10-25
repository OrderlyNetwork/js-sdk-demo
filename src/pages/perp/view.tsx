import { useEffect } from "react";
import { TradingPage, type TradingPageProps } from "@orderly.network/trading";
import { BaseLayout } from "@/components/baseLayout";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { setPerpSymbol } from "@/perpSymbolStorage";

export type PerpViewProps = Pick<TradingPageProps, "symbol">;

export default function PerpView(props: PerpViewProps) {
  const config = useOrderlyConfig();
  useEffect(() => {
    setPerpSymbol(props.symbol);
  }, [props.symbol]);

  return (
    <BaseLayout>
      <TradingPage
        symbol={props.symbol}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </BaseLayout>
  );
}
