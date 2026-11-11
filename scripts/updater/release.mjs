// What the updater installs: GitHub's latest release, never a branch. Its
// tag is the version, vMAJOR.MINOR.PATCH, compared as numbers (v1.10.0 is
// newer than v1.9.0). Shared by the supervisor (scripts/serve.mjs), the
// admin and next.config.mjs, so they all agree on what counts. The admin's
// copy of the rule in platform/admin/version.mjs must stay the same.

/** @typedef {[number, number, number]} Version */

export const tagRule = 'vMAJOR.MINOR.PATCH, like v1.4.0'

/** The same words, by the name the knowledge base's admin imports. */
export const TAG_RULE = tagRule

// A lowercase v, three numbers without leading zeros, and nothing after:
// no 1.4.0, no v1.4, no v1.4.0-rc.1, no space.
const tagPattern = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

/**
 * The version a tag names, or null for any other form. Anything that is not
 * a string, such as a number in a state file edited by hand, is null too.
 * @param {unknown} tag
 * @returns {Version | null}
 */
export function parseVersion(tag) {
  if (typeof tag !== 'string') return null
  const match = tagPattern.exec(tag)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null
}

/**
 * True when tag `a` names a newer version than tag `b`. False when either is
 * not a version tag.
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function isNewer(a, b) {
  const x = parseVersion(a)
  const y = parseVersion(b)
  if (!x || !y) return false
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]
  return false
}

/** Which part of the version a new release raises: a fix, something new, or a big change. */
export const BUMPS = /** @type {const} */ (['patch', 'minor', 'major'])

/**
 * The tag after the latest release: from v1.4.0, a patch is v1.4.1, a minor
 * v1.5.0 and a major v2.0.0. The first release, with none before it, is
 * v1.0.0 whatever the choice. Null when the latest release's tag is not a
 * version, or the choice is not one of BUMPS.
 * @param {string | null} latestTag
 * @param {string} bump
 * @returns {string | null}
 */
export function nextTag(latestTag, bump) {
  if (!(/** @type {readonly string[]} */ (BUMPS).includes(bump))) return null
  if (latestTag === null) return 'v1.0.0'
  const version = parseVersion(latestTag)
  if (!version) return null
  const [major, minor, patch] = version
  if (bump === 'major') return `v${major + 1}.0.0`
  if (bump === 'minor') return `v${major}.${minor + 1}.0`
  return `v${major}.${minor}.${patch + 1}`
}
