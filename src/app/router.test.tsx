import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { AppRoutes } from "./router";

describe("application routes", () => {
  it("renders focused pricing projects as the default product route", () => {
    render(
      <MemoryRouter initialEntries={["/pricing"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Pricing Projects" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Decide which menu prices to change, by how much/),
    ).toBeInTheDocument();
  });
});
