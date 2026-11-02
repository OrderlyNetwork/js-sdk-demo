import { useLocation, useParams } from "react-router";
import { useTranslation } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
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

export default function AnnouncementView() {
  const { slug } = useParams();
  const { search } = useLocation();
  const { onRouteChange } = useAppContext();
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const direction = useDocumentDirection();
  const backLabel = slug
    ? t("notification.announcements")
    : t("extend.backToTrading");

  const onBack = () => {
    const params = new URLSearchParams(search);
    params.delete("is_official");
    if (!slug) {
      params.delete("category");
      params.delete("page");
    }
    const path = slug ? PathEnum.Announcement : PathEnum.Root;
    const query = params.toString();
    onRouteChange?.({
      href: query ? `${path}?${query}` : path,
      name: backLabel,
      scope: "announcement",
    });
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
      <AnnouncementCenterPage slug={slug} />
    </BaseLayout>
  );
}
