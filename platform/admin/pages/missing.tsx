// app/admin/[...missing]/page.tsx: export { default, generateMetadata } from '@/platform/admin/pages/missing'
import { notFound } from 'next/navigation'

/** Says it is a 404 to the render that sets the tab's title, so no page's own title comes back. */
export function generateMetadata(): never {
  notFound()
}

/** Any other address under /admin gets the admin's own 404 rather than the public site's, or the framework's bare one. */
export default function MissingAdminPage(): never {
  notFound()
}
