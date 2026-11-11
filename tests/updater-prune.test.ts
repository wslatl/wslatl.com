import { describe, expect, it } from 'vitest'
import { devOnlyPaths } from '../scripts/updater/dev-files.mjs'

/**
 * The updater (the kit's, scripts/updater/) deletes what production never
 * uses from each release before its trial start, and its own tests check
 * the deleting. What it must never delete depends on the app, so this site
 * checks its own: every file its running server, its share cards and the
 * updater read in a release.
 */
const read = [
  '.next/BUILD_ID',
  '.next/server/app/index.html',
  '.next/static/chunks/main.js',
  'public/og-image.png',
  'package.json',
  'package-lock.json',
  // next start loads next.config.mjs, and everything it imports.
  'next.config.mjs',
  'config/links.json',
  'config/security-headers.mjs',
  'platform/admin/next.mjs',
  'platform/admin/version.mjs',
  // The kit's settings, read by the admin and the updater.
  'platform.config.mjs',
  'platform/config.mjs',
  // The share cards' fonts and lockup, read from disk when a card is drawn.
  'platform/assets/fonts/Geist-400.ttf',
  'platform/assets/fonts/Geist-700.ttf',
  'platform/assets/fonts/InstrumentSerif-Italic.ttf',
  'platform/assets/brand/wslatl-lockup.png',
  'node_modules/next/package.json',
  'scripts/serve.mjs',
  'scripts/updater/lib.mjs',
  'scripts/updater/github.mjs',
]

describe('the list of what production never uses', () => {
  it('holds nothing this site reads once it runs, nor a folder around one', () => {
    for (const path of devOnlyPaths) expect(read.filter((kept) => kept === path || kept.startsWith(`${path}/`)), path).toEqual([])
  })
})
