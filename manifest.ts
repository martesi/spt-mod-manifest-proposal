/**
 * Mod manifest proposal for SPT (Single-Player Tarkov).
 *
 * SPT defines the structure of server-side mods, while BepInEx defines the structure
 * of client-side mods. This manifest schema provides a standardized format to describe
 * mod metadata and dependencies, enabling mod managers to properly manage mod installations.
 */
interface Manifest {
  /**
   * A unique identifier to distinguish the mod from other mods.
   * @example "com.example.my-mod"
   */
  id: ModId
  /**
   * The name of the mod.
   * This is the name that will be displayed to the user.
   * @example "My Mod"
   */
  name: string
  /**
   * The author or authors of the mod.
   * For multiple authors, use an array of strings.
   * @example "John Doe"
   * @example ["John Doe", "Jane Doe"]
   */
  author: string | string[]
  /**
   * A brief description of the mod.
   * For detailed documentation, use the documentation field.
   * @example "A mod that enhances gameplay mechanics."
   */
  description?: string
  /**
   * The version of the mod. Should be a semantic version.
   * @example "1.0.0"
   */
  version: Version
  /**
   * Version range of SPT that this mod is compatible with.
   * @example "^4.0.0"
   */
  sptVersion: VersionRange
  /**
   * The icon of the mod. Should be a relative path to the manifest file.
   * @example "icon.png"
   */
  icon?: RelativePathToManifestFile
  /**
   * The documentation of the mod. Should be a relative path to the manifest file.
   * @example "documentation.md"
   */
  documentation?: RelativePathToManifestFile
  /**
   * The compatibility of the mod.
   * @example { include: ["com.my.tom"], exclude: ["com.his.cat"] }
   */
  compatibility?: Compatibility
  /**
   * The dependencies of the mod.
   * Can be a list of mod ids, a record of mod ids and version ranges, or a list of dependencies.
   * @example { "com.example.my-mod": "^1.0.0", "com.example.my-mod-2": "^2.0.0" }
   * @example [{ id: "com.example.my-mod", version: "^1.0.0", optional: true }, { id: "com.example.my-mod-2", version: "^2.0.0" }]
   */
  dependencies?: Record<ModId, VersionRange> | Dependency[]
  /**
   * Effects this mod has on profile data.
   *
   * If a mod adds new traders, items, or other persistent data, profiles saved with
   * the mod enabled will contain that data. When the mod is disabled, the SPT server
   * may be unable to load profiles containing references to the mod's data, potentially
   * causing profile corruption.
   *
   * Use this field to indicate that the mod permanently modifies profile data,
   * which may cause profiles to become incompatible if the mod is removed.
   * @example ["trader", "item"]
   */
  effects?: Effect[]
  /**
   * Links to display along with the mod.
   * You can use {@link LinkType} to mark the type of the link.
   * @example [{ type: LinkType.code, url: "https://github.com/example/my-mod" }, { url: "https://example.com/documentation" }]
   */
  links?: Link[]
}

/**
 * A relative path to the manifest file.
 * @example "icon.png"
 */
type RelativePathToManifestFile = string

/**
 * A semantic version.
 * @example "1.0.0"
 */
type Version = string

/**
 * A version range.
 * @example "^1.0.0"
 */
type VersionRange = string

/**
 * A unique identifier to distinguish the mod from other mods.
 * @example "com.example.my-mod"
 */
type ModId = string

/**
 * A dependency of the mod.
 * @example { id: "com.example.my-mod", version: "^1.0.0", optional: true }
 */
interface Dependency {
  id: string
  version: VersionRange
  optional?: boolean
}

/**
 * The compatibility of the mod.
 * @example { include: ["com.my.tom"], exclude: ["com.his.cat"] }
 */
interface Compatibility {
  include?: ModId[]
  exclude?: ModId[]
}
/**
 * Recognized effects that a mod may have on profile data.
 * Mod managers that support this manifest can use these values to warn users
 * about potential profile incompatibilities and prompt them to enable profile
 * cleaning features in SPT settings.
 */
enum Effect {
  trader = 'trader',
  item = 'item',
  other = 'other',
}

/**
 * A link to display along with the mod.
 * You can use {@link LinkType} to mark the type of the link.
 * @example { type: LinkType.code, url: "https://github.com/example/my-mod" }
 * @example { url: "https://example.com/documentation" }
 */
interface Link {
  type?: LinkType
  name?: string
  url: string
}

/**
 * Common link types for mod-related resources.
 */
enum LinkType {
  code = 'code',
  discord = 'discord',
  website = 'website',
  documentation = 'documentation',
}
