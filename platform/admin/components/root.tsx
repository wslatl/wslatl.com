import '../admin.css'
import { geist, geistMono } from './fonts'

/**
 * The admin's own <html>: a root layout beside the public site's, English
 * only, with nothing from the public layout (header, structured data). The
 * admin class is what admin.css hangs on.
 */
export function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark admin ${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  )
}
