import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useTranslation } from "@orderly.network/i18n";
import { SubMenuMarketsWidget } from "@orderly.network/markets";
import { API } from "@orderly.network/types";
import {
  TradingActiveIcon,
  TradingInactiveIcon,
  PredictionIcon,
} from "@orderly.network/ui";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";
import { DEFAULT_SYMBOL, getSymbol, updateSymbol } from "@/storage";
import { MenuItemRow } from "./SubMenuComponents";

type TradeSubMenuTab = "perps" | "prediction";

function getTradeSubMenuTab(pathname: string): TradeSubMenuTab {
  return pathname.includes(PathEnum.Prediction) ? "prediction" : "perps";
}

const RIGHT_SECTION_WRAPPER_CLASSNAME = [
  "oui-overflow-hidden",
  "oui-transition-[width,height] oui-duration-120 oui-ease-out",
  "data-[state=open]:oui-w-[280px] data-[state=closed]:oui-w-0",
  "data-[state=open]:oui-h-[423px] data-[state=closed]:oui-h-0",
  "data-[state=closed]:oui-pointer-events-none",
].join(" ");

const RIGHT_SECTION_ANIMATION_CLASSNAME = [
  "oui-origin-top-left",
  "data-[state=open]:oui-animate-in data-[state=closed]:oui-animate-out",
  "data-[state=open]:oui-fade-in-0 data-[state=closed]:oui-fade-out-0",
  "data-[state=open]:oui-zoom-in-95 data-[state=closed]:oui-zoom-out-95",
  "data-[state=open]:oui-slide-in-from-top-2",
  "data-[state=open]:oui-slide-in-from-left-2",
].join(" ");

const LeftSection = (props: {
  selectedTab: TradeSubMenuTab;
  onSelect: (tab: TradeSubMenuTab) => void;
  onPerpsClick: () => void;
  onPredictionClick: () => void;
  onHoverTab: (tab: "perps" | null) => void;
}) => {
  const { selectedTab, onSelect, onPerpsClick, onPredictionClick, onHoverTab } =
    props;
  const { t } = useTranslation();

  const menus = [
    {
      key: "perps" as const,
      activeIcon: <TradingActiveIcon size={20} />,
      inactiveIcon: <TradingInactiveIcon size={20} />,
      title: t("extend.perps"),
      description: t("extend.perps.description"),
      onClick: () => {
        onSelect("perps");
        onPerpsClick();
      },
      onMouseEnter: () => {
        onHoverTab("perps");
      },
    },
    {
      key: "prediction" as const,
      activeIcon: <PredictionIcon active size={20} />,
      inactiveIcon: <PredictionIcon size={20} />,
      title: t("prediction.title"),
      description: t("prediction.description"),
      onClick: () => {
        onSelect("prediction");
        onPredictionClick();
      },
    },
  ];

  return (
    <div className="oui-w-[240px] oui-flex-shrink-0 oui-rounded-lg">
      {menus.map((menu) => {
        const isActive = selectedTab === menu.key;
        return (
          <MenuItemRow
            key={menu.key}
            activeIcon={isActive ? menu.activeIcon : menu.inactiveIcon}
            title={menu.title}
            description={menu.description}
            onClick={menu.onClick}
            onMouseEnter={
              menu.onMouseEnter ??
              (() => {
                onHoverTab(null);
              })
            }
            isActive={isActive}
            showArrow={true}
          />
        );
      })}
    </div>
  );
};

const RightSection = (props: { className?: string }) => {
  const { className } = props;
  const params = useParams();
  const { onRouteChange } = useNav();
  const [symbol, setSymbol] = useState<string>(params.symbol || DEFAULT_SYMBOL);

  useEffect(() => {
    const next = params.symbol || DEFAULT_SYMBOL;
    if (next !== symbol) setSymbol(next);
  }, [params.symbol, symbol]);

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const nextSymbol = data.symbol;
      setSymbol(nextSymbol);
      onRouteChange({
        href: `${PathEnum.Perp}/${nextSymbol}`,
        name: "perps",
      });
    },
    [onRouteChange],
  );

  return (
    <div className={className}>
      <SubMenuMarketsWidget
        className="oui-rounded-md oui-p-2"
        symbol={symbol}
        onSymbolChange={onSymbolChange}
      />
    </div>
  );
};

export const customTradeSubMenuRender = () => {
  return () => {
    const { pathname } = useLocation();
    const [selectedTab, setSelectedTab] = useState<TradeSubMenuTab>(() =>
      getTradeSubMenuTab(pathname),
    );
    const [hoverTab, setHoverTab] = useState<"perps" | null>(null);
    const { onRouteChange } = useNav();

    const handlePerpsClick = () => {
      onRouteChange({
        href: `${PathEnum.Perp}/${getSymbol() || DEFAULT_SYMBOL}`,
        name: "perps",
      });
    };

    const handlePredictionClick = () => {
      onRouteChange({
        href: PathEnum.Prediction,
        name: "prediction",
      });
    };

    useEffect(() => {
      setSelectedTab(getTradeSubMenuTab(pathname));
    }, [pathname]);

    const showPerpsRightSection =
      selectedTab === "perps" || hoverTab === "perps";
    const rightSectionState = showPerpsRightSection ? "open" : "closed";

    return (
      <div
        className="oui-flex oui-p-1 oui-bg-base-8 oui-rounded-lg oui-border oui-border-line-6"
        onMouseLeave={() => {
          setHoverTab(null);
        }}
      >
        <LeftSection
          selectedTab={selectedTab}
          onSelect={setSelectedTab}
          onPerpsClick={handlePerpsClick}
          onPredictionClick={handlePredictionClick}
          onHoverTab={setHoverTab}
        />
        <div
          className={RIGHT_SECTION_WRAPPER_CLASSNAME}
          onMouseEnter={() => {
            setHoverTab("perps");
          }}
          data-state={rightSectionState}
        >
          <div
            className={RIGHT_SECTION_ANIMATION_CLASSNAME}
            data-state={rightSectionState}
          >
            <RightSection className="oui-w-[280px] oui-h-[423px] oui-ml-1" />
          </div>
        </div>
      </div>
    );
  };
};
