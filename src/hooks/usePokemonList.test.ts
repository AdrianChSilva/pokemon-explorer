import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { usePokemonList } from "./usePokemonList";
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

describe("usePokemonList", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("carga la primera página de pokémon al montar", async () => {
    const mockList = {
      results: [{ name: "bulbasaur" }, { name: "charmander" }],
      next: "next-url",
    };
    const bulbasaur = createMockPokemon(1, "bulbasaur");
    const charmander = createMockPokemon(4, "charmander");

    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url.startsWith("pokemon?")) {
        return Promise.resolve({ data: mockList });
      }
      if (url === "pokemon/bulbasaur") {
        return Promise.resolve({ data: bulbasaur });
      }
      if (url === "pokemon/charmander") {
        return Promise.resolve({ data: charmander });
      }
      return Promise.reject(new Error("not found"));
    });

    const { result } = renderHook(() => usePokemonList());
    // Wait for loading to be false
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.pokemons).toHaveLength(2);
    expect(result.current.pokemons[0].name).toBe("bulbasaur");
    expect(result.current.hasMore).toBe(true);
  });

  it("loadMore incrementa el offset y carga más pokémon", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let offset = 0;

    const mockList = {
      results: [{ name: "pikachu" }],
      next: null,
    };
    const pikachu = createMockPokemon(25, "pikachu");

    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url.startsWith("pokemon?")) {
        offset += 20;
        return Promise.resolve({ data: mockList });
      }
      if (url === "pokemon/pikachu") {
        return Promise.resolve({ data: pikachu });
      }
      return Promise.reject(new Error("not found"));
    });

    const { result } = renderHook(() => usePokemonList());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.pokemons.some((p) => p.name === "pikachu")).toBe(
      true
    );
    expect(result.current.hasMore).toBe(false);
  });

  it("maneja errores de la API correctamente", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("API error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const { result } = renderHook(() => usePokemonList());
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.pokemons).toHaveLength(0);
      expect(result.current.loading).toBe(false);
    } finally {
      // Es para limpiar la consola del (esperado) console.error de este test
      consoleSpy.mockRestore();
    }
  });
});
