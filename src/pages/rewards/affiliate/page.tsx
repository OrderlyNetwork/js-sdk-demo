import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import AffiliateView from "./view";

export default function AffiliatePage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.RewardsAffiliate]));

  return <AffiliateView />;
}
