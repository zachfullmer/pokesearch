import type { PokemonType } from "~/lib/pokemon_types";

export type UnitType = "imperial" | "metric";

const API_ID_URL_REGEX = /^.+\/(\d+)\/$/;

// POKÉMON
//////////

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
  species: PkApiEndpointStub;
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
   * Unique identifier for this Pokémon's species in the PokéAPI database.
   */
  speciesId: number;
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
  speciesId: number = -Infinity;
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
    pk.speciesId = pokemonSerialized.speciesId;
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
      speciesId: this.speciesId,
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
    const specRegexResult = API_ID_URL_REGEX.exec(pkApiPokemon.species.url);
    if (!specRegexResult) {
      throw new Error(
        `Unable to extract species ID from "${pkApiPokemon.species.url}"`
      );
    }
    pk.speciesId = parseInt(specRegexResult[1]!);
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

// POKÉMON SPECIES
//////////////////

/**
 * API object representing a short description applied to closely-related Pokémon.
 */
type PkApiGenus = {
  genus: string;
  language: {
    name: string;
    url: string;
  };
};

/**
 * API object representing a regional variety of a Pokémon Species.
 */
type PkApiVariety = {
  is_default: boolean;
  pokemon: {
    name: string;
    url: string;
  };
};

/**
 * The response object representing a Pokémon Species in PokéAPI. Most fields are dummied out of
 * the TypeScript type, but still shown here for completeness.
 */
export type PkApiPokemonSpecies = {
  // base_happiness: undefined;
  // capture_rate: undefined;
  // color: undefined;
  // egg_groups: undefined;
  evolution_chain: {
    url: string;
  };
  // evolves_from_species: undefined;
  // flavor_text_entries: undefined;
  // form_descriptions: undefined;
  // forms_switchable: undefined;
  // gender_rate: undefined;
  genera: PkApiGenus[];
  generation: {
    name: string;
    url: string;
  };
  // growth_rate: undefined;
  // habitat: undefined;
  // has_gender_differences: undefined;
  // hatch_counter: undefined;
  id: number;
  // is_baby: undefined;
  // is_legendary: undefined;
  // is_mythical: undefined;
  name: string;
  // names: undefined;
  // order: undefined;
  // pal_park_encounters: undefined;
  // pokedex_numbers: undefined;
  // shape: undefined;
  varieties: PkApiVariety[];
};

type PokemonVarietyRef = {
  id: number;
  name: string;
};

export interface PokemonSpeciesSerialized {
  /**
   * Unique identifier for this Pokémon Species in the PokéAPI database.
   */
  id: number;
  /**
   * Name of the Pokémon Species, lower case.
   */
  name: string;
  /**
   * A short description of the Pokemon Species.
   */
  shortDesc: string;
  /**
   * Unique identifier for this Pokémon's generation in the PokéAPI database.
   */
  generationId: number;
  /**
   * Unique string identifier for this Pokémon's generation in the PokéAPI database.
   */
  generationName: string;
  /**
   * Unique identifier for this Pokémon's evolution chain in the PokéAPI database.
   */
  evolutionChainId: number;
  /**
   * List of varieties for this Pokémon, with name and unique ID.
   */
  varieties: PokemonVarietyRef[];
  /**
   * The variety from the `varieties` list that was marked by the API as the default.
   */
  defaultVariety: PokemonVarietyRef | null;
}

/**
 * Additional information needed to populate the PokemonInfoDisplay component. Most of the information
 * is copied over from a PkApiPokemonSpecies directly.
 */
export class PokemonSpecies implements PokemonSpeciesSerialized {
  id: number = -Infinity;
  name: string = "MISSINGNO";
  shortDesc: string = "???";
  generationId: number = -Infinity;
  generationName: string = "";
  evolutionChainId: number = -Infinity;
  varieties: PokemonVarietyRef[] = [];
  defaultVariety: PokemonVarietyRef | null = null;

  static default: Readonly<PokemonSpecies> = new PokemonSpecies();

  static fromSerialized(
    pksSerialized: PokemonSpeciesSerialized
  ): PokemonSpecies {
    const pks = new PokemonSpecies();
    pks.id = pksSerialized.id;
    pks.name = pksSerialized.name;
    pks.shortDesc = pksSerialized.shortDesc;
    pks.generationId = pksSerialized.generationId;
    pks.evolutionChainId = pksSerialized.evolutionChainId;
    pks.varieties = structuredClone(pksSerialized.varieties);
    pks.defaultVariety = structuredClone(pksSerialized.defaultVariety);
    return pks;
  }

  toSerialized(): PokemonSpeciesSerialized {
    return {
      id: this.id,
      name: this.name,
      shortDesc: this.shortDesc,
      generationId: this.generationId,
      generationName: this.generationName,
      evolutionChainId: this.evolutionChainId,
      varieties: structuredClone(this.varieties),
      defaultVariety: structuredClone(this.defaultVariety),
    };
  }

  static fromPkApiPokemonSpecies(
    pkApiPokemonSpecies: PkApiPokemonSpecies
  ): PokemonSpecies {
    const guiLanguage = "en";
    const pks = new PokemonSpecies();
    pks.id = pkApiPokemonSpecies.id;
    pks.name = pkApiPokemonSpecies.name;
    const pkApiGenus = pkApiPokemonSpecies.genera.find(
      (genus) => genus.language.name == guiLanguage
    );
    if (pkApiGenus) {
      pks.shortDesc = pkApiGenus.genus;
    }
    const genRegexResult = API_ID_URL_REGEX.exec(
      pkApiPokemonSpecies.generation.url
    );
    if (!genRegexResult) {
      throw new Error(
        `Unable to extract generation ID from "${pkApiPokemonSpecies.generation.url}"`
      );
    }
    pks.generationId = parseInt(genRegexResult[1]!);
    pks.generationName = pkApiPokemonSpecies.generation.name;
    const evoRegexResult = API_ID_URL_REGEX.exec(
      pkApiPokemonSpecies.evolution_chain.url
    );
    if (!evoRegexResult) {
      throw new Error(
        `Unable to extract evolution chain ID from "${pkApiPokemonSpecies.evolution_chain.url}"`
      );
    }
    pks.evolutionChainId = parseInt(evoRegexResult[1]!);
    for (let pkApiVariety of pkApiPokemonSpecies.varieties) {
      const varRegexResult = API_ID_URL_REGEX.exec(pkApiVariety.pokemon.url);
      if (!varRegexResult) {
        throw new Error(
          `Unable to extract pokémon ID from "${pkApiVariety.pokemon.url}"`
        );
      }
      pks.varieties.push({
        id: parseInt(varRegexResult[1]!),
        name: pkApiVariety.pokemon.name,
      });
    }
    const defaultVarietyIndex = pkApiPokemonSpecies.varieties.findIndex(
      (variety) => variety.is_default
    );
    pks.defaultVariety = defaultVarietyIndex == -1 ? null : pks.varieties[defaultVarietyIndex]!;
    return pks;
  }
}

// EVOLUTION CHAINS
///////////////////

/**
 * API object representing a single Pokémon species in an evolutionary chain.
 */
type PkApiEvolutionChainLink = {
  species: PkApiEndpointStub;
  evolves_to: PkApiEvolutionChainLink[];
};

/**
 * API object representing an entire evolutionary chain.
 */
export type PkApiEvolutionChain = {
  id: number;
  chain: PkApiEvolutionChainLink;
};

type EvolutionChainLink = {
  speciesId: number;
  speciesName: string;
  evolvesTo: EvolutionChainLink[];
};

type PokemonSpeciesRef = {
  id: number;
  name: string;
};

export type RelativeEvolutionRefs = {
  evolvesFrom: PokemonSpeciesRef[];
  evolvesTo: PokemonSpeciesRef[];
};

export type RelativeEvolutionSpecies = {
  evolvesFrom: PokemonSpecies[];
  evolvesTo: PokemonSpecies[];
};

export type RelativeEvolutions = {
  evolvesFrom: Pokemon[];
  evolvesTo: Pokemon[];
};

export interface EvolutionChainSerialized {
  id: number;
  chain: EvolutionChainLink | null;
}

/**
 * Information related to a Pokémon Species' evolutions. Can be used to generate a list of
 * relative evolutionary relationships.
 */
export class EvolutionChain implements EvolutionChainSerialized {
  id: number = -Infinity;
  chain: EvolutionChainLink | null = null;

  static default: Readonly<EvolutionChain> = new EvolutionChain();

  static fromSerialized(
    pkecSerialized: EvolutionChainSerialized
  ): EvolutionChain {
    const ec = new EvolutionChain();
    ec.id = pkecSerialized.id;
    ec.chain = structuredClone(pkecSerialized.chain);
    return ec;
  }

  toSerialized(): EvolutionChainSerialized {
    return {
      id: this.id,
      chain: structuredClone(this.chain),
    };
  }

  private static _chainLinkFromPkApiChainLink(
    chainLink: PkApiEvolutionChainLink
  ): EvolutionChainLink {
    const specRegexResult = API_ID_URL_REGEX.exec(chainLink.species.url);
    if (!specRegexResult) {
      throw new Error(
        `Unable to extract species ID from "${chainLink.species.url}"`
      );
    }
    return {
      speciesId: parseInt(specRegexResult[1]!),
      speciesName: chainLink.species.name,
      evolvesTo: chainLink.evolves_to.map((ev) =>
        this._chainLinkFromPkApiChainLink(ev)
      ),
    };
  }

  static fromPkApiEvolutionChain(
    pkApiEvolutionChain: PkApiEvolutionChain
  ): EvolutionChain {
    const ec = new EvolutionChain();
    ec.id = pkApiEvolutionChain.id;
    ec.chain = EvolutionChain._chainLinkFromPkApiChainLink(
      pkApiEvolutionChain.chain
    );
    return ec;
  }

  private static _searchForRelativeEvolutions(
    searchId: number,
    relativeEvolutions: RelativeEvolutionRefs,
    chainLink: EvolutionChainLink,
    parentChainLink: EvolutionChainLink | null
  ) {
    if (chainLink.speciesId == searchId) {
      if (parentChainLink) {
        relativeEvolutions.evolvesFrom.push({
          id: parentChainLink.speciesId,
          name: parentChainLink.speciesName,
        });
      }
      for (let childChainLink of chainLink.evolvesTo) {
        relativeEvolutions.evolvesTo.push({
          id: childChainLink.speciesId,
          name: childChainLink.speciesName,
        });
      }
    } else {
      for (let childChainLink of chainLink.evolvesTo) {
        EvolutionChain._searchForRelativeEvolutions(
          searchId,
          relativeEvolutions,
          childChainLink,
          chainLink
        );
      }
    }
  }

  /**
   * Returns a list of evolutionary relationships from the perspective of the Pokémon with the given `id`.
   * @param id The identifier of the Pokémon Species to search for.
   * @returns A RelativeEvolutionRefs object. The lists will be empty if the given `id` is not contained in this EvolutionChain
   */
  getRelativeEvolutionRefsById(id: number): RelativeEvolutionRefs {
    const relativeEvolutions: RelativeEvolutionRefs = {
      evolvesFrom: [],
      evolvesTo: [],
    };
    if (this.chain) {
      EvolutionChain._searchForRelativeEvolutions(
        id,
        relativeEvolutions,
        this.chain,
        null
      );
    }
    return relativeEvolutions;
  }
}
