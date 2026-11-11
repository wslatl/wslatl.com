// app/admin/api/update/route.ts: export { GET, POST } from '@/platform/admin/routes/update'
import { admin } from '../app'

/** What the updater is doing (GET), and asking it to install the latest release (POST). */
export const { GET, POST } = admin.routes.update
