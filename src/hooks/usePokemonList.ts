import { useState, useEffect } from "react";
import api from "@/lib/axios";
import type { PokemonDetail } from "@/types/pokemon";
import { getPokemonDetails } from "@/lib/getPokemonDetails";

const PAGE_LIMIT = 20;
interface pokeApiResponse {
  data: {
    results: PokemonDetail[];
    next: string | null;
  };
}

export const usePokemonList = () => {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemons = async (currentOffset: number) => {
    setLoading(true);
    try {
      const { data }: pokeApiResponse = await api.get(
        `pokemon?offset=${currentOffset}&limit=${PAGE_LIMIT}`
      );

      const pokemonNames = data.results.map((pokemon) => pokemon.name);

      const detailed = await getPokemonDetails(pokemonNames)

      setPokemons((prev) => {
        const newPokemons = detailed.filter(
          (newPoke) => !prev.some((oldPoke) => oldPoke.id === newPoke.id)
        );
        return [
          ...prev,
          ...newPokemons
        ];
      });

      setHasMore(Boolean(data.next));
    } catch (err) {
      console.error("Error cargando Pokémon:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(offset);
  }, [offset]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setOffset((prev) => prev + PAGE_LIMIT);
    }
  };

  return { pokemons, loading, hasMore, loadMore };
};
