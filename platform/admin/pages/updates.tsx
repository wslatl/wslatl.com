// app/admin/(signed-in)/page.tsx on the main website, or (signed-in)/updates/page.tsx beside an overview:
//   export { default, generateMetadata } from '@/platform/admin/pages/updates'
import { admin } from '../app'

/** What is installed, GitHub's latest release, and the button that installs it. */
export default admin.Updates

export const generateMetadata = admin.updatesMetadata
