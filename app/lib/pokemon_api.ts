import {
  EvolutionChain,
  type EvolutionChainSerialized,
  Pokemon,
  type PokemonSerialized,
  PokemonSpecies,
  type PokemonSpeciesSerialized,
  type RelativeEvolutionRefs,
  type RelativeEvolutions,
  type RelativeEvolutionSpecies,
} from "~/lib/pokemon";

/**
 * Retrieve one Pokémon from its unique database ID in PokéAPI.
 * @param id Unique ID in PokéAPI.
 * @returns A Pokémon result, async.
 */
export async function getPokemonWithId(id: string): Promise<Pokemon | null> {
  const endpoint = `/api/pokemon/${id}`;
  const { data } = await useAsyncData(
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

/**
 * Retrieve many Pokémon from their unique database IDs in PokéAPI.
 * @param ids Unique ID in PokéAPI.
 * @returns A list of Pokémon results, async.
 */
export async function getAllPokemonSpeciesInRelativeEvolutions(
  relativeEvolutionRefs: RelativeEvolutionRefs
): Promise<RelativeEvolutionSpecies> {
  const [evolvesFromSpecies, evolvesToSpecies] = await Promise.all([
    Promise.all(
      relativeEvolutionRefs.evolvesFrom.map((speciesRef) =>
        getPokemonSpeciesWithId("" + speciesRef.id)
      )
    ),
    Promise.all(
      relativeEvolutionRefs.evolvesTo.map((speciesRef) =>
        getPokemonSpeciesWithId("" + speciesRef.id)
      )
    ),
  ]);
  return {
    evolvesFrom: evolvesFromSpecies.filter(spec=>spec) as PokemonSpecies[],
    evolvesTo: evolvesToSpecies.filter(spec=>spec) as PokemonSpecies[]
  }
}

/**
 * Retrieve many Pokémon from their unique database IDs in PokéAPI.
 * @param ids Unique ID in PokéAPI.
 * @returns A list of Pokémon results, async.
 */
export async function getAllPokemonInRelativeEvolutions(
  relativeEvolutionRefs: RelativeEvolutionSpecies
): Promise<RelativeEvolutions> {
  const [evolvesFrom, evolvesTo] = await Promise.all([
    Promise.all(
      relativeEvolutionRefs.evolvesFrom.map((species) =>
        species?.defaultVariety?.id
          ? getPokemonWithId("" + species!.defaultVariety!.id)
          : null
      )
    ),
    Promise.all(
      relativeEvolutionRefs.evolvesTo.map((species) =>
        species?.defaultVariety?.id
          ? getPokemonWithId("" + species!.defaultVariety!.id)
          : null
      )
    ),
  ]);
  return {
    evolvesFrom: evolvesFrom.filter(pk=>pk) as Pokemon[],
    evolvesTo: evolvesTo.filter(pk=>pk) as Pokemon[]
  }
}

/**
 * Retrieve one Pokémon Species from its unique database ID in PokéAPI.
 * @param id Unique ID in PokéAPI.
 * @returns A Pokémon Species result, async.
 */
export async function getPokemonSpeciesWithId(
  id: string
): Promise<PokemonSpecies | null> {
  const endpoint = `/api/species/${id}`;
  const { data } = await useAsyncData(
    endpoint,
    async () => {
      // If the Pokémon Species is not cached, load it from the API. If the API
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
        // If the Pokémon Species is cached on the client side,
        // just reuse it.
        return data;
      },
    }
  );
  if (data.value) {
    return PokemonSpecies.fromSerialized(
      data.value as PokemonSpeciesSerialized
    );
  }
  return null;
}

/**
 * Retrieve one Evolution Chain from its unique database ID in PokéAPI.
 * @param id Unique ID in PokéAPI.
 * @returns An Evolution Chain result, async.
 */
export async function getEvolutionChainWithId(
  id: string
): Promise<EvolutionChain | null> {
  const endpoint = `/api/evolution/${id}`;
  const { data } = await useAsyncData(
    endpoint,
    async () => {
      // If the Evolution Chain is not cached, load it from the API. If the API
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
        // If the Evolution Chain is cached on the client side,
        // just reuse it.
        return data;
      },
    }
  );
  if (data.value) {
    return EvolutionChain.fromSerialized(
      data.value as EvolutionChainSerialized
    );
  }
  return null;
}
