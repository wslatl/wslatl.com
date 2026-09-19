import type { ReactNode } from 'react'
import { siteConfig } from '@/config/site'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

/*
 * The building blocks every legal document is made of, so all ten look alike.
 * Spacing between blocks comes from LegalSection; lists, links, and bold text
 * are styled by .legal-body in globals.css. Documents should not need their
 * own class names.
 */

/** How much a callout or tier matters. It sets the accent color only. */
export type Tone = 'note' | 'good' | 'caution' | 'critical'

interface CalloutProps {
  tone?: Tone
  title: string
  children: ReactNode
}

/** A passage the reader should not miss. The text keeps the document's color. */
export function Callout({ tone = 'note', title, children }: CalloutProps) {
  return (
    <div role="note" className="legal-callout" data-tone={tone}>
      <p className="legal-callout-title">{title}</p>
      <p>{children}</p>
    </div>
  )
}

interface InfoCardProps {
  title?: string
  /** A plain line under the title, such as a mailing address. */
  subtitle?: string
  children: ReactNode
}

/** A boxed set of details: where to send a notice, who to contact. */
export function InfoCard({ title, subtitle, children }: InfoCardProps) {
  return (
    <div className="legal-card">
      {title && <p className="legal-card-title">{title}</p>}
      {subtitle && <p>{subtitle}</p>}
      <dl>{children}</dl>
    </div>
  )
}

/** One labeled line of an InfoCard. */
export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

/** Our name, location, email, and Discord: the card that closes each document. */
export function CompanyContact({ children }: { children?: ReactNode }) {
  return (
    <InfoCard title={siteConfig.legal.companyName} subtitle={siteConfig.legal.mailingAddress}>
      {children ?? (
        <InfoRow label="Email">
          <Email name="support" /> or <Email name="info" />
        </InfoRow>
      )}
      <InfoRow label="Discord">
        <ShortLink name="discord" />
      </InfoRow>
    </InfoCard>
  )
}

/**
 * Holds a table that may need to scroll sideways on a phone. The region is
 * named and focusable, so it can be scrolled from the keyboard too.
 */
export function ScrollTable({ label, children }: { label: string; children: ReactNode }) {
  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must take focus to be scrolled without a mouse (WCAG 2.1.1)
    <section className="legal-table-wrap" aria-label={label} tabIndex={0}>
      {children}
    </section>
  )
}

/** A short list of rules that step up in severity, such as age limits. */
export function Tiers({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="legal-tiers">
      {title && <p className="legal-card-title">{title}</p>}
      <ul>{children}</ul>
    </div>
  )
}

export function Tier({ tone, title, children }: { tone: Tone; title: string; children: ReactNode }) {
  return (
    <li data-tone={tone}>
      <strong>{title}</strong> {children}
    </li>
  )
}
