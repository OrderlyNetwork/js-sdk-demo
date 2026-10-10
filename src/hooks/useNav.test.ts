import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNav } from "./useNav";

const mocks = vi.hoisted(() => ({ navigate: vi.fn(), generatePath: vi.fn() }));
vi.mock("react", () => ({ useCallback: (callback: unknown) => callback }));
vi.mock("react-router", () => ({ useNavigate: () => mocks.navigate }));
vi.mock("@orderly.network/i18n", () => ({ generatePath: mocks.generatePath }));
vi.mock("@orderly.network/portfolio", () => ({
  PortfolioLeftSidebarPath: { FeeTier: "/feeTier", ApiKey: "/apiKey" },
}));
vi.mock("@/storage", () => ({ getSymbol: () => "PERP_ETH_USDC" }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.generatePath.mockImplementation(
    ({ path }: { path: string }) => `/zh${path}?networkId=testnet`,
  );
});

describe("SDK route navigation", () => {
  it("forwards replacement and the localized URL with query parameters", () => {
    useNav().onRouteChange({
      href: "/prediction/PERP_BTC5M2608271200_USDC",
      name: "prediction",
      replace: true,
    });
    expect(mocks.generatePath).toHaveBeenCalledWith({
      path: "/prediction/PERP_BTC5M2608271200_USDC",
    });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/prediction/PERP_BTC5M2608271200_USDC?networkId=testnet",
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
    });
    expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith(
      "/zh/perp/PERP_ETH_USDC?networkId=testnet",
      { replace: true },
    );
  });
});
