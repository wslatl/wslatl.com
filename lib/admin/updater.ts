import 'server-only'
import { randomBytes } from 'node:crypto'
import { existsSync, statSync } from 'node:fs'
import { readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * The admin's side of the updater. The update itself runs in the supervisor
 * (scripts/serve.mjs), which owns `next start` and so can stop and restart
 * it; this server cannot replace itself. The two talk through two files in
 * the folder the supervisor names in UPDATER_DIR:
 *
 *   request.json  written here to ask for an update; the supervisor takes it
 *   state.json    written by the supervisor; read here for the dashboard
 *
 * Without UPDATER_DIR the site was started some other way (`npm start`,
 * `next dev`), and the dashboard says updates need `npm run serve`.
 */

/** Mirrors what scripts/updater/lib.mjs writes. */
export type StepId = 'download' | 'install' | 'build' | 'check' | 'switch'
export type StepState = 'pending' | 'running' | 'done' | 'failed' | 'skipped'
export type ReleaseBuild = { tag: string; sha: string; name: string; publishedAt: string }
export type InstalledRelease = ReleaseBuild & { deployedAt: string }
export type UpdaterState = {
  status: 'idle' | 'downloading' | 'installing' | 'building' | 'checking' | 'swapping' | 'failed' | 'rolled-back'
  current: InstalledRelease | null
  previous: InstalledRelease | null
  target: ReleaseBuild | null
  steps: Record<StepId, StepState>
  startedAt: string | null
  finishedAt: string | null
  message: string
  log: string[]
  /** The live release carries a different scripts/serve.mjs than the one running it. */
  updaterChanged?: boolean
}

export const busyStatuses: readonly UpdaterState['status'][] = ['downloading', 'installing', 'building', 'checking', 'swapping']

export type UpdaterStatus = { available: boolean; pending: boolean; state: UpdaterState | null }

export function updaterDir(env: Record<string, string | undefined> = process.env): string | null {
  const dir = env.UPDATER_DIR?.trim()
  return dir && existsSync(dir) && statSync(dir).isDirectory() ? dir : null
}

async function readState(dir: string): Promise<UpdaterState | null> {
  try {
    return JSON.parse(await readFile(join(dir, 'state.json'), 'utf8'))
  } catch {
    return null
  }
}

export async function updaterStatus(dir = updaterDir()): Promise<UpdaterStatus> {
  if (!dir) return { available: false, pending: false, state: null }
  return { available: true, pending: existsSync(join(dir, 'request.json')), state: await readState(dir) }
}

export type UpdateRequest = { ok: true } | { ok: false; status: 409 | 503; error: string }

export async function requestUpdate(by: string, dir = updaterDir()): Promise<UpdateRequest> {
  if (!dir) {
    return { ok: false, status: 503, error: 'Updates only work when the site is started with npm run serve.' }
  }
  const { pending, state } = await updaterStatus(dir)
  if (pending) return { ok: false, status: 409, error: 'An update is already waiting to start.' }
  if (state && busyStatuses.includes(state.status)) return { ok: false, status: 409, error: 'An update is already running.' }
  // Written whole and then renamed, so the supervisor never reads half a file.
  const temporary = join(dir, `request.${randomBytes(6).toString('hex')}.tmp`)
  await writeFile(temporary, JSON.stringify({ requestedAt: new Date().toISOString(), by }))
  await rename(temporary, join(dir, 'request.json'))
  return { ok: true }
}
