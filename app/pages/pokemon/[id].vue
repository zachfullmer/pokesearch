<script setup lang="ts">
// scripts
import {
  Pokemon,
  type UnitType,
  PokemonSpecies,
  EvolutionChain,
  type RelativeEvolutions,
} from "~/lib/pokemon";
import {
  getAllPokemonInRelativeEvolutions,
  getAllPokemonSpeciesInRelativeEvolutions,
  getEvolutionChainWithId,
  getPokemonSpeciesWithId,
  getPokemonWithId,
} from "~/lib/pokemon_api";
import IconArrowLeft from "~/assets/icons/arrow_left.svg";

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
let pokemonId = "0";
if (typeof route.params.id == "string") {
  pokemonId = route.params.id;
}

const pokemon: Ref<Pokemon | null> = ref(null);
const pokemonSpecies: Ref<PokemonSpecies | null> = ref(null);
const evolutionChain: Ref<EvolutionChain | null> = ref(null);
const relativeEvolutions: Ref<RelativeEvolutions | null> = ref(null);

pokemon.value = await getPokemonWithId(pokemonId);
if (pokemon.value) {
  pokemonSpecies.value = await getPokemonSpeciesWithId(
    "" + pokemon.value.speciesId
  );
}
if (pokemonSpecies.value) {
  evolutionChain.value = await getEvolutionChainWithId(
    "" + pokemonSpecies.value?.evolutionChainId
  );
}
if (evolutionChain.value) {
  const relativeEvolutionRefs =
    evolutionChain.value.getRelativeEvolutionRefsById(pokemonSpecies.value!.id);
  const relativeEvolutionSpecies =
    await getAllPokemonSpeciesInRelativeEvolutions(relativeEvolutionRefs);
  relativeEvolutions.value = await getAllPokemonInRelativeEvolutions(
    relativeEvolutionSpecies
  );
}

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
  <div style="">
    <NuxtLink class="nuxt-link-unstyled" to="/pokemon">
      <ModularButton>
        <div>
          <IconArrowLeft />
        </div>
        <span>Back</span>
      </ModularButton>
    </NuxtLink>
    <PokemonInfoDisplay
      v-if="pokemon && pokemonSpecies && relativeEvolutions"
      :pokemon="pokemon"
      :species="pokemonSpecies"
      :evolutions="relativeEvolutions"
      :unit-type="unitType"
    />
    <div class="trailing-gap"></div>
  </div>
</template>

<style scoped>
.type-container {
  display: flex;
  gap: 0.6em;
}
</style>
