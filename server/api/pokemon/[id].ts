import { PkApiPokemon, Pokemon, PokemonSerialized } from "~/lib/pokemon";

export default defineEventHandler(
  async (event): Promise<Readonly<PokemonSerialized> | null> => {
    const idStr = event?.context?.params?.id;
    if (!idStr) {
      return null;
    }
    try {
      const res: PkApiPokemon = await $fetch(
        `https://pokeapi.co/api/v2/pokemon/${idStr}`
      );
      return Pokemon.fromPkApiPokemon(res);
    } catch (err) {
      throw createError(err as unknown as any);
    }
  }
);
