import { usePokemonList } from "@/hooks/usePokemonList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { PokemonCard } from "@/components/PokemonCard";

const HomePage = () => {
  const { pokemons, loading, hasMore, loadMore } = usePokemonList();

  useInfiniteScroll(loadMore, loading || !hasMore);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Pokémon Explorer</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-6 text-gray-500 text-sm">
          Loading more Pokémon...
        </div>
      )}
    </div>
  );
};

export default HomePage;
