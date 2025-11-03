# PokéSearch

```sh
pnpm install
pnpm dev
# OR
bun install
bun dev
```

This is my take on the PokéAPI assignment. Where possible, I avoided using external libraries aside from those in the Nuxt ecosystem. I tried to strike a balance between experimenting with extra features and following the original guidelines. For instance, I included a pagination feature, but the search bar only operates on the 60 currently-loaded items, as per the requirements.

The app makes extensive use of caching, to shield the external API from repeated calls. All of the calls to the local server are cached directly on the server side, and the final result objects are cached on the client side for quick loading. This should make subsequent page loads light on network I/O and very quick.

Icons used in the type badges come from [this](https://github.com/duiker101/pokemon-type-svg-icons) repository. All other icons come from the [Octicons](https://primer.style/octicons/) set.

### Additions

* 60 Pokémon are displayed on the gallery page, but the gallery is also paginated. The search feature only works within the current page.
* The search feature has an additional mode: "broken string matching". When active, the search string will match Pokémon names as long as all characters are present in the right order. For instance, "venat" will match "venonat". This makes the search feature less rigid and more typo-proof. In a larger project where I was pulling in more dependencies, I would instead have used fuzzy string matching.
* Pokémon information pages show the Pokémon's types, with special icons for each.
* Pokémon information pages show gallery views of all the forms the given Pokémon evolves to/from. Each card is a link to the pictured Pokémon's page.
* The sprite shown on a Pokémon's page can be changed: there are dropdowns to select the generation, game, and specific in-game sprite to display.

### Limitations

* Data received from PokéAPI is not validated, it's just assumed to match the schema in the documentation. In a larger project, I would use a library like `ajv` or `runtypes`to validate external data and make sure it conformed to the expected schema.
* PokéAPI is not structured in a way that makes string searching across its database easy, so it would be a much larger task to provide a more complete search feature. Much larger than this proof-of-concept.
* If the project were a bit larger, I would consider adding end-to-end tests. Honestly the chained requests to different API endpoints are complex enough that it could benefit from them already. I'm keeping it light instead, but I can add some for demonstration purposes.