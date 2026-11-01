import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import nextConfig from '../next.config.mjs'

/**
 * The admin's settings (password hash, session secret, GitHub token) live in
 * .env and are read on the server, per request. These checks keep every
 * path by which one could reach a browser closed; scripts/scan-build.mjs
 * then checks the build itself, with canary values in CI.
 */
const root = join(__dirname, '..')
const sourceDirs = ['app', 'components', 'config', 'content', 'data', 'i18n', 'lib']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|mjs)$/.test(name) ? [path] : []
  })
}

const files = sourceDirs.flatMap((dir) => sourceFiles(join(root, dir)))
const read = (file: string) => readFileSync(file, 'utf8')
const rel = (file: string) => relative(root, file).replaceAll('\\', '/')
const clientFiles = files.filter((file) => /^\s*['"]use client['"]/m.test(read(file)))

describe('admin secrets', () => {
  it('never use the NEXT_PUBLIC_ prefix, which Next copies into the browser bundle', () => {
    const everywhere = [...files, join(root, 'next.config.mjs'), join(root, 'proxy.ts')]
    expect(everywhere.filter((file) => read(file).includes('NEXT_PUBLIC_')).map(rel)).toEqual([])
  })

  it('are only ever read by server-only modules', () => {
    const readers = files.filter((file) => /process\.env/.test(read(file))).map(rel)
    // The admin's settings, the baked-in commit, and the updater's folder.
    expect(readers.toSorted()).toEqual(['lib/admin/build-info.ts', 'lib/admin/settings.ts', 'lib/admin/updater.ts'])
    for (const file of readers) expect(read(join(root, file)), file).toMatch(/^import 'server-only'/)
  })

  it('cannot be imported by a client component, because every admin module is server-only', () => {
    const adminModules = sourceFiles(join(root, 'lib', 'admin'))
    expect(adminModules.length).toBeGreaterThan(0)
    for (const file of adminModules) expect(read(file), rel(file)).toMatch(/^import 'server-only'/)
  })

  it('are not read by any client component, which may import admin types and nothing else', () => {
    expect(clientFiles.length).toBeGreaterThan(0)
    for (const file of clientFiles) {
      const text = read(file)
      expect(text, rel(file)).not.toMatch(/process\.env/)
      const adminImports = [...text.matchAll(/^import\s+(type\s+)?[^'"]*['"]@\/lib\/admin\/[^'"]+['"]/gm)]
      expect(adminImports.filter((match) => !match[1]).map((match) => match[0]), rel(file)).toEqual([])
    }
  })

  it('are not baked into the build by next.config.mjs, which bakes only the release and commit', () => {
    expect(Object.keys(nextConfig.env ?? {})).toEqual(['SITE_RELEASE', 'SITE_COMMIT'])
  })
})
