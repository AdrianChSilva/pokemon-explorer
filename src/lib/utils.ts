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


