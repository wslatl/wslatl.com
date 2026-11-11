/**
 * @typedef {[number, number, number]} Version
 * @typedef {object} Floors
 * @property {string} node the Node major every app runs, such as "22"
 * @property {string[]} [requires] packages the kit's own code imports, which every app must list in its dependencies
 * @property {Record<string, string>} packages the lowest version allowed for each shared package
 * @typedef {object} PackageJson
 * @property {Record<string, string>} [dependencies]
 * @property {Record<string, string>} [devDependencies]
 */

/**
 * The lowest version a package.json range allows, or null when it names
 * none (a git address, a tag such as "latest"). Handles plain ranges
 * ("^16.4.6", "~5.1.0", ">=22", "16.4.6") and npm aliases
 * ("npm:@typescript/typescript6@^6.0.2").
 * @param {string} range
 * @returns {Version | null}
 */
export function lowestVersion(range) {
  const spec = range.startsWith('npm:') ? range.slice(range.lastIndexOf('@') + 1) : range
  const match = /(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(spec)
  if (!match) return null
  return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)]
}

/**
 * @param {Version} a
 * @param {Version} b
 * @returns {number} below zero when a is older
 */
export const compareVersions = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]

/**
 * Where an app falls below the kit's floors, one plain sentence each.
 * A shared package the app does not use is not required.
 * @param {Floors} floors
 * @param {PackageJson} pkg
 * @param {string | null} nvmrc the contents of `.nvmrc`, or null when it is missing
 * @returns {string[]}
 */
export function versionProblems(floors, pkg, nvmrc) {
  /** @type {string[]} */
  const problems = []
  const declared = { ...pkg.dependencies, ...pkg.devDependencies }
  for (const name of floors.requires ?? []) {
    if (pkg.dependencies?.[name] !== undefined) continue
    problems.push(
      pkg.devDependencies?.[name] === undefined
        ? `The kit's code imports ${name}, so the app needs it in "dependencies".`
        : `The kit's code imports ${name} at run time, so move it from "devDependencies" to "dependencies".`,
    )
  }
  for (const [name, floor] of Object.entries(floors.packages)) {
    const range = declared[name]
    if (range === undefined) continue
    const wanted = lowestVersion(floor)
    if (!wanted) continue
    const lowest = lowestVersion(range)
    if (!lowest) {
      problems.push(`${name} is "${range}", which names no version. The kit needs ${floor} or later.`)
    } else if (compareVersions(lowest, wanted) < 0) {
      problems.push(`${name} allows "${range}", which is below the kit's ${floor}.`)
    }
  }
  if (floors.node) {
    const node = nvmrc === null ? null : lowestVersion(nvmrc.trim().replace(/^v/, ''))
    if (!node) {
      problems.push(`.nvmrc is missing or empty. The kit runs on Node ${floors.node}.`)
    } else if (node[0] !== Number(floors.node)) {
      problems.push(`.nvmrc says Node ${nvmrc?.trim()}, and the kit runs on Node ${floors.node}.`)
    }
  }
  return problems
}
