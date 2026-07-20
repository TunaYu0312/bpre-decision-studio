import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";

import { PriceSensitivityPage } from "./price-sensitivity";
import { PricingBaselinePage } from "./pricing-baseline";
import { PricingProjectsPage } from "./pricing-projects";

describe("pricing MVP pages", () => {
  it("starts from focused pricing projects", () => {
    render(
      <MemoryRouter>
        <PricingProjectsPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Pricing Projects" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Open baseline for 2026 Core Menu Price Review",
      }),
    ).toHaveAttribute(
      "href",
      "/pricing/pricing-core-menu-2026/baseline",
    );
  });

  it("shows a consistent item-level baseline", () => {
    render(
      <MemoryRouter
        initialEntries={["/pricing/pricing-core-menu-2026/baseline"]}
      >
        <Routes>
          <Route
            element={<PricingBaselinePage />}
            path="/pricing/:id/baseline"
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "2026 Core Menu Price Review" }),
    ).toBeVisible();
    expect(screen.getByText("Total menu UPH")).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Sales" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "Sales %" }),
    ).toBeVisible();
    expect(screen.getAllByText("Signature Breakfast Set")[0]).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Continue to Price Sensitivity" }),
    ).toHaveAttribute(
      "href",
      "/pricing/pricing-core-menu-2026/research",
    );
  });

  it("separates research response from observed elasticity", () => {
    render(
      <MemoryRouter
        initialEntries={["/pricing/pricing-core-menu-2026/research"]}
      >
        <Routes>
          <Route
            element={<PriceSensitivityPage />}
            path="/pricing/:id/research"
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "How will customers respond to price?",
      }),
    ).toBeVisible();
    expect(screen.getByText("Van Westendorp PSM")).toBeVisible();
    expect(screen.getByText("Gabor–Granger")).toBeVisible();
    expect(
      screen.getByText(/Survey response is not treated as actual elasticity/),
    ).toBeVisible();
  });
});
