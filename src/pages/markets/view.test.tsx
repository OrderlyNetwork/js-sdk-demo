// @vitest-environment jsdom
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { i18n } from "@orderly.network/i18n";
import type { API } from "@orderly.network/types";
import MarketsView from "./view";

const mocks = vi.hoisted(() => ({ setPerpSymbol: vi.fn() }));

vi.mock("@orderly.network/markets", () => ({
  MarketsHomePage: ({
    onSymbolChange,
  }: {
    onSymbolChange?: (symbol: API.Symbol) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        onSymbolChange?.({ symbol: "PERP_BTC_USDC" } as API.Symbol)
      }
    >
      PERP_BTC_USDC
    </button>
  ),
}));
vi.mock("@orderly.network/portfolio", () => ({
  PortfolioLeftSidebarPath: { FeeTier: "/feeTier", ApiKey: "/apiKey" },
}));
vi.mock("@/perpSymbolStorage", () => ({
  getPerpSymbol: () => "PERP_ETH_USDC",
  setPerpSymbol: mocks.setPerpSymbol,
}));

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">{`${location.pathname}${location.search}`}</div>
  );
}

beforeEach(async () => {
  mocks.setPerpSymbol.mockClear();
  window.history.replaceState({}, "", "/en/markets?networkId=testnet");
  await i18n.changeLanguage("en");
});

afterEach(cleanup);

describe("MarketsView", () => {
  it("opens the trading page for the selected symbol", () => {
    render(
      <MemoryRouter initialEntries={["/en/markets?networkId=testnet"]}>
        <Routes>
          <Route
            path="/:lang/markets"
            element={
              <>
                <MarketsView />
                <LocationProbe />
              </>
            }
          />
          <Route path="/:lang/perp/:symbol" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "PERP_BTC_USDC" }));

    expect(mocks.setPerpSymbol).toHaveBeenCalledExactlyOnceWith(
      "PERP_BTC_USDC",
    );
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/en/perp/PERP_BTC_USDC?networkId=testnet",
    );
  });
});
