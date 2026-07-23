import { useTranslation } from "@orderly.network/i18n";
import {
  ChevronLeftIcon,
  Flex,
  Text,
  useDocumentDirection,
} from "@orderly.network/ui";
import { AnnouncementCenterPage } from "@orderly.network/ui-notification";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";

export default function AnnouncementView() {
  const { t } = useTranslation();
  const { onRouteChange } = useNav();
  const direction = useDocumentDirection();
  const backToTradingLabel = t("extend.backToTrading");

  const onBack = () => {
    onRouteChange({ href: PathEnum.Root, name: t("common.trading") });
  };

  const topBar = (
    <Flex
      width="100%"
      height={44}
      px={3}
      direction="row"
      itemAlign="center"
      justify="center"
      className="oui-relative"
    >
      <button
        type="button"
        aria-label={backToTradingLabel}
        title={backToTradingLabel}
        onClick={onBack}
        className="oui-absolute oui-start-4 oui-flex oui-h-8 oui-w-8 oui-items-center oui-justify-center oui-rounded oui-text-base-contrast hover:oui-bg-base-7"
      >
        <ChevronLeftIcon
          className="oui-h-5 oui-w-5"
          style={{
            transform: direction === "rtl" ? "rotate(180deg)" : undefined,
          }}
        />
      </button>
      <Text className="oui-text-base oui-font-bold oui-text-base-contrast">
        {t("notification.centerTitle")}
      </Text>
    </Flex>
  );

  return (
    <BaseLayout
      topBar={topBar}
      classNames={{
        bottomNav: "oui-hidden",
      }}
    >
      <AnnouncementCenterPage routerAdapter={{ onRouteChange }} />
    </BaseLayout>
  );
}
