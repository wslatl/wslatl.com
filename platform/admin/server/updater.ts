import 'server-only'
import { randomBytes } from 'node:crypto'
import { existsSync, statSync } from 'node:fs'
import { link, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Env } from './settings'

/**
 * The admin's side of the updater. The update itself runs in the
 * supervisor (scripts/serve.mjs), which owns `next start` and so can stop
 * and restart it; the site cannot replace itself. The two talk through two
 * files in the folder the supervisor names in UPDATER_DIR:
 *
 *   request.json  written here to ask for an update; the supervisor takes it
 *   state.json    written by the supervisor; read here for the Updates page
 *
 * Without UPDATER_DIR the site was started some other way (`npm start`,
 * `next dev`), and the Updates page says updates need `npm run serve`.
 * Both files keep the format the supervisor has always used.
 */

/** In order. 'migrate' is only reported by an app with updater.migrate in platform.config.mjs. */
export const stepIds = ['download', 'install', 'build', 'prune', 'migrate', 'check', 'switch'] as const
export type StepId = (typeof stepIds)[number]
export type StepState = 'pending' | 'running' | 'done' | 'failed' | 'skipped'
export type ReleaseBuild = { tag: string; sha: string; name: string; publishedAt: string }
export type InstalledRelease = ReleaseBuild & { deployedAt: string }

export type UpdaterState = {
  /** idle, failed and rolled-back mean nothing runs. Anything else is an update on its way. */
  status: string
  current: InstalledRelease | null
  previous: InstalledRelease | null
  target: ReleaseBuild | null
  /** Only the steps the supervisor reports: one older than the Updates page leaves out the ones it does not know. */
  steps: Partial<Record<StepId, StepState>>
  startedAt: string | null
  finishedAt: string | null
  message: string
  log: string[]
  /** The live release carries a different scripts/serve.mjs or scripts/updater/ than the ones running. */
  updaterChanged?: boolean
  /** Every release a crash rollback took back out, never offered again. */
  withdrawn?: string[]
  /** When the crash watch of the live release started. */
  watchSince?: string | null
}

export type UpdaterStatus = { available: boolean; pending: boolean; state: UpdaterState | null }

/** The statuses that mean no update is running. Any other one is an update on its way, including one a newer supervisor adds. */
export const restingStatuses: readonly string[] = Object.freeze(['idle', 'failed', 'rolled-back'])

export const isBusy = (state: UpdaterState | null) => state !== null && !restingStatuses.includes(state.status)

export function updaterDir(env: Env = process.env): string | null {
  const dir = env.UPDATER_DIR?.trim()
  return dir && existsSync(dir) && statSync(dir).isDirectory() ? dir : null
}

const stepStates: readonly string[] = ['pending', 'running', 'done', 'failed', 'skipped']
const strings = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [])
const text = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback)
const when = (value: unknown) => (typeof value === 'string' ? value : null)

function release(value: unknown): ReleaseBuild | null {
  if (typeof value !== 'object' || value === null) return null
  const raw = value as Record<string, unknown>
  if (typeof raw.tag !== 'string' || raw.tag === '') return null
  return { tag: raw.tag, sha: text(raw.sha), name: text(raw.name, raw.tag), publishedAt: text(raw.publishedAt) }
}

function installed(value: unknown): InstalledRelease | null {
  const found = release(value)
  return found && { ...found, deployedAt: text((value as Record<string, unknown>).deployedAt) }
}

/**
 * state.json as the Updates page can use it, whatever is in the file: it
 * can be edited by hand, or cut short by a full disk. A field of the wrong
 * type is dropped rather than shown.
 */
export function readableState(raw: unknown): UpdaterState | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null
  const saved = raw as Record<string, unknown>
  const steps: UpdaterState['steps'] = {}
  if (typeof saved.steps === 'object' && saved.steps !== null) {
    for (const id of stepIds) {
      const value = (saved.steps as Record<string, unknown>)[id]
      if (typeof value === 'string' && stepStates.includes(value)) steps[id] = value as StepState
    }
  }
  return {
    status: text(saved.status, 'idle') || 'idle',
    current: installed(saved.current),
    previous: installed(saved.previous),
    target: release(saved.target),
    steps,
    startedAt: when(saved.startedAt),
    finishedAt: when(saved.finishedAt),
    message: text(saved.message),
    log: strings(saved.log).slice(-500),
    updaterChanged: saved.updaterChanged === true,
    withdrawn: strings(saved.withdrawn),
    watchSince: when(saved.watchSince),
  }
}

async function readState(dir: string): Promise<UpdaterState | null> {
  try {
    return readableState(JSON.parse(await readFile(join(dir, 'state.json'), 'utf8')))
  } catch {
    return null
  }
}

export async function updaterStatus(dir = updaterDir()): Promise<UpdaterStatus> {
  if (!dir) return { available: false, pending: false, state: null }
  return { available: true, pending: existsSync(join(dir, 'request.json')), state: await readState(dir) }
}

export type UpdateRequest = { ok: true } | { ok: false; status: 409 | 503; error: string }

/** Asks the supervisor for an update. `by` says who asked, for the record. */
export async function requestUpdate(by: string, dir = updaterDir()): Promise<UpdateRequest> {
  if (!dir) {
    return { ok: false, status: 503, error: 'Updates only work when the site is started with npm run serve.' }
  }
  const waiting = { ok: false, status: 409, error: 'An update is already waiting to start.' } as const
  const { pending, state } = await updaterStatus(dir)
  if (pending) return waiting
  if (isBusy(state)) return { ok: false, status: 409, error: 'An update is already running.' }
  // Written whole beside its place, then linked in under its real name. A
  // link is never made over a file that is already there, so of many
  // presses at the same moment exactly one asks, and the supervisor never
  // reads half a file.
  const file = join(dir, 'request.json')
  const temporary = join(dir, `request.${randomBytes(6).toString('hex')}.tmp`)
  await writeFile(temporary, JSON.stringify({ requestedAt: new Date().toISOString(), by }))
  try {
    await link(temporary, file)
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'EEXIST') return waiting
    // A disk that cannot hold links: made in one step instead, and only if
    // it is not there yet, which is still once.
    if (code !== 'EPERM' && code !== 'ENOTSUP' && code !== 'ENOSYS' && code !== 'EXDEV') throw error
    try {
      await writeFile(file, await readFile(temporary), { flag: 'wx' })
    } catch (again) {
      if ((again as NodeJS.ErrnoException).code === 'EEXIST') return waiting
      throw again
    }
  } finally {
    await rm(temporary, { force: true })
  }
  return { ok: true }
}
