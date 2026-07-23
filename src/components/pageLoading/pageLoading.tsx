import { Spinner } from "@orderly.network/ui";
import { OrderlyTextIcon } from "@/components/icons/orderlyText";

export default function PageLoading() {
  return (
    <div
      aria-busy="true"
      className="oui-fixed oui-inset-0 oui-z-[100] oui-flex oui-items-center oui-justify-center oui-bg-base-10"
    >
      <div className="oui-flex oui-flex-col oui-items-center oui-gap-4">
        <OrderlyTextIcon className="oui-h-12 oui-w-32 oui-fill-base-contrast" />
        <Spinner size="lg" color="primary" />
      </div>
    </div>
  );
}
