<script setup lang="ts">
// scripts
import { Pokemon } from "~/lib/pokemon";
import { capitalize } from "~/lib/string_ops";

// DATA
///////

const props = withDefaults(
  defineProps<{
    pokemon: Readonly<Pokemon>;
  }>(),
  {
    pokemon: () => Pokemon.default,
  }
);

// COMPUTED
///////////

const pokemonNameCapitalized = computed(() => {
  return capitalize(props.pokemon.name);
});
</script>

<template>
  <NuxtLink class="nuxt-link-unstyled" :to="`/pokemon/${pokemon.id}`">
    <div class="pokemon-card">
      <div class="card-image-container">
        <img :src="pokemon.defaultSprites.items['default']!.url"></img>
      </div>
      <div class="card-name-panel">{{ pokemonNameCapitalized }}</div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.pokemon-card {
  display: flex;
  flex-direction: column;
  border: solid 1px white;
  border-radius: 0.3em;
}

.card-image-container {
  width: 180px;
  height: 180px;
  padding: 1em;
  border-bottom: solid 1px white;
}

.card-image-container img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  /* Prevent anti-aliasing of the pixel art */
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
}

.card-name-panel {
  padding: 0.5em;
}

.card-name-panel {
  text-align: center;
  font-size: larger;
}
</style>