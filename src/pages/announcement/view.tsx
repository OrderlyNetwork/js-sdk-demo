import { useLocation, useParams } from "react-router";
import { useTranslation } from "@orderly.network/i18n";
import {
  ChevronLeftIcon,
  Flex,
  Text,
  useDocumentDirection,
  useScreen,
} from "@orderly.network/ui";
import { AnnouncementCenterPage } from "@orderly.network/ui-notification";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";

export default function AnnouncementView() {
  const { announcementId } = useParams();
  const { search } = useLocation();
  // The announcement SDK supplies the full query, including filter removals.
  const { onRouteChange } = useNav({ preserveSearchParams: false });
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const direction = useDocumentDirection();
  const backLabel = announcementId
    ? t("notification.announcements")
    : t("extend.backToTrading");

  const onBack = () => {
    const params = new URLSearchParams(search);
    if (!announcementId) {
      params.delete("category");
      params.delete("page");
    }
    const path = announcementId ? PathEnum.Announcement : PathEnum.Root;
    onRouteChange({ href: `${path}?${params.toString()}`, name: backLabel });
  };

  const topBar = isMobile ? (
    <Flex
      role="navigation"
      aria-label={t("notification.announcements")}
      width="100%"
      height={44}
      px={3}
      itemAlign="center"
      justify="center"
      className="oui-relative"
    >
      <button
        type="button"
        aria-label={backLabel}
        title={backLabel}
        onClick={onBack}
        className="oui-absolute oui-start-4 oui-flex oui-size-8 oui-items-center oui-justify-center oui-rounded oui-text-base-contrast-54"
      >
        <ChevronLeftIcon
          size={24}
          color="inherit"
          opacity={1}
          style={{
            transform: direction === "rtl" ? "rotate(180deg)" : undefined,
          }}
        />
      </button>
      <Text className="oui-text-base oui-font-bold oui-text-base-contrast">
        {t("notification.announcements")}
      </Text>
    </Flex>
  ) : undefined;

  return (
    <BaseLayout
      initialMenu={PathEnum.Announcement}
      topBar={topBar}
      classNames={{
        root: "lg:oui-overflow-y-scroll",
        content: isMobile
          ? "[&_.oui-announcement-center>h1]:oui-hidden [&_.oui-announcement-center]:oui-pt-0 [&_.oui-announcement-center>div]:oui-mt-0 [&_.oui-announcement-categories]:oui-py-2"
          : undefined,
      }}
    >
      <AnnouncementCenterPage
        announcementId={announcementId}
        routerAdapter={{ onRouteChange }}
      />
    </BaseLayout>
  );
}
