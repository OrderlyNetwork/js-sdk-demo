import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import AssetsView from "./view";

export default function AssetsPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Assets]));

  return <AssetsView />;
}
