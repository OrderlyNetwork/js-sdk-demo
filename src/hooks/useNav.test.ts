// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNav } from "./useNav";

const mocks = vi.hoisted(() => ({ navigate: vi.fn(), generatePath: vi.fn() }));
vi.mock("react", () => ({ useCallback: (callback: unknown) => callback }));
vi.mock("react-router", () => ({ useNavigate: () => mocks.navigate }));
vi.mock("@orderly.network/i18n", () => ({
  generatePath: mocks.generatePath,
  getLocalePathFromPathname: (path: string) =>
    ["en", "zh", "tc"].includes(path.split("/")[1]) ? path.split("/")[1] : null,
}));
vi.mock("@orderly.network/portfolio", () => ({
  PortfolioLeftSidebarPath: { FeeTier: "/feeTier", ApiKey: "/apiKey" },
}));
vi.mock("@/perpSymbolStorage", () => ({
  getPerpSymbol: () => "PERP_ETH_USDC",
}));

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState({}, "", "/zh/markets?networkId=testnet");
  mocks.generatePath.mockImplementation(
    ({ path, locale, search }) =>
      `${/^\/(en|zh|tc)(\/|$)/.test(path) ? "" : `/${locale ?? "zh"}`}${path}${search ?? window.location.search}`,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SDK route navigation", () => {
  it("forwards replacement and the localized URL with query parameters", () => {
    useNav().onRouteChange({
      href: "/prediction/PERP_BTC5M2608271200_USDC",
      name: "prediction",
      replace: true,
    });
    expect(mocks.generatePath).toHaveBeenCalledWith({
      path: "/predict/PERP_BTC5M2608271200_USDC",
      locale: "zh",
    });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/predict/PERP_BTC5M2608271200_USDC?networkId=testnet",
      { replace: true },
    );
  });

  it("keeps ordinary market selection as normal navigation", () => {
    useNav().onRouteChange({ href: "/perp/PERP_BTC_USDC", name: "perps" });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/perp/PERP_BTC_USDC?networkId=testnet",
      { replace: undefined },
    );
  });

  it("retains the stored trading symbol for root navigation", () => {
    useNav().onRouteChange({ href: "/", name: "perps", replace: true });
    expect(mocks.generatePath).toHaveBeenCalledWith({
      path: "/perp/PERP_ETH_USDC",
      locale: "zh",
    });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/perp/PERP_ETH_USDC?networkId=testnet",
      { replace: true },
    );
  });

  it("preserves explicit query and hash on legacy navigation", () => {
    window.history.replaceState(
      {},
      "",
      "/zh/markets?networkId=testnet#positions",
    );
    useNav().onRouteChange({
      href: "/prediction/BTC%2F5M%25?network=main#orders#details",
      name: "prediction",
    });
    expect(mocks.generatePath).toHaveBeenCalledWith({
      path: "/predict/BTC%2F5M%25",
      locale: "zh",
      search: "?network=main",
    });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/predict/BTC%2F5M%25?network=main#orders#details",
      { replace: undefined },
    );
  });

  it("inherits the query and hash when the destination omits them", () => {
    window.history.replaceState(
      {},
      "",
      "/zh/markets?networkId=testnet#positions",
    );
    useNav().onRouteChange({ href: "/prediction", name: "prediction" });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/predict?networkId=testnet#positions",
      { replace: undefined },
    );
  });

  it("uses the language of the current direct URL", () => {
    window.history.replaceState({}, "", "/tc/predict?network=test#orders");
    useNav().onRouteChange({ href: "/prediction/BTC", name: "prediction" });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/tc/predict/BTC?network=test#orders",
      { replace: undefined },
    );
  });

  it("keeps an explicit destination language", () => {
    useNav().onRouteChange({
      href: "/en/prediction/BTC%2F5M?network=main#orders",
      name: "prediction",
    });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/en/predict/BTC%2F5M?network=main#orders",
      { replace: undefined },
    );
  });

  it("supports query and hash suffixes on the default Perps destination", () => {
    useNav().onRouteChange({ href: "/?network=main#orders", name: "perps" });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/perp/PERP_ETH_USDC?network=main#orders",
      { replace: undefined },
    );
  });

  it.each([
    ["/feeTier", "/portfolio/fee"],
    ["/apiKey", "/portfolio/api-key"],
  ])("retains Portfolio mapping for %s", (href, path) => {
    useNav().onRouteChange({ href, name: "portfolio" });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      `/zh${path}?networkId=testnet`,
      { replace: undefined },
    );
  });

  it("opens external links with the existing window isolation", () => {
    const openedWindow = { opener: {} };
    const open = vi
      .spyOn(window, "open")
      .mockReturnValue(openedWindow as Window);
    useNav().onRouteChange({
      href: "https://example.com/prediction?x=1#orders",
      name: "external",
      target: "_blank",
    });
    expect(open).toHaveBeenCalledExactlyOnceWith(
      "https://example.com/prediction?x=1#orders",
      "_blank",
      "noopener,noreferrer",
    );
    expect(openedWindow.opener).toBeNull();
    expect(mocks.generatePath).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("ignores external links with unsupported protocols", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    useNav().onRouteChange({
      href: "javascript:void(0)",
      name: "external",
      target: "_blank",
    });
    expect(open).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
