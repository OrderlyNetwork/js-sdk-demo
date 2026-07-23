import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import VaultsView from "./view";

export default function VaultsPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Vaults]));

  return <VaultsView />;
}
