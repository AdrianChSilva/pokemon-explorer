import { useParams } from "react-router-dom";
import { useFavoritesStore } from "@/store/favorites";
import { Button } from "@/components/ui/button";
import { Heart, HeartIcon } from "lucide-react";
import { usePokemonDetails } from "@/hooks/usePokemonDetail";

const DetailPage = () => {
  const { pokemonName } = useParams<string>();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { loading, notFound, pokemonDetails } = usePokemonDetails(pokemonName!);
  const isFav = pokemonName ? isFavorite(pokemonName) : false;

  const toggleFavorite = () => {
    if (!pokemonName) return;

    if (isFav) {
      removeFavorite(pokemonName);
    } else {
      addFavorite(pokemonName);
    }
  };
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Pokémon not found
        </h1>
        <p className="text-gray-700 mb-4">
          Pokémon <b>{pokemonName}</b> does not exist or could not be loaded.
        </p>
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    );
  }

  if (!pokemonDetails)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Something went wrong
        </h1>
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    );

  return (
    <div className="max-w-screen-md mx-auto p-4 relative">
      <Button
        onClick={toggleFavorite}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-red-500 hover:bg-red-100"
      >
        {isFav ? <Heart className="fill-red-500" /> : <HeartIcon />}
      </Button>

      <div className="flex flex-col items-center gap-4 text-center">
        <img
          src={pokemonDetails.sprites.other["official-artwork"].front_default}
          alt={pokemonDetails.name}
          className="w-48 h-48"
        />
        <h1 className="text-3xl font-bold capitalize">
          {pokemonDetails.name} <span className="text-gray-500">#{pokemonDetails.id}</span>
        </h1>

        <div className="flex gap-2">
          {pokemonDetails.types.map((type) => (
            <span
              key={type.type.name}
              className="px-3 py-1 bg-gray-100 rounded-full capitalize text-sm"
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Stats</h2>
        <ul className="grid grid-cols-2 gap-2">
          {pokemonDetails.stats.map((stat) => (
            <li key={stat.stat.name} className="capitalize">
              <strong>{stat.stat.name}:</strong> {stat.base_stat}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Moves</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {pokemonDetails.moves.slice(0, 10).map((move) => (
            <li key={move.move.name} className="capitalize">
              {move.move.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailPage;
