// app/admin/(signed-in)/layout.tsx: export { default } from '@/platform/admin/pages/signed-in-layout'
import { admin } from '../app'

/**
 * The header and main area around every page that needs someone signed in.
 * It checks first, and each page checks again, since moving between pages
 * does not run a layout a second time.
 */
export default admin.SignedInLayout
