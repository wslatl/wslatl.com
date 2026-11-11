'use client'

/**
 * The last resort, for an app's own `app/global-error.tsx`. A crash in a root
 * layout takes the layout with it, and with it the stylesheet, the fonts and
 * the router may all be gone. So this page brings its own <html> and <body>,
 * styles everything inline with the same values as tokens.css, and links
 * with a plain anchor. The app passes the words, in the language of the
 * address, and never the error itself.
 *
 *   'use client'
 *   export default function GlobalError({ reset }: { reset: () => void }) {
 *     return <GlobalErrorPage lang="en" title="Something went wrong | WSLATL" heading="Something went wrong" retryLabel="Try again" onRetry={reset} homeHref="/" homeLabel="Go home">...</GlobalErrorPage>
 *   }
 */
export interface GlobalErrorPageProps {
  /** The page's language, from the address. */
  lang: string
  /** The browser tab's title. */
  title: string
  heading: string
  /** One or two plain sentences, such as where to ask for help. */
  children: React.ReactNode
  retryLabel: string
  /** Next's `reset`, which tries the page again. */
  onRetry: () => void
  homeHref: string
  homeLabel: string
}

// The values in tokens.css, inline, since its stylesheet may not have loaded.
const colors = {
  background: 'oklch(0.08 0 0)',
  foreground: 'oklch(0.95 0.005 0)',
  muted: 'oklch(0.7 0.015 0)',
  primary: 'oklch(0.53 0.18 240)',
  onPrimary: 'oklch(1 0 0)',
  input: '#645d5f',
  link: 'oklch(0.7 0.15 240)',
}

const button: React.CSSProperties = {
  // The shorthand first: it resets every font property, so the size and
  // weight below are the ones that stay.
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '2.75rem',
  padding: '0 1.25rem',
  borderRadius: '0.5rem',
  fontSize: '0.9375rem',
  fontWeight: 500,
  cursor: 'pointer',
  textDecoration: 'none',
}

export function GlobalErrorPage({ lang, title, heading, children, retryLabel, onRetry, homeHref, homeLabel }: GlobalErrorPageProps) {
  return (
    <html lang={lang} style={{ colorScheme: 'dark' }}>
      {/* oxlint-disable-next-line nextjs/no-head-element -- app/global-error.tsx renders its own document; next/head is the pages router's */}
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>{title}</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          padding: '3rem 1rem',
          boxSizing: 'border-box',
          background: colors.background,
          color: colors.foreground,
          fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <main style={{ maxWidth: '36rem', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{heading}</h1>
          <div style={{ marginTop: '1rem', lineHeight: 1.6, color: colors.muted }}>{children}</div>
          <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onRetry}
              style={{ ...button, border: 'none', background: colors.primary, color: colors.onPrimary }}
            >
              {retryLabel}
            </button>
            <a
              href={homeHref}
              style={{ ...button, border: `1px solid ${colors.input}`, background: 'transparent', color: colors.foreground }}
            >
              {homeLabel}
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}

/** For links inside the body text of the global error page, inline like the rest of it. */
export const globalErrorLinkStyle: React.CSSProperties = {
  color: colors.link,
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
}
