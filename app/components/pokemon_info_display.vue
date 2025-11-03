<script setup lang="ts">
// scripts
import {
  Pokemon,
  PokemonSpecies,
  type RelativeEvolutions,
  type UnitType,
} from "~/lib/pokemon";
import { capitalize } from "~/lib/string_ops";

// DATA
///////

const props = withDefaults(
  defineProps<{
    // This view shouldn't ever have any reason to mutate the Pokémon object
    // passed to it.
    pokemon: Readonly<Pokemon>;
    species: Readonly<PokemonSpecies>;
    evolutions: Readonly<RelativeEvolutions>;
    unitType: UnitType;
  }>(),
  {
    pokemon: () => Pokemon.default,
    unitType: "imperial",
  }
);

// Set the sprite generation in the dropdown to the first value in the map.
// This should be the "Default" generation. See `Pokemon.extractSpriteOptions`.
const defaultSpriteGeneration = Object.keys(props.pokemon.spriteOptions)?.[0];
// Refs which store the values of the sprite selection dropdowns.
const chosenSpriteGeneration: Ref<string | undefined> = ref(
  defaultSpriteGeneration
);
const chosenSpriteGame: Ref<string | undefined> = ref(undefined);
const chosenSprite: Ref<string | undefined> = ref(undefined);
const chosenSpriteUrl: Ref<string | undefined> = ref(undefined);

// COMPUTED
///////////

const pokemonNameCapitalized = computed(() => {
  return capitalize(props.pokemon.name);
});

// Computed values for displaying Pokémon height and weight using the configured units.

const pokemonHeightMString = computed(() => {
  return `${(props.pokemon.heightDm * 0.1).toFixed(1)} m`;
});

const pokemonHeightFtInString = computed(() => {
  const totalInches = Math.round(props.pokemon.heightDm * 3.937008);
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
});

const pokemonHeightString: ComputedRef<string> = computed(() => {
  switch (props.unitType) {
    case "imperial":
      return pokemonHeightFtInString.value;
    case "metric":
      return pokemonHeightMString.value;
  }
  // the type system will catch any missing values, no default needed here
});

const pokemonWeightKgString = computed(() => {
  return `${(props.pokemon.weightHg * 0.1).toFixed(1)} kg`;
});

const pokemonWeightLbString = computed(() => {
  return `${(props.pokemon.weightHg * 0.2204623).toFixed(1)} lbs`;
});

const pokemonWeightString: ComputedRef<string> = computed(() => {
  switch (props.unitType) {
    case "imperial":
      return pokemonWeightLbString.value;
    case "metric":
      return pokemonWeightKgString.value;
  }
  // the type system will catch any missing values, no default needed here
});

const pokemonAbilityListString = computed(() => {
  return props.pokemon.abilities
    .map((ability) => capitalize(ability))
    .join(", ");
});

// Watchers that control the behavior of the sprite selection dropdowns. Each dropdown is populated by the
// contents of the previous one (e.g. the Game dropdown needs to know which Generation is selected, and the
// Sprite dropdown needs to know which Game is selected).

// Normally these would be calculated with computed values, but they're both user-controlled and
// part of a nested data structure. Watchers let us cascade the changes while allowing for user
// intervention.

watch(
  chosenSpriteGeneration,
  (newGen) => {
    // When the sprite Generation dropdown is changed, update the chosen game to equal the first one
    // in that Generation's `items` map.
    if (!newGen) {
      chosenSpriteGame.value = undefined;
      return;
    }
    const games = props.pokemon.spriteOptions[newGen]?.items;
    if (!games) {
      chosenSpriteGame.value = undefined;
      return;
    }
    chosenSpriteGame.value = Object.keys(games)[0];
  },
  {
    // run this watcher when the page loads as well
    immediate: true,
  }
);

watch(
  chosenSpriteGame,
  (newGame) => {
    // When the sprite Game is changed, update the chosen sprite to equal the first one
    // in that Game's list.
    if (!chosenSpriteGeneration.value || !newGame) {
      chosenSprite.value = undefined;
      return;
    }
    const sprites =
      props.pokemon.spriteOptions[chosenSpriteGeneration.value]?.items[newGame]
        ?.items;
    if (!sprites) {
      chosenSprite.value = undefined;
      return;
    }
    // Unlike in the previous watcher, there's an exception to setting a new chosenSprite value.
    // If the currently-chosen sprite ID is also one of the options in the new sprite map, we can
    // just keep the current one. This means that if you have "Shiny" selected as your sprite type
    // and switch games, it will continue showing you shinies.
    if (!(chosenSprite.value && chosenSprite.value in sprites)) {
      chosenSprite.value = Object.keys(sprites)[0];
    }
  },
  {
    // run this watcher when the page loads as well
    immediate: true,
  }
);

watch(
  [chosenSpriteGeneration, chosenSpriteGame, chosenSprite],
  () => {
    // When the value of ANY of the sprite selection dropdowns changes, update the URL
    // of the sprite to display.
    if (
      !chosenSpriteGeneration.value ||
      !chosenSpriteGame.value ||
      !chosenSprite.value
    ) {
      chosenSpriteUrl.value = undefined;
      return;
    }
    const url =
      props.pokemon.spriteOptions[chosenSpriteGeneration.value]?.items[
        chosenSpriteGame.value
      ]?.items[chosenSprite.value]?.url;
    if (!url) {
      chosenSpriteUrl.value = undefined;
      return;
    }
    chosenSpriteUrl.value = url;
  },
  {
    // run this watcher when the page loads as well
    immediate: true,
  }
);
</script>

<template>
  <div class="pokemon-header">
    <div class="pokemon-info-container">
      <div class="pokemon-name">{{ pokemonNameCapitalized }}</div>
      <div class="pokemon-short-desc">{{ species.shortDesc }}</div>
      <div class="type-container">
        <TypeBadge v-for="type in pokemon.types" :type="type" />
      </div>
      <table class="pokemon-info-table">
        <tbody>
          <tr>
            <td>Height:</td>
            <td>{{ pokemonHeightString }}</td>
          </tr>
          <tr>
            <td>Weight:</td>
            <td>{{ pokemonWeightString }}</td>
          </tr>
          <tr>
            <td>Abilities:</td>
            <td>{{ pokemonAbilityListString }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pokemon-image-info-container">
      <div class="sprite-selector-container-top">
        <select v-model="chosenSpriteGeneration">
          <option
            v-for="(spriteGen, spriteGenId) in pokemon.spriteOptions"
            :value="spriteGenId"
          >
            {{ spriteGen.label }}
          </option>
        </select>
        <select v-if="chosenSpriteGeneration" v-model="chosenSpriteGame">
          <option
            v-for="(spriteGame, spriteGameId) in pokemon.spriteOptions[
              chosenSpriteGeneration
            ]?.items"
            :value="spriteGameId"
          >
            {{ spriteGame.label }}
          </option>
        </select>
      </div>
      <div class="pokemon-image-container">
        <img :src="chosenSpriteUrl" />
      </div>
      <div class="sprite-selector-container-bottom">
        <select
          v-if="chosenSpriteGeneration && chosenSpriteGame"
          v-model="chosenSprite"
        >
          <option
            v-for="(sprite, spriteId) in pokemon.spriteOptions[
              chosenSpriteGeneration
            ]?.items[chosenSpriteGame]?.items"
            :value="spriteId"
          >
            {{ sprite.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <div class="evolution-container">
    <div>
      <h2>Evolves From</h2>
      <div
        v-if="evolutions.evolvesFrom.length"
        class="pokemon-card-gallery justify-start"
      >
        <PokemonCard
          v-for="evolvesFrom in evolutions.evolvesFrom"
          :pokemon="evolvesFrom"
        />
      </div>
      <span v-else>N/A</span>
    </div>
    <div>
      <h2>Evolves Into</h2>
      <div
        v-if="evolutions.evolvesTo.length"
        class="pokemon-card-gallery justify-start"
      >
        <PokemonCard
          v-for="evolvesTo in evolutions.evolvesTo"
          :pokemon="evolvesTo"
        />
      </div>
      <span v-else>N/A</span>
    </div>
  </div>
</template>

<style scoped>
.pokemon-header {
  display: flex;
  gap: 1em;
  margin: 1em 0;
  justify-content: space-between;
}

.pokemon-info-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 50px;
  max-width: 300px;
  gap: 1em;
}

.pokemon-name {
  font-size: x-large;
}

.type-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6em;
  width: 100%;
}

.pokemon-info-table {
  font-size: large;
}

/* Pad only the first cell in each row */
.pokemon-info-table td:first-child {
  padding-inline-end: 1em;
}

.pokemon-image-info-container {
  flex: 0 1 300px;
}

.pokemon-image-container {
  max-width: 300px;
  padding: 1em;
  border: solid 1px var(--bg3);
}

.pokemon-image-container img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  /* Prevent anti-aliasing of the pixel art */
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
}

.sprite-selector-container-top {
  display: flex;
}

.sprite-selector-container-top select {
  width: 0;
  flex: 1 0 auto;
}

.sprite-selector-container-bottom {
  display: flex;
  flex-direction: row-reverse;
}

.evolution-container {
  display: flex;
  justify-content: space-between;
}

.evolution-container > * {
  flex: 1 0 1px;
}
</style>
