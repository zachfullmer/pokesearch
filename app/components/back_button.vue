<script setup lang="ts">
import IconArrowLeft from "~/assets/icons/arrow_left.svg";
</script>

<template>
  <span class="back-button">
    <div>
      <IconArrowLeft />
    </div>
    <span>Back</span>
  </span>
</template>

<style>
.back-button {
  display: inline-flex;
  align-items: center;
  justify-items: center;
  padding: 0.3em;
  color: var(--fg1);
  background: var(--bg2);
  border: solid 1px #5f5f79;
  border-radius: 0.2em;
  cursor: pointer;
}
</style>
