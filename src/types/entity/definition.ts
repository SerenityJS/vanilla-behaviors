import { EntityTypeComponents } from "./component";
import { EntityTypeDescription } from "./description";

interface EntityTypeDefinition {
  format_version: string;
  "minecraft:entity": {
    description: EntityTypeDescription;
    components: Partial<EntityTypeComponents>;
  }
}

export type { EntityTypeDefinition };
