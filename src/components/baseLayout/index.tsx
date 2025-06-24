"use client";
import { FC, ReactNode } from "react";
import { Scaffold, ScaffoldProps } from "@orderly.network/ui-scaffold";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { useNav } from "@/hooks/useNav";
import { PathEnum } from "@/constant";

export type BaseLayoutProps = {
  children: React.ReactNode;
  initialMenu?: string;
  classNames?: ScaffoldProps["classNames"];
  topBar?: ReactNode;
};

export const BaseLayout: FC<BaseLayoutProps> = (props) => {
  const config = useOrderlyConfig();

  const { onRouteChange, campaigns } = useNav();

  return (
    <Scaffold
      topBar={props.topBar}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: props.initialMenu || PathEnum.Root,
        campaigns,
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
