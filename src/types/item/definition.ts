import type { ItemTypeComponents } from "./component";
import type { ItemTypeDescription } from "./description";

interface ItemTypeDefinition {
  format_version: string;
  "minecraft:item": {
    description: ItemTypeDescription;
    components: Partial<ItemTypeComponents>
  }
}

export type { ItemTypeDefinition };