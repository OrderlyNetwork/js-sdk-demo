import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import APIKeyView from "./view";

export default function APIKeyPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.ApiKey]));

  return <APIKeyView />;
}
