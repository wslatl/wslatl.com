// What the updater installs: GitHub's latest release, never a branch. Its
// tag is the version, vMAJOR.MINOR.PATCH, compared as numbers (v1.10.0 is
// newer than v1.9.0). Shared by the supervisor (scripts/serve.mjs), the
// admin dashboard (lib/admin/github.ts) and next.config.mjs.

/** @typedef {[number, number, number]} Version */

export const tagRule = 'vMAJOR.MINOR.PATCH, like v1.4.0'

const tagPattern = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

/**
 * The version a tag names, or null for any other form.
 * @param {string} tag
 * @returns {Version | null}
 */
export function parseVersion(tag) {
  const match = tagPattern.exec(tag)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null
}

/**
 * True when tag `a` names a newer version than tag `b`. False when either is
 * not a version tag.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function isNewer(a, b) {
  const x = parseVersion(a)
  const y = parseVersion(b)
  if (!x || !y) return false
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]
  return false
}
