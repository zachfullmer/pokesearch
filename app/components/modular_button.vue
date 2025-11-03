<script setup lang="ts">

// DATA
///////

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);
</script>

<template>
  <span :class="{ 'modular-button': true, disabled }">
    <slot></slot>
  </span>
</template>

<style>
.modular-button {
  display: inline-flex;
  align-items: center;
  justify-items: center;
  padding: 0.3em;
  color: var(--fg1);
  background: var(--bg2);
  border: solid 1px #5f5f79;
  border-radius: 0.2em;
  cursor: pointer;
  transition: all 0.1s linear;
  user-select: none;
}

.modular-button.disabled {
  color: var(--fg2);
  border: solid 1px var(--bg3);
  cursor: inherit;
  pointer-events: none;
}

.modular-button:not(.disabled):hover {
  background: var(--bg3);
  transition: all 0.1s linear;
}
</style>
