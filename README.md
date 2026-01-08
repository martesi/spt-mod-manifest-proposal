# SPT Mod Manifest Proposal

This proposal defines a standardized manifest interface for mods in SPT (Single-Player Tarkov). This proposal only defines the interface structure and does not prescribe a specific implementation format.

SPT defines the structure of server-side mods, while BepInEx defines the structure of client-side mods. This manifest interface proposal provides a standardized format to describe mod metadata and dependencies, enabling mod managers to properly manage mod installations.

## General

A manifest is a structured document that describes a mod's identity, metadata, dependencies, and compatibility requirements. Each manifest must conform to the Manifest interface defined in this proposal. The proposal is format-agnostic and may be implemented as JSON, YAML, or any other structured data format.

## Terminology

1. **"manifest"** is a structured document that conforms to the Manifest interface defined in this proposal.
2. **"mod"** is a modification to SPT that may include server-side components, client-side components, or both.
3. **"mod manager"** is a tool that reads manifests to identify, install, update, and manage mods.
4. **"semantic version"** follows the [Semantic Versioning](https://semver.org/) specification (e.g., `1.0.0`, `2.1.3`).
5. **"version range"** is a string that specifies a range of compatible versions (e.g., `^1.0.0`, `>=2.0.0 <3.0.0`).

## Manifest Interface

A manifest interface must provide the following required fields and may provide optional fields as specified below.

### Required Fields

#### `id`

A unique identifier to distinguish the mod from other mods.

- **Type**: `string`
- **Format**: Should follow reverse domain notation (e.g., `com.example.my-mod`)
- **Example**: `"com.example.my-mod"`

#### `name`

The name of the mod. This is the name that will be displayed to the user.

- **Type**: `string`
- **Example**: `"My Mod"`

#### `author`

The author or authors of the mod. For multiple authors, use an array of strings.

- **Type**: `string | string[]`
- **Example**: `"John Doe"`
- **Example**: `["John Doe", "Jane Doe"]`

#### `version`

The version of the mod. Should be a semantic version.

- **Type**: `string`
- **Format**: Semantic version (e.g., `1.0.0`, `2.1.3`)
- **Example**: `"1.0.0"`

#### `sptVersion`

Version range of SPT that this mod is compatible with.

- **Type**: `string`
- **Format**: Version range specification (e.g., `^4.0.0`, `>=3.0.0 <5.0.0`)
- **Example**: `"^4.0.0"`

### Optional Fields

#### `description`

A brief description of the mod. For detailed documentation, use the documentation field.

- **Type**: `string` (optional)
- **Example**: `"A mod that enhances gameplay mechanics."`

#### `icon`

The icon of the mod. Should be a relative path to the manifest file.

- **Type**: `string` (optional)
- **Example**: `"icon.png"`

#### `documentation`

The documentation of the mod. Should be a relative path to the manifest file.

- **Type**: `string` (optional)
- **Example**: `"documentation.md"`

#### `compatibility`

The compatibility of the mod with other mods.

- **Type**: `Compatibility` (optional)
- **Example**: `{ "include": ["com.my.tom"], "exclude": ["com.his.cat"] }`

See the Compatibility interface for field definitions.

#### `dependencies`

The dependencies of the mod. Can be an object mapping mod IDs to version ranges, or an array of dependency objects.

- **Type**: `Record<string, string> | Dependency[]` (optional)
- **Example (object)**: `{ "com.example.my-mod": "^1.0.0", "com.example.my-mod-2": "^2.0.0" }`
- **Example (array)**: `[{ "id": "com.example.my-mod", "version": "^1.0.0", "optional": true }, { "id": "com.example.my-mod-2", "version": "^2.0.0" }]`

#### `effects`

Effects this mod has on profile data.

If a mod adds new traders, items, or other persistent data, profiles saved with the mod enabled will contain that data. When the mod is disabled, the SPT server may be unable to load profiles containing references to the mod's data, potentially causing profile corruption.

Use this field to indicate that the mod permanently modifies profile data, which may cause profiles to become incompatible if the mod is removed.

- **Type**: `string[]` (optional)
- **Allowed values**: `"trader"`, `"item"`, `"other"`
- **Example**: `["trader", "item"]`

#### `links`

Links to display along with the mod. You can use the link type to mark the type of the link.

- **Type**: `Link[]` (optional)
- **Example**: `[{ "type": "code", "url": "https://github.com/example/my-mod" }, { "url": "https://example.com/documentation" }]`

## Dependency Interface

A dependency interface specifies a required or optional dependency on another mod.

A dependency interface must provide the following fields:

### `id`

The unique identifier of the required mod.

- **Type**: `string`
- **Example**: `"com.example.my-mod"`

### `version`

The version range of the required mod.

- **Type**: `string`
- **Format**: Version range specification (e.g., `^1.0.0`, `>=2.0.0 <3.0.0`)
- **Example**: `"^1.0.0"`

### `optional`

Whether this dependency is optional. If true, the mod can function without this dependency, though some features may be unavailable.

- **Type**: `boolean` (optional)
- **Default**: `false`
- **Example**: `true`

## Compatibility Interface

A compatibility interface specifies which mods this mod is known to work with or conflict with.

A compatibility interface may provide the following optional fields:

### `include`

An array of mod IDs that this mod is known to work well with.

- **Type**: `string[]` (optional)
- **Example**: `["com.my.tom", "com.other.mod"]`

### `exclude`

An array of mod IDs that this mod is known to conflict with.

- **Type**: `string[]` (optional)
- **Example**: `["com.his.cat", "com.conflicting.mod"]`

## Effect

Recognized effects that a mod may have on profile data. Mod managers that support this manifest can use these values to warn users about potential profile incompatibilities and prompt them to enable profile cleaning features in SPT settings.

The effect value must be one of the following strings:

- **`"trader"`**: The mod adds or modifies traders.
- **`"item"`**: The mod adds or modifies items.
- **`"other"`**: The mod has other effects on profile data not covered by the above categories.

## Link Interface

A link interface provides a URL to a resource related to the mod.

A link interface must provide the following fields:

### `url`

The URL of the link.

- **Type**: `string`
- **Example**: `"https://github.com/example/my-mod"`

### `type`

The type of the link. See LinkType for available types.

- **Type**: `string` (optional)
- **Allowed values**: `"code"`, `"discord"`, `"website"`, `"documentation"`
- **Example**: `"code"`

### `name`

A custom name for the link. If not provided, the link type or URL may be used as the display name.

- **Type**: `string` (optional)
- **Example**: `"Source Code Repository"`

## LinkType

Common link types for mod-related resources.

The link type value must be one of the following strings:

- **`"code"`**: Link to source code repository (e.g., GitHub, GitLab).
- **`"discord"`**: Link to Discord server or channel.
- **`"website"`**: Link to mod website or homepage.
- **`"documentation"`**: Link to documentation or wiki.


## Example Manifest

```json
{
  "id": "com.example.my-mod",
  "name": "My Mod",
  "author": ["John Doe", "Jane Doe"],
  "version": "1.0.0",
  "sptVersion": "^4.0.0",
  "description": "A mod that enhances gameplay mechanics.",
  "icon": "icon.png",
  "documentation": "documentation.md",
  "compatibility": {
    "include": ["com.my.tom"],
    "exclude": ["com.his.cat"]
  },
  "dependencies": [
    {
      "id": "com.example.base-mod",
      "version": "^1.0.0"
    },
    {
      "id": "com.example.optional-mod",
      "version": "^2.0.0",
      "optional": true
    }
  ],
  "effects": ["trader", "item"],
  "links": [
    {
      "type": "code",
      "url": "https://github.com/example/my-mod"
    },
    {
      "type": "discord",
      "url": "https://discord.gg/example"
    }
  ]
}
```

## Notes

1. This is a proposal and may be subject to change based on feedback and community input. This proposal defines only the interface structure and does not prescribe a specific file format. Manifests may be implemented as JSON, YAML, or any other structured data format that can represent the interface.
2. All paths specified in the manifest (icon, documentation) are relative to the manifest file's location.