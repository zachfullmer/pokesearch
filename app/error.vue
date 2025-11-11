<script setup lang="ts">
import type { NuxtError } from "#app";
import IconArrowLeft from "~/assets/icons/arrow_left.svg";

const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <ModularButton @click="handleError">
      <div>
        <IconArrowLeft />
      </div>
      <span>Back</span>
    </ModularButton>
    <div v-if="error">
      <p>{{ error.message }}</p>
      <p>{{ error.statusCode }}: {{ error.statusMessage }}</p>
    </div>
  </NuxtLayout>
</template>

<style scoped>
</style>
