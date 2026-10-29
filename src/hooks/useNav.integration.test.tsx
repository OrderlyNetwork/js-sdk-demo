// @vitest-environment jsdom
import type { PropsWithChildren } from "react";
import { MemoryRouter, useLocation, useNavigate } from "react-router";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { i18n } from "@orderly.network/i18n";
import {
  appTargetConfig,
  appTargetConfigMap,
} from "@/components/orderlyConfig/appTargetConfig";
import { useConfigStore } from "@/components/orderlyProvider/configStore";
import { useAnnouncementFromUrl } from "./useAnnouncementFromUrl";
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

it.each(["demo", "dmm"] as const)(
  "applies announcement URL configuration for %s without rebuilding the broker store",
  (target) => {
    const defaults = appTargetConfigMap[target].widgetConfigs ?? {};
    window.history.replaceState({}, "", "/?excludeOfficial=false&stale=window");
    const { result, rerender } = renderHook(
      ({ networkId }) => {
        const broker = useBrokerFromUrl(networkId);
        return {
          ...useNav(),
          navigate: useNavigate(),
          location: useLocation(),
          widgets: useAnnouncementFromUrl(networkId, defaults),
          store: useConfigStore({ ...broker, networkId }),
        };
      },
      {
        initialProps: { networkId: "testnet" as "testnet" | "mainnet" },
        wrapper: ({ children }: PropsWithChildren) => (
          <MemoryRouter
            initialEntries={[
              "/en/markets?brokerId=woofi_pro&brokerName=WOOFi&excludeOfficial=true&campaign=autumn",
            ]}
          >
            {children}
          </MemoryRouter>
        ),
      },
    );
    const originalStore = result.current.store;
    expect(result.current.widgets.announcement?.excludeOfficial).toBe(true);
    expect(result.current.widgets.subAccount).toEqual(defaults?.subAccount);
    expect(defaults?.announcement).toBeUndefined();
    if (target === "dmm")
      expect(result.current.widgets.subAccount?.maxSubAccountCount).toBe(9999);

    act(() =>
      result.current.onRouteChange({
        href: "/portfolio?tab=history",
        name: "Portfolio",
      }),
    );
    expect(
      new URLSearchParams(result.current.location.search).get(
        "excludeOfficial",
      ),
    ).toBe("true");
    expect(result.current.widgets.announcement?.excludeOfficial).toBe(true);
    expect(result.current.store).toBe(originalStore);

    act(() =>
      result.current.onRouteChange({
        href: "/markets?excludeOfficial=false",
        name: "Markets",
      }),
    );
    expect(result.current.widgets.announcement?.excludeOfficial).toBe(false);
    expect(result.current.store).toBe(originalStore);

    act(() =>
      result.current.onRouteChange({
        href: "/announcement?brokerId=woofi_pro&brokerName=WOOFi&excludeOfficial=true&category=legal&page=2",
        name: "Announcements",
        scope: "announcement",
      }),
    );
    expect(result.current.widgets.announcement?.excludeOfficial).toBe(true);
    expect(
      new URLSearchParams(result.current.location.search).get("page"),
    ).toBe("2");
    expect(result.current.store).toBe(originalStore);

    rerender({ networkId: "mainnet" });
    expect(result.current.widgets.announcement?.excludeOfficial).toBe(false);
    expect(result.current.store.get("brokerId")).toBe(appTargetConfig.brokerId);
    rerender({ networkId: "testnet" });
    expect(result.current.widgets.announcement?.excludeOfficial).toBe(true);

    const currentStore = result.current.store;
    act(() =>
      result.current.navigate(
        "/en/announcement?brokerId=woofi_pro&brokerName=WOOFi",
      ),
    );
    expect(result.current.widgets.announcement?.excludeOfficial).toBe(false);
    expect(result.current.widgets.subAccount).toEqual(defaults?.subAccount);
    expect(result.current.store).toBe(currentStore);
  },
);

it("preserves nested announcement and target settings without mutating defaults", () => {
  const defaults = {
    subAccount: { maxSubAccountCount: 9999 },
    announcement: { excludeOfficial: true, customOption: "preserved" },
  };
  const { result } = renderHook(
    () => useAnnouncementFromUrl("testnet", defaults),
    {
      wrapper: ({ children }: PropsWithChildren) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    },
  );
  expect(result.current).toEqual({
    subAccount: { maxSubAccountCount: 9999 },
    announcement: { excludeOfficial: false, customOption: "preserved" },
  });
  expect(defaults.announcement.excludeOfficial).toBe(true);
  expect(result.current.subAccount).toBe(defaults.subAccount);
});
