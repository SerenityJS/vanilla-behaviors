import { CustomEntityType } from "@serenityjs/core";
import { EntityTypeDefinition } from "../types";

class JsonEntityType extends CustomEntityType {
  public readonly json: EntityTypeDefinition;

  public constructor(json: EntityTypeDefinition) {
    // Get the identifier from the JSON data
    const identifier = json["minecraft:entity"].description.identifier;

    // Call the parent constructor with the entity identifier
    super(identifier);

    // Assign the JSON data to the instance
    this.json = json;

    // Check if the JSON data contains properties
    if (json["minecraft:entity"].description.properties) {
      // Load the properties of the entity type
      for (const [key, value] of Object.entries(json["minecraft:entity"].description.properties)) {
        // Switch based on the type of the property
        switch (value.type) {
          case "bool": {
            // Create a boolean property with the key and default value
            this.createBooleanProperty(key, value.default as boolean);
          }

          case "int": {
            // Get the range from the value or set a default range
            const range = value.range ?? [0, 1];

            // Create an integer property with the key, range, and default value
            this.createIntProperty(key, range, value.default as number);
          }

          case "float": {
            // Get the range from the value or set a default range
            const range = value.range ?? [0, 1];

            // Create a float property with the key, range, and default value
            this.createFloatProperty(key, range, value.default as number);
          }

          case "enum": {
            // Get the values from the value or set an empty array
            const values = value.values ?? [];

            // Create an enum property with the key, values, and default value
            this.createEnumProperty(key, values, value.default as string);
          }
        }
      }
    }
  }
}

export { JsonEntityType };
