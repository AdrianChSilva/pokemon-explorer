import { useFavoritesStore } from "@/store/favorites";
import { PokemonCard } from "@/components/PokemonCard";
import { useFavoritesPokemon } from "@/hooks/useFavoritesPokemon";

const FavoritesPage = () => {
  const { favorites } = useFavoritesStore();
  const { pokemonFavs, loading } = useFavoritesPokemon(favorites);

  if (loading) {
    return <p className="text-center mt-10">Loading your favorites...</p>;
  }

  if (pokemonFavs.length === 0) {
    return <p className="text-center mt-10">You don't have favorites yet.</p>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Your favorite Pokémon
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemonFavs.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
