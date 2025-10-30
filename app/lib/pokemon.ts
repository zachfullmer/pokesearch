import type { PokemonType } from "~/lib/pokemon_types";

export type UnitType = "imperial" | "metric";

/**
 * Represents limited information about another object that is returned from
 * a different API endpoint.
 */
type PkApiEndpointStub<T = string> = {
  name: T;
  url: string;
};

/**
 * Information about one of a Pokémon's abilities, including placement information.
 */
type PkApiPokemonAbility = {
  ability: PkApiEndpointStub;
  is_hidden: boolean;
  slot: number;
};

/**
 * Information about one of a Pokémon's types, including placement information.
 */
type PkApiPokemonType = {
  type: PkApiEndpointStub<PokemonType>;
  slot: number;
};

/**
 * A map of URL fields that point to sprite images. Sprites are usually from the
 * same game, but may be a different categorization, like official art.
 */
type PkApiSpritesGame = {
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
};

/**
 * A map of game names to sprite information. Games in the map will usually be
 * grouped by generation, but may be a different categorization, like official art.
 */
type PkApiSpritesGen = {
  [gameKey: string]: PkApiSpritesGame;
};

/**
 * Root of the sprite URL object
 */
type PkApiSpritesRoot = {
  other: {
    "official-artwork": PkApiSpritesGame;
  };
  versions: {
    [genKey: string]: PkApiSpritesGen;
  };
};

/**
 * The response object representing a Pokémon in PokéAPI. Most fields are dummied out of
 * the TypeScript type, but still shown here for completeness.
 */
export type PkApiPokemon = {
  abilities: PkApiPokemonAbility[];
  // base_experience: undefined;
  // cries: undefined;
  // forms: undefined;
  // game_indices: undefined;
  height: number;
  // held_items: undefined;
  id: number;
  // is_default: undefined;
  // location_area_encounters: undefined;
  // moves: undefined;
  name: string;
  // order: undefined;
  // past_abilities: undefined;
  // past_types: undefined;
  // species: undefined;
  sprites: PkApiSpritesRoot;
  // stats: undefined;
  types: PkApiPokemonType[];
  weight: number;
};

/**
 * A dropdown item representing a game and its associated sprites.
 */
export type PokemonSpriteGameOptions = {
  label: string;
  items: {
    [spriteKey: string]: {
      label: string;
      url: string;
    };
  };
};

/**
 * A dropdown item representing a generation and its associated games.
 */
export type PokemonSpriteGenOptions = {
  label: string;
  items: {
    [gameKey: string]: PokemonSpriteGameOptions;
  };
};

/**
 * A dropdown of generations. Nested inside of each generation are the games
 * in that generation, and then the relevant sprites from that game. This structure
 * is used to construct a series of dropdown elements for switching between sprites
 * in the GUI.
 */
export type PokemonSpriteOptions = {
  [genKey: string]: PokemonSpriteGenOptions;
};

export interface PokemonSerialized {
  /**
   * Unique identifier for this Pokémon in the PokéAPI database.
   */
  id: number;
  /**
   * Name of the Pokémon, lower case.
   */
  name: string;
  /**
   * Height of the Pokémon in decimeters. The conversion functions for displaying this number in
   * a more useful format are in `pokemon_info_display.vue`.
   */
  heightDm: number;
  /**
   * Weight of the Pokémon in hectograms. The conversion functions for displaying this number in
   * a more useful format are in `pokemon_info_display.vue`.
   */
  weightHg: number;
  /**
   * A list of type names, lower case.
   */
  types: PokemonType[];
  /**
   * A list of ability names, lower case.
   */
  abilities: string[];
  /**
   * A map of the sprites listed at the root of the PkApiPokemon.sprite object.
   */
  defaultSprites: PokemonSpriteGameOptions;
  /**
   * PokemonSpriteOptions used to build the sprite selection dropdowns in the GUI.
   */
  spriteOptions: PokemonSpriteOptions;
}

/**
 * The information needed to populate the PokemonInfoDisplay component. Most of the information
 * is copied over from a PkApiPokemon directly, but on construction this class will build its own
 * set of sprite information to populate the sprite switcher GUI.
 */
export class Pokemon implements PokemonSerialized {
  id: number = -Infinity;
  name: string = "MISSINGNO";
  heightDm: number = 0;
  weightHg: number = 0;
  types: PokemonType[] = ["unknown"];
  abilities: string[] = [];
  defaultSprites: PokemonSpriteGameOptions = { label: "default", items: {} };
  spriteOptions: PokemonSpriteOptions = {};

  static default: Readonly<Pokemon> = new Pokemon();

  static fromSerialized(pokemonSerialized: PokemonSerialized): Pokemon {
    const pk = new Pokemon();
    pk.id = pokemonSerialized.id;
    pk.name = pokemonSerialized.name;
    pk.heightDm = pokemonSerialized.heightDm;
    pk.weightHg = pokemonSerialized.weightHg;
    pk.types = [...pokemonSerialized.types];
    pk.abilities = [...pokemonSerialized.abilities];
    pk.defaultSprites = structuredClone(pokemonSerialized.defaultSprites);
    pk.spriteOptions = structuredClone(pokemonSerialized.spriteOptions);
    return pk;
  }

  toSerialized(): PokemonSerialized {
    return {
      id: this.id,
      name: this.name,
      heightDm: this.heightDm,
      weightHg: this.weightHg,
      types: [...this.types],
      abilities: [...this.abilities],
      defaultSprites: structuredClone(this.defaultSprites),
      spriteOptions: structuredClone(this.spriteOptions),
    };
  }

  static fromPkApiPokemon(pkApiPokemon: PkApiPokemon): Pokemon {
    const pk = new Pokemon();
    pk.id = pkApiPokemon.id;
    pk.name = pkApiPokemon.name;
    pk.heightDm = pkApiPokemon.height;
    pk.weightHg = pkApiPokemon.weight;
    pk.types = pkApiPokemon.types
      .sort((typeA, typeB) => typeA.slot - typeB.slot)
      .map((pkApiType) => pkApiType.type.name);
    pk.abilities = pkApiPokemon.abilities.map(
      (pkApiAbility) => pkApiAbility.ability.name
    );
    pk.defaultSprites = Pokemon.extractGameSpriteOptions(
      "default",
      pkApiPokemon.sprites as unknown as PkApiSpritesGame
    );
    pk.spriteOptions = Pokemon.extractSpriteOptions(pkApiPokemon.sprites);
    return pk;
  }

  /**
   * @param gameName String to be used as the game's dropdown label.
   * @param apiGame PkApiSpritesGame to extract from.
   */
  static extractGameSpriteOptions(
    gameName: string,
    apiGame: PkApiSpritesGame
  ): PokemonSpriteGameOptions {
    const game: PokemonSpriteGameOptions = {
      label: gameName,
      items: {},
    };
    if (apiGame.front_default) {
      game.items.default = {
        label: "Default",
        url: apiGame.front_default,
      };
    }
    if (apiGame.front_female) {
      game.items.defaultFemale = {
        label: "Default (Female)",
        url: apiGame.front_female,
      };
    }
    if (apiGame.front_shiny) {
      game.items.shiny = {
        label: "Shiny",
        url: apiGame.front_shiny,
      };
    }
    if (apiGame.front_shiny_female) {
      game.items.shinyFemale = {
        label: "Shiny (Female)",
        url: apiGame.front_shiny_female,
      };
    }
    return game;
  }

  /**
   * Converts the sprites field in a PkApiPokemon object into a format that can be used to display the sprite selection dropdowns.
   * @param pkApiSprites Sprites object from the PokéAPI Pokémon endpoint response.
   * @returns The sprite selection dropdown builder data.
   */
  static extractSpriteOptions(pkApiSprites: PkApiSpritesRoot) {
    const spriteOptions: PokemonSpriteOptions = {};
    spriteOptions.default = {
      label: "Default Generation",
      items: {
        default: Pokemon.extractGameSpriteOptions(
          "Default Game",
          pkApiSprites as unknown as PkApiSpritesGame
        ),
      },
    };
    for (let genName of Object.keys(pkApiSprites.versions)) {
      const apiGen = pkApiSprites.versions[genName]!;
      for (let gameName of Object.keys(apiGen)) {
        const apiGame = apiGen[gameName]!;
        if (
          !apiGame.front_default &&
          !apiGame.front_female &&
          !apiGame.front_shiny &&
          !apiGame.front_shiny_female
        ) {
          continue;
        }
        if (gameName == "icons") {
          continue;
        }
        if (!(genName in spriteOptions)) {
          spriteOptions[genName] = {
            label: genName,
            items: {},
          };
        }
        const gen = spriteOptions[genName]!;
        if (!(gameName in gen.items)) {
          gen!.items[gameName] = Pokemon.extractGameSpriteOptions(
            gameName,
            apiGame
          );
        }
      }
    }
    return spriteOptions;
  }
}
