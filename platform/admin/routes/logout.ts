// app/admin/api/logout/route.ts: export { GET, POST } from '@/platform/admin/routes/logout'
import { admin } from '../app'

/** The shared password's sign-out: the session ended on the server for good, and its cookie cleared. The device cookie stays. */
export const { GET, POST } = admin.routes.logout
