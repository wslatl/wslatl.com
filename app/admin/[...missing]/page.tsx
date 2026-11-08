import { notFound } from 'next/navigation'

/** Any other address under /admin gets the admin's own 404 rather than the framework's bare one. */
export default function MissingAdminPage() {
  notFound()
}
