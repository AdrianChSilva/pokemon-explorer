import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/axios";
import { useFavoritesStore } from "@/store/favorites";
import { Button } from "@/components/ui/button";
import { Heart, HeartIcon } from "lucide-react";
import type { PokemonDetail } from "@/types/pokemon";

const DetailPage = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isFav = name ? isFavorite(name) : false;

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<PokemonDetail>(`pokemon/${name}`);
        setPokemon(data);
      } catch (err) {
        console.error("Error cargando Pokémon:", err);
      } finally {
        setLoading(false);
      }
    };

    if (name) fetchPokemon();
  }, [name]);

  const toggleFavorite = () => {
    if (!name) return;

    if (isFav) {
      removeFavorite(name);
    } else {
      addFavorite(name);
    }
  };

  if (loading || !pokemon) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  if (loading || !pokemon) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

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
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-48 h-48"
        />
        <h1 className="text-3xl font-bold capitalize">
          {pokemon.name} <span className="text-gray-500">#{pokemon.id}</span>
        </h1>

        <div className="flex gap-2">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="px-3 py-1 bg-gray-100 rounded-full capitalize text-sm"
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>
        <ul className="grid grid-cols-2 gap-2">
          {pokemon.stats.map((stat) => (
            <li key={stat.stat.name} className="capitalize">
              <strong>{stat.stat.name}:</strong> {stat.base_stat}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Movimientos</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {pokemon.moves.slice(0, 20).map((move) => (
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
