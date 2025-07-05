import { useFavoritesStore } from "@/store/favorites";
import { describe, expect, it } from "vitest";

describe("useFavoritesStore", () => {
  beforeEach(() => {
    // Reseteamos el store antes de cada test
    useFavoritesStore.setState({ favorites: [] });
    localStorage.clear();
  });

  it("añade un favorito", () => {
    useFavoritesStore.getState().addFavorite("pikachu");

    expect(useFavoritesStore.getState().favorites).toContain("pikachu");
  });

  it("elimina un favorito", () => {
    useFavoritesStore.getState().addFavorite("pikachu");
    useFavoritesStore.getState().removeFavorite("pikachu");

    expect(useFavoritesStore.getState().favorites).not.toContain("pikachu");
  });

  it("comprueba si un Pokémon es favorito", () => {
    useFavoritesStore.getState().addFavorite("charmander");
    expect(useFavoritesStore.getState().isFavorite("charmander")).toBe(true);
  });

  it("mantiene el estado persistente", () => {
    const key = "pokemon-favorites";

    useFavoritesStore.getState().addFavorite("snorlax");

    const raw = localStorage.getItem(key);
    expect(raw).toBeTruthy();
    expect(raw).toContain("snorlax");
  });
});
