import { DiggerOptions } from "./digger-component";
import { DisplayNameOptions } from "./display-name-component";
import { ItemDurabilityOptions } from "./durability-component";
import { ItemFoodOptions } from "./food-component";
import { ItemIconOptions } from "./icon-component";
import { ItemUseModifiersOptions } from "./use-modifiers-component";
import { ItemWearableOptions } from "./wearable-component";

interface ItemTypeComponents {
  "minecraft:icon": Partial<ItemIconOptions> | string;
  "minecraft:display_name": Partial<DisplayNameOptions> | string;
  "minecraft:digger": Partial<DiggerOptions>;
  "minecraft:durability": Partial<ItemDurabilityOptions>;
  "minecraft:hand_equipped": boolean;
  "minecraft:wearable": Partial<ItemWearableOptions>;
  "minecraft:max_stack_size": number;
  "minecraft:food": Partial<ItemFoodOptions>;
  "minecraft:use_modifiers": Partial<ItemUseModifiersOptions>;
}

export type { ItemTypeComponents };