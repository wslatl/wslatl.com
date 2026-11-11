// app/admin/login/page.tsx: export { default, generateMetadata } from '@/platform/admin/pages/login'
import { admin } from '../app'

/** The shared password's sign-in card. Someone already signed in goes straight to /admin. */
export default admin.SignIn

export const generateMetadata = admin.signInMetadata
