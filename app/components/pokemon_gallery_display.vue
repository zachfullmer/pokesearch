<script setup lang="ts">
// scripts
import { range } from "~/lib/generators";
import { Pokemon } from "~/lib/pokemon";
import { getAllPokemonWithIds } from "~/lib/pokemon_api";
import { stringContainsBrokenSubstring } from "~/lib/string_ops";

// DATA
///////

const props = defineProps<{
  start: number;
  end: number;
}>();

const searchString = useState("searchString", () => "");
const useBrokenStringMatching = useState("useBrokenStringMatching", () => true);

const loading = ref(false);
const pokemonList: Ref<(Pokemon | null)[]> = ref([]);

// COMPUTED
///////////

watch(
  [() => props.start, () => props.end],
  async () => {
    loading.value = true;
    const newPokemonList = await getAllPokemonWithIds(
      ...range(props.start, props.end).map((id) => "" + id)
    );
    if (newPokemonList[0]?.id == props.start) {
      pokemonList.value = newPokemonList;
    }
    loading.value = false;
  },
  { immediate: true }
);

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
  <div
    class="pokemon-card-gallery loading"
    :style="{ opacity: loading ? 0.5 : 1 }"
  >
    <PokemonCard
      v-for="pokemon in pokemonListFiltered"
      :key="pokemon.id"
      :pokemon="pokemon"
    />
  </div>
</template>

<style scoped></style>
