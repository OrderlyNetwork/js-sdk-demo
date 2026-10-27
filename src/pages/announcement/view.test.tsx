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
import type { ScaffoldProps } from "@orderly.network/ui-scaffold";
import extendEnLocale from "@/locales/en.json";
import AnnouncementView from "./view";

const mocks = vi.hoisted(() => ({ isMobile: true }));
const require = createRequire(import.meta.url);

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
  AnnouncementCenterPage: ({ announcementId }: { announcementId?: string }) => (
    <main>
      {announcementId ? `Article ${announcementId}` : "Announcement list"}
    </main>
  ),
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
          path="/:lang/announcement/:announcementId?"
          element={<AnnouncementView />}
        />
        <Route path="/:lang/perp/:symbol" element={<main>Trading</main>} />
      </Routes>
      <Location />
    </MemoryRouter>,
  );
}

beforeEach(async () => {
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

describe("announcement mobile navigation", () => {
  it.each(["/en/announcement", "/en/announcement/123"])(
    "renders a centered title and an icon-only back control in the mobile top bar at %s",
    (path) => {
      renderPage(path);
      const navigation = screen.getByRole("navigation", {
        name: "Announcements",
      });
      expect(within(navigation).getByText("Announcements")).toBeTruthy();
      const back = within(navigation).getByRole("button");
      expect(back.textContent).toBe("");
      expect(back.getAttribute("aria-label")).toBe(
        path.endsWith("123") ? "Announcements" : "Back to trading",
      );
      expect(
        screen.queryByRole("navigation", { name: "Main navigation" }),
      ).toBeNull();
      expect(screen.queryByRole("button", { name: "Menu" })).toBeNull();
      expect(screen.queryByText("Back to trading")).toBeNull();
    },
  );

  it("returns from a directly opened detail to the filtered list with broker and network intact", () => {
    renderPage(
      "/en/announcement/123?brokerId=fee_rate&networkId=testnet&category=listing&page=2",
    );
    fireEvent.click(screen.getByRole("button", { name: "Announcements" }));
    expect(screen.getByTestId("location").textContent).toBe(
      "/en/announcement?brokerId=fee_rate&networkId=testnet&category=listing&page=2",
    );
    expect(screen.getByText("Announcement list")).toBeTruthy();
  });

  it("returns from the list to trading and removes announcement filters only", () => {
    renderPage(
      "/en/announcement?brokerId=fee_rate&networkId=testnet&category=listing&page=2",
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

  it("does not add a mobile back control on desktop", () => {
    mocks.isMobile = false;
    renderPage("/en/announcement/123");
    expect(screen.queryByRole("button", { name: "Announcements" })).toBeNull();
  });
});
