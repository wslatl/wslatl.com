import 'server-only'
import { parseVersion } from '@/scripts/updater/release.mjs'

/**
 * What this build is, baked in at build time by next.config.mjs: the release
 * the updater built it from (SITE_RELEASE) and its commit (SITE_COMMIT).
 * Both are null for a folder uploaded and built by hand, except that a build
 * from a git checkout knows its commit.
 */
export function installedRelease(): string | null {
  const tag = process.env.SITE_RELEASE ?? ''
  return parseVersion(tag) ? tag : null
}

export function deployedCommit(): string | null {
  const sha = process.env.SITE_COMMIT ?? ''
  return /^[0-9a-f]{40}$/.test(sha) ? sha : null
}
