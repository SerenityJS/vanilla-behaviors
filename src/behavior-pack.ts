import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { BlockType, CustomItemType, ItemType } from "@serenityjs/core";

import { BehaviorPackManifest, BlockTypeDefinition } from "./types";
import { JsonBlockType } from "./block";
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
        const buffer = readFileSync(resolve(this.path, path, definition.name));
        const json = JSON.parse(buffer.toString()) as BlockTypeDefinition;

        // Create a new block type instance using the JSON data
        const blockType = new JsonBlockType(json);

        const itemType = new CustomItemType(blockType.identifier, { blockType });
        itemType.creativeCategory = CreativeItemCategory.Construction;

        // Add the block type & item type to the set
        this.blocks.add(blockType);
        this.items.add(itemType);
     } catch (error) {
        // Log an error message if the block definition could not be read
        console.error(`Failed to read block definition: ${definition.name}`, (error as Error).message);
      }
    }

    // Iterate over each directory
    for (const directory of directories) {
      this.readAllBlocks(join(path, directory.name)); // Recursively read blocks in subdirectories
    }
  }
}

export { BehaviorPack };
