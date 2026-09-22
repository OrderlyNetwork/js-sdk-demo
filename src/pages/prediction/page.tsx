import { PredictionPage as PredictionMarketPage } from "@orderly.network/prediction";
import { BaseLayout } from "@/components/baseLayout";
import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";

export default function PredictionPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Prediction]));

  return (
    <BaseLayout initialMenu={PathEnum.Root}>
      <PredictionMarketPage />
    </BaseLayout>
  );
}
