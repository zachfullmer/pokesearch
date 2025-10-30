<script setup lang="ts">
// scripts
import { Pokemon, type PkApiPokemon, type UnitType } from "~/lib/pokemon";
import { getPokemonWithId } from "~/lib/pokemon_api";

definePageMeta({
  validate(route) {
    // only accept an integer for the `id` param
    return typeof route.params.id === "string" && /^\d+$/.test(route.params.id);
  },
});

// DATA
///////

const useMetricUnits = useState("useMetricUnits", () => true);
const route = useRoute();
let pokemonId = 0;
if (typeof route.params.id == "string") {
  pokemonId = parseInt(route.params.id);
}

const pokemonResult = await useAsyncData(() => {
  return getPokemonWithId(pokemonId);
});

const pokemon = ref(
  pokemonResult.data.value
    ? Pokemon.fromPkApiPokemon(pokemonResult.data.value)
    : null
);

// COMPUTED
///////////

const unitType: ComputedRef<UnitType> = computed(() => {
  if (useMetricUnits.value) {
    return "metric";
  }
  return "imperial";
});
</script>

<template>
  <NuxtLink class="nuxt-link-unstyled" to="/pokemon">
    <BackButton />
  </NuxtLink>
  <PokemonInfoDisplay v-if="pokemon" :pokemon="pokemon" :unit-type="unitType" />
</template>

<style scoped>
.type-container {
  display: flex;
  gap: 0.6em;
}
</style>
