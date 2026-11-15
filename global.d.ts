import type { routing } from '@/platform/i18n/routing'
import type { PlatformMessages } from '@/platform/i18n/messages'
import type messages from './messages/en.json'

// next-intl's own functions take the five languages and these keys, so a
// key that is misspelt, or missing in English, fails `npm run typecheck`.
// Whether the other four languages have it is i18n:check's job.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages & { platform: PlatformMessages }
  }
}
