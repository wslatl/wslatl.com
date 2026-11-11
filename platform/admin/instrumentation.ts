/**
 * The admin's part of the app's instrumentation.ts, which Next runs once as
 * the server starts. The admin's settings are checked there, so a problem
 * with one (a session secret shorter than 32 characters, a hash not made by
 * npm run admin:hash, a missing token) is in the log from the first moment,
 * not only after the first visit to /admin. Until it is fixed every admin
 * page and route answers 404, and the rest of the site runs as usual.
 *
 * On the shared password, instrumentation.ts at the app's root is one line:
 *
 *   export { register } from '@/platform/admin/instrumentation'
 *
 * An app with its own accounts, or with a register() of its own, calls
 * serverStarting() and then its own admin's settings() in it (README.md has
 * the lines). The admin is loaded only once serverStarting() says so, so
 * nothing of it reaches the Edge build.
 */

/** True in the server Next starts; false in the Edge runtime, and while `next build` runs. */
export function serverStarting(): boolean {
  return process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PHASE !== 'phase-production-build'
}

/** Checks the ready-made admin's settings as the server starts, and logs what is wrong, once. */
export async function register(): Promise<void> {
  if (!serverStarting()) return
  const { admin } = await import('./app')
  // An app with its own accounts checks its own admin instead (above).
  if (admin.app.auth === 'password') await admin.settings()
}
