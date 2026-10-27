// @vitest-environment jsdom
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { LegacyPredictionRedirect } from "./legacyPredictionRedirect";

afterEach(cleanup);

it.each(["/en/prediction", "/zh/prediction/BTC%2F5M%25"])(
  "replaces the legacy entry and preserves URL suffixes: %s",
  (path) => {
    let back: () => void = () => {};
    function Observer() {
      const { pathname, search, hash } = useLocation();
      const navigate = useNavigate();
      back = () => navigate(-1);
      return (
        <output data-testid="location">{`${pathname}${search}${hash}`}</output>
      );
    }
    render(
      <MemoryRouter initialEntries={["/start", `${path}?network=test#orders`]}>
        <Observer />
        <Routes>
          <Route
            path="/:lang/prediction/:symbol?"
            element={<LegacyPredictionRedirect />}
          />
          <Route path="*" element={null} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId("location").textContent).toBe(
      `${path.replace("/prediction", "/predict")}?network=test#orders`,
    );
    act(() => back());
    expect(screen.getByTestId("location").textContent).toBe("/start");
  },
);
