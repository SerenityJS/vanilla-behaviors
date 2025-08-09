import {
  Dirent,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  unlinkSync,
} from "node:fs";
import { join, resolve } from "node:path";

import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";
import AdmZip from "adm-zip";
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
        for (const type of pack.entities)
          world.entityPalette.registerType(type);
      }
    }
  }

  public onInitialize(): void {
    // Check if the behavior packs folder exists
    if (!existsSync(resolve(this.packsPath)))
      // If not, create it in the main server directory
      mkdirSync(resolve(this.packsPath));

    // Read all the files in the behavior packs folder
    const files = readdirSync(resolve(this.packsPath), { withFileTypes: true });

    // Filter the files to only include directories
    const directories = files.filter((file) => file.isDirectory());
    // Parse the directories to read the manifest files
    this.parseDirectories(directories);

    // Filter the files to only include .mcpack files
    const mcpacks = files.filter(
      (file) => file.isFile() && file.name.endsWith(".mcpack")
    );
    // Parse the .mcpack files
    this.parseMcpacks(mcpacks);
  }

  public parseMcpacks(files: Dirent<string>[]): void {
    // If there are no .mcpack files, return early
    if (files.length === 0) return;

    // Array to hold the directory entries after extraction
    const dirents: Dirent<string>[] = [];

    // Iterate over each .mcpack file
    for (const file of files) {
      // Generate the pack name and paths
      const packName = file.name.replace(/\.mcpack$/, "");
      const filePath = resolve(this.packsPath, file.name);
      const outputPath = resolve(this.packsPath, packName);

      // Check if the pack already exists
      if (existsSync(outputPath)) {
        this.logger.warn(
          `Behavior pack ${packName} already exists, skipping extraction.`
        );
        continue;
      }

      // Extract the .mcpack file
      const zip = new AdmZip(filePath);
      zip.extractAllTo(outputPath, true);

      // Normalize: some packs have a wrapper folder inside the zip
      const extractedContents = readdirSync(outputPath, {
        withFileTypes: true,
      });
      if (
        extractedContents.length === 1 &&
        extractedContents[0]!.isDirectory()
      ) {
        // If the pack has a single folder inside, treat it as a wrapper
        const wrapperFolder = join(outputPath, extractedContents[0]!.name);
        const innerFiles = readdirSync(wrapperFolder);

        // Move the contents of the wrapper folder up one level
        for (const name of innerFiles) {
          const src = join(wrapperFolder, name);
          const dest = join(outputPath, name);
          renameSync(src, dest);
        }

        // Remove the now-empty wrapper folder
        rmdirSync(wrapperFolder);
      }

      // Read the directory entries from the extracted pack
      const packDirent = readdirSync(this.packsPath, {
        withFileTypes: true,
      }).find((d) => d.name === packName && d.isDirectory());
      // If the pack directory entry exists, add it to the dirents array
      if (packDirent) dirents.push(packDirent);

      // Delete the .mcpack file after extraction
      unlinkSync(filePath);
      this.logger.info(`Extracted behavior pack: ${packName}`);
    }

    // Parse the directories from the extracted packs
    this.parseDirectories(dirents);
  }

  public parseDirectories(directories: Dirent<string>[]): void {
    // Attempt to read the manifest file for each directory
    for (const directory of directories) {
      // Attempt to read the manifest file
      const pack = this.readPack(resolve(this.packsPath, directory.name));

      // Check if there was an error reading the manifest
      if (pack instanceof Error) {
        // Log an error message if the manifest could not be read
        this.logger.error(
          `Failed to read manifest for behavior pack: ${directory.name}`
        );
        this.logger.debug(`Error: ${pack.message}`);
        // Skip to the next directory
        continue;
      }

      // Check if the pack contains a blocks directory
      if (existsSync(resolve(pack.path, "blocks")))
        pack.readAllBlocks("blocks"); // Read all the blocks in the behavior pack

      // Check if the pack contains an items directory
      if (existsSync(resolve(pack.path, "items"))) pack.readAllItems("items"); // Read all the items in the behavior pack

      // Check if the pack contains an entities directory
      if (existsSync(resolve(pack.path, "entities")))
        pack.readAllEntities("entities");

      // Log a message indicating the behavior pack was loaded successfully
      this.logger.info(
        `Loaded behavior pack: ${pack.manifest.header.name} (${pack.manifest.header.uuid})`
      );

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
      const buffer = readFileSync(
        resolve(this.packsPath, path, "manifest.json")
      );

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
    }
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
