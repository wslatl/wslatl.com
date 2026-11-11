// app/admin/api/login/route.ts: export { GET, POST } from '@/platform/admin/routes/login'
import { admin } from '../app'

/** The shared password's sign-in: a session cookie for the right password, with the lockout. */
export const { GET, POST } = admin.routes.login
