// {
//     "format_version": "1.21.40",
//     "minecraft:block": {
//         "description": {
//             "identifier": "wiki:custom_block",
//             "states": {
//                 "wiki:integer_state_example": [2, 4, 6, 8],
//                 "wiki:boolean_state_example": [false, true],
//                 "wiki:string_state_example": ["red", "green", "blue"]
//             }
//         },
//         "components": {},
//         "permutations": [
//             {
//                 "condition": "q.block_state('wiki:integer_state_example') == 2",
//                 "components": {
//                     "minecraft:friction": 0.1
//                 }
//             },
//             {
//                 "condition": "q.block_state('wiki:boolean_state_example')",
//                 "components": {
//                     "minecraft:friction": 0.8 // Overrides previous permutation
//                 }
//             },
//             {
//                 "condition": "q.block_state('wiki:string_state_example') == 'red' && !q.block_state('wiki:boolean_state_example')",
//                 "components": {
//                     "minecraft:geometry": "geometry.pig"
//                 }
//             }
//         ]
//     }
// }

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
    "minecraft:material_instances": any;
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