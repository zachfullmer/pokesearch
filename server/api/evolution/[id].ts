import { PkApiEvolutionChain, EvolutionChain, EvolutionChainSerialized } from "~/lib/pokemon";

export default defineEventHandler(
  async (event): Promise<Readonly<EvolutionChainSerialized> | null> => {
    const idStr = event?.context?.params?.id;
    if (!idStr) {
      return null;
    }
    const res: PkApiEvolutionChain = await $fetch(
      `https://pokeapi.co/api/v2/evolution-chain/${idStr}`
    );
    return EvolutionChain.fromPkApiEvolutionChain(res);
  }
);
