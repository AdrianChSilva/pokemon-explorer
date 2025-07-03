import { render, screen, fireEvent } from "@testing-library/react";
import DetailPage from "./DetailPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "@/lib/axios";
import { vi } from "vitest";
import type { AxiosError } from "axios";
import type { PokemonDetail } from "@/types/pokemon";

const addFavorite = vi.fn();
const removeFavorite = vi.fn();
const isFavorite = vi.fn().mockReturnValue(false);

vi.mock("@/store/favorites", () => ({
  useFavoritesStore: () => ({
    addFavorite,
    removeFavorite,
    isFavorite,
  }),
}));

vi.mock("@/lib/axios", async () => {
  const actual = await vi.importActual<typeof import("@/lib/axios")>("@/lib/axios");
  return {
    ...actual,
    default: {
      get: vi.fn(),
    },
  };
});

const mockAxios = api as unknown as { get: ReturnType<typeof vi.fn> };

const renderWithRoute = (name: string) =>
  render(
    <MemoryRouter initialEntries={[`/pokemon/${name}`]}>
      <Routes>
        <Route path="/pokemon/:name" element={<DetailPage />} />
      </Routes>
    </MemoryRouter>
  );

const mockPokemon: PokemonDetail = {
  id: 25,
  name: "pikachu",
  sprites: {
    other: {
      "official-artwork": {
        front_default: "https://img.pokemondb.net/artwork/pikachu.jpg",
      },
    },
  },
  types: [
    { type: { name: "electric" } },
  ],
  stats: [
    { base_stat: 55, stat: { name: "speed" } },
  ],
  moves: [
    { move: { name: "thunderbolt" } },
    { move: { name: "quick-attack" } },
  ],
};

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra loading correctamente", async () => {
    mockAxios.get.mockResolvedValueOnce(new Promise(() => {}));

    renderWithRoute("pikachu");

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("renderiza detalles de un Pokémon válido", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: mockPokemon });

    renderWithRoute("pikachu");

    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText("#25")).toBeInTheDocument();
    expect(screen.getByText("electric")).toBeInTheDocument();
    expect(screen.getByText(/thunderbolt/i)).toBeInTheDocument();
  });

  it("permite marcar como favorito", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: mockPokemon });
    isFavorite.mockReturnValue(false);

    renderWithRoute("pikachu");

    const button = await screen.findByRole("button");
    fireEvent.click(button);

    expect(addFavorite).toHaveBeenCalledWith("pikachu");
  });

  it("permite desmarcar como favorito", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: mockPokemon });
    isFavorite.mockReturnValue(true);

    renderWithRoute("pikachu");

    const button = await screen.findByRole("button");
    fireEvent.click(button);

    expect(removeFavorite).toHaveBeenCalledWith("pikachu");
  });

  it("muestra mensaje de error si no existe el Pokémon (404)", async () => {
    const error404 = {
      response: {
        status: 404,
      },
    } as AxiosError;

    mockAxios.get.mockRejectedValueOnce(error404);

    renderWithRoute("missingno");

    expect(await screen.findByText("Pokémon no encontrado")).toBeInTheDocument();
    expect(
      screen.getByText(/no existe o no se pudo cargar/i)
    ).toBeInTheDocument();
  });
});
