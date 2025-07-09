import { describe, it, vi, expect, beforeEach } from "vitest";
import { getAllPokemonDetails } from "@/lib/getAllPokemonDetails";
import api from "@/lib/axios";
import type { PokemonDetail } from "@/types/pokemon";

vi.mock("@/lib/axios");

const createMockPokemon = (id: number, name: string): PokemonDetail => ({
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

describe("getAllPokemonDetails", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("hace una llamada por cada nombre y devuelve los datos en orden", async () => {
    const names = ["bulbasaur", "charmander", "squirtle"];
    const mockData = names.map((name, i) => createMockPokemon(i + 1, name));

    const getMock = vi.mocked(api.get).mockImplementation((url: string) => {
      const name = url.split("/").pop()!;
      const data = mockData.find((p) => p.name === name)!;
      return Promise.resolve({ data });
    });

    const result = await getAllPokemonDetails(names);

    expect(result).toEqual(mockData);
    expect(getMock).toHaveBeenCalledTimes(3);
    expect(getMock).toHaveBeenCalledWith("pokemon/bulbasaur");
    expect(getMock).toHaveBeenCalledWith("pokemon/charmander");
    expect(getMock).toHaveBeenCalledWith("pokemon/squirtle");
  });

});
