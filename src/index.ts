import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";
import { BehaviorPackManifest } from "./types";
import { BehaviorPack } from "./behavior-pack";
import { EntitySpawnedSignal } from "@serenityjs/core";
import { JsonEntityType } from "./entity";

class VanillaBehaviors extends Plugin implements PluginEvents {
  public readonly type = PluginType.Addon;

  /**
   * The path to the behavior packs folder
  */
  public packsPath = resolve(process.cwd(), "behavior_packs");

  /**
   * The behavior packs loaded by the plugin
  */
  public readonly behaviorPacks: Set<BehaviorPack> = new Set();

  public constructor() {
    super("vanilla-behaviors", "0.1.1-beta");

    // Set the logger properties
    this.logger.name = "Behaviors";
  }

  public onStartUp(): void {
    // Iterate over all the loaded behavior packs
    for (const pack of this.behaviorPacks) {
      // Iterate over all the loaded worlds
      for (const [, world] of this.serenity.worlds) {
        // Register all the block types in the behavior pack
        for (const type of pack.blocks) world.blockPalette.registerType(type);
      
        // Register all the item types in the behavior pack
        for (const type of pack.items) world.itemPalette.registerType(type);

        // Register all the entity types in the behavior pack
        for (const type of pack.entities) world.entityPalette.registerType(type);
      }
    }
  }

  public onInitialize(): void {
    // Check if the behavior packs folder exists
    if (!existsSync(resolve(this.packsPath)))
      // If not, create it in the main server directory
      mkdirSync(resolve(this.packsPath));

    // Read all the files in the behavior packs folder
    // Filtering out any files that are not directories
    const files = readdirSync(resolve(this.packsPath), { withFileTypes: true })
    const directories = files.filter(file => file.isDirectory());

    // Attempt to read the manifest file for each directory
    for (const directory of directories) {
      // Attempt to read the manifest file
      const pack = this.readPack(resolve(this.packsPath, directory.name));

      // Check if there was an error reading the manifest
      if (pack instanceof Error) {
        // Log an error message if the manifest could not be read
        this.logger.error(`Failed to read manifest for behavior pack: ${directory.name}`);

        // Skip to the next directory
        continue;
      }

      // Check if the pack contains a blocks directory
      if (existsSync(resolve(pack.path, "blocks")))
        pack.readAllBlocks("blocks"); // Read all the blocks in the behavior pack

      // Check if the pack contains an items directory
      if (existsSync(resolve(pack.path, "items")))
        pack.readAllItems("items"); // Read all the items in the behavior pack

      // Check if the pack contains an entities directory
      if (existsSync(resolve(pack.path, "entities")))
        pack.readAllEntities("entities");

      // Log a message indicating the behavior pack was loaded successfully
      this.logger.info(`Loaded behavior pack: ${pack.manifest.header.name} (${pack.manifest.header.uuid})`);

      // Add the behavior pack to the loaded behavior packs
      this.behaviorPacks.add(pack);
    }
  }

  public readPack(path: string): BehaviorPack | Error {
    // Check if the path provided is a directory
    if (!existsSync(resolve(this.packsPath, path)))
      return new Error("The path provided is not a directory");

    // Attempt to read the manifest file
    try {
      // Read the manifest buffer
      const buffer = readFileSync(resolve(this.packsPath, path, "manifest.json"));

      // Remove any comments from the buffer
      const filtered = buffer.toString().replace(/\/\/.*$/gm, "");

      // Parse the buffer into an object
      const manifest = JSON.parse(filtered) as BehaviorPackManifest;

      // Create a new behavior pack instance
      const pack = new BehaviorPack(path, manifest);

      // Return the behavior pack instance
      return pack;
    } catch (error) {
      return error as Error;
    };
  }

  public onEntitySpawned(signal: EntitySpawnedSignal): void {
    // Check if the entity has a custom type
    if (signal.entity.type instanceof JsonEntityType) {
      // Load the components of the entity type
      JsonEntityType.loadComponents(signal.entity, signal.entity.type.json["minecraft:entity"].components);
    }
  }
}

// Create a new instance of the plugin
const plugin = new VanillaBehaviors();

// Export the plugin instance
export default plugin;
