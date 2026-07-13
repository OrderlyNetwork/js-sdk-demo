import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import FeeTierView from "./view";

export default function FeeTierPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.FeeTier]));

  return <FeeTierView />;
}
