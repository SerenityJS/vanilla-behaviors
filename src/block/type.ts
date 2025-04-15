import { BlockPermutation, BlockType, CustomBlockType } from "@serenityjs/core";
import { BlockComponents, BlockTypeDefinition } from "../types";

class JsonBlockType extends CustomBlockType {
  protected readonly json: BlockTypeDefinition;

  public constructor(json: BlockTypeDefinition) {
    // Get the identifier from the JSON data
    const identifier = json["minecraft:block"].description.identifier;

    // Call the parent constructor with the block identifier
    super(identifier, {});

    // Assign the JSON data to the instance
    this.json = json;

    // Load the components of the block type
    this.loadComponents(this, json["minecraft:block"].components);

    // Iterate over the permutations of the block
    for (const definition of json["minecraft:block"].permutations ?? []) {
      // Parse the block state from the query
      const state = this.parseStateFromQuery(definition.condition);

      // Create a new permutation with the block state
      const permutation = this.createPermutation(state);

      // Load the components of the permutation
      this.loadComponents(permutation, definition.components);
    }

    // Check if there are no permutations
    if (this.permutations.length === 0)
      this.createPermutation({}, {}); // Default permutation
  }

  protected parseStateFromQuery(query: string): Record<string, boolean | string | number> {
    // Create a regular expression to match the block state conditions
    const regex = /(?:query|q)\.block_state\('([^']+)'\)\s*==\s*(true|false|'[^']+'|\d+(?:\.\d+)?)/g;
  
    // Prepare an object to store the conditions
    const conditions: Record<string, boolean | string | number> = {};
  
    // Iterate over the matches
    let match: RegExpExecArray | null;
    while ((match = regex.exec(query)) !== null) {
      // Get the key of the condition
      const key = match[1]!
  
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
      conditions[key] = value;
    }
  
    return conditions;
  }

  protected loadComponents(
    context: BlockType | BlockPermutation,
    components: BlockComponents
  ): void {
    // Check if the components contain a custom component
    if (components["minecraft:custom_components"]) {
      context.components.setIsInteractable(true); // Set the block as interactable
    }

    // Check if the components contain the geometry component
    if (components["minecraft:collision_box"]) {
      // Get the geometry component
      const definition = components["minecraft:collision_box"];

      // Check if the definition is a geometry component
      if (typeof definition === "boolean") {
        // Check if the definition if the collision box is true or false
        if (definition) context.components.setCollisionBox(); // Default collision box
        else context.components.setCollisionBox({ origin: [0, 0, 0], size: [0, 0, 0] }); // No collision box
      } else {
        // Assign the geometry options to the collision box component
        context.components.setCollisionBox(definition)
      }
    }

    // Check if the components contain the selection box component
    if (components["minecraft:selection_box"]) {
      // Get the selection box component
      const definition = components["minecraft:selection_box"];

      // Check if the definition is a geometry component
      if (typeof definition === "boolean") {
        // Check if the definition if the selection box is true or false
        if (definition) context.components.setSelectionBox(); // Default selection box
        else context.components.setSelectionBox({ origin: [0, 0, 0], size: [0, 0, 0] }); // No selection box
      } else {
        // Assign the geometry options to the selection box component
        context.components.setSelectionBox(definition)
      }
    }

    // Check if the components contain a crafting table component
    if (components["minecraft:crafting_table"]) {
      // Get the crafting table component
      const definition = components["minecraft:crafting_table"];

      // Set the crafting table component
      context.components.setCraftingTable(definition);
    }

    // Check if the components contain a geometry component
    if (components["minecraft:geometry"]) {
      // Get the geometry component
      const definition = components["minecraft:geometry"];

      // Check if the definition is a geometry component
      if (typeof definition === "string") {
        context.components.setGeometry({ identifier: definition });
      } else {
        // Assign the geometry options to the geometry component
        context.components.setGeometry(definition);
      }
    }

    // Check if the components contain a material instances component
    if (components["minecraft:material_instances"]) {
      // Get the material instances component
      const definition = components["minecraft:material_instances"];

      for (const [key, value] of Object.entries(definition)) {
        // Check if the definition is a geometry component
        if (!value || typeof value === "string") continue; // Not sure but this condition is here

        // Get the material instance component
        const component = context.components.getMaterialInstances()

        // Create a new material instance with the key and value
        component.createMaterialInstance(key, value);
      }
    }

    // Check if the components contain a transformation component
    if (components["minecraft:transformation"]) {
      // Get the transformation component
      const definition = components["minecraft:transformation"];

      // Set the transformation component
      context.components.setTransformation(definition);
    }
  }
}

export { JsonBlockType };
