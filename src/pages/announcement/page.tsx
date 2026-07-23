import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import AnnouncementView from "./view";

export default function AnnouncementPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Announcement]));

  return <AnnouncementView />;
}
