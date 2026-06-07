import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import PositionsView from "./view";

export default function PositionsPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Positions]));

  return <PositionsView />;
}
