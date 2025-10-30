<script setup lang="ts">
// scripts
import { range } from "~/lib/generators";
import { Pokemon } from "~/lib/pokemon";
import { getAllPokemonWithIds } from "~/lib/pokemon_api";
import { stringContainsBrokenSubstring } from "~/lib/string_ops";

// DATA
///////

const searchString = useState('searchString', () => "");
const useBrokenStringMatching = useState('useBrokenStringMatching', () => true);

const pokemonGalleryResult = await useAsyncData("gallery", () => {
  return getAllPokemonWithIds(...range(1, 61));
});
const pokemonList: Ref<Pokemon[] | undefined> = ref(
  pokemonGalleryResult.data.value?.map((pkApiPokemon) =>
    Pokemon.fromPkApiPokemon(pkApiPokemon)
  )
);

// COMPUTED
///////////

const pokemonListFiltered = computed(() => {
  if (searchString.value.length == 0) {
    return pokemonList.value || [];
  }
  if(useBrokenStringMatching.value) {
    return (
      pokemonList.value?.filter((pokemon) =>
        stringContainsBrokenSubstring(pokemon.name, searchString.value)
      ) || []
    );
  }
  return (
    pokemonList.value?.filter((pokemon) =>
      pokemon.name.includes(searchString.value)
    ) || []
  );
});
</script>

<template>
  <div class="pokemon-card-gallery">
    <PokemonCard v-for="pokemon in pokemonListFiltered" :key="pokemon.id" :pokemon="pokemon" />
  </div>
</template>

<style>
.pokemon-card-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20em;
}
</style>
