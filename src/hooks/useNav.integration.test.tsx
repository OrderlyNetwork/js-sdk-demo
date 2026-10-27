// @vitest-environment jsdom
import type { PropsWithChildren } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { i18n } from "@orderly.network/i18n";
import { useConfigStore } from "@/components/orderlyProvider/configStore";
import { useBrokerFromUrl } from "./useBrokerFromUrl";
import { useNav } from "./useNav";

vi.mock("@orderly.network/portfolio", () => ({
  PortfolioLeftSidebarPath: { FeeTier: "/feeTier", ApiKey: "/apiKey" },
}));

beforeEach(async () => {
  await i18n.changeLanguage("en");
});
afterEach(cleanup);

it("retains the broker store and arbitrary parameters across successive referral navigations", () => {
  const initialEntry =
    "/en/portfolio?brokerId=woofi_pro&brokerName=WOOFi&campaign=autumn&feature=one&feature=two";
  // Deliberately differ from the router to catch reliance on window.location.
  window.history.replaceState({}, "", "/?stale=window");
  const wrapper = ({ children }: PropsWithChildren) => (
    <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
  );
  const { result } = renderHook(
    () => {
      const broker = useBrokerFromUrl("testnet");
      return {
        ...useNav(),
        location: useLocation(),
        store: useConfigStore({ ...broker, networkId: "testnet" }),
      };
    },
    { wrapper },
  );
  const originalStore = result.current.store;

  act(() => {
    result.current.onRouteChange({
      href: "/rewards/affiliate?tab=affiliate",
      name: "Rewards",
    });
  });
  expect(result.current.location.pathname).toBe("/en/rewards/affiliate");
  expect(result.current.location.search).toBe(
    "?brokerId=woofi_pro&brokerName=WOOFi&campaign=autumn&feature=one&feature=two&tab=affiliate",
  );
  expect(result.current.store).toBe(originalStore);
  expect(result.current.store.get("brokerId")).toBe("woofi_pro");
  expect(result.current.store.get("brokerName")).toBe("WOOFi");

  act(() => {
    result.current.onRouteChange({
      href: "/markets?tab=trader#rewards",
      name: "Markets",
    });
  });
  expect(result.current.location.pathname).toBe("/en/markets");
  expect(result.current.location.search).toBe(
    "?brokerId=woofi_pro&brokerName=WOOFi&campaign=autumn&feature=one&feature=two&tab=trader",
  );
  expect(result.current.location.hash).toBe("#rewards");
  expect(result.current.store).toBe(originalStore);
});

it("replaces announcement queries through the global adapter while retaining broker context", () => {
  const initialEntry =
    "/en/announcement/shared?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet&category=listing&page=2&is_official=true";
  window.history.replaceState({}, "", "/?stale=window");
  const { result } = renderHook(
    () => {
      const broker = useBrokerFromUrl("testnet");
      return {
        ...useNav(),
        location: useLocation(),
        store: useConfigStore({ ...broker, networkId: "testnet" }),
      };
    },
    {
      wrapper: ({ children }: PropsWithChildren) => (
        <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
      ),
    },
  );
  const originalStore = result.current.store;
  act(() =>
    result.current.onRouteChange({
      href: "/announcement?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet&category=listing&page=2",
      name: "Announcements",
      scope: "announcement",
    }),
  );
  expect(result.current.location.pathname).toBe("/en/announcement");
  expect(result.current.location.search).toBe(
    "?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet&category=listing&page=2",
  );
  expect(result.current.store).toBe(originalStore);

  act(() =>
    result.current.onRouteChange({
      href: "/announcement?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet",
      name: "All announcements",
      scope: "announcement",
    }),
  );
  expect(result.current.location.search).toBe(
    "?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet",
  );
  expect(result.current.store).toBe(originalStore);

  act(() =>
    result.current.onRouteChange({
      href: "/announcement/shared?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet&is_official=false#detail",
      name: "Platform announcement",
      scope: "announcement",
    }),
  );
  expect(result.current.location.search).toBe(
    "?brokerId=woofi_pro&brokerName=WOOFi&networkId=testnet&is_official=false",
  );
  expect(result.current.location.hash).toBe("#detail");
  expect(result.current.store).toBe(originalStore);
});
