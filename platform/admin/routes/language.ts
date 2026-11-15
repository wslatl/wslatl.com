// app/admin/api/language/route.ts: export { GET, POST } from '@/platform/admin/routes/language'
import { admin } from '../app'

/** The admin's language: sets the admin's language cookie (and the account's own language, for an app that keeps one). */
export const { GET, POST } = admin.routes.language
