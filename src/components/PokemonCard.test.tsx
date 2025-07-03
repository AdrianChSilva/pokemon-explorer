import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PokemonCard } from "@/components/PokemonCard";
import type { PokemonDetail } from "@/types/pokemon";
import { BrowserRouter } from "react-router-dom";
import * as favoritesStore from "@/store/favorites";

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

const mockPokemon: PokemonDetail = {
  id: 25,
  name: "pikachu",
  sprites: {
    other: {
      "official-artwork": {
        front_default: "https://example.com/pikachu.png",
      },
    },
  },
  types: [{ type: { name: "electric" } }],
  stats: [],
  moves: [],
};

describe("PokemonCard", () => {
  const addFavorite = vi.fn();
  const removeFavorite = vi.fn();

  beforeEach(() => {
    vi.spyOn(favoritesStore, "useFavoritesStore").mockReturnValue({
      isFavorite: vi.fn().mockReturnValue(false),
      addFavorite,
      removeFavorite,
      favorites: [],
    });
  });

  it("renderiza nombre, número, imagen y tipo", () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText("N.º 25")).toBeInTheDocument();
    expect(screen.getByAltText("pikachu")).toHaveAttribute("src", mockPokemon.sprites.other["official-artwork"].front_default);
    expect(screen.getByText("electric")).toBeInTheDocument();
  });

  it("enlaza al detalle del Pokémon", () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pokemon/pikachu");
  });

  it("añade a favoritos si no lo es", () => {
    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);

    const favButton = screen.getByRole("button");
    fireEvent.click(favButton);

    expect(addFavorite).toHaveBeenCalledWith("pikachu");
  });

  it("elimina de favoritos si ya lo es", () => {
    vi.spyOn(favoritesStore, "useFavoritesStore").mockReturnValue({
      isFavorite: vi.fn().mockReturnValue(true),
      addFavorite,
      removeFavorite,
      favorites: [],
    });

    renderWithRouter(<PokemonCard pokemon={mockPokemon} />);

    const favButton = screen.getByRole("button");
    fireEvent.click(favButton);

    expect(removeFavorite).toHaveBeenCalledWith("pikachu");
  });


});
