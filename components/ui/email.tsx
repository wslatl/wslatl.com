import { emails, type EmailName } from '@/config/emails'
import { scrambleEmail } from '@/lib/email-cipher'
import { EmailLink } from '@/components/ui/email-link'

interface EmailProps {
  name: EmailName
  className?: string
}

/**
 * One of our email addresses, kept away from harvesters. The page only ever
 * carries it scrambled; the browser turns it into a mailto link once someone
 * moves the mouse, touches the screen, scrolls, or presses a key. See
 * lib/presence.ts for what counts as a person.
 */
export function Email({ name, className }: EmailProps) {
  return <EmailLink code={scrambleEmail(emails[name])} className={className} />
}
