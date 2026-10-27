// @vitest-environment jsdom
import { createElement } from "react";
import { MemoryRouter } from "react-router";
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

function navigateTo(
  href: string,
  replace?: boolean,
  preserveSearchParams = true,
  scope?: string,
) {
  const { result } = renderHook(() => useNav({ preserveSearchParams }), {
    wrapper: ({ children }) =>
      createElement(
        MemoryRouter,
        { initialEntries: [window.location.pathname + window.location.search] },
        children,
      ),
  });
  result.current.onRouteChange({ href, name: href, replace, scope });
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

  it.each(["affiliate", "trader"])(
    "preserves all current parameters when opening the %s referral tab",
    (tab) => {
      window.history.replaceState(
        {},
        "",
        "/zh/portfolio?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet&campaign=autumn&feature=one&feature=two",
      );
      navigateTo(`/rewards/affiliate?tab=${tab}`);
      expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
        `/zh/rewards/affiliate?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet&campaign=autumn&feature=one&feature=two&tab=${tab}`,
        { replace: undefined },
      );
    },
  );

  it("replaces target keys with all target values, including empty values", () => {
    window.history.replaceState(
      {},
      "",
      "/zh/portfolio?campaign=autumn&tab=old&filter=old&filter=older&label=old",
    );
    navigateTo(
      "/en/rewards/affiliate?tab=trader&filter=new&filter=next&label=#referral",
      true,
    );
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/en/rewards/affiliate?campaign=autumn&tab=trader&filter=new&filter=next&label=#referral",
      { replace: true },
    );
  });

  it("preserves current parameters for an empty target query", () => {
    navigateTo("/markets?");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/markets?networkId=testnet",
      { replace: undefined },
    );
  });

  it("keeps encoded values intact when merging queries", () => {
    window.history.replaceState(
      {},
      "",
      "/zh/portfolio?brokerName=WOOFi%20Pro&context=a%26b%3Dc%2B&empty=",
    );
    navigateTo("/markets?campaign=%E7%A7%8B%E5%AD%A3");
    const [href] = mocks.navigate.mock.calls[0];
    const params = new URL(href, window.location.origin).searchParams;
    expect(Array.from(params)).toEqual([
      ["brokerName", "WOOFi Pro"],
      ["context", "a&b=c+"],
      ["empty", ""],
      ["campaign", "秋季"],
    ]);
  });

  it.each([true, false])(
    "opens external links unchanged when preservation is %s",
    (preserveSearchParams) => {
      const open = vi.spyOn(window, "open").mockReturnValue(null);
      const { result } = renderHook(() => useNav({ preserveSearchParams }), {
        wrapper: ({ children }) => createElement(MemoryRouter, null, children),
      });
      try {
        result.current.onRouteChange({
          href: "https://orderly.network/docs?section=api",
          name: "Docs",
          target: "_blank",
          scope: "announcement",
        });
        expect(open).toHaveBeenCalledExactlyOnceWith(
          "https://orderly.network/docs?section=api",
          "_blank",
          "noopener,noreferrer",
        );
        expect(mocks.navigate).not.toHaveBeenCalled();
      } finally {
        open.mockRestore();
      }
    },
  );
});

describe("announcement navigation with the installed SDK URL formatter", () => {
  function navigateToAnnouncement(href: string) {
    // The global callback recognizes complete announcement queries by scope.
    return navigateTo(href, undefined, true, "announcement");
  }

  beforeEach(() => {
    window.history.replaceState(
      {},
      "",
      "/zh/announcement?networkId=testnet&category=listing&page=2",
    );
  });

  it("switches category and removes the previous page", () => {
    navigateToAnnouncement("/announcement?networkId=testnet&category=campaign");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?networkId=testnet&category=campaign",
      { replace: undefined },
    );
  });

  it("preserves arbitrary context supplied by the SDK while removing filters", () => {
    window.history.replaceState(
      {},
      "",
      "/zh/announcement?brokerId=woofi_pro&campaign=autumn&category=listing&page=2",
    );
    navigateToAnnouncement("/announcement?brokerId=woofi_pro&campaign=autumn");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?brokerId=woofi_pro&campaign=autumn",
      { replace: undefined },
    );
  });

  it("selects all categories without restoring the old category or page", () => {
    navigateToAnnouncement("/announcement?networkId=testnet");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?networkId=testnet",
      { replace: undefined },
    );
  });

  it("allows an explicit empty query to clear all previous filters", () => {
    navigateToAnnouncement("/announcement?");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?",
      { replace: undefined },
    );
  });

  it("changes page without corrupting the category or page number", () => {
    navigateToAnnouncement(
      "/announcement?networkId=testnet&category=listing&page=3",
    );
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?networkId=testnet&category=listing&page=3",
      { replace: undefined },
    );
  });

  it("returns to page one without restoring the previous page", () => {
    navigateToAnnouncement("/announcement?networkId=testnet&category=listing");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement?networkId=testnet&category=listing",
      { replace: undefined },
    );
  });

  it.each(["/announcement/123", "/announcement"])(
    "preserves list context once when navigating to %s",
    (path) => {
      navigateToAnnouncement(
        `${path}?networkId=testnet&category=listing&page=2`,
      );
      expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
        `/zh${path}?networkId=testnet&category=listing&page=2`,
        { replace: undefined },
      );
    },
  );

  it("keeps the hash after the target query string", () => {
    navigateToAnnouncement("/announcement/123?networkId=testnet#details");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement/123?networkId=testnet#details",
      { replace: undefined },
    );
  });

  it("clears the current query and preserves the hash when no target query is supplied", () => {
    navigateToAnnouncement("/announcement/123#details");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/announcement/123?#details",
      { replace: undefined },
    );
  });

  it.each(["category=legal", "page=2", "is_official=true"])(
    "does not restore %s when the SDK supplies a query-free list URL",
    (query) => {
      window.history.replaceState({}, "", `/zh/announcement?${query}`);
      navigateToAnnouncement("/announcement");
      expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
        "/zh/announcement?",
        { replace: undefined },
      );
    },
  );

  it.each([true, false])(
    "overrides the previous official source with false when preservation is %s",
    (preserveSearchParams) => {
      window.history.replaceState(
        {},
        "",
        "/zh/announcement?networkId=testnet&is_official=true",
      );
      navigateTo(
        "/announcement/release-notes?networkId=testnet&is_official=false",
        undefined,
        preserveSearchParams,
        "announcement",
      );
      expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
        "/zh/announcement/release-notes?networkId=testnet&is_official=false",
        { replace: undefined },
      );
    },
  );

  it("preserves an existing locale prefix", () => {
    navigateToAnnouncement("/en/announcement?category=legal");
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/en/announcement?category=legal",
      { replace: undefined },
    );
  });
});
