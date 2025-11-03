<script setup lang="ts">
// DATA
///////

const PAGE_SIZE = 60;
const POKEMON_COUNT = 1025;
const MIN_PAGE = 1;
const MAX_PAGE = Math.ceil(POKEMON_COUNT / PAGE_SIZE) + 1;

const galleryPage = useState("galleryPage", () => 1);

// COMPUTED
///////////

const start = computed(() => {
  return Math.max((galleryPage.value - 1) * PAGE_SIZE + 1, 0);
});

const end = computed(() => {
  return Math.min(galleryPage.value * PAGE_SIZE + 1, POKEMON_COUNT);
});
</script>

<template>
  <Paginator :min-page="MIN_PAGE" :max-page="MAX_PAGE" v-model="galleryPage" />
  <PokemonGalleryDisplay :start="start" :end="end" />
  <Paginator :min-page="MIN_PAGE" :max-page="MAX_PAGE" v-model="galleryPage" />
  <div class="trailing-gap"></div>
</template>

<style scoped></style>
