// @vitest-environment jsdom
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { i18n } from "@orderly.network/i18n";
import { useNav } from "./useNav";

const mocks = vi.hoisted(() => ({ navigate: vi.fn() }));
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => mocks.navigate,
}));
vi.mock("@orderly.network/portfolio", () => ({
  PortfolioLeftSidebarPath: { FeeTier: "/feeTier", ApiKey: "/apiKey" },
}));
vi.mock("@/perpSymbolStorage", () => ({
  getPerpSymbol: () => "PERP_ETH_USDC",
}));

beforeEach(async () => {
  vi.clearAllMocks();
  window.history.replaceState(
    {},
    "",
    "/zh/perp/PERP_ETH_USDC?networkId=testnet",
  );
  await i18n.changeLanguage("zh");
});

afterEach(cleanup);

function navigateTo(href: string, replace?: boolean) {
  const { result } = renderHook(useNav);
  result.current.onRouteChange({ href, name: href, replace });
}

describe("SDK route navigation", () => {
  it("forwards replacement and the localized URL with query parameters", () => {
    navigateTo("/prediction/PERP_BTC5M2608271200_USDC", true);
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/prediction/PERP_BTC5M2608271200_USDC?networkId=testnet",
      { replace: true },
    );
  });

  it("keeps ordinary market selection as normal navigation", () => {
    navigateTo("/perp/PERP_BTC_USDC");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/perp/PERP_BTC_USDC?networkId=testnet",
      { replace: undefined },
    );
  });

  it("retains the stored trading symbol for root navigation", () => {
    navigateTo("/", true);
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/perp/PERP_ETH_USDC?networkId=testnet",
      { replace: true },
    );
  });

  it("maps portfolio aliases before applying query parameters and hash", () => {
    navigateTo("/feeTier?networkId=mainnet#fees");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/portfolio/fee?networkId=mainnet#fees",
      { replace: undefined },
    );
  });
});

describe("announcement navigation with the installed SDK URL formatter", () => {
  beforeEach(() => {
    window.history.replaceState(
      {},
      "",
      "/zh/announcement?networkId=testnet&category=listing&page=2",
    );
  });

  it("switches category and removes the previous page", () => {
    navigateTo("/announcement?networkId=testnet&category=campaign");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?networkId=testnet&category=campaign",
      { replace: undefined },
    );
  });

  it("selects all categories without restoring the old category or page", () => {
    navigateTo("/announcement?networkId=testnet");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?networkId=testnet",
      { replace: undefined },
    );
  });

  it("allows an explicit empty query to clear all previous filters", () => {
    navigateTo("/announcement?");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?",
      { replace: undefined },
    );
  });

  it("changes page without corrupting the category or page number", () => {
    navigateTo("/announcement?networkId=testnet&category=listing&page=3");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?networkId=testnet&category=listing&page=3",
      { replace: undefined },
    );
  });

  it("returns to page one without restoring the previous page", () => {
    navigateTo("/announcement?networkId=testnet&category=listing");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?networkId=testnet&category=listing",
      { replace: undefined },
    );
  });

  it.each(["/announcement/123", "/announcement"])(
    "preserves list context once when navigating to %s",
    (path) => {
      navigateTo(`${path}?networkId=testnet&category=listing&page=2`);
      expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
        `/zh${path}?networkId=testnet&category=listing&page=2`,
        { replace: undefined },
      );
    },
  );

  it("keeps the hash after the target query string", () => {
    navigateTo("/announcement/123?networkId=testnet#details");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement/123?networkId=testnet#details",
      { replace: undefined },
    );
  });

  it("inherits the current query before the hash when none is supplied", () => {
    navigateTo("/announcement/123#details");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement/123?networkId=testnet&category=listing&page=2#details",
      { replace: undefined },
    );
  });

  it("preserves an existing locale prefix", () => {
    navigateTo("/en/announcement?category=legal");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/en/announcement?category=legal",
      { replace: undefined },
    );
  });
});
