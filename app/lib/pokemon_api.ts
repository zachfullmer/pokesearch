import type { PkApiPokemon } from "./pokemon";

/**
 * Retrieve one Pokémon from its unique database ID in PokéAPI.
 * @param id Unique ID in PokéAPI.
 * @returns A PkApiPokemon result, async.
 */
export async function getPokemonWithId(id: number): Promise<PkApiPokemon> {
  return $fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
}

/**
 * Retrieve many Pokémon from their unique database IDs in PokéAPI.
 * @param ids Unique ID in PokéAPI.
 * @returns A list of PkApiPokemon results, asnyc.
 */
export async function getAllPokemonWithIds(
  ...ids: number[]
): Promise<PkApiPokemon[]> {
  return Promise.all(
    ids.map(
      (id) =>
        $fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        ) as Promise<PkApiPokemon>
    )
  );
}
