import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { AppRoutes } from "./router";

describe("application routes", () => {
  it("renders the operational home as the default product route", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Decisions requiring attention" }),
    ).toBeInTheDocument();
  });
});
