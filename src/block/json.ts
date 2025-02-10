interface BlockTypeMenuCategory {
  category?: string;
  group?: string;
}

interface BlockTypeDescription {
  identifier: string;
  is_experimental: boolean;
  register_to_creative_menu?: boolean;
  menu_category?: BlockTypeMenuCategory;
  states?: Record<string, Array<number | string | boolean>>;
}

interface BlockTypeComponents {
  "minecraft:loot": string;
  "minecraft:destroy_time": number;
  "minecraft:explosion_resistance": number;
  "minecraft:friction": number;
  "minecraft:flammable": any;
  "minecraft:map_color": string;
  "minecraft:block_light_absorption": number;
  "minecraft:block_light_emission": number;
  "minecraft:hardness": number;
  "minecraft:harvest_tool": string;
  "minecraft:harvest_level": number;
  "minecraft:material": string;
  "minecraft:material_instances": Record<string, { texture: string, render_method: string, face_dimming?: boolean, ambient_occlusion?: boolean }>;
  "minecraft:custom_components": Array<string>;
  "minecraft:geometry": string | {
    identifier: string;
  };
  "minecraft:collision_box": {
    size: [number, number, number],
    origin?: [number, number, number]
  };
  "minecraft:selection_box": {
    size: [number, number, number],
    origin?: [number, number, number]
  };
}

interface BlockTypePermutation {
  condition: string;
  components: BlockTypeComponents;
}

interface BlockTypeDefinition {
  format_version: string;
  "minecraft:block": {
    description: BlockTypeDescription;
    components: BlockTypeComponents;
    permutations?: Array<BlockTypePermutation>;
  };
}

export { BlockTypeDefinition, BlockTypeDescription, BlockTypeComponents };
