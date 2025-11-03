<script setup lang="ts">
// DATA
///////

const PAGE_SIZE = 60;
const POKEMON_COUNT = 1025;
const MIN_PAGE = 1;
const MAX_PAGE = Math.ceil(POKEMON_COUNT / PAGE_SIZE) + 1;

const page = ref(MIN_PAGE);

// COMPUTED
///////////

const start = computed(() => {
  return Math.max((page.value - 1) * PAGE_SIZE + 1, 0);
});

const end = computed(() => {
  return Math.min(page.value * PAGE_SIZE + 1, POKEMON_COUNT);
});
</script>

<template>
  <Paginator :min-page="MIN_PAGE" :max-page="MAX_PAGE" v-model="page" />
  <PokemonGalleryDisplay :start="start" :end="end" />
  <Paginator :min-page="MIN_PAGE" :max-page="MAX_PAGE" v-model="page" />
  <div class="trailing-gap"></div>
</template>

<style scoped></style>
