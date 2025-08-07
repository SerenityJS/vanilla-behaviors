# Vanilla Behaviors

> **Add support for vanilla Minecraft Bedrock Edition behavior packs to your SerenityJS server.**

## Getting Started
1. **Install the Plugin**: Add the `vanilla-behaviors` plugin to your SerenityJS server's `plugins` directory.

2. **Start Your Server**: Launch your SerenityJS server. The plugin will automatically create a `behavior_packs` directory in the root of your server if it doesn't already exist.

3. **Add Behavior Packs**: Place your Minecraft Bedrock Edition behavior packs (folders containing a `manifest.json` file) into the `behavior_packs` directory.

4. **Restart Your Server**: Restart your server to load and apply the behavior packs. The custom items, blocks, and entities defined in the behavior packs will now be available in the game.

## Features
- 🔄 **Automatic Pack Parsing**
  Plugin automatically scans and parses behavior packs from a `behavior_packs` directory that is generated in the root of your SerenityJS server. The plugin searches for `manifest.json` files to identify valid behavior packs, then loads and parses the associated JSON files to extract item, block, and entity definitions.

- 📦 **Custom Items**
  All items defined in the subdirectories of the behavior packs are registered and made available in the game, while parsing and applying their properties and components as defined in the JSON files.
  - ⚙️ **Supported Components**
    We are working continuously to expand the list of supported item components. Currently, the following components are supported:
    - `minecraft:icon`
    - `minecraft:display_name`
    - `minecraft:digger`
    - `minecraft:durability`
    - `minecraft:hand_equipped`
    - `minecraft:wearable`
    - `minecraft:max_stack_size`
    - `minecraft:food`
    - `minecraft:use_modifiers`
    - `minecraft:damage`

- 📦 **Custom Blocks**
  All blocks defined in the subdirectories of the behavior packs are registered and made available in the game, while parsing and applying their properties, permutations, and components as defined in the JSON files.
  - ⚙️ **Supported Components**
    We are working continuously to expand the list of supported block components. Currently, the following components are supported:
    - `minecraft:custom_components`
    - `minecraft:collision_box`
    - `minecraft:selection_box`
    - `minecraft:crafting_table`
    - `minecraft:destructible_by_explosion`
    - `minecraft:destructible_by_mining`
    - `minecraft:display_name`
    - `minecraft:friction`
    - `minecraft:light_emission`
    - `minecraft:geometry`
    - `minecraft:material_instances`
    - `minecraft:transformation`

- 📦 **Custom Entities**
  All entities defined in the subdirectories of the behavior packs are registered and made available in the game, while parsing and applying their properties and components as defined in the JSON files.
  - ⚙️ **Supported Components**
    We currently don't support any entity components, but we are working to add support for them in future releases!