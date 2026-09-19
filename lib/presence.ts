/**
 * Whether a person is using the page, as a tiny store for useSyncExternalStore.
 *
 * It turns true on the first real pointer move, tap, wheel turn, or key press
 * and stays true for the rest of the visit (sessionStorage carries it across
 * reloads). Only trusted events count, so a script calling dispatchEvent()
 * cannot fake it. A scraper that reads the HTML, or a headless browser that
 * never moves, stays at false.
 */
const EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown'] as const
const STORAGE_KEY = 'wslatl:present'

let present: boolean | undefined
const listeners = new Set<() => void>()

function onInput(event: Event) {
  if (event.isTrusted) markPresent()
}

/** Records that a person is here, for example after they press a reveal button. */
export function markPresent() {
  if (present) return
  present = true
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Storage can be blocked. The flag then lasts for this page only.
  }
  for (const type of EVENTS) window.removeEventListener(type, onInput, true)
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!getSnapshot()) {
    for (const type of EVENTS) window.addEventListener(type, onInput, { capture: true, passive: true })
  }
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot(): boolean {
  if (present === undefined) {
    try {
      present = sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      present = false
    }
  }
  return present
}

/** The server never knows, so server HTML always holds the placeholder. */
export function getServerSnapshot(): boolean {
  return false
}
