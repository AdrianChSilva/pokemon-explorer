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
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Favoritos" })).toHaveAttribute("href", "/favorites");
  });

  it("marca el link correcto como activo en la ruta /", () => {
    renderWithRoute("/");

    const inicioLink = screen.getByRole("link", { name: "Inicio" });
    const favoritosLink = screen.getByRole("link", { name: "Favoritos" });

    expect(inicioLink).toHaveClass("text-blue-600", "underline");
    expect(favoritosLink).toHaveClass("text-gray-700");
  });

  it("marca el link correcto como activo en la ruta /favorites", () => {
    renderWithRoute("/favorites");

    const inicioLink = screen.getByRole("link", { name: "Inicio" });
    const favoritosLink = screen.getByRole("link", { name: "Favoritos" });

    expect(favoritosLink).toHaveClass("text-blue-600", "underline");
    expect(inicioLink).toHaveClass("text-gray-700");
  });
});
