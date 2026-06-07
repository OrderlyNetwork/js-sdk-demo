import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import MarketsView from "./view";

export default function MarketsPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Markets]));

  return <MarketsView />;
}
