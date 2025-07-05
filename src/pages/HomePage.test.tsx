import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import HomePage from "@/pages/HomePage";
import type { PokemonDetail } from "@/types/pokemon";
import { usePokemonList } from "@/hooks/usePokemonList";

vi.mock("@/components/PokemonCard", () => ({
  PokemonCard: ({ pokemon }: { pokemon: PokemonDetail }) => (
    <div data-testid="pokemon-card">
      <span>{pokemon.id}</span>
      <span>{pokemon.name}</span>
      <span>{pokemon.types.map((t) => t.type.name).join(", ")}</span>
    </div>
  ),
}));

vi.mock("@/hooks/usePokemonList", () => ({
  usePokemonList: vi.fn(),
}));

const createMockPokemon = (
  id: number,
  name: string,
  types: string[]
): PokemonDetail => ({
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

  it("renderiza el título, loading y pokémon correctamente", async () => {
    const mockPokemons = [
      createMockPokemon(1, "bulbasaur", ["grass", "poison"]),
      createMockPokemon(4, "charmander", ["fire"]),
    ];

    vi.mocked(usePokemonList).mockReturnValue({
      pokemons: mockPokemons,
      loading: true,
      hasMore: false,
      loadMore: vi.fn(),
    });

    render(<HomePage />);

    expect(screen.getByText(/Pokémon Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading more Pokémon/i)).toBeInTheDocument();

    const cards = await screen.findAllByTestId("pokemon-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("1");
    expect(cards[0]).toHaveTextContent("bulbasaur");
    expect(cards[0]).toHaveTextContent("grass, poison");
    expect(cards[1]).toHaveTextContent("4");
    expect(cards[1]).toHaveTextContent("charmander");
    expect(cards[1]).toHaveTextContent("fire");
  });

  it("renderiza 20 pokémon sin loading", async () => {
    const mockPokemons = [];
    for (let i = 1; i <= 20; i++) {
      mockPokemons.push(
        createMockPokemon(i, `pokemon-${i}`, ["normal"])
      );
    }

    vi.mocked(usePokemonList).mockReturnValue({
      pokemons: mockPokemons,
      loading: false,
      hasMore: true,
      loadMore: vi.fn(),
    });

    render(<HomePage />);

    const cards = await screen.findAllByTestId("pokemon-card");
    expect(cards).toHaveLength(20);
  });
});
