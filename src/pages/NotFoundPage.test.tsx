import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("muestra el mensaje 404 y un botón para volver al inicio", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();

    expect(screen.getByText("The page you are looking for does not exist.")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Return to home page/i });
    expect(link).toBeInTheDocument();
  });
});
