import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/Header";
import { MemoryRouter } from "react-router-dom";

const renderWithRoute = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>
  );
};

describe("Header", () => {
  it("renderiza el título y los links", () => {
    renderWithRoute("/");

    expect(screen.getByText("Pokémon Explorer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Your favorites" })).toHaveAttribute("href", "/favorites");
  });

  it("marca el link correcto como activo en la ruta /", () => {
    renderWithRoute("/");

    const homeLink = screen.getByRole("link", { name: "Home" });
    const favoritesLink = screen.getByRole("link", { name: "Your favorites" });

    expect(homeLink).toHaveClass("text-blue-600", "underline");
    expect(favoritesLink).toHaveClass("text-gray-700");
  });

  it("marca el link correcto como activo en la ruta /favorites", () => {
    renderWithRoute("/favorites");

    const homeLink = screen.getByRole("link", { name: "Home" });
    const favoritesLink = screen.getByRole("link", { name: "Your favorites" });

    expect(favoritesLink).toHaveClass("text-blue-600", "underline");
    expect(homeLink).toHaveClass("text-gray-700");
  });
});
