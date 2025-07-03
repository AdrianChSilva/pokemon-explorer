import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import HomePage from "@/pages/HomePage";
import api from "@/lib/axios";
import type { PokemonDetail } from "@/types/pokemon";

vi.mock("@/components/PokemonCard", () => ({
  PokemonCard: ({ pokemon }: { pokemon: PokemonDetail }) => (
    <div data-testid="pokemon-card">
      <span>{pokemon.id}</span>
      <span>{pokemon.name}</span>
      <span>{pokemon.types.map((t) => t.type.name).join(", ")}</span>
    </div>
  ),
}));

vi.mock("@/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: (cb: () => void, disabled: boolean) => {
    if (!disabled) {
      setTimeout(cb, 0);
    }
  },
}));

const createMockPokemon = (id: number, name: string, types: string[]): PokemonDetail => ({
  id,
  name,
  sprites: {
    other: {
      "official-artwork": {
        front_default: `https://img/${name}.png`,
      },
    },
  },
  types: types.map((t) => ({ type: { name: t } })),
  stats: [],
  moves: [],
});

describe("HomePage - lista de Pokémon", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renderiza el título, muestra loading, y carga pokémon con id, nombre y tipos", async () => {
    const apiGet = vi.spyOn(api, "get");

    apiGet.mockResolvedValueOnce({
      data: {
        results: [{ name: "bulbasaur" }, { name: "charmander" }],
        next: null,
      },
    });

    apiGet.mockResolvedValueOnce({
      data: createMockPokemon(1, "bulbasaur", ["grass", "poison"]),
    });
    apiGet.mockResolvedValueOnce({
      data: createMockPokemon(4, "charmander", ["fire"]),
    });

    render(<HomePage />);

    expect(screen.getByText(/cargando más pokémon/i)).toBeInTheDocument();

    await waitFor(() => {
      const cards = screen.getAllByTestId("pokemon-card");
      expect(cards).toHaveLength(2);

      expect(cards[0]).toHaveTextContent("1");
      expect(cards[0]).toHaveTextContent("bulbasaur");
      expect(cards[0]).toHaveTextContent("grass, poison");

      expect(cards[1]).toHaveTextContent("4");
      expect(cards[1]).toHaveTextContent("charmander");
      expect(cards[1]).toHaveTextContent("fire");
    });

    expect(apiGet).toHaveBeenCalledWith("pokemon?offset=0&limit=20");
    expect(apiGet).toHaveBeenCalledWith("pokemon/bulbasaur");
    expect(apiGet).toHaveBeenCalledWith("pokemon/charmander");
  });
  it("renderiza 20 pokémon tras la primera carga", async () => {
  const apiGet = vi.spyOn(api, "get");

  const pokemonNames = Array.from({ length: 20 }, (_, i) => ({
    name: `pokemon-${i + 1}`,
  }));

  apiGet.mockResolvedValueOnce({
    data: {
      results: pokemonNames,
      next: "next-page-url",
    },
  });

  pokemonNames.forEach((p, i) => {
    apiGet.mockResolvedValueOnce({
      data: createMockPokemon(i + 1, p.name, ["normal"]),
    });
  });

  render(<HomePage />);

  await waitFor(() => {
    const cards = screen.getAllByTestId("pokemon-card");
    expect(cards).toHaveLength(20);
  });

  expect(apiGet).toHaveBeenCalledWith("pokemon?offset=0&limit=20");

  pokemonNames.forEach((p) => {
    expect(apiGet).toHaveBeenCalledWith(`pokemon/${p.name}`);
  });
});
});
