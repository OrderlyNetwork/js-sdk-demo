"use client";
import React from "react";
import { Dashboard, ReferralProvider } from "@orderly.network/affiliate";
import { Scaffold } from "@orderly.network/ui-scaffold";
import config from "@/config";
import { useNav } from "@/hooks/useNav";
import { Box, Flex } from "@orderly.network/ui";
export default function AffiliateView() {
  const { onRouteChange } = useNav();

  return (
    <Scaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/referral",
      }}
      footerProps={config.scaffold.footerProps}
      routerAdapter={{
        onRouteChange,
        currentPath: "/referral",
      }}
    >
      <ReferralProvider
        becomeAnAffiliateUrl="https://orderly.network"
        learnAffiliateUrl="https://orderly.network"
        referralLinkUrl="https://ordely.network"
        showReferralPage={() => {
          console.log("show referral page");
        }}
        splashPage={() => <div style={{ backgroundColor: "#FF0000" }}>df</div>}
        overwrite={{
          shortBrokerName: "Orderly",
          brokerName: "Orderly",
          ref: {
            // top: (state) =>  (<div>ASD</div>),
            // card: (state) => (<div>GFHJK</div>)
            // card: {
            // refClassName: "orderly-text-red-900",
            // refIcon: (<div className="orderly-bg-white orderly-h-full">DDS</div>),
            // ref: (state) => (<div>gdjsj</div>)
            // traderClassName: "orderly-text-red-900",
            // traderIcon: (<div className="orderly-bg-white orderly-h-full">DDS</div>),
            // trader: (state) => (<div>gdjsj</div>)
            // },
            // step: (state) => (<div>DJD</div>)
            // step: {
            //   applyIcon: (<div>Apply</div>),
            //   shareIcon: (<div>Share</div>),
            //   earnIcon: (<div>Earn</div>),
            // }
          },
        }}
      >
        <Dashboard.DashboardPage
          classNames={{
            root: "oui-flex oui-justify-center",
            home: "oui-py-6 oui-px-4 lg:oui-px-6 lg:oui-py-12 xl:oui-pl-4 xl:oui-pr-6 oui-w-full",
            dashboard: "oui-py-6 oui-px-4 lg:oui-px-6 xl:oui-pl-3 xl:oui-pr-6",
          }}
        />
      </ReferralProvider>
    </Scaffold>
  );
}
