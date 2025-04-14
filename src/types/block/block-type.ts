import type { BlockTypePermutation } from "./block-permutation";
import type { BlockComponents } from "./component";
import type { BlockTypeDescription } from "./block-description";

interface BlockTypeDefinition {
  format_version: string;
  "minecraft:block": {
    description: BlockTypeDescription;
    components: BlockComponents;
    permutations?: Array<BlockTypePermutation>;
  };
}

export type { BlockTypeDefinition };
