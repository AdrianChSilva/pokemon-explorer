import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { PokemonDetail } from "@/types/pokemon";

const PAGE_LIMIT = 20;

export const usePokemonList = () => {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemons = useCallback(async (currentOffset: number) => {
    setLoading(true);
    try {
      const { data } = await api.get(`pokemon?offset=${currentOffset}&limit=${PAGE_LIMIT}`);

      const results = await Promise.all(
        data.results.map((p: { name: string }) =>
          api.get<PokemonDetail>(`pokemon/${p.name}`)
        )
      );

      const detailed = results.map((r) => r.data);
      setPokemons((prev) => {
        const all = [...prev, ...detailed];
        const unique = new Map(all.map((p) => [p.id, p]));
        return Array.from(unique.values());
      });

      setHasMore(Boolean(data.next));
    } catch (err) {
      console.error("Error cargando Pokémon:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemons(offset);
  }, [offset, fetchPokemons]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setOffset((prev) => prev + PAGE_LIMIT);
    }
  };

  return { pokemons, loading, hasMore, loadMore };
};
