import type { CollisionBoxComponent } from "./collision-box";
import type { SelectionBoxComponent } from "./selection-box";
import type { CraftingTableComponent } from "./crafting-table";
import type { DestructibleByExplosionComponent } from "./destructible-by-explosion";
import type { DestructibleByMiningComponent } from "./destructible-by-mining";
import type { GeometryComponent } from "./geometry";
import type { MaterialInstancesComponent } from "./material-instances";
import type { TransformationComponent } from "./transformation";

interface BlockComponents {
  "minecraft:custom_components"?: Array<string>;
  "minecraft:collision_box"?: Partial<CollisionBoxComponent>;
  "minecraft:selection_box"?: Partial<SelectionBoxComponent>;
  "minecraft:crafting_table"?: Partial<CraftingTableComponent>;
  "minecraft:destructible_by_explosion"?: Partial<DestructibleByExplosionComponent>;
  "minecraft:destructible_by_mining"?: Partial<DestructibleByMiningComponent>;
  "minecraft:display_name"?: string;
  "minecraft:friction"?: number;
  "minecraft:geometry"?: Partial<GeometryComponent>;
  "minecraft:material_instances"?: Partial<MaterialInstancesComponent>;
  "minecraft:transformation"?: Partial<TransformationComponent>;
}

export type { BlockComponents };
