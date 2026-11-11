// app/admin/api/adopt-updater/route.ts: export { GET, POST } from '@/platform/admin/routes/adopt-updater'
import { admin } from '../app'

/** Copies the live release's updater over the uploaded folder's: the button on the "updater itself changed" notice. */
export const { GET, POST } = admin.routes.adoptUpdater
