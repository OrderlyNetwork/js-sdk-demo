import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import LeaderboardView from "./view";

export default function LeaderboardPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Leaderboard]));

  return <LeaderboardView />;
}
