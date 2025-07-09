import { describe, it, expect, vi } from "vitest";
import { toggleFavorite, getGradient } from "./utils";
import { TYPE_COLORS } from "@/types/typeColors";


describe("toggleFavorite", () => {
  it("llama a removeFavorite si ya es favorito", () => {
    const removeFavorite = vi.fn();
    const addFavorite = vi.fn();
    toggleFavorite(true, "pikachu", removeFavorite, addFavorite);
    expect(removeFavorite).toHaveBeenCalledWith("pikachu");
    expect(addFavorite).not.toHaveBeenCalled();
  });

  it("llama a addFavorite si no es favorito", () => {
    const removeFavorite = vi.fn();
    const addFavorite = vi.fn();
    toggleFavorite(false, "bulbasaur", removeFavorite, addFavorite);
    expect(addFavorite).toHaveBeenCalledWith("bulbasaur");
    expect(removeFavorite).not.toHaveBeenCalled();
  });
});

describe("getGradient", () => {
  it("devuelve el color correcto para un solo tipo", () => {
    const type = "fire";
    expect(getGradient([type])).toBe(TYPE_COLORS[type] ?? "#FFFF");
  });

  it("devuelve un gradiente para dos tipos", () => {
    const types = ["fire", "water"];
    const expected = `linear-gradient(135deg, ${TYPE_COLORS["fire"] ?? "#FFFF"}, ${TYPE_COLORS["water"] ?? "#FFFF"})`;
    expect(getGradient(types)).toBe(expected);
  });

  it("usa el color por defecto si el tipo no existe", () => {
    expect(getGradient(["unknown"])).toBe("#FFFF");
    expect(getGradient(["fire", "unknown"])).toBe(
      `linear-gradient(135deg, ${TYPE_COLORS["fire"] ?? "#FFFF"}, #FFFF)`
    );
  });
});