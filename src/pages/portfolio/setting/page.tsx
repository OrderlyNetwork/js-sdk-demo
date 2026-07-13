import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import SettingsView from "./view";

export default function SettingsPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Setting]));

  return <SettingsView />;
}
