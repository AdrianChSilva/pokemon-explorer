import { TYPE_COLORS } from "@/types/typeColors";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const toggleFavorite = (
  isFav: boolean,
  pokemonName: string,
  removeFavorite: (pokemonName: string) => void,
  addFavorite: (pokemonName: string) => void
) => {
  if (isFav) {
    removeFavorite(pokemonName);
  } else {
    addFavorite(pokemonName);
  }
};

export const getGradient = (pokemonType: string[]): string => {
  const defaultColor = "#FFFF";
  const colors = pokemonType.map((type) => TYPE_COLORS[type] ?? defaultColor);

  if (colors.length === 1) {
    return colors[0];
  }

  return `linear-gradient(135deg, ${colors.join(", ")})`;
};

