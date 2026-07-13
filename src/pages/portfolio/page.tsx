import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import PortfolioView from "./view";

export default function PortfolioPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Portfolio]));

  return <PortfolioView />;
}
