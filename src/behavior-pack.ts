import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { BlockType, BlockTypeFrictionComponent, BlockTypeHardnessComponent, CustomBlockType, CustomItemType, ItemType } from "@serenityjs/core";

import { BehaviorPackManifest, BlockTypeDefinition } from "./types";
import { CreativeItemCategory } from "@serenityjs/protocol";

class BehaviorPack {
  /**
   * The path to the behavior pack directory
  */
  public readonly path: string;

  /**
   * The manifest file for the behavior pack
  */
  public readonly manifest: BehaviorPackManifest;

  /**
   * The name of the behavior pack
  */
  public get name(): string {
    return this.manifest.header.name;
  }

  /**
   * The description of the behavior pack
  */
  public get description(): string {
    return this.manifest.header.description
  }

  /**
   * The block types of the behavior pack
  */
  public readonly blocks: Set<BlockType> = new Set();

  public readonly items: Set<ItemType> = new Set();

  /**
   * Create a new behavior pack instance
   * @param path The path to the behavior pack directory
   * @param manifest The manifest file for the behavior pack
  */
  public constructor(path: string, manifest: BehaviorPackManifest) {
    this.path = path;
    this.manifest = manifest;
  }


  public readAllBlocks(path: string): void {
    // Read all the files in the behavior pack directory
    const files = readdirSync(resolve(this.path, path), { withFileTypes: true });
    const json = files.filter(file => file.name.endsWith(".json"));
    const directories = files.filter(file => file.isDirectory());

    for (const definition of json) {
     // Attempt to read the block definition
     try {
        // Read the block definition buffer
        const buffer = readFileSync(resolve(this.path, "blocks", definition.name));
        const block = JSON.parse(buffer.toString()) as BlockTypeDefinition;

        // Get the description and components of the block
        const { description, components, permutations } = block["minecraft:block"];

        // Check if the block type already exists
        if (BlockType.types.has(description.identifier)) continue;

        // Create a new block type and item type
        const blockType = new CustomBlockType(description.identifier);
        const itemType = new CustomItemType(description.identifier, { blockType });

        // Check if the block should be registered to the creative menu
        if (description?.register_to_creative_menu || description?.menu_category) {
          itemType.creativeCategory = CreativeItemCategory.Construction; // TODD
          itemType.creativeGroup = description?.menu_category?.group ?? `itemGroup.name.${blockType.identifier}`;
        }

        // Check if there are any permutations
        if (!permutations || permutations.length === 0) blockType.createPermutation({}) // Default permutation
        else {
          for (const permutation of permutations) {
            console.log("TODO: ", permutation);
          }
        }

        // Check if the definition has a friction component
        if (components?.["minecraft:friction"]) {
          // Add the friction component to the block type
          blockType.components.add(BlockTypeFrictionComponent, components["minecraft:friction"]);
        }

        // Add the block type to the set
        if (components?.["minecraft:destroy_time"]) {
          blockType.components.add(BlockTypeHardnessComponent, components["minecraft:destroy_time"]);
        }

        // Add the block type & item type to the set
        this.blocks.add(blockType);
        this.items.add(itemType);
     } catch (error) { console.error(error); }; 
    }

    // Iterate over each directory
    for (const directory of directories)
      // Read all the blocks in the directory
      this.readAllBlocks(resolve(path, directory.name));
  }
}

export { BehaviorPack };
