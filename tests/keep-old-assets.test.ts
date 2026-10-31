import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const script = join(__dirname, '..', 'scripts', 'keep-old-assets.mjs')
const day = 24 * 60 * 60 * 1000
let project = ''

function run(mode: 'save' | 'restore', env: Record<string, string> = {}) {
  execFileSync(process.execPath, [script, mode, project], { env: { ...process.env, ...env } })
}

function file(path: string, ageInDays = 0) {
  const full = join(project, path)
  mkdirSync(join(full, '..'), { recursive: true })
  writeFileSync(full, path)
  const when = new Date(Date.now() - ageInDays * day)
  utimesSync(full, when, when)
}

afterEach(() => rmSync(project, { recursive: true, force: true }))

describe('keeping earlier builds’ files', () => {
  it('keeps the files the site serves now through a rebuild, however long ago they were built', () => {
    project = mkdtempSync(join(tmpdir(), 'keep-old-assets-'))
    // The live build is 40 days old: its files must still be there after the next one.
    file('.next/static/chunks/live.css', 40)
    // Retired 40 days ago and not live since: this one goes.
    file('.next-static-history/chunks/retired.css', 40)

    run('save')
    rmSync(join(project, '.next'), { recursive: true }) // what next build does
    file('.next/static/chunks/new.css')
    run('restore')

    expect(existsSync(join(project, '.next/static/chunks/new.css'))).toBe(true)
    expect(existsSync(join(project, '.next/static/chunks/live.css'))).toBe(true)
    expect(existsSync(join(project, '.next/static/chunks/retired.css'))).toBe(false)
  })

  it('does nothing on a first build', () => {
    project = mkdtempSync(join(tmpdir(), 'keep-old-assets-'))
    run('save')
    file('.next/static/chunks/new.css')
    run('restore')
    expect(existsSync(join(project, '.next-static-history'))).toBe(false)
    expect(existsSync(join(project, '.next/static/chunks/new.css'))).toBe(true)
  })

  it('uses the history folder the updater names, so every release shares one', () => {
    // scripts/serve.mjs builds each release in its own folder, and points
    // them all at the history beside .env.
    project = mkdtempSync(join(tmpdir(), 'keep-old-assets-'))
    const shared = join(project, 'shared-history')
    file('.next/static/chunks/live.css')
    run('save', { STATIC_HISTORY_DIR: shared })
    rmSync(join(project, '.next'), { recursive: true })
    file('.next/static/chunks/new.css')
    run('restore', { STATIC_HISTORY_DIR: shared })
    expect(existsSync(join(shared, 'chunks/live.css'))).toBe(true)
    expect(existsSync(join(project, '.next-static-history'))).toBe(false)
    expect(existsSync(join(project, '.next/static/chunks/live.css'))).toBe(true)
  })
})
