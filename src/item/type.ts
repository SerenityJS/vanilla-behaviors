import { BlockIdentifier, BlockType, CustomItemType, ItemType } from "@serenityjs/core";
import { ItemTypeComponents, ItemTypeDefinition } from "../types";
import { CreativeItemCategory } from "@serenityjs/protocol";

class JsonItemType extends CustomItemType {
  /**
   * The JSON definition of the item type.
  */
  public readonly json: ItemTypeDefinition;

  public constructor(json: ItemTypeDefinition) {
    // Get the identifier from the JSON data
    const identifier = json["minecraft:item"].description.identifier;

    // Call the parent constructor with the item identifier
    super(identifier);

    // Assign the JSON data to the instance
    this.json = json;

    // Load the components of the item type
    JsonItemType.loadComponents(this, json["minecraft:item"].components);

    // Check if the JSON data contains a menu category
    if (json["minecraft:item"].description.menu_category) {
      // Get the creative item category from the JSON data
      const { category, group } = json["minecraft:item"].description.menu_category;

      // Check if the category is defined
      if (category) switch(category) {
        // Check the category and set the creative category accordingly
        case "construction": {
          this.creativeCategory = CreativeItemCategory.Construction;
          break;
        }

        case "nature": {
          this.creativeCategory = CreativeItemCategory.Nature;
          break;
        }

        case "equipment": {
          this.creativeCategory = CreativeItemCategory.Equipment;
          break;
        }

        case "items": {
          this.creativeCategory = CreativeItemCategory.Items;
          break;
        }
      }

      // Check if the group is defined
      if (group) this.creativeGroup = group;
    }
  }

  public static loadComponents(
    context: ItemType,
    components: Partial<ItemTypeComponents>
  ): void {
    // Check if the components contain the "minecraft:icon" component
    if (components["minecraft:icon"]) {
      // Get the icon definition from the components
      const definition = components["minecraft:icon"];

      // Check if the definition is a string or an object
      if (typeof definition === "string") {
        // If it's a string, set the icon directly
        context.components.setIcon({ default: definition });
      } else {
        // If it's an object, set the icon with options
        context.components.setIcon(definition.textures)
      }
    }

    // Check if the components contain the "minecraft:display_name" component
    if (components["minecraft:display_name"]) {
      // Get the display name definition from the components
      const definition = components["minecraft:display_name"];

      // Check if the definition is a string or an object
      if (typeof definition === "string") {
        // If it's a string, set the display name directly
        context.components.setDisplayName(definition);
      } else if (definition.value && typeof definition.value === "string") {
        // If it's an object, set the display name with options
        context.components.setDisplayName(definition.value);
      }
    }

    // Check if the components contain the "minecraft:digger" component
    if (components["minecraft:digger"]) {
      // Get the digger definition from the components
      const definition = components["minecraft:digger"];

      // Get the digger component from the context
      const digger = context.components.getDigger();

      // Check if a "use_efficiency" property exists in the definition
      if (definition.use_efficiency) digger.setUseEfficiency(definition.use_efficiency);

      // Check if a "destroy_speeds" property exists in the definition
      if (definition.destroy_speeds) {
        // Prepare an array to hold the destroy speeds
        const speeds: Array<{ speed: number; tags?: Array<string>; type?: BlockType }> = [];

        // Iterate over each destroy speed option in the definition
        for (const { speed, block } of definition.destroy_speeds) {
          // Prepare the block tags from the speed options
          let tags: Array<string> = [];

          // Check if the block is an object with tags or a string
          if (typeof block === "object" && "tags" in block) {
            // Parse the tags into an array
            const parsedTags = block.tags.match(/(?:q|query)\.any_tag\(([^)]+)\)/);

            // If the tags were parsed, split them into an array
            if (parsedTags && parsedTags[1]) {
              // Split the tags by comma and remove quotes
              tags = parsedTags[1]
                .split(",")
                .map((tag) => tag.replace(/'/g, "").trim());
            }

            // Add the speed and tags to the speeds array
            speeds.push({ speed, tags });
          } else {
            // Get the block type from the identifier
            const type = BlockType.get(block as BlockIdentifier)

            // Push the speed and type to the speeds array
            speeds.push({ speed, type })
          }
        }

        // Set the destroy speeds in the digger component
        digger.setDestructionSpeeds(speeds);
      }
    }

    // Check if the components contain the "minecraft:durability" component
    if (components["minecraft:durability"]) {
      // Get the durability definition from the components
      const definition = components["minecraft:durability"];

      // Set the durability options in the item type components
      context.components.setDurability(definition);
    }

    // Check if the components contain the "minecraft:hand_equipped" component
    if (components["minecraft:hand_equipped"]) {
      // Get the hand equipped definition from the components
      const definition = components["minecraft:hand_equipped"];

      // Set the hand equipped option in the item type components
      context.components.setHandEquipped(definition);
    }

    // Check if the components contain the "minecraft:wearable" component
    if (components["minecraft:wearable"]) {
      // Get the wearable definition from the components
      const definition = components["minecraft:wearable"];
    
      // Set the wearable options in the item type components
      context.components.setWearable(definition);
    }

    // Check if the components contain the "minecraft:max_stack_size" component
    if (components["minecraft:max_stack_size"]) {
      // Get the max stack size from the components
      const maxStackSize = components["minecraft:max_stack_size"];

      // Set the max stack size in the item type components
      context.components.setMaxStackSize(maxStackSize);
    }

    // Check if the components contain the "minecraft:food" component
    if (components["minecraft:food"]) {
      // Get the food definition from the components
      const definition = components["minecraft:food"];

      // Set the food options in the item type components
      context.components.setFood({
        can_always_eat: definition.can_always_eat,
        nutrition: definition.nutrition,
        saturation_modifier: definition.saturation_modifier,
        using_converts_to: ItemType.get(definition.using_converts_to ?? "minecraft:air") || undefined
      });
    }

    // Check if the components contain the "minecraft:use_modifiers" component
    if (components["minecraft:use_modifiers"]) {
      // Get the use modifiers definition from the components
      const definition = components["minecraft:use_modifiers"];

      // Set the use modifiers options in the item type components
      context.components.setUseModifiers(definition);
    }

    // Check if the components contain the "minecraft:damage" component
    if (components["minecraft:damage"]) {
      // Get the damage value from the components
      const damage = components["minecraft:damage"];

      // Set the damage value in the item type components
      context.components.setDamage(damage);
    }
  }
}

export { JsonItemType };
