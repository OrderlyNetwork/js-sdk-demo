import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import TradingRewardsView from "./view";

export default function TradingRewardsPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.RewardsTrading]));

  return <TradingRewardsView />;
}
