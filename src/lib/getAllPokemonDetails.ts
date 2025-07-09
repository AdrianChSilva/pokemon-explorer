import type { PokemonDetail } from "@/types/pokemon";
import api from "./axios";

export const getAllPokemonDetails = async (names: string[]): Promise<PokemonDetail[]> => {
  const responses = await Promise.all(
    names.map((name) => api.get<PokemonDetail>(`pokemon/${name}`))
  );

  return responses.map((res) => res.data);
};
