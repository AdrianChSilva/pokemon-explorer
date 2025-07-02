import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { PokemonCard } from "@/components/PokemonCard";
import type { PokemonDetail } from "@/types/pokemon";

const PAGE_LIMIT = 20;

const HomePage = () => {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemons = async (currentOffset: number) => {
    setLoading(true);
    try {
      const { data } = await api.get(`pokemon?offset=${currentOffset}&limit=${PAGE_LIMIT}`);

      const results = await Promise.all(
        data.results.map((p: { name: string }) =>
          api.get<PokemonDetail>(`pokemon/${p.name}`)
        )
      );

      const detailed = results.map((r) => r.data);
      setPokemons((prev) => [...prev, ...detailed]);
      setHasMore(Boolean(data.next));
    } catch (err) {
      console.error("Error cargando Pokémon:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 300 && !loading && hasMore) {
      setOffset((prev) => prev + PAGE_LIMIT);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchPokemons(offset);
  }, [offset]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Pokémon Explorer</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-6 text-gray-500 text-sm">
          Cargando más Pokémon...
        </div>
      )}
    </div>
  );
};

export default HomePage;
