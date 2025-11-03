import { PkApiPokemonSpecies, PokemonSpecies, PokemonSpeciesSerialized } from "~/lib/pokemon";

export default defineEventHandler(
  async (event): Promise<Readonly<PokemonSpeciesSerialized> | null> => {
    const idStr = event?.context?.params?.id;
    if (!idStr) {
      return null;
    }
    const res: PkApiPokemonSpecies = await $fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${idStr}`
    );
    return PokemonSpecies.fromPkApiPokemonSpecies(res);
  }
);
