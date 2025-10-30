// Load in all of the type icons here. This is being done with nuxt's svgo module, which
// lets me import each SVG as a ready-made component. In a larger project I might set up
// a system that allows me to refer to the SVG icons by a key, so they can be easily
// referenced using a reusable Icon component.
import IconBug from "~/assets/icons/bug.svg";
import IconDark from "~/assets/icons/dark.svg";
import IconDragon from "~/assets/icons/dragon.svg";
import IconElectric from "~/assets/icons/electric.svg";
import IconFairy from "~/assets/icons/fairy.svg";
import IconFighting from "~/assets/icons/fighting.svg";
import IconFire from "~/assets/icons/fire.svg";
import IconFlying from "~/assets/icons/flying.svg";
import IconGhost from "~/assets/icons/ghost.svg";
import IconGrass from "~/assets/icons/grass.svg";
import IconGround from "~/assets/icons/ground.svg";
import IconIce from "~/assets/icons/ice.svg";
import IconNormal from "~/assets/icons/normal.svg";
import IconPoison from "~/assets/icons/poison.svg";
import IconPsychic from "~/assets/icons/psychic.svg";
import IconRock from "~/assets/icons/rock.svg";
import IconSteel from "~/assets/icons/steel.svg";
import IconUnknown from "~/assets/icons/unknown.svg";
import IconWater from "~/assets/icons/water.svg";

/**
 * A plain JavaScript list containing all Pokémon types. Its type is narrowly-defined by TypeScript
 * using `as const`, making it readonly and statically-known at compile time. This means we can change the list
 * here, and type definitions below which rely on it update automatically. Also it's still iterable,
 * if we want to iterate all types somewhere else.
 */
export const POKEMON_TYPE_LIST = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "stellar",
  "unknown",
] as const;

/**
 * A mapped type that turns `POKEMON_TYPE_LIST` into a string union to be used for type checking.
 * This can also be done with an `enum` declaration, but I find this accomplishes the same thing
 * (at least for a string enum), and also gives you more reliable IntelliSense completion across
 * all files.
 */
export type PokemonType = (typeof POKEMON_TYPE_LIST)[number];

export type PokemonTypeData = {
  icon: string;
};
export type PokemonTypeDataMap = {
  [key in PokemonType]: PokemonTypeData;
};

/**
 * A set of data mapped to every type, statically-checked at compile time.
 */
export const POKEMON_TYPE_DATA: Readonly<PokemonTypeDataMap> = {
  normal: { icon: IconNormal },
  fighting: { icon: IconFighting },
  flying: { icon: IconFlying },
  poison: { icon: IconPoison },
  ground: { icon: IconGround },
  rock: { icon: IconRock },
  bug: { icon: IconBug },
  ghost: { icon: IconGhost },
  steel: { icon: IconSteel },
  fire: { icon: IconFire },
  water: { icon: IconWater },
  grass: { icon: IconGrass },
  electric: { icon: IconElectric },
  psychic: { icon: IconPsychic },
  ice: { icon: IconIce },
  dragon: { icon: IconDragon },
  dark: { icon: IconDark },
  fairy: { icon: IconFairy },
  stellar: { icon: IconUnknown },
  unknown: { icon: IconUnknown },
};
