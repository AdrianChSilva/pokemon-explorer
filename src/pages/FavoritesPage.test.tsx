import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import FavoritesPage from "@/pages/FavoritesPage";
import type { PokemonDetail } from "@/types/pokemon";
import * as favoritesStore from "@/store/favorites";
import * as pokemonApi from "@/lib/getPokemonDetails";

vi.mock("@/components/PokemonCard", () => ({
  PokemonCard: ({ pokemon }: { pokemon: PokemonDetail }) => (
    <div data-testid="pokemon-card">{pokemon.name}</div>
  ),
}));

vi.mock("@/store/favorites");
vi.mock("@/lib/getPokemonDetails");

const mockPokemon = (id: number, name: string): PokemonDetail => ({
  id,
  name,
  sprites: {
    other: {
      "official-artwork": {
        front_default: `https://img/${name}.png`,
      },
    },
  },
  types: [{ type: { name: "normal" } }],
  stats: [],
  moves: [],
});

describe("FavoritesPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("muestra mensaje si no hay favoritos", () => {
    vi.mocked(favoritesStore.useFavoritesStore).mockReturnValue({
      favorites: [],
    });

    render(<FavoritesPage />);
    expect(
      screen.getByText("You don't have favorites yet.")
    ).toBeInTheDocument();
  });

  it("muestra loading y luego los Pokémon favoritos", async () => {
    vi.mocked(favoritesStore.useFavoritesStore).mockReturnValue({
      favorites: [1, 4],
    });

    vi.mocked(pokemonApi.getPokemonDetails).mockResolvedValue([
      mockPokemon(1, "bulbasaur"),
      mockPokemon(4, "charmander"),
    ]);

    render(<FavoritesPage />);

    expect(screen.getByText("Loading your favorites...")).toBeInTheDocument();

    await waitFor(() => {
      const cards = screen.getAllByTestId("pokemon-card");
      expect(cards).toHaveLength(2);
      expect(cards[0]).toHaveTextContent("bulbasaur");
      expect(cards[1]).toHaveTextContent("charmander");
    });
  });

  it("muestra solo loading si tarda en cargar", async () => {
    vi.mocked(favoritesStore.useFavoritesStore).mockReturnValue({
      favorites: [1],
    });

    vi.mocked(pokemonApi.getPokemonDetails).mockImplementation(
      () => new Promise(() => {})
    );

    render(<FavoritesPage />);
    expect(screen.getByText("Loading your favorites...")).toBeInTheDocument();
  });
});
