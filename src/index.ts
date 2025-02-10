import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";
import { BehaviorPackManifest } from "./types";
import { BehaviorPack } from "./behavior-pack";

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
    super("vanilla-behaviors", "1.0.0");
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

      pack.readAllBlocks("blocks");

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

      // Parse the buffer into an object
      const manifest = JSON.parse(buffer.toString()) as BehaviorPackManifest;

      // Create a new behavior pack instance
      const pack = new BehaviorPack(path, manifest);

      // Return the behavior pack instance
      return pack;
    } catch (error) {
      return error as Error;
    };
  }
}

export default new VanillaBehaviors();
