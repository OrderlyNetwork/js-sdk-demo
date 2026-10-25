// @vitest-environment jsdom
// TradeSubMenu is rendered inside a MemoryRouter so router params and path
// parsing run for real; the SDK widget is stubbed to capture its props.
import { MemoryRouter, Route, Routes } from "react-router";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { TradeSubMenuWidgetProps } from "@orderly.network/markets";
import { TradeSubMenu } from "./customTradeSubMenu";
import { getTradeSubMenuTab } from "./tradeSubMenuTab";

const mocks = vi.hoisted(() => ({
  widget: vi.fn<(props: TradeSubMenuWidgetProps) => null>(() => null),
}));
vi.mock("@orderly.network/markets", () => ({
  PERPS_TRADE_SUB_MENU_KEY: "perps",
  PREDICTION_TRADE_SUB_MENU_KEY: "prediction",
  TradeSubMenuWidget: mocks.widget,
}));

function renderMenu(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/perp/:symbol" element={<TradeSubMenu />} />
        <Route path="/prediction/:symbol?" element={<TradeSubMenu />} />
        <Route path="*" element={<TradeSubMenu />} />
      </Routes>
    </MemoryRouter>,
  );
  const props = mocks.widget.mock.calls.at(-1)?.[0];
  if (!props) throw new Error("TradeSubMenuWidget was not rendered");
  return props;
}

afterEach(() => {
  cleanup();
  mocks.widget.mockClear();
});

describe("getTradeSubMenuTab", () => {
  it.each(["/prediction", "/prediction/PERP_BTC5M2608271200_USDC"])(
    "treats %s as the prediction tab",
    (path) => {
      expect(getTradeSubMenuTab(path)).toBe("prediction");
    },
  );

  it.each([
    "/perp/PERP_BTC_USDC",
    "/markets",
    "/predictions",
    "/portfolio/prediction",
  ])("treats %s as the perps tab", (path) => {
    expect(getTradeSubMenuTab(path)).toBe("perps");
  });
});

describe("TradeSubMenu", () => {
  it("passes the perps route symbol", () => {
    const props = renderMenu("/perp/PERP_BTC_USDC");
    expect(props.activeKey).toBe("perps");
    expect(props.symbol).toBe("PERP_BTC_USDC");
    expect(props.defaultSymbol).toBe("PERP_ETH_USDC");
  });

  it("passes the prediction round symbol for the widget to ignore", () => {
    const props = renderMenu("/prediction/PERP_BTC5M2608271200_USDC");
    expect(props.activeKey).toBe("prediction");
    expect(props.symbol).toBe("PERP_BTC5M2608271200_USDC");
  });

  it("leaves the symbol to the widget on routes without one", () => {
    const props = renderMenu("/markets");
    expect(props.activeKey).toBe("perps");
    expect(props.symbol).toBeUndefined();
  });

  it("uses the built-in entries without customization", () => {
    const props = renderMenu("/perp/PERP_BTC_USDC");
    expect(props.items).toBeUndefined();
  });
});
