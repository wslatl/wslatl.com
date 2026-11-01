import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
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

/** Time passing: moves every file in the project `days` into the past. */
function age(days: number, dir = project) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      age(days, path)
    } else {
      const when = new Date(statSync(path).mtimeMs - days * day)
      utimesSync(path, when, when)
    }
  }
}

/** `npm run build`, with a `next build` that makes only these chunks. */
function build(...chunks: string[]) {
  run('save')
  rmSync(join(project, '.next'), { recursive: true, force: true }) // what next build does
  for (const name of chunks) file(`.next/static/chunks/${name}`)
  run('restore')
}

const has = (path: string) => existsSync(join(project, path))
const putBack = () => (JSON.parse(readFileSync(join(project, '.next', 'restored-assets.json'), 'utf8')) as string[]).toSorted()

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

  it('lets a file go 30 days after it was last live, though every build puts it back meanwhile', () => {
    project = mkdtempSync(join(tmpdir(), 'keep-old-assets-'))
    // site.css is in every build; first.css only in the one live now.
    file('.next/static/chunks/site.css')
    file('.next/static/chunks/first.css')
    build('site.css', 'second.css')
    // Back for the pages that still name it, and listed as put back.
    expect(has('.next/static/chunks/first.css')).toBe(true)
    expect(putBack()).toEqual(['chunks/first.css'])
    expect(has('.next/static/restored-assets.json')).toBe(false)

    age(20)
    build('site.css', 'third.css')
    expect(putBack()).toEqual(['chunks/first.css', 'chunks/second.css'])
    age(15)
    // first.css was last live 35 days ago, second.css 15.
    build('site.css', 'fourth.css')

    expect(has('.next-static-history/chunks/first.css')).toBe(false)
    expect(has('.next/static/chunks/first.css')).toBe(false)
    expect(has('.next-static-history/chunks/second.css')).toBe(true)
    expect(has('.next/static/chunks/second.css')).toBe(true)
    expect(has('.next-static-history/chunks/site.css')).toBe(true)
    expect(has('.next/static/chunks/site.css')).toBe(true)
    expect(putBack()).toEqual(['chunks/second.css', 'chunks/third.css'])
  })

  it('keeps every file of a build that has been live for over 30 days, and nothing retired before it', () => {
    project = mkdtempSync(join(tmpdir(), 'keep-old-assets-'))
    file('.next/static/chunks/site.css')
    file('.next/static/chunks/first.css')
    build('site.css', 'second.css')
    // No build for 40 days: the history's copies are all that old now.
    age(40)
    build('site.css', 'third.css')
    // second.css was live until this build, so it stays; first.css went 40 days ago.
    expect(has('.next-static-history/chunks/second.css')).toBe(true)
    expect(has('.next/static/chunks/second.css')).toBe(true)
    expect(has('.next-static-history/chunks/site.css')).toBe(true)
    expect(has('.next-static-history/chunks/first.css')).toBe(false)
    expect(has('.next/static/chunks/first.css')).toBe(false)
    expect(putBack()).toEqual(['chunks/second.css'])
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
