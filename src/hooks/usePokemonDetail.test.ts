import { renderHook, waitFor } from "@testing-library/react";
import { usePokemonDetails } from "./usePokemonDetail";
import api from "@/lib/axios";
import type { PokemonDetail } from "@/types/pokemon";
import { AxiosError } from "axios";

vi.mock("@/lib/axios");

const mockPokemon: PokemonDetail = {
  id: 1,
  name: "bulbasaur",
  sprites: {
    other: {
      "official-artwork": {
        front_default: `https://img/bulbasaur.png`,
      },
    },
  },
  types: [],
  stats: [],
  moves: [],
};

const mockedApiGet = api.get as ReturnType<typeof vi.fn>;

describe("usePokemonDetails", () => {
  it("debe cargar los detalles correctamente", async () => {
    mockedApiGet.mockResolvedValueOnce({ data: mockPokemon });
    const { result } = renderHook(() => usePokemonDetails("bulbasaur"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.pokemonDetails?.name).toBe("bulbasaur");
      expect(result.current.loading).toBe(false);
      expect(result.current.notFound).toBe(false);
    });
  });

  it("debe manejar el error 404 correctamente", async () => {
    const error = {
      response: { status: 404 },
      isAxiosError: true,
    } as AxiosError;

    (api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      error
    );

    const { result } = renderHook(() => usePokemonDetails("missingno"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.pokemonDetails).toBeUndefined();
      expect(result.current.loading).toBe(false);
      expect(result.current.notFound).toBe(true);
    });
  });

  it("debe manejar otros errores correctamente", async () => {
    const error = {
      response: { status: 500 },
      isAxiosError: true,
    } as AxiosError;

    mockedApiGet.mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePokemonDetails("bulbasaur"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.pokemonDetails).toBeUndefined();
      expect(result.current.loading).toBe(false);
      expect(result.current.notFound).toBe(false);
    });
  });
});
