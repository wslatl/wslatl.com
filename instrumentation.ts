/**
 * Runs once, as the server starts. The admin's settings are checked here, so
 * a problem with one (a session secret shorter than 32 characters, a hash
 * not made by npm run admin:hash, a missing token) is in the log from the
 * first moment, not only after the first visit to /admin. Until it is fixed
 * the admin stays off, every /admin page and route answering 404, and the
 * rest of the site runs as usual.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const { adminEnabled } = await import('@/lib/admin/auth')
  adminEnabled()
}
