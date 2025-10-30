<script setup lang="ts">
// scripts
import { range } from "~/lib/generators";
import { Pokemon } from "~/lib/pokemon";
import { getAllPokemonWithIds } from "~/lib/pokemon_api";
import { stringContainsBrokenSubstring } from "~/lib/string_ops";

// DATA
///////

const searchString = useState("searchString", () => "");
const useBrokenStringMatching = useState("useBrokenStringMatching", () => true);

const pokemonList: Ref<(Pokemon | null)[]> = ref(
  await getAllPokemonWithIds(...range(1, 61).map((id) => "" + id))
);

// COMPUTED
///////////

const pokemonListFiltered: ComputedRef<Pokemon[]> = computed(() => {
  if (searchString.value.length == 0) {
    return (pokemonList.value?.filter((pokemon) => pokemon) || []) as Pokemon[];
  }
  if (useBrokenStringMatching.value) {
    return (pokemonList.value?.filter(
      (pokemon) =>
        pokemon &&
        stringContainsBrokenSubstring(pokemon.name, searchString.value)
    ) || []) as Pokemon[];
  }
  return (pokemonList.value?.filter(
    (pokemon) => pokemon && pokemon.name.includes(searchString.value)
  ) || []) as Pokemon[];
});
</script>

<template>
  <div class="pokemon-card-gallery">
    <PokemonCard
      v-for="pokemon in pokemonListFiltered"
      :key="pokemon.id"
      :pokemon="pokemon"
    />
  </div>
</template>

<style>
.pokemon-card-gallery {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 20em;
}
</style>
