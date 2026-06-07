import { PageTitleMap, PathEnum } from "@/constant";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { generatePageTitle } from "@/utils";
import OrdersView from "./view";

export default function OrdersPage() {
  useDocumentTitle(generatePageTitle(PageTitleMap[PathEnum.Orders]));

  return <OrdersView />;
}
