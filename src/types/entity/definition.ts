import { EntityTypeDescription } from "./description";

interface EntityTypeDefinition {
  format_version: string;
  "minecraft:entity": {
    description: EntityTypeDescription;
  }
}

export type { EntityTypeDefinition };
