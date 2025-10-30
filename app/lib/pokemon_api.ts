import { Pokemon, type PokemonSerialized } from "./pokemon";

/**
 * Retrieve one Pokémon from its unique database ID in PokéAPI.
 * @param id Unique ID in PokéAPI.
 * @returns A Pokémon result, async.
 */
export async function getPokemonWithId(id: string): Promise<Pokemon | null> {
  const endpoint = `/api/pokemon/${id}`;
  const { data } = useAsyncData(
    endpoint,
    async () => {
      // If the Pokémon is not cached, load it from the API. If the API
      // call is cached, it will return that cached response. If it isn't,
      // the remote PokéAPI endpoint will be called.
      return await $fetch(endpoint);
    },
    {
      getCachedData: (key) => {
        const data = useNuxtApp().payload.data[key];
        if (!data) {
          return;
        }
        // If the Pokémon is cached on the client side,
        // just reuse it.
        return data;
      },
    }
  );
  if (data.value) {
    return Pokemon.fromSerialized(data.value as PokemonSerialized);
  }
  return null;
}

/**
 * Retrieve many Pokémon from their unique database IDs in PokéAPI.
 * @param ids Unique ID in PokéAPI.
 * @returns A list of Pokémon results, async.
 */
export async function getAllPokemonWithIds(
  ...ids: string[]
): Promise<(Pokemon | null)[]> {
  return Promise.all(ids.map((id) => getPokemonWithId(id)));
}
