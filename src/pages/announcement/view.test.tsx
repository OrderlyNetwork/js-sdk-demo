// @vitest-environment jsdom
import type { PropsWithChildren, ReactNode } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { createRequire } from "node:module";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultNS, i18n } from "@orderly.network/i18n";
import { AnnouncementCenterPage } from "@orderly.network/ui-notification";
import type { ScaffoldProps } from "@orderly.network/ui-scaffold";
import { useNav } from "@/hooks/useNav";
import extendEnLocale from "@/locales/en.json";
import AnnouncementView from "./view";

const mocks = vi.hoisted(() => ({ isMobile: true }));
const require = createRequire(import.meta.url);

vi.mock("@orderly.network/react-app", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@orderly.network/react-app")>()),
  // Model the callback installed once on OrderlyAppProvider by the host.
  useAppContext: () => ({
    wrongNetwork: false,
    disabledConnect: false,
    ...useNav(),
  }),
}));

vi.mock("@orderly.network/ui", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@orderly.network/ui")>()),
  useScreen: () => ({ isMobile: mocks.isMobile, isDesktop: !mocks.isMobile }),
}));
vi.mock("@orderly.network/portfolio", () => ({
  PortfolioLeftSidebarPath: { FeeTier: "/feeTier", ApiKey: "/apiKey" },
}));
vi.mock("@/perpSymbolStorage", () => ({
  getPerpSymbol: () => "PERP_ETH_USDC",
}));
vi.mock("@/components/layout/customTradeSubMenu", () => ({
  TradeSubMenu: () => null,
}));
vi.mock("@/components/layout/useCustomRender", () => ({
  useCustomRender:
    () =>
    ({ title, leftNav }: { title?: ReactNode; leftNav?: ReactNode }) => (
      <nav aria-label="Main navigation">
        {leftNav && <button type="button">Menu</button>}
        {title}
      </nav>
    ),
}));
vi.mock("@orderly.network/ui-scaffold", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@orderly.network/ui-scaffold")>();
  return {
    ...actual,
    // Keep the installed SDK's menu matching and mobile header behavior real.
    Scaffold: ({
      mainNavProps,
      routerAdapter,
      topBar,
      children,
    }: PropsWithChildren<ScaffoldProps>) => (
      <>
        {mocks.isMobile &&
          (topBar ?? (
            <actual.MainNavMobile
              {...mainNavProps}
              routerAdapter={routerAdapter}
            />
          ))}
        {children}
      </>
    ),
  };
});
vi.mock("@orderly.network/ui-notification", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@orderly.network/ui-notification")
  >()),
  AnnouncementCenterPage: vi.fn(({ slug }: { slug?: string }) => (
    <main>{slug ? `Article ${slug}` : "Announcement list"}</main>
  )),
}));

function Location() {
  const { pathname, search } = useLocation();
  return (
    <output data-testid="location">
      {pathname}
      {search}
    </output>
  );
}

function renderPage(path: string) {
  window.history.replaceState({}, "", path);
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/:lang/announcement/:slug?"
          element={<AnnouncementView />}
        />
        <Route path="/:lang/perp/:symbol" element={<main>Trading</main>} />
      </Routes>
      <Location />
    </MemoryRouter>,
  );
}

beforeEach(async () => {
  vi.clearAllMocks();
  mocks.isMobile = true;
  // The installed Scaffold uses CommonJS dependencies, which bypass vi.mock.
  vi.spyOn(require("@orderly.network/hooks"), "useAccount").mockReturnValue({
    state: { status: 0 },
    isMainAccount: true,
  });
  vi.spyOn(
    require("@orderly.network/react-app"),
    "useAppContext",
  ).mockReturnValue({
    wrongNetwork: false,
    disabledConnect: false,
  });
  i18n.addResourceBundle("en", defaultNS, extendEnLocale, true, true);
  await i18n.changeLanguage("en");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("announcement SDK integration", () => {
  it.each([undefined, "release-notes", "123"])(
    "passes the route segment %s directly as slug",
    (slug) => {
      renderPage(`/en/announcement${slug ? `/${slug}` : ""}`);
      const [props] = vi.mocked(AnnouncementCenterPage).mock.calls[0];
      expect(props).toMatchObject({
        slug,
      });
      expect(props).not.toHaveProperty("routerAdapter");
      expect(props).not.toHaveProperty("onRouteChange");
      expect(props).not.toHaveProperty("id");
      expect(props).not.toHaveProperty("announcementId");
      expect(props).not.toHaveProperty("isOfficial");
      expect(
        screen.getByText(slug ? `Article ${slug}` : "Announcement list"),
      ).toBeTruthy();
    },
  );

  it.each(["true", "false"])(
    "leaves URL source %s for the SDK to resolve",
    (source) => {
      renderPage(`/en/announcement/release-notes?is_official=${source}`);
      const [props] = vi.mocked(AnnouncementCenterPage).mock.calls[0];
      expect(props).toMatchObject({ slug: "release-notes" });
      expect(props).not.toHaveProperty("isOfficial");
      expect(window.location.search).toBe(`?is_official=${source}`);
    },
  );
});

describe("announcement mobile navigation", () => {
  it.each([
    ["/en/announcement", "Back to trading"],
    ["/en/announcement/release-notes", "Announcements"],
    ["/en/announcement/123", "Announcements"],
  ])(
    "renders a centered title and an icon-only back control in the mobile top bar at %s",
    (path, backLabel) => {
      renderPage(path);
      const navigation = screen.getByRole("navigation", {
        name: "Announcements",
      });
      expect(within(navigation).getByText("Announcements")).toBeTruthy();
      const back = within(navigation).getByRole("button");
      expect(back.textContent).toBe("");
      expect(back.getAttribute("aria-label")).toBe(backLabel);
      expect(
        screen.queryByRole("navigation", { name: "Main navigation" }),
      ).toBeNull();
      expect(screen.queryByRole("button", { name: "Menu" })).toBeNull();
      expect(screen.queryByText("Back to trading")).toBeNull();
    },
  );

  it.each(["true", "false"])(
    "returns from source %s to the filtered list with context intact",
    (source) => {
      renderPage(
        `/en/announcement/release-notes?brokerId=fee_rate&networkId=testnet&category=listing&page=2&campaign=autumn&feature=one&feature=two&is_official=${source}`,
      );
      fireEvent.click(screen.getByRole("button", { name: "Announcements" }));
      expect(screen.getByTestId("location").textContent).toBe(
        "/en/announcement?brokerId=fee_rate&networkId=testnet&category=listing&page=2&campaign=autumn&feature=one&feature=two",
      );
      expect(screen.getByText("Announcement list")).toBeTruthy();
    },
  );

  it("returns from the list to trading and removes announcement filters only", () => {
    renderPage(
      "/en/announcement?brokerId=fee_rate&networkId=testnet&category=listing&page=2&is_official=true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Back to trading" }));
    expect(screen.getByTestId("location").textContent).toBe(
      "/en/perp/PERP_ETH_USDC?brokerId=fee_rate&networkId=testnet",
    );
  });

  it("handles detail links without query parameters", () => {
    renderPage("/en/announcement/123");
    fireEvent.click(screen.getByRole("button", { name: "Announcements" }));
    expect(screen.getByTestId("location").textContent).toBe("/en/announcement");
  });

  it("clears the query when source is the only detail parameter", () => {
    renderPage("/en/announcement/release-notes?is_official=true");
    fireEvent.click(screen.getByRole("button", { name: "Announcements" }));
    expect(screen.getByTestId("location").textContent).toBe("/en/announcement");
  });

  it("clears announcement-only parameters when returning to trading", () => {
    renderPage("/en/announcement?category=listing&page=2&is_official=false");
    fireEvent.click(screen.getByRole("button", { name: "Back to trading" }));
    expect(screen.getByTestId("location").textContent).toBe(
      "/en/perp/PERP_ETH_USDC",
    );
  });

  it("does not add a mobile back control on desktop", () => {
    mocks.isMobile = false;
    renderPage("/en/announcement/123");
    expect(screen.queryByRole("button", { name: "Announcements" })).toBeNull();
  });
});
