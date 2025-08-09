import { CustomEntityType, Entity, EntityCollisionTrait, EntityGravityTrait, EntityHealthTrait, EntityPhysicsTrait } from "@serenityjs/core";
import { EntityTypeComponents, EntityTypeDefinition } from "../types";
import { ActorDataId, ActorDataType, DataItem } from "@serenityjs/protocol";

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

  public static loadComponents(
    context: Entity,
    components: Partial<EntityTypeComponents>
  ): void {
    // Check if the components contain the "minecraft:nameable" component
    if (components["minecraft:nameable"]) {
      // Get the nameable component options
      const definition = components["minecraft:nameable"];

      // Set the alwaysShowNameTag property based on the definition
      context.alwaysShowNameTag = definition?.always_show ?? false;
    }

    // Check if the components contain the "minecraft:scale" component
    if (components["minecraft:scale"]) {
      // Get the scale component options
      const definition = components["minecraft:scale"];

      // Set the scale of the entity based on the definition
      if (typeof definition === "number") {
        context.scale = definition;
      } else {
        context.scale = definition?.value ?? 1;
      }
    }

    // Check if the components contain the "minecraft:physics" component
    if (components["minecraft:physics"]) {
      // Get the physics component options
      const definition = components["minecraft:physics"];

      // Add the physics trait to the entity
      context.addTrait(EntityPhysicsTrait);

      // Check if the has_collision property is defined in the definition
      if (definition.has_collision) {
        context.addTrait(EntityCollisionTrait);
      } else {
        context.removeTrait(EntityCollisionTrait);
      }

      // Check if the has_gravity property is defined in the definition
      if (definition.has_gravity) {
        context.addTrait(EntityGravityTrait);
      } else {
        context.removeTrait(EntityGravityTrait);
      }
    }

    // Check if the components contain the "minecraft:collision_box" component
    if (components["minecraft:collision_box"]) {
      // Get the collision box component options
      const definition = components["minecraft:collision_box"];

      // Set the collision box dimensions of the entity based on the definition
      context.setCollisionHeight(definition?.height ?? 1);
      context.setCollisionWidth(definition?.width ?? 1);

      // Update the entity's metadata for height and width
      context.metadata.set(53, new DataItem(53, ActorDataType.Float, definition?.width ?? 1)); // Width
      context.metadata.set(54, new DataItem(54, ActorDataType.Float, definition?.height ?? 1)); // Height
    }

    // Check if the components contain the "minecraft:health" component
    if (components["minecraft:health"]) {
      // Get the health component options
      const definition = components["minecraft:health"];

      // Get the health trait from the context or add it if it doesn't exist
      const health = context.addTrait(EntityHealthTrait);

      // Set the current health value based on the definition
      health.maximumValue = definition?.max ?? 20; // Set the maximum health value
      health.defaultValue = definition?.value ?? 20; // Set the default health value
    }
  }
}

export { JsonEntityType };
