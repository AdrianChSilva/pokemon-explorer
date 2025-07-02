import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { PokemonCard } from "@/components/PokemonCard";
import type { PokemonDetail } from "@/types/pokemon";

const PAGE_LIMIT = 20;

const HomePage = () => {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `pokemon?offset=${offset}&limit=${PAGE_LIMIT}`
      );

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

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setOffset((prev) => prev + PAGE_LIMIT);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Pokémon Explorer</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
