import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { UpdatePanel } from '@/components/admin/update-panel'
import type { UpdaterState, UpdaterStatus } from '@/lib/admin/updater'

/**
 * The supervisor runs from the uploaded folder, so it can be older than the
 * dashboard until its files are copied over ("The updater itself changed").
 * The panel shows the steps the supervisor reports, and only those.
 */
function finished(steps: Partial<UpdaterState['steps']>, more: Partial<UpdaterState> = {}): UpdaterStatus {
  return {
    available: true,
    pending: false,
    state: {
      status: 'idle',
      current: null,
      previous: null,
      target: null,
      steps: steps as UpdaterState['steps'],
      startedAt: '2026-11-07T20:00:00Z',
      finishedAt: '2026-11-07T20:05:00Z',
      message: 'Installed v1.2.0 (commit aaaaaaa).',
      log: [],
      ...more,
    },
  }
}

const render = (status: UpdaterStatus) =>
  renderToStaticMarkup(createElement(UpdatePanel, { initial: status, offer: null, blocked: 'Up to date', summary: null }))

describe('the update steps', () => {
  it('show Clean up between Build and Trial start when the supervisor reports it', () => {
    const html = render(finished({ download: 'done', install: 'done', build: 'done', prune: 'done', check: 'done', switch: 'done' }))
    const order = ['Download', 'Install', 'Build', 'Clean up', 'Trial start', 'Switch'].map((label) => html.indexOf(`>${label}<`))
    expect(order.every((at) => at !== -1)).toBe(true)
    expect(order).toEqual(order.toSorted((a, b) => a - b))
  })

  it('leave out a step an older supervisor never reports, rather than show it as waiting', () => {
    const html = render(finished({ download: 'done', install: 'done', build: 'done', check: 'done', switch: 'done' }))
    expect(html).toContain('>Trial start<')
    expect(html).not.toContain('Clean up')
    expect(html).not.toContain('Waiting')
  })
})

describe('the notice that the updater itself changed', () => {
  it('names the folder to copy from', () => {
    const current = { tag: 'v1.2.0', sha: 'a'.repeat(40), name: 'v1.2.0', publishedAt: '', deployedAt: '' }
    const html = render(finished({}, { updaterChanged: true, current }))
    expect(html).toContain('The updater itself changed')
    expect(html).toContain('.updater/releases/v1.2.0/scripts/')
  })
})
