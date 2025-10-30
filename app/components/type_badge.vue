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
  color: white;
  background: #34344c;
  padding: 0 0.5em;
  border: solid 1px #5f5f79;
  border-left: none;
  border-start-end-radius: var(--badge-radius);
  border-end-end-radius: var(--badge-radius);
  vertical-align: middle;
}

.badge .icon-panel {
  padding: 0 0.2em;
  border-start-start-radius: var(--badge-radius);
  border-end-start-radius: var(--badge-radius);
}

/*
I'm keeping dependencies to a minimum in this project, but a Sass rule
mapping type names to colors could have made this a lot more compact,
if slightly less clear.
*/

.badge.normal .icon-panel {
  color: var(--type-fg-normal);
  background: var(--type-bg-normal);
  border: solid 1px var(--type-fg-normal);
}
.badge.fighting .icon-panel {
  color: var(--type-fg-fighting);
  background: var(--type-bg-fighting);
  border: solid 1px var(--type-fg-fighting);
}
.badge.flying .icon-panel {
  color: var(--type-fg-flying);
  background: var(--type-bg-flying);
  border: solid 1px var(--type-fg-flying);
}
.badge.poison .icon-panel {
  color: var(--type-fg-poison);
  background: var(--type-bg-poison);
  border: solid 1px var(--type-fg-poison);
}
.badge.ground .icon-panel {
  color: var(--type-fg-ground);
  background: var(--type-bg-ground);
  border: solid 1px var(--type-fg-ground);
}
.badge.rock .icon-panel {
  color: var(--type-fg-rock);
  background: var(--type-bg-rock);
  border: solid 1px var(--type-fg-rock);
}
.badge.bug .icon-panel {
  color: var(--type-fg-bug);
  background: var(--type-bg-bug);
  border: solid 1px var(--type-fg-bug);
}
.badge.ghost .icon-panel {
  color: var(--type-fg-ghost);
  background: var(--type-bg-ghost);
  border: solid 1px var(--type-fg-ghost);
}
.badge.steel .icon-panel {
  color: var(--type-fg-steel);
  background: var(--type-bg-steel);
  border: solid 1px var(--type-fg-steel);
}
.badge.fire .icon-panel {
  color: var(--type-fg-fire);
  background: var(--type-bg-fire);
  border: solid 1px var(--type-fg-fire);
}
.badge.water .icon-panel {
  color: var(--type-fg-water);
  background: var(--type-bg-water);
  border: solid 1px var(--type-fg-water);
}
.badge.grass .icon-panel {
  color: var(--type-fg-grass);
  background: var(--type-bg-grass);
  border: solid 1px var(--type-fg-grass);
}
.badge.electric .icon-panel {
  color: var(--type-fg-electric);
  background: var(--type-bg-electric);
  border: solid 1px var(--type-fg-electric);
}
.badge.psychic .icon-panel {
  color: var(--type-fg-psychic);
  background: var(--type-bg-psychic);
  border: solid 1px var(--type-fg-psychic);
}
.badge.ice .icon-panel {
  color: var(--type-fg-ice);
  background: var(--type-bg-ice);
  border: solid 1px var(--type-fg-ice);
}
.badge.dragon .icon-panel {
  color: var(--type-fg-dragon);
  background: var(--type-bg-dragon);
  border: solid 1px var(--type-fg-dragon);
}
.badge.dark .icon-panel {
  color: var(--type-fg-dark);
  background: var(--type-bg-dark);
  border: solid 1px var(--type-fg-dark);
}
.badge.fairy .icon-panel {
  color: var(--type-fg-fairy);
  background: var(--type-bg-fairy);
  border: solid 1px var(--type-fg-fairy);
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
