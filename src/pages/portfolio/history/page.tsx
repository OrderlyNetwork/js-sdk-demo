import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import HistoryView from "./view";

export default function HistoryPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.History]));

  return <HistoryView />;
}
