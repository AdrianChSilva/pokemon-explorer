import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteState {
  favorites: string[];
  addFavorite: (name: string) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
}

export const useFavoritesStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (name) =>
        set((state) => ({
          favorites: [...state.favorites, name],
        })),
      removeFavorite: (name) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav !== name),
        })),
      isFavorite: (name) => get().favorites.includes(name),
    }),
    {
      name: "pokemon-favorites", 
    }
  )
);
