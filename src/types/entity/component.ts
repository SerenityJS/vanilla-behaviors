import { EntityCollisionBoxOptions } from "./collision-box-component";
import { EntityHealthOptions } from "./health-component";
import { EntityNameableOptions } from "./nameable-component";
import { EntityPhysicsOptions } from "./physics-component";
import { EntityScaleOptions } from "./scale-component";

interface EntityTypeComponents {
  "minecraft:nameable": Partial<EntityNameableOptions>;
  "minecraft:scale": Partial<EntityScaleOptions> | number;
  "minecraft:physics": Partial<EntityPhysicsOptions>;
  "minecraft:collision_box": Partial<EntityCollisionBoxOptions>;
  "minecraft:health": Partial<EntityHealthOptions>;
}

export type { EntityTypeComponents };
