import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";

// Mocks de las páginas
vi.mock("@/pages/HomePage", () => ({
  default: () => <div>Home Page</div>,
}));
vi.mock("@/pages/DetailPage", () => ({
  default: () => <div>Detail Page</div>,
}));
vi.mock("@/pages/FavoritesPage", () => ({
  default: () => <div>Favorites Page</div>,
}));
vi.mock("@/pages/NotFoundPage", () => ({
  default: () => <div>404 - Not Found</div>,
}));

// Mock del Header
vi.mock("@/components/Header", () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

describe("App router", () => {
  it("siempre renderiza el Header", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renderiza HomePage en la ruta /", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Home Page")).toBeInTheDocument();
  });

  it("renderiza DetailPage en la ruta /pokemon/:name", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/pokemon/pikachu"]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Detail Page")).toBeInTheDocument();
  });

  it("renderiza FavoritesPage en la ruta /favorites", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/favorites"]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText("Favorites Page")).toBeInTheDocument();
  });

  it("renderiza NotFoundPage en una ruta desconocida", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/ruta-inexistente"]}>
          <App />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText(/404/i)).toBeInTheDocument();
  });
});
