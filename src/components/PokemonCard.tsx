import type { PokemonDetail } from "@/types/pokemon";
import { TYPE_COLORS } from "@/types/typeColors";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { useFavoritesStore } from "@/store/favorites";
import { Button } from "./ui/button";
import { Heart, Heart as HeartIcon } from "lucide-react";
import React from "react";

interface Props {
  pokemon: PokemonDetail;
}

export const PokemonCard = React.memo(({ pokemon }: Props) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const fav = isFavorite(pokemon.name);

  const toggleFavorite = () => {
    if (fav) {
      removeFavorite(pokemon.name);
    } else {
      addFavorite(pokemon.name);
    }
  };
  const bg = getGradient(pokemon.types.map((t) => t.type.name));
  const renderedTypes = pokemon.types.map((t) => (
    <span
      key={t.type.name}
      className="px-2 py-1 rounded-full bg-white/20 text-xs capitalize"
    >
      {t.type.name}
    </span>
  ));

  return (
    <Card
      className="relative overflow-hidden transition transform hover:scale-[1.02]"
      style={{ background: bg }}
    >
      <Button
        onClick={toggleFavorite}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-white hover:bg-white/10"
      >
        {fav ? <Heart className="fill-white" /> : <HeartIcon />}
      </Button>

      <Link to={`/pokemon/${pokemon.name}`}>
        <CardContent className="p-4 text-white flex flex-col items-center text-center">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-24 h-24"
          />
          <h2 className="text-lg font-semibold capitalize mt-2">
            {pokemon.name}
          </h2>
          <p className="text-sm">N.º {pokemon.id}</p>
          <div className="flex gap-2 mt-2 flex-wrap justify-center">
            {renderedTypes}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
});

const getGradient = (types: string[]): string => {
  const colors = types.map((type) => TYPE_COLORS[type] || "#AAA");

  if (colors.length === 1) return colors[0];
  if (colors.length === 2)
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  return `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
};
