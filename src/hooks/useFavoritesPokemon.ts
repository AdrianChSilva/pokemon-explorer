import { useEffect, useState } from "react";
import { getAllPokemonDetails } from "@/lib/getAllPokemonDetails";
import type { PokemonDetail } from "@/types/pokemon";

export const useFavoritesPokemon = (favorites: string[]) => {
  const [pokemonFavs, setPokemonFavs] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favorites.length === 0) {
      setPokemonFavs([]);
      return;
    }
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const pokemons = await getAllPokemonDetails(favorites);
        setPokemonFavs(pokemons);
      } catch (error) {
        setPokemonFavs([]);
        console.error("Error loading favorites pokemon:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [favorites]);

  return { pokemonFavs, loading };
};