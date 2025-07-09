import { useEffect, useState } from "react";
import type { PokemonDetail } from "../types/pokemon";
import api from "@/lib/axios";
import type { AxiosError } from "axios";

export const usePokemonDetails = (pokemonName: string) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!pokemonName) return;

      setLoading(true);
      setNotFound(false);
      try {
        const { data } = await api.get<PokemonDetail>(`pokemon/${pokemonName}`);
        setPokemonDetails(data);
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("Error Loading Pokémon:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [pokemonName]);
  return { pokemonDetails, loading, notFound };
};
