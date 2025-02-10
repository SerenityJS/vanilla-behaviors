import { BlockPermutation, BlockType, BlockTypeCollisionBoxComponent, BlockTypeGeometryComponent, BlockTypeMaterialInstancesComponent, BlockTypeSelectionBoxComponent, CustomBlockType } from "@serenityjs/core";
import { BlockTypeComponents, BlockTypeDefinition } from "./json";
import plugin from "../index";
import { MaterialRenderMethod } from "@serenityjs/protocol";

class JsonBlockType extends CustomBlockType {
  protected readonly json: BlockTypeDefinition;

  public constructor(json: BlockTypeDefinition) {
    // Call the parent constructor with the block identifier
    super(json["minecraft:block"].description.identifier, {});

    // Assign the JSON data to the instance
    this.json = json;

    // Iterate over the permutations of the block
    // for (const definition of json["minecraft:block"].permutations ?? []) {
    //   // Parse the block state from the query
    //   const state = this.parseStateFromQuery(definition.condition);

    //   // Create a new permutation with the block state
    //   const permutation = this.createPermutation(state, {});

    //   // Load the components of the permutation
    //   // this.loadComponents(permutation, definition.components);
    // }

    // Check if there are no permutations
    if (this.permutations.length === 0)
      this.createPermutation({}, {}); // Default permutation

    // Load the components of the block type
    this.loadComponents(this, json["minecraft:block"].components);
  }

  protected parseStateFromQuery(query: string): Record<string, boolean | string | number> {
    // Create a regular expression to match the block state conditions
    const regex = /q\.block_state\('([^']+)'\)\s*==\s*(true|false|'[^']+'|\d+(?:\.\d+)?)/g;

    // Prepare an object to store the conditions
    const conditions: Record<string, boolean | string | number> = {};

    // Iterate over the matches
    let match: RegExpExecArray | null;
    while ((match = regex.exec(query)) !== null) {
      // Prepare the value based on the type
      let value: boolean | string | number;

      // Check the type of the value
      if (match[2] === 'true' || match[2] === 'false') {
        value = match[2] === 'true';
      } else if (/^'[^']+'$/.test(match[2]!)) {
        value = match[2]!.slice(1, -1);
      } else {
        value = parseFloat(match[2]!);
      }

      // Store the condition
      conditions[match[1]!] = value;
    }
  
    return conditions;
  }

  protected loadComponents(
    context: BlockType | BlockPermutation,
    components: BlockTypeComponents
  ): void {
    // Check if the component group contains custom components
    if (components["minecraft:custom_components"])
      // Log a warning message to the console
      plugin.logger.warn(`Block type §3${this.identifier}§r has custom components, which requires the vanilla Scripting API. These functionalities will need to be implemented manually via a BlockTrait within an external plugin.`);

    // Check if the component group contains a collision box definition
    if (components["minecraft:collision_box"]) {
      // Get the collision box component definition
      const definition = components["minecraft:collision_box"];

      // Add the collision box component to the block type
      const component = context.components.add(BlockTypeCollisionBoxComponent, {});

      // Check if the definition has a size or origin
      if (definition.size) component.size = definition.size;
      if (definition.origin) component.origin = definition.origin;
      else component.origin = [-8, 0, -8]; // Vanilla default
    }

    // Check if the component group contains a selection box definition
    if (components["minecraft:selection_box"]) {
      // Get the selection box component definition
      const definition = components["minecraft:selection_box"];

      // Add the selection box component to the block type
      const component = context.components.add(BlockTypeSelectionBoxComponent, {});

      // Check if the definition has a size or origin
      if (definition.size) component.size = definition.size;
      if (definition.origin) component.origin = definition.origin;
      else component.origin = [-8, 0, -8]; // Vanilla default
    }

    // TODO: this needs fixed on the serenity/core side

    // // Check if the component group contains a geometry definition
    // if (components["minecraft:geometry"]) {
    //   // Get the geometry component definition
    //   const definition = components["minecraft:geometry"];

    //   // Add the geometry component to the block type
    //   const component = new BlockTypeGeometryComponent(context, { culling: "none", model: "none" });

    //   // // Check if the definition has an identifier
    //   // if (typeof definition === 'string') component.model = definition;
    //   // else component.model = definition.identifier;
    // }

    if (components["minecraft:geometry"]) {
      // Get the geometry component definition
      const definition = components["minecraft:geometry"];

      const identifier = typeof definition === 'string' ? definition : definition.identifier;

      const geo = context.components.createCompoundTag({ name: "minecraft:geometry" });
      geo.createCompoundTag({ name: "bone_visibility" })
      geo.createStringTag({ name: "identifier", value: identifier });
      geo.createStringTag({ name: "culling", value: "" });
    }

    if (components["minecraft:material_instances"]) {
      // Get the material instances component definition
      const definition = components["minecraft:material_instances"];

      // Add the material instances component to the block type
      const component = context.components.add(BlockTypeMaterialInstancesComponent, {});

      // Iterate over the material instances
      for (const [name, instance] of Object.entries(definition)) {
        // Add the material instance to the component
        component.createMaterialInstance(name, {
          texture: instance.texture,
          render_method: instance.render_method as MaterialRenderMethod,
          ambient_occlusion: instance?.ambient_occlusion ?? false,
          face_dimming: instance?.face_dimming ?? false
        });
      }
    }
  }
}

export { JsonBlockType };
