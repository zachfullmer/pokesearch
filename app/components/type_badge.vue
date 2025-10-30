<script setup lang="ts">
// scripts
import { type PokemonType, POKEMON_TYPE_DATA } from "~/lib/pokemon_types";

const props = defineProps<{
  type: PokemonType;
}>();
</script>

<template>
  <span :class="{ badge: true, [type]: true }">
    <div class="icon-panel">
      <component :is="POKEMON_TYPE_DATA[type].icon" />
    </div>
    <span class="name-panel">
      {{ type.toUpperCase() }}
    </span>
  </span>
</template>

<style lang="css" scoped>
.badge {
  --badge-radius: 0.2em;
  display: flex;
  padding: 0;
}

.badge .name-panel {
  display: inline-flex;
  align-items: center;
  padding: 0 0.5em;
  color: var(--bg1);
  background: #34344c;
  border: solid 1px var(--fg1);
  border-left: none;
  border-start-end-radius: var(--badge-radius);
  border-end-end-radius: var(--badge-radius);
  vertical-align: middle;
}

.badge .icon-panel {
  padding: 0 0.2em;
  border-start-start-radius: var(--badge-radius);
  border-end-start-radius: var(--badge-radius);
  border: solid 1px var(--fg1);
}

/*
I'm keeping dependencies to a minimum in this project, but a Sass rule
mapping type names to colors could have made this a lot more compact,
if slightly less clear.
*/

.badge.normal .icon-panel {
  color: var(--type-fg-normal);
  background: var(--type-bg-normal);
}
.badge.fighting .icon-panel {
  color: var(--type-fg-fighting);
  background: var(--type-bg-fighting);
}
.badge.flying .icon-panel {
  color: var(--type-fg-flying);
  background: var(--type-bg-flying);
}
.badge.poison .icon-panel {
  color: var(--type-fg-poison);
  background: var(--type-bg-poison);
}
.badge.ground .icon-panel {
  color: var(--type-fg-ground);
  background: var(--type-bg-ground);
}
.badge.rock .icon-panel {
  color: var(--type-fg-rock);
  background: var(--type-bg-rock);
}
.badge.bug .icon-panel {
  color: var(--type-fg-bug);
  background: var(--type-bg-bug);
}
.badge.ghost .icon-panel {
  color: var(--type-fg-ghost);
  background: var(--type-bg-ghost);
}
.badge.steel .icon-panel {
  color: var(--type-fg-steel);
  background: var(--type-bg-steel);
}
.badge.fire .icon-panel {
  color: var(--type-fg-fire);
  background: var(--type-bg-fire);
}
.badge.water .icon-panel {
  color: var(--type-fg-water);
  background: var(--type-bg-water);
}
.badge.grass .icon-panel {
  color: var(--type-fg-grass);
  background: var(--type-bg-grass);
}
.badge.electric .icon-panel {
  color: var(--type-fg-electric);
  background: var(--type-bg-electric);
}
.badge.psychic .icon-panel {
  color: var(--type-fg-psychic);
  background: var(--type-bg-psychic);
}
.badge.ice .icon-panel {
  color: var(--type-fg-ice);
  background: var(--type-bg-ice);
}
.badge.dragon .icon-panel {
  color: var(--type-fg-dragon);
  background: var(--type-bg-dragon);
}
.badge.dark .icon-panel {
  color: var(--type-fg-dark);
  background: var(--type-bg-dark);
}
.badge.fairy .icon-panel {
  color: var(--type-fg-fairy);
  background: var(--type-bg-fairy);
}
.badge.stellar .icon-panel {
  color: var(--type-fg-fire);
  background: var(--type-bg-fire);
  animation: stellar-rainbow 30s infinite linear;
}
.badge.unknown .icon-panel {
  color: var(--type-fg-unknown);
  background: var(--type-bg-unknown);
}
</style>
