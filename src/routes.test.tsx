// @vitest-environment jsdom
import type { ReactNode } from "react";
import type { RouteObject } from "react-router";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AppRoute from "./routes";

const mocks = vi.hoisted(() => ({
  createRouter: vi.fn((_routes: RouteObject[]) => ({})),
  changeLanguage: vi.fn(),
}));
vi.mock("react-router", async (importActual) => ({
  ...(await importActual<typeof import("react-router")>()),
  RouterProvider: () => <div data-testid="router" />,
}));
vi.mock("@orderly.network/i18n", () => ({
  i18n: { language: "zh", changeLanguage: mocks.changeLanguage },
  parseI18nLang: () => "zh",
  getLocalePathFromPathname: (path: string) =>
    /^\/(en|zh|tc)(\/|$)/.test(path) ? path.split("/")[1] : null,
}));
vi.mock("@/components/baseLayout", () => ({ BaseLayout: () => null }));
vi.mock("@/components/layout", () => ({
  PortfolioLayout: () => null,
  TradingRewardsLayout: () => null,
}));
vi.mock("@/components/orderlyProvider", () => ({ default: () => null }));
vi.mock("@/components/pageLoading/LazyPage", () => ({
  LazyPage: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("@/perpSymbolStorage", () => ({
  getPerpSymbol: () => "PERP_BTC_USDC",
}));
vi.mock("@/sentry", () => ({
  getSentryCreateBrowserRouter: () => mocks.createRouter,
}));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

it.each([
  ["/prediction", "/zh/predict"],
  ["/predict", "/zh/predict"],
  ["/prediction/BTC%2F5M%25", "/zh/predict/BTC%2F5M%25"],
  ["/predict/BTC%2F5M%25", "/zh/predict/BTC%2F5M%25"],
  ["/markets", "/zh/markets"],
])("normalizes %s and mounts the router immediately", (path, expected) => {
  window.history.replaceState({}, "", `${path}?network=test#orders`);
  render(<AppRoute />);
  expect(window.location.pathname).toBe(expected);
  expect(window.location.search).toBe("?network=test");
  expect(window.location.hash).toBe("#orders");
  expect(screen.getByTestId("router")).toBeTruthy();
  expect(mocks.createRouter).toHaveBeenCalledTimes(1);
  const routes = mocks.createRouter.mock.calls[0][0];
  const localeRoutes = routes
    .find((route) => route.path === "/")!
    .children!.find((route) => route.path === ":lang")!.children!;
  expect(localeRoutes.map((route) => route.path)).toEqual(
    expect.arrayContaining(["predict/:symbol?", "prediction/:symbol?"]),
  );
});

it.each(["/", "/health", "/en/predict/BTC%2F5M", "/en/prediction/BTC%2F5M"])(
  "leaves the existing entry path intact before router navigation: %s",
  (path) => {
    window.history.replaceState({}, "", `${path}?network=test#orders`);
    render(<AppRoute />);
    expect(
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
    ).toBe(`${path}?network=test#orders`);
    expect(mocks.createRouter).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("router")).toBeTruthy();
    if (path.startsWith("/en/")) {
      expect(mocks.changeLanguage).toHaveBeenCalledWith("en");
    }
  },
);
