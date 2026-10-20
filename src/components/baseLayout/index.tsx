import { FC, ReactNode } from "react";
import { useAnnouncementPrototype } from "@orderly.network/ui-notification";
import { Scaffold, ScaffoldProps } from "@orderly.network/ui-scaffold";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";

export type BaseLayoutProps = {
  children: React.ReactNode;
  initialMenu?: string;
  classNames?: ScaffoldProps["classNames"];
  topBar?: ReactNode;
};

export const BaseLayout: FC<BaseLayoutProps> = (props) => {
  const config = useOrderlyConfig();
  const announcementPrototype = useAnnouncementPrototype();
  const { onRouteChange } = useNav();

  return (
    <Scaffold
      announcementState={announcementPrototype?.scaffoldState}
      topBar={props.topBar}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: props.initialMenu || PathEnum.Root,
      }}
      footerProps={config.scaffold.footerProps}
      routerAdapter={{
        onRouteChange,
      }}
      classNames={props.classNames}
      bottomNavProps={config.scaffold.bottomNavProps}
    >
      {props.children}
    </Scaffold>
  );
};
