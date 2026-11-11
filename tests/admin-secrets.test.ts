import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import nextConfig from '../next.config.mjs'

/**
 * The admin's settings (password hash, session secret, GitHub token) live in
 * .env and are read on the server, per request, by the kit's admin
 * (platform/admin/server/). These checks keep every path by which one could
 * reach a browser closed; scripts/scan-build.mjs then checks the build
 * itself, with canary values in CI.
 */
const root = join(__dirname, '..')
const siteDirs = ['app', 'components', 'config', 'content', 'data', 'i18n', 'lib']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|mjs)$/.test(name) ? [path] : []
  })
}

const siteFiles = siteDirs.flatMap((dir) => sourceFiles(join(root, dir)))
const kitFiles = sourceFiles(join(root, 'platform'))
const adminServer = sourceFiles(join(root, 'platform', 'admin', 'server'))
const read = (file: string) => readFileSync(file, 'utf8')
const rel = (file: string) => relative(root, file).replaceAll('\\', '/')
const clientFiles = [...siteFiles, ...kitFiles].filter((file) => /^\s*['"]use client['"]/m.test(read(file)))

describe('admin secrets', () => {
  it('never use the NEXT_PUBLIC_ prefix, which Next copies into the browser bundle', () => {
    const everywhere = [...siteFiles, ...kitFiles, ...['next.config.mjs', 'proxy.ts', 'platform.config.mjs'].map((file) => join(root, file))]
    expect(everywhere.filter((file) => read(file).includes('NEXT_PUBLIC_')).map(rel)).toEqual([])
  })

  it("are read by the kit's admin alone, never by the site's own code", () => {
    expect(siteFiles.filter((file) => /process\.env/.test(read(file))).map(rel)).toEqual([])
  })

  it('are only ever read on the server, by modules no client component can import', () => {
    // The admin's settings, the baked-in commit, and the updater's folder.
    const readers = adminServer.filter((file) => /process\.env/.test(read(file)))
    expect(readers.length).toBeGreaterThan(0)
    for (const file of adminServer) expect(read(file), rel(file)).toMatch(/^import 'server-only'/)
  })

  it('are not read by any client component, which may import admin types and nothing else', () => {
    expect(clientFiles.length).toBeGreaterThan(0)
    for (const file of clientFiles) {
      const text = read(file)
      expect(text, rel(file)).not.toMatch(/process\.env/)
      // The admin's server folder, by its address from anywhere, or as a
      // relative path (../server/updater) from a file inside platform/admin.
      const inAdmin = rel(file).startsWith('platform/admin/')
      const isServer = (path: string) => /\/admin\/server(\/|$)/.test(path) || (inAdmin && /(^|\/)server(\/|$)/.test(path))
      const serverImports = [...text.matchAll(/^import\s+(type\s+)?[^'"]*['"]([^'"]+)['"]/gm)].filter((match) => isServer(match[2]))
      expect(serverImports.filter((match) => !match[1]).map((match) => match[0]), rel(file)).toEqual([])
    }
  })

  it('never reach a public page, which imports nothing of the admin', () => {
    // Only app/admin/ hands requests to the kit's admin; proxy.ts and
    // instrumentation.ts, outside app/, run on the server alone.
    const publicFiles = siteFiles.filter((file) => !rel(file).startsWith('app/admin/'))
    expect(publicFiles.filter((file) => /['"]@\/platform\/admin\//.test(read(file))).map(rel)).toEqual([])
  })

  it('are not baked into the build by next.config.mjs, which bakes only the release and commit', () => {
    expect(Object.keys(nextConfig.env ?? {})).toEqual(['SITE_RELEASE', 'SITE_COMMIT'])
  })
})
