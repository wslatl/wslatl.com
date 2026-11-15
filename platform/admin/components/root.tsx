import '../admin.css'
import type { Locale } from '../../i18n/config'
import type { AdminMessages } from '../text'
import { AdminTextProvider } from './admin-text'
import { geist, geistMono } from './fonts'

/**
 * The admin's own <html>: a root layout beside the public site's, in the
 * admin's language, with nothing from the public layout (header, structured
 * data). The admin class is what admin.css hangs on. Its client components
 * get their words from the provider; left without a language, it is
 * English, and they say theirs in English.
 */
export function AdminRoot({ locale = 'en', messages, children }: { locale?: Locale; messages?: AdminMessages; children: React.ReactNode }) {
  return (
    <html lang={locale} className={`dark admin ${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        {messages ? (
          <AdminTextProvider locale={locale} messages={messages}>
            {children}
          </AdminTextProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
